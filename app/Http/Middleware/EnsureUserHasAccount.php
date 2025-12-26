<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasAccount
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();

        // Si l'utilisateur n'a pas de compte assigné, rediriger vers une page d'erreur ou login
        if ($user && !$user->account_id) {
            return redirect()->route('login')->with('error', 'Aucun compte n\'est assigné à votre utilisateur. Veuillez contacter l\'administrateur.');
        }

        return $next($request);
    }
}
