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

        // Supprimer les endpoints existants pour éviter les doublons
        ReportPlatformEndpoint::where('report_id', $summaryReport->id)
            ->where('platform_id', $targeTelematics->id)
            ->delete();

        // Configuration des endpoints pour TARGE TELEMATICS
        // Note: Le base URL (https://fleet.securysat.com) sera configuré dans account_platform
        // Note: Les paramètres sessionId, startDate, endDate sont ajoutés automatiquement par ReportDataService
        
        $endpoints = [
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

        foreach ($endpoints as $endpointData) {
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

        $this->command->info('✅ Endpoints configurés pour le Rapport de Synthèse sur TARGE TELEMATICS');
        $this->command->info('   - getEventHistoryReport (événements)');
        $this->command->info('   - getDailyVehicleEcoSummary (éco-conduite)');
        $this->command->info('   - getStopReport (arrêts)');
        $this->command->newLine();
        $this->command->warn('⚠️  N\'oubliez pas de configurer l\'URL de base et le token dans account_platform:');
        $this->command->info('   Base URL: https://fleet.securysat.com');
        $this->command->info('   Compte: APM (ou autre)');
    }
}
