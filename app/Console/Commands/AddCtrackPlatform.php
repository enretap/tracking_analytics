<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Platform;

class AddCtrackPlatform extends Command
{
    protected $signature = 'platform:add-ctrack';
    protected $description = 'Add CTRACK platform to the database';

    public function handle()
    {
        $this->info('Adding CTRACK platform...');

        $platform = Platform::firstOrCreate(
            ['slug' => 'ctrack'],
            [
                'name' => 'CTRACK',
                'provider' => 'CTRACK Systems',
                'is_active' => true,
            ]
        );

        if ($platform->wasRecentlyCreated) {
            $this->info('✓ CTRACK platform created successfully!');
        } else {
            $this->info('✓ CTRACK platform already exists.');
        }

        $this->table(
            ['ID', 'Name', 'Slug', 'Provider', 'Active'],
            [[$platform->id, $platform->name, $platform->slug, $platform->provider, $platform->is_active ? 'Yes' : 'No']]
        );

        return 0;
    }
}
