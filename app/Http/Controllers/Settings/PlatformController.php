<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StorePlatformRequest;
use App\Http\Requests\Settings\UpdatePlatformRequest;
use App\Models\Platform;
use Illuminate\Http\RedirectResponse;

class PlatformController extends Controller
{
    public function store(StorePlatformRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if (isset($data['config']) && is_string($data['config'])) {
            $data['config'] = json_decode($data['config'], true);
        }
        $platform = Platform::create($data);
        return redirect()->route('settings.platforms')->with('success', 'Plateforme créée.');
    }

    public function update(UpdatePlatformRequest $request, Platform $platform): RedirectResponse
    {
        $data = $request->validated();
        if (isset($data['config']) && is_string($data['config'])) {
            $data['config'] = json_decode($data['config'], true);
        }

        $platform->update($data);

        return redirect()->route('settings.platforms')->with('success', 'Plateforme mise à jour.');
    }

    public function destroy(Platform $platform): RedirectResponse
    {
        $platform->delete();
        return redirect()->route('settings.platforms')->with('success', 'Plateforme supprimée.');
    }
}
