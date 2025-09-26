<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PreventBrowserCaching;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
        Route::middleware('web')
            ->prefix('api')
            ->name('api.')
            ->group(base_path('routes/api.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'prevent.caching' => PreventBrowserCaching::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
    })->create();

//production mode
// <?php

// use App\Http\Middleware\CheckRole;
// use App\Http\Middleware\HandleInertiaRequests;
// use Illuminate\Foundation\Application;
// use Illuminate\Foundation\Configuration\Exceptions;
// use Illuminate\Foundation\Configuration\Middleware;
// use Illuminate\Support\Facades\Route;

// $app = Application::configure(basePath: dirname(__DIR__))
//     ->withRouting(
//         web: __DIR__.'/../routes/web.php',
//         api: __DIR__.'/../routes/api.php',
//         commands: __DIR__.'/../routes/console.php',
//         health: '/up',
//         then: function () {
//             Route::middleware('web')
//                 ->prefix('api')
//                 ->name('api.')
//                 ->group(base_path('routes/api.php'));
//         }
//     )
//     ->withMiddleware(function (Middleware $middleware): void {
//         $middleware->web(append: [
//             HandleInertiaRequests::class,
//         ]);

//         $middleware->alias([
//             'role' => CheckRole::class,
//         ]);
//     })
//     ->withExceptions(function (Exceptions $exceptions): void {
//         //
//     })->create();

// $app->usePublicPath('/home/{name_path}/public_html/{name_path}');

// return $app;