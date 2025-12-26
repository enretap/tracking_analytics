<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserInvitation;
use App\Models\Account;
use App\Notifications\UserInvitationNotification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('manage-users');

        $this->authorize('manage-users');

        $currentUser = Auth::user();

        // Super-admin voit tous les utilisateurs, admin ne voit que son compte
        $usersQuery = User::with('account')->orderBy('id', 'desc');
        $invitationsQuery = UserInvitation::with('account')
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->orderBy('created_at', 'desc');

        if (!$currentUser->isSuperAdmin() && $currentUser->account_id) {
            $usersQuery->where('account_id', $currentUser->account_id);
            $invitationsQuery->where('account_id', $currentUser->account_id);
        }

        $users = $usersQuery->get();
        $invitations = $invitationsQuery->get();

        return inertia('settings/users/index', [
            'users' => $users,
            'invitations' => $invitations,
        ]);
    }

    public function create()
    {
        $this->authorize('manage-users');

        $currentUser = Auth::user();

        // Super-admin voit tous les comptes, admin ne voit que le sien
        $accountsQuery = Account::orderBy('name');
        if (!$currentUser->isSuperAdmin() && $currentUser->account_id) {
            $accountsQuery->where('id', $currentUser->account_id);
        }

        $accounts = $accountsQuery->get();

        return inertia('settings/users/create', [
            'accounts' => $accounts,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('manage-users');

        $currentUser = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email', 'unique:user_invitations,email'],
            'account_id' => ['nullable', 'exists:accounts,id'],
            'role' => ['required', Rule::in(['super-admin', 'admin', 'agent'])],
        ]);

        // Admin ne peut créer que des utilisateurs de son compte
        if (!$currentUser->isSuperAdmin()) {
            if ($currentUser->account_id && $validated['account_id'] != $currentUser->account_id) {
                return back()->withErrors(['account_id' => 'Vous ne pouvez créer des utilisateurs que pour votre compte.']);
            }
            // Admin ne peut pas créer de super-admin
            if ($validated['role'] === 'super-admin') {
                return back()->withErrors(['role' => 'Vous ne pouvez pas créer de super-admin.']);
            }
        }

        $token = Str::random(64);

        $invitation = UserInvitation::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'account_id' => $validated['account_id'],
            'role' => $validated['role'],
            'token' => $token,
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $invitation->email)
            ->notify(new UserInvitationNotification($invitation));

        return redirect()->route('settings.users.index')
            ->with('success', 'Invitation envoyée avec succès.');
    }

    public function edit(User $user)
    {
        $this->authorize('manage-users');

        $currentUser = Auth::user();

        // Admin ne peut éditer que les utilisateurs de son compte
        if (!$currentUser->isSuperAdmin() && $user->account_id !== $currentUser->account_id) {
            abort(403, 'Accès non autorisé.');
        }

        // Super-admin voit tous les comptes, admin ne voit que le sien
        $accountsQuery = Account::orderBy('name');
        if (!$currentUser->isSuperAdmin() && $currentUser->account_id) {
            $accountsQuery->where('id', $currentUser->account_id);
        }

        $accounts = $accountsQuery->get();

        return inertia('settings/users/edit', [
            'user' => $user->load('account'),
            'accounts' => $accounts,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('manage-users');

        $currentUser = Auth::user();

        // Admin ne peut éditer que les utilisateurs de son compte
        if (!$currentUser->isSuperAdmin() && $user->account_id !== $currentUser->account_id) {
            abort(403, 'Accès non autorisé.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'account_id' => ['nullable', 'exists:accounts,id'],
            'role' => ['required', Rule::in(['super-admin', 'admin', 'agent'])],
        ]);

        // Admin ne peut pas changer de compte ni créer de super-admin
        if (!$currentUser->isSuperAdmin()) {
            if ($validated['account_id'] != $currentUser->account_id) {
                return back()->withErrors(['account_id' => 'Vous ne pouvez gérer que les utilisateurs de votre compte.']);
            }
            if ($validated['role'] === 'super-admin') {
                return back()->withErrors(['role' => 'Vous ne pouvez pas définir le rôle super-admin.']);
            }
        }

        $user->update($validated);

        return redirect()->route('settings.users.index')
            ->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy(User $user)
    {
        $this->authorize('manage-users');

        $currentUser = Auth::user();

        if ($user->id === $currentUser->id) {
            return back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        // Admin ne peut supprimer que les utilisateurs de son compte
        if (!$currentUser->isSuperAdmin() && $user->account_id !== $currentUser->account_id) {
            abort(403, 'Accès non autorisé.');
        }

        $user->delete();

        return redirect()->route('settings.users.index')
            ->with('success', 'Utilisateur supprimé avec succès.');
    }

    public function resendInvitation(UserInvitation $invitation)
    {
        $this->authorize('manage-users');

        $currentUser = Auth::user();

        // Admin ne peut renvoyer que les invitations de son compte
        if (!$currentUser->isSuperAdmin() && $invitation->account_id !== $currentUser->account_id) {
            abort(403, 'Accès non autorisé.');
        }

        if ($invitation->isAccepted()) {
            return back()->with('error', 'Cette invitation a déjà été acceptée.');
        }

        if ($invitation->isExpired()) {
            $invitation->update(['expires_at' => now()->addDays(7)]);
        }

        Notification::route('mail', $invitation->email)
            ->notify(new UserInvitationNotification($invitation));

        return back()->with('success', 'Invitation renvoyée avec succès.');
    }

    public function cancelInvitation(UserInvitation $invitation)
    {
        $this->authorize('manage-users');

        $currentUser = Auth::user();

        // Admin ne peut annuler que les invitations de son compte
        if (!$currentUser->isSuperAdmin() && $invitation->account_id !== $currentUser->account_id) {
            abort(403, 'Accès non autorisé.');
        }

        $invitation->delete();

        return back()->with('success', 'Invitation annulée avec succès.');
    }
}
