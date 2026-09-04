<?php

use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Ramsey\Uuid\Uuid;

uses(RefreshDatabase::class);

test('a user is keyed by a version 7 uuid', function () {
    $user = User::factory()->create();

    expect($user->getKeyType())->toBe('string')
        ->and($user->getIncrementing())->toBeFalse()
        ->and(Uuid::fromString($user->id)->getFields()->getVersion())->toBe(7);
});

test('a sanctum token is keyed by a uuid and authenticates api requests', function () {
    $user = User::factory()->create();

    $plainTextToken = $user->createToken('test-device')->plainTextToken;
    [$tokenId] = explode('|', $plainTextToken, 2);

    expect(Uuid::fromString($tokenId)->getFields()->getVersion())->toBe(7);

    $this->withToken($plainTextToken)
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('id', $user->id);
});

test('a token stores the full uuid of its owner', function () {
    $user = User::factory()->create();
    $user->createToken('test-device');

    expect(PersonalAccessToken::sole()->tokenable_id)->toBe($user->id)
        ->and(PersonalAccessToken::sole()->tokenable)->toBeInstanceOf(User::class);
});
