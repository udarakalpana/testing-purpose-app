<?php

use App\Models\User;

it('lets an admin create users', function () {
    expect(User::factory()->admin()->make()->can('create', User::class))->toBeTrue();
});

it('does not let a regular user create users', function () {
    expect(User::factory()->make()->can('create', User::class))->toBeFalse();
});
