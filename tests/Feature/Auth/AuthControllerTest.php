<?php

use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns a token and the user for valid credentials', function () {
    $user = User::factory()->create(['email' => 'valid@example.com']);

    $response = $this->postJson('/api/login', [
        'email' => 'valid@example.com',
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('user.name', $user->name)
        ->assertJsonPath('user.email', 'valid@example.com');

    expect($response->json('token'))->toBeString()->not->toBeEmpty()
        ->and(array_keys($response->json('user')))->toBe(['id', 'name', 'email'])
        ->and($user->tokens()->count())->toBe(1);
});

it('returns 422 and issues no token for a wrong password', function () {
    User::factory()->create(['email' => 'wrong-password@example.com']);

    $this->postJson('/api/login', [
        'email' => 'wrong-password@example.com',
        'password' => 'not-the-password',
    ])
        ->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'These credentials do not match our records.');

    expect(PersonalAccessToken::count())->toBe(0);
});

it('returns 422 for an unknown email', function () {
    $this->postJson('/api/login', [
        'email' => 'nobody@example.com',
        'password' => 'password',
    ])
        ->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'These credentials do not match our records.');

    expect(PersonalAccessToken::count())->toBe(0);
});

it('returns 422 when email and password are missing', function () {
    $this->postJson('/api/login', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});

it('returns 422 for a malformed email', function (string $email) {
    $this->postJson('/api/login', ['email' => $email, 'password' => 'password'])
        ->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'The email field must be a valid email address.');
})->with([
    'no at sign' => 'not-an-email',
    'no local part' => '@example.com',
    'no domain' => 'user@',
    'two at signs' => 'user@@example.com',
]);

it('returns 429 after five failed attempts', function () {
    User::factory()->create(['email' => 'throttled@example.com']);

    foreach (range(1, 5) as $ignored) {
        $this->postJson('/api/login', [
            'email' => 'throttled@example.com',
            'password' => 'not-the-password',
        ])->assertUnprocessable();
    }

    $this->postJson('/api/login', [
        'email' => 'throttled@example.com',
        'password' => 'password',
    ])->assertTooManyRequests();
});

it('revokes the current token and returns 204', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-device')->plainTextToken;

    $this->withToken($token)->postJson('/api/logout')->assertNoContent();

    expect($user->tokens()->count())->toBe(0);

    // The guard caches its resolved user for the lifetime of the test, so it
    // has to be forgotten for the next call to behave like a separate request.
    $this->app['auth']->forgetGuards();

    $this->withToken($token)->getJson('/api/user')->assertUnauthorized();
});

it('leaves the tokens of other devices intact', function () {
    $user = User::factory()->create();
    $phoneToken = $user->createToken('phone')->plainTextToken;
    $user->createToken('laptop');

    $this->withToken($phoneToken)->postJson('/api/logout')->assertNoContent();

    expect($user->tokens()->pluck('name')->all())->toBe(['laptop']);
});

it('returns 401 when signing out without a token', function () {
    $this->postJson('/api/logout')->assertUnauthorized();
});

it('returns 401 as json when signing out without a token or an accept header', function () {
    $this->post('/api/logout')->assertUnauthorized()->assertJson(['message' => 'Unauthenticated.']);
});
