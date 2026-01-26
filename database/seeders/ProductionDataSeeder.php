<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Platform;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class ProductionDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting production data seeding...');

        // Load data from JSON files
        $dataPath = database_path('seeders/data');

        // Create Super Admin User FIRST (before reports that reference it)
        $this->command->info('Creating super admin user...');
        
        $superAdmin = User::updateOrCreate(
            ['email' => 'admin@tracking-dashboard.com'],
            [
                'name' => 'Super Admin',
                'email' => 'admin@tracking-dashboard.com',
                'password' => Hash::make('AdminPass123!'),
                'role' => 'super-admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Super admin created: admin@tracking-dashboard.com / AdminPass123!');
        $this->command->warn('IMPORTANT: Change this password immediately after first login!');

        // Seed Platforms
        $this->command->info('Seeding platforms...');
        $platformsData = json_decode(File::get($dataPath . '/platforms.json'), true);
        
        foreach ($platformsData as $platformData) {
            Platform::updateOrCreate(
                ['id' => $platformData['id']],
                $platformData
            );
        }
        $this->command->info('Seeded ' . count($platformsData) . ' platforms');

        // Seed Accounts
        $this->command->info('Seeding accounts...');
        $accountsData = json_decode(File::get($dataPath . '/accounts.json'), true);
        
        foreach ($accountsData as $accountData) {
            $platforms = $accountData['platforms'] ?? [];
            unset($accountData['platforms']);
            
            $account = Account::updateOrCreate(
                ['id' => $accountData['id']],
                $accountData
            );

            // Sync platforms with pivot data
            if (!empty($platforms)) {
                $syncData = [];
                foreach ($platforms as $platformData) {
                    $syncData[$platformData['platform_id']] = [
                        'api_url' => $platformData['api_url'] ?? null,
                        'api_token' => $platformData['api_token'] ?? null,
                        'http_method' => $platformData['http_method'] ?? 'GET',
                        'token_type' => $platformData['token_type'] ?? null,
                        'token_key' => $platformData['token_key'] ?? null,
                        'additional_params' => $platformData['additional_params'] ?? null,
                        'is_active' => $platformData['is_active'] ?? true,
                    ];
                }
                $account->platforms()->sync($syncData);
            }
        }
        $this->command->info('Seeded ' . count($accountsData) . ' accounts');

        // Seed Reports with their platform endpoints
        $this->command->info('Seeding reports...');
        $reportsData = json_decode(File::get($dataPath . '/reports.json'), true);
        
        foreach ($reportsData as $reportData) {
            $platformEndpoints = $reportData['platform_endpoints'] ?? [];
            unset($reportData['platform_endpoints']);
            
            $report = Report::updateOrCreate(
                ['id' => $reportData['id']],
                $reportData
            );

            // Sync platform endpoints
            if (!empty($platformEndpoints)) {
                $report->platformEndpoints()->delete(); // Clear existing
                
                foreach ($platformEndpoints as $endpointData) {
                    $report->platformEndpoints()->create($endpointData);
                }
            }
        }
        $this->command->info('Seeded ' . count($reportsData) . ' reports');

        // Assign first account to super admin if exists
        if (Account::count() > 0 && !$superAdmin->account_id) {
            $superAdmin->account_id = Account::first()->id;
            $superAdmin->save();
        }

        $this->command->info('Production data seeding completed successfully!');
    }
}
