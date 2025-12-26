<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Super Admin a tous les droits
        Gate::before(function (User $user, string $ability) {
            return $user->isSuperAdmin() ? true : null;
        });

        // Gates pour les rôles
        Gate::define('manage-users', function (User $user) {
            return $user->hasAdminAccess();
        });

        Gate::define('manage-accounts', function (User $user) {
            return $user->isSuperAdmin();
        });

        Gate::define('manage-platforms', function (User $user) {
            return $user->isSuperAdmin();
        });

        Gate::define('manage-reports', function (User $user) {
            return $user->isSuperAdmin();
        });

        Gate::define('access-settings', function (User $user) {
            return $user->isSuperAdmin();
        });

        Gate::define('view-reports', function (User $user) {
            return true; // Tous les utilisateurs authentifiés
        });

        Gate::define('export-reports', function (User $user) {
            return true; // Tous les utilisateurs authentifiés
        });
    }
}
