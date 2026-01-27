<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class InvitationController extends Controller
{
    public function show(string $token)
    {
        $invitation = UserInvitation::where('token', $token)
            ->whereNull('accepted_at')
            ->firstOrFail();

        if ($invitation->isExpired()) {
            return inertia('auth/invitation-expired', [
                'email' => $invitation->email,
            ]);
        }

        return inertia('auth/accept-invitation', [
            'token' => $token,
            'name' => $invitation->name,
            'email' => $invitation->email,
        ]);
    }

    public function accept(Request $request, string $token)
    {
        $invitation = UserInvitation::where('token', $token)
            ->whereNull('accepted_at')
            ->firstOrFail();

        if ($invitation->isExpired()) {
            return back()->withErrors(['token' => 'Cette invitation a expiré.']);
        }

        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

            $user = User::create([
            'name' => $invitation->name,
            'email' => $invitation->email,
            'password' => Hash::make($validated['password']),
            'account_id' => $invitation->account_id,
            'role' => $invitation->role,
        ]);

        $invitation->update(['accepted_at' => now()]);

        Auth::login($user);

        return redirect()->route('dashboard')
            ->with('success', 'Votre compte a été créé avec succès !');
    }
}
