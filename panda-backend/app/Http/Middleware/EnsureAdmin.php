<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;


class EnsureAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // $user = Auth::user();
        // if ($user->user_type == 'admin') {
        //     return $next($request);
        // }
        // $response = ['success' => false, 'action' => 'logout', 'message' => 'invalid user'];

        // return response()->json($response, $code);
        return $next($request);
    }
}
