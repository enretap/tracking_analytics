<?php

namespace App\Console\Commands;

use App\Models\Account;
use App\Models\Platform;
use App\Models\Report;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ExportProductionData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:export';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export production data (platforms, accounts, reports) to seeder files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting data export...');

        $dataPath = database_path('seeders/data');
        if (!File::exists($dataPath)) {
            File::makeDirectory($dataPath, 0755, true);
        }

        // Export Platforms
        $this->info('Exporting platforms...');
        $platforms = Platform::all()->map(function ($platform) {
            return [
                'id' => $platform->id,
                'name' => $platform->name,
                'slug' => $platform->slug,
                'provider' => $platform->provider,
                'config' => $platform->config,
                'is_active' => $platform->is_active,
                'created_at' => $platform->created_at,
                'updated_at' => $platform->updated_at,
            ];
        })->toArray();

        File::put(
            $dataPath . '/platforms.json',
            json_encode($platforms, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
        $this->info('Exported ' . count($platforms) . ' platforms');

        // Export Accounts
        $this->info('Exporting accounts...');
        $accounts = Account::with('platforms')->get()->map(function ($account) {
            return [
                'id' => $account->id,
                'name' => $account->name,
                'domain' => $account->domain,
                'reference_ctrack' => $account->reference_ctrack,
                'logo' => $account->logo,
                'settings' => $account->settings,
                'is_active' => $account->is_active,
                'created_at' => $account->created_at,
                'updated_at' => $account->updated_at,
                'platforms' => $account->platforms->map(function ($platform) {
                    return [
                        'platform_id' => $platform->id,
                        'api_url' => $platform->pivot->api_url,
                        'api_token' => $platform->pivot->api_token,
                        'http_method' => $platform->pivot->http_method,
                        'token_type' => $platform->pivot->token_type,
                        'token_key' => $platform->pivot->token_key,
                        'additional_params' => $platform->pivot->additional_params,
                        'is_active' => $platform->pivot->is_active,
                    ];
                })->toArray(),
            ];
        })->toArray();

        File::put(
            $dataPath . '/accounts.json',
            json_encode($accounts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
        $this->info('Exported ' . count($accounts) . ' accounts');

        // Export Reports with their endpoints
        $this->info('Exporting reports...');
        $reports = Report::with('platformEndpoints')->get()->map(function ($report) {
            return [
                'id' => $report->id,
                'name' => $report->name,
                'description' => $report->description,
                'type' => $report->type,
                'schedule' => $report->schedule,
                'params' => $report->params,
                'created_by' => $report->created_by,
                'is_enabled' => $report->is_enabled,
                'created_at' => $report->created_at,
                'updated_at' => $report->updated_at,
                'platform_endpoints' => $report->platformEndpoints->map(function ($endpoint) {
                    return [
                        'platform_id' => $endpoint->platform_id,
                        'endpoint_path' => $endpoint->endpoint_path,
                        'http_method' => $endpoint->http_method,
                        'data_key' => $endpoint->data_key,
                        'additional_params' => $endpoint->additional_params,
                        'order' => $endpoint->order,
                        'is_required' => $endpoint->is_required,
                        'description' => $endpoint->description,
                    ];
                })->toArray(),
            ];
        })->toArray();

        File::put(
            $dataPath . '/reports.json',
            json_encode($reports, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
        $this->info('Exported ' . count($reports) . ' reports');

        $this->info('Data export completed successfully!');
        $this->line('Files saved in: ' . $dataPath);

        return Command::SUCCESS;
    }
}
