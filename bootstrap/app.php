<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        /*
         * Laravel points guests at route('login') by default. This application
         * serves no HTML and registers no such route, so that default turns
         * every unauthenticated request into a RouteNotFoundException before
         * the exception handler can render a 401. Returning null keeps the
         * AuthenticationException free of a redirect target.
         */
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
         * The API must answer with JSON whatever the client sends in its
         * Accept header, rather than falling back to an HTML error page.
         */
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson()
        );
    })->create();
