<?php

use App\Enums\UserRole;
use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

/**
 * @return array<string, string>
 */
function validPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'password' => 'password-1234',
        'password_confirmation' => 'password-1234',
    ], $overrides);
}

it('returns 401 when unauthenticated', function () {
    $this->postJson('/api/users', validPayload())->assertUnauthorized();

    expect(User::count())->toBe(0);
});

it('returns 403 when the authenticated user is not an admin', function () {
    $this->actingAs(User::factory()->create(), 'sanctum')
        ->postJson('/api/users', validPayload())
        ->assertForbidden();

    expect(User::count())->toBe(1);
});

it('creates a user and returns 201', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/users', validPayload());

    $response->assertCreated()
        ->assertJsonPath('user.name', 'Ada Lovelace')
        ->assertJsonPath('user.email', 'ada@example.com')
        ->assertJsonPath('user.role', 'user');

    $created = User::whereEmail('ada@example.com')->sole();

    expect(array_keys($response->json('user')))->toBe(['id', 'name', 'email', 'role'])
        ->and($response->json('user.id'))->toBe($created->id)
        ->and($created->role)->toBe(UserRole::User)
        ->and(Hash::check('password-1234', $created->password))->toBeTrue()
        ->and(PersonalAccessToken::count())->toBe(0);
});

it('creates an admin when the role is admin', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin, 'sanctum')
        ->postJson('/api/users', validPayload(['role' => 'admin']))
        ->assertCreated()
        ->assertJsonPath('user.role', 'admin');

    expect(User::whereEmail('ada@example.com')->sole()->role)->toBe(UserRole::Admin);
});

it('returns 422 when the required fields are missing', function () {
    $this->actingAs(User::factory()->admin()->create(), 'sanctum')
        ->postJson('/api/users', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'password']);

    expect(User::count())->toBe(1);
});

it('returns 422 for an email that is already taken', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->create(['email' => 'ada@example.com']);

    $this->actingAs($admin, 'sanctum')
        ->postJson('/api/users', validPayload())
        ->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'The email has already been taken.');

    expect(User::count())->toBe(2);
});

it('returns 422 when the password confirmation does not match', function () {
    $this->actingAs(User::factory()->admin()->create(), 'sanctum')
        ->postJson('/api/users', validPayload(['password_confirmation' => 'something-else']))
        ->assertUnprocessable()
        ->assertJsonPath('errors.password.0', 'The password field confirmation does not match.');
});

it('returns 422 for a password shorter than eight characters', function () {
    $this->actingAs(User::factory()->admin()->create(), 'sanctum')
        ->postJson('/api/users', validPayload(['password' => 'short', 'password_confirmation' => 'short']))
        ->assertUnprocessable()
        ->assertJsonPath('errors.password.0', 'The password field must be at least 8 characters.');
});

it('returns 422 for a role outside the enum', function () {
    $this->actingAs(User::factory()->admin()->create(), 'sanctum')
        ->postJson('/api/users', validPayload(['role' => 'superuser']))
        ->assertUnprocessable()
        ->assertJsonPath('errors.role.0', 'The selected role is invalid.');

    expect(User::count())->toBe(1);
});
