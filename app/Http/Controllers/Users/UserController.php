<?php

namespace App\Http\Controllers\Users;

use App\Actions\Users\RegisterUser;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\RegisterUserRequest;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Register an account for someone else. Administrators only.
     */
    public function register(RegisterUserRequest $request, RegisterUser $registerUser): JsonResponse
    {
        $role = $request->has('role')
            ? UserRole::from($request->string('role')->toString())
            : null;

        $user = $registerUser->handle(
            $request->string('name')->toString(),
            $request->string('email')->toString(),
            $request->string('password')->toString(),
            $role,
        );

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
            ],
        ], 201);
    }
}
