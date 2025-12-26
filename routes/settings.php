<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('settings', function () {
        return Inertia::render('settings/index');
    })->name('settings.index');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    // Users management routes (requires admin access)
    Route::middleware('can:manage-users')->group(function () {
        Route::get('settings/users', [\App\Http\Controllers\Settings\UsersController::class, 'index'])->name('settings.users.index');
        Route::get('settings/users/create', [\App\Http\Controllers\Settings\UsersController::class, 'create'])->name('settings.users.create');
        Route::post('settings/users', [\App\Http\Controllers\Settings\UsersController::class, 'store'])->name('settings.users.store');
        Route::get('settings/users/{user}/edit', [\App\Http\Controllers\Settings\UsersController::class, 'edit'])->name('settings.users.edit');
        Route::put('settings/users/{user}', [\App\Http\Controllers\Settings\UsersController::class, 'update'])->name('settings.users.update');
        Route::delete('settings/users/{user}', [\App\Http\Controllers\Settings\UsersController::class, 'destroy'])->name('settings.users.destroy');
        Route::post('settings/users/invitations/{invitation}/resend', [\App\Http\Controllers\Settings\UsersController::class, 'resendInvitation'])->name('settings.users.invitations.resend');
        Route::delete('settings/users/invitations/{invitation}', [\App\Http\Controllers\Settings\UsersController::class, 'cancelInvitation'])->name('settings.users.invitations.cancel');
    });

    // Reports page - accessible à tous les utilisateurs authentifiés
    Route::get('reports', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user->account_id) {
            $accounts = \App\Models\Account::where('id', $user->account_id)->orderBy('name')->get();
            $platforms = \App\Models\Platform::whereHas('accounts', fn($q) => $q->where('accounts.id', $user->account_id))->orderBy('name')->get();
            $reports = \App\Models\Report::whereHas('accounts', fn($q) => $q->where('accounts.id', $user->account_id))->orderBy('name')->get();
        } else {
            $accounts = \App\Models\Account::orderBy('name')->get();
            $platforms = \App\Models\Platform::orderBy('name')->get();
            $reports = \App\Models\Report::orderBy('name')->get();
        }
        return Inertia::render('reports/list', ['accounts' => $accounts, 'platforms' => $platforms, 'reports' => $reports]);
    })->name('reports.index');

    Route::post('reports/export', [\App\Http\Controllers\Reports\ExportController::class, 'export'])->name('reports.export');

    // Routes nécessitant l'accès super-admin uniquement
    Route::middleware('can:access-settings')->group(function () {
        // App settings pages
        Route::get('settings/platforms', function () {
        // Les super-admins voient toutes les plateformes
        $platforms = \App\Models\Platform::orderBy('id', 'desc')->get();
        return Inertia::render('settings/platforms/index', ['platforms' => $platforms]);
    })->name('settings.platforms');

    // API endpoints for Platforms
    Route::post('settings/platforms', [\App\Http\Controllers\Settings\PlatformController::class, 'store'])->name('settings.platforms.store');
    Route::put('settings/platforms/{platform}', [\App\Http\Controllers\Settings\PlatformController::class, 'update'])->name('settings.platforms.update');
    Route::delete('settings/platforms/{platform}', [\App\Http\Controllers\Settings\PlatformController::class, 'destroy'])->name('settings.platforms.destroy');

    Route::get('settings/platforms/create', function () {
        return Inertia::render('settings/platforms/create');
    })->name('settings.platforms.create');

    Route::get('settings/platforms/{id}', function ($id) {
        $platform = \App\Models\Platform::findOrFail($id);
        return Inertia::render('settings/platforms/show', ['platform' => $platform]);
    })->name('settings.platforms.show');

    Route::get('settings/platforms/{id}/edit', function ($id) {
        $platform = \App\Models\Platform::findOrFail($id);
        return Inertia::render('settings/platforms/edit', ['platform' => $platform]);
    })->name('settings.platforms.edit');

    Route::get('settings/accounts', function () {
        // Les super-admins voient tous les comptes
        $accounts = \App\Models\Account::with('platforms')->orderBy('id', 'desc')->get();
        return Inertia::render('settings/accounts/index', ['accounts' => $accounts]);
    })->name('settings.accounts');

    // API endpoints for Accounts
    Route::post('settings/accounts', [\App\Http\Controllers\Settings\AccountController::class, 'store'])->name('settings.accounts.store');
    Route::put('settings/accounts/{account}', [\App\Http\Controllers\Settings\AccountController::class, 'update'])->name('settings.accounts.update');
    Route::delete('settings/accounts/{account}', [\App\Http\Controllers\Settings\AccountController::class, 'destroy'])->name('settings.accounts.destroy');

    Route::get('settings/accounts/create', function () {
        $platforms = \App\Models\Platform::orderBy('name')->get();
        return Inertia::render('settings/accounts/create', ['platforms' => $platforms]);
    })->name('settings.accounts.create');

    Route::get('settings/accounts/{id}', function ($id) {
        $account = \App\Models\Account::with('platforms')->findOrFail($id);
        return Inertia::render('settings/accounts/show', ['account' => $account]);
    })->name('settings.accounts.show');

    Route::get('settings/accounts/{id}/edit', function ($id) {
        $account = \App\Models\Account::with('platforms')->findOrFail($id);
        $platforms = \App\Models\Platform::orderBy('name')->get();
        return Inertia::render('settings/accounts/edit', ['account' => $account, 'platforms' => $platforms]);
    })->name('settings.accounts.edit');

    Route::get('settings/reports', function () {
        // Les super-admins voient tous les rapports
        $reports = \App\Models\Report::with('accounts')->orderBy('id', 'desc')->get();
        return Inertia::render('settings/reports/index', ['reports' => $reports]);
    })->name('settings.reports');

    // API endpoints for Reports
    Route::post('settings/reports', [\App\Http\Controllers\Settings\ReportController::class, 'store'])->name('settings.reports.store');
    Route::put('settings/reports/{report}', [\App\Http\Controllers\Settings\ReportController::class, 'update'])->name('settings.reports.update');
    Route::delete('settings/reports/{report}', [\App\Http\Controllers\Settings\ReportController::class, 'destroy'])->name('settings.reports.destroy');

    Route::get('settings/reports/create', function () {
        $accounts = \App\Models\Account::orderBy('name')->get();
        return Inertia::render('settings/reports/create', ['accounts' => $accounts]);
    })->name('settings.reports.create');

    Route::get('settings/reports/{id}', function ($id) {
        $report = \App\Models\Report::with('accounts')->findOrFail($id);
        return Inertia::render('settings/reports/show', ['report' => $report]);
    })->name('settings.reports.show');

    Route::get('settings/reports/{id}/edit', function ($id) {
        $report = \App\Models\Report::with('accounts')->findOrFail($id);
        $accounts = \App\Models\Account::orderBy('name')->get();
        return Inertia::render('settings/reports/edit', ['report' => $report, 'accounts' => $accounts]);
    })->name('settings.reports.edit');
    }); // Fin du groupe account.required
});
