<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('defaults a new user to the user role', function () {
    expect(User::factory()->create()->role)->toBe(UserRole::User);
});

it('can be created as an admin', function () {
    expect(User::factory()->admin()->create()->role)->toBe(UserRole::Admin);
});
