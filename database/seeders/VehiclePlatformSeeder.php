<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Account;
use App\Models\Platform;

class VehiclePlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des plateformes exemple
        $platforms = [
            [
                'name' => 'GPS Tracker Pro',
                'slug' => 'gps-tracker',
                'provider' => 'GPS Tracker Inc.',
                'is_active' => true,
            ],
            [
                'name' => 'Fleet Manager',
                'slug' => 'fleet-manager',
                'provider' => 'Fleet Solutions Ltd.',
                'is_active' => true,
            ],
            [
                'name' => 'Track Pro',
                'slug' => 'track-pro',
                'provider' => 'Track Pro Systems',
                'is_active' => true,
            ],
            [
                'name' => 'CTRACK',
                'slug' => 'ctrack',
                'provider' => 'CTRACK Systems',
                'is_active' => true,
            ],
        ];

        foreach ($platforms as $platformData) {
            Platform::firstOrCreate(
                ['slug' => $platformData['slug']],
                $platformData
            );
        }

        // Exemple : Associer les plateformes au premier compte
        $account = Account::first();
        
        if ($account) {
            $gpsTracker = Platform::where('slug', 'gps-tracker')->first();
            $fleetManager = Platform::where('slug', 'fleet-manager')->first();

            if ($gpsTracker) {
                // Vérifier si la relation existe déjà
                if (!$account->platforms()->where('platform_id', $gpsTracker->id)->exists()) {
                    $account->platforms()->attach($gpsTracker->id, [
                        'api_url' => 'https://api.example.com/gps-tracker/vehicles',
                        'api_token' => 'example-token-for-gps-tracker',
                    ]);
                }
            }

            if ($fleetManager) {
                if (!$account->platforms()->where('platform_id', $fleetManager->id)->exists()) {
                    $account->platforms()->attach($fleetManager->id, [
                        'api_url' => 'https://api.example.com/fleet-manager/vehicles',
                        'api_token' => 'example-token-for-fleet-manager',
                    ]);
                }
            }

            $this->command->info('Platforms seeded successfully!');
            $this->command->info('Note: Update api_url and api_token with real values in your database.');
        } else {
            $this->command->warn('No account found. Please create an account first.');
        }
    }
}
