<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user && $user->must_change_password) {
            // Allow profile-related endpoints and logout
            if (!$request->is('profile') && !$request->is('profile/*') && !$request->is('logout')) {
                return redirect()->route('profile')->with('warning', 'Anda harus mengganti password bawaan terlebih dahulu.');
            }
        }

        return $next($request);
    }
}
