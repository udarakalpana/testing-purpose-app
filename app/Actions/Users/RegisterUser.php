<?php

namespace App\Actions\Users;

use App\Enums\UserRole;
use App\Models\User;

class RegisterUser
{
    /**
     * Create an account on behalf of an administrator.
     *
     * The model's "hashed" cast takes care of the password, and an unspecified
     * role falls back to the least privileged one.
     */
    public function handle(string $name, string $email, string $password, ?UserRole $role = null): User
    {
        return User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $role ?? UserRole::User,
        ]);
    }
}
