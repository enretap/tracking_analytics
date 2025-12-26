<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreAccountRequest;
use App\Http\Requests\Settings\UpdateAccountRequest;
use App\Models\Account;
use Illuminate\Http\RedirectResponse;

class AccountController extends Controller
{
    public function store(StoreAccountRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if (isset($data['settings']) && is_string($data['settings'])) {
            $data['settings'] = json_decode($data['settings'], true);
        }
        $account = Account::create($data);

        // sync platforms if provided
        if (isset($data['platform_ids'])) {
            $account->platforms()->sync($data['platform_ids']);
        }

        return redirect()->route('settings.accounts')->with('success', 'Compte créé.');
    }

    public function update(UpdateAccountRequest $request, Account $account): RedirectResponse
    {
        $data = $request->validated();
        if (isset($data['settings']) && is_string($data['settings'])) {
            $data['settings'] = json_decode($data['settings'], true);
        }
        $account->update($data);

        // sync platforms if provided
        if (isset($data['platform_ids'])) {
            $account->platforms()->sync($data['platform_ids']);
        }

        return redirect()->route('settings.accounts')->with('success', 'Compte mis à jour.');
    }

    public function destroy(Account $account): RedirectResponse
    {
        $account->delete();

        return redirect()->route('settings.accounts')->with('success', 'Compte supprimé.');
    }
}
