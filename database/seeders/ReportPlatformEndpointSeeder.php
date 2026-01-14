<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Report;
use App\Models\Platform;
use App\Models\ReportPlatformEndpoint;
use Illuminate\Support\Facades\DB;

class ReportPlatformEndpointSeeder extends Seeder
{
    /**
     * Seed the report platform endpoints.
     * Example: Rapport de Synthèse avec TARGE TELEMATICS
     */
    public function run(): void
    {
        // Chercher ou créer le rapport "Rapport de Synthèse"
        $summaryReport = Report::firstOrCreate(
            ['name' => 'Rapport de Synthèse'],
            [
                'description' => 'Rapport synthétique regroupant les événements, l\'éco-conduite et les arrêts',
                'type' => 'summary',
                'is_enabled' => true,
            ]
        );

        // Chercher ou créer la plateforme TARGE TELEMATICS
        $targeTelematics = Platform::firstOrCreate(
            ['slug' => 'targe-telematics'],
            [
                'name' => 'TARGE TELEMATICS',
                'provider' => 'Securysat',
                'is_active' => true,
            ]
        );

        // Chercher ou créer la plateforme CTRACK
        $ctrack = Platform::firstOrCreate(
            ['slug' => 'ctrack'],
            [
                'name' => 'CTRACK',
                'provider' => 'CTRACK',
                'is_active' => true,
            ]
        );

        // Supprimer les endpoints existants pour éviter les doublons
        ReportPlatformEndpoint::where('report_id', $summaryReport->id)
            ->where('platform_id', $targeTelematics->id)
            ->delete();
        
        ReportPlatformEndpoint::where('report_id', $summaryReport->id)
            ->where('platform_id', $ctrack->id)
            ->delete();

        // Configuration des endpoints pour TARGE TELEMATICS
        // Note: Le base URL (https://fleet.securysat.com) sera configuré dans account_platform
        // Note: Les paramètres sessionId, startDate, endDate sont ajoutés automatiquement par ReportDataService
        
        $endpointsTarge = [
            [
                'endpoint_path' => '/json/getEventHistoryReport',
                'http_method' => 'POST',
                'data_key' => 'events',
                'description' => 'Historique des événements du véhicule (alertes, violations, etc.)',
                'order' => 1,
                'is_required' => true,
                'additional_params' => json_encode([
                    // sessionId, startDate, endDate sont ajoutés automatiquement
                ]),
            ],
            [
                'endpoint_path' => '/json/getDailyVehicleEcoSummary',
                'http_method' => 'POST',
                'data_key' => 'eco_summary',
                'description' => 'Résumé quotidien de l\'éco-conduite par véhicule',
                'order' => 2,
                'is_required' => true,
                'additional_params' => json_encode([
                    // sessionId, startDate, endDate sont ajoutés automatiquement
                ]),
            ],
            [
                'endpoint_path' => '/json/getStopReport',
                'http_method' => 'POST',
                'data_key' => 'stops',
                'description' => 'Rapport des arrêts du véhicule avec durée et localisation',
                'order' => 3,
                'is_required' => false, // Non requis car optionnel pour le rapport
                'additional_params' => json_encode([
                    // sessionId, startDate, endDate sont ajoutés automatiquement
                    'min_duration' => 300, // Arrêts de minimum 5 minutes (paramètre spécifique)
                ]),
            ],
        ];

        foreach ($endpointsTarge as $endpointData) {
            ReportPlatformEndpoint::create([
                'report_id' => $summaryReport->id,
                'platform_id' => $targeTelematics->id,
                'endpoint_path' => $endpointData['endpoint_path'],
                'http_method' => $endpointData['http_method'],
                'data_key' => $endpointData['data_key'],
                'description' => $endpointData['description'],
                'order' => $endpointData['order'],
                'is_required' => $endpointData['is_required'],
                'additional_params' => $endpointData['additional_params'],
            ]);
        }

        // Configuration des endpoints pour CTRACK
        // Note: Le base URL (https://comafrique-ctrack.online) sera configuré dans account_platform
        // Note: Les paramètres begin, end sont envoyés en query string (format: d/m/Y)
        
        $endpointsCtrack = [
            [
                'endpoint_path' => '/api/units/ecoDriving',
                'http_method' => 'GET',
                'data_key' => 'eco_driving',
                'description' => 'Données d\'éco-conduite CTRACK avec violations et métriques de conduite',
                'order' => 1,
                'is_required' => true,
                'additional_params' => json_encode([
                    // begin et end sont ajoutés en query parameters (format: dd/mm/yyyy)
                ]),
            ],
        ];

        foreach ($endpointsCtrack as $endpointData) {
            ReportPlatformEndpoint::create([
                'report_id' => $summaryReport->id,
                'platform_id' => $ctrack->id,
                'endpoint_path' => $endpointData['endpoint_path'],
                'http_method' => $endpointData['http_method'],
                'data_key' => $endpointData['data_key'],
                'description' => $endpointData['description'],
                'order' => $endpointData['order'],
                'is_required' => $endpointData['is_required'],
                'additional_params' => $endpointData['additional_params'],
            ]);
        }

        $this->command->info('✅ Endpoints configurés pour le Rapport de Synthèse');
        $this->command->newLine();
        $this->command->info('📊 TARGE TELEMATICS:');
        $this->command->info('   - getEventHistoryReport (événements)');
        $this->command->info('   - getDailyVehicleEcoSummary (éco-conduite)');
        $this->command->info('   - getStopReport (arrêts)');
        $this->command->newLine();
        $this->command->info('📊 CTRACK:');
        $this->command->info('   - /api/units/ecoDriving (éco-conduite)');
        $this->command->newLine();
        $this->command->warn('⚠️  N\'oubliez pas de configurer les URLs et tokens dans account_platform:');
        $this->command->info('   TARGE: https://fleet.securysat.com');
        $this->command->info('   CTRACK: https://comafrique-ctrack.online');
    }
}
