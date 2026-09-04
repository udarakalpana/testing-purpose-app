<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login')
    ->name('auth.login');

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum')
    ->name('auth.logout');

Route::post('/users', [UserController::class, 'register'])
    ->middleware('auth:sanctum')
    ->name('users.register');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
