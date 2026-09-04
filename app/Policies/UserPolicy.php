<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can register another account.
     */
    public function create(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }
}
