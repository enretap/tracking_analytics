<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Platform;
use App\Services\ReportDataService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Exemple de contrôleur pour générer le Rapport de Synthèse
 * avec les données de plusieurs endpoints TARGE TELEMATICS
 */
class SummaryReportController extends Controller
{
    protected $reportDataService;

    public function __construct(ReportDataService $reportDataService)
    {
        $this->reportDataService = $reportDataService;
    }

    /**
     * Afficher le formulaire de génération du rapport
     */
    public function create()
    {
        $report = Report::where('type', 'summary')
            ->orWhere('name', 'Rapport de Synthèse')
            ->first();

        if (!$report) {
            return back()->withErrors(['error' => 'Rapport de synthèse non trouvé']);
        }

        // Récupérer les plateformes configurées pour ce rapport
        $platforms = $report->platforms()->get();

        return Inertia::render('reports/SummaryReportForm', [
            'report' => $report,
            'platforms' => $platforms,
        ]);
    }

    /**
     * Générer et afficher le rapport
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'report_id' => 'required|exists:reports,id',
            'platform_id' => 'required|exists:platforms,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'vehicle_ids' => 'nullable|array',
            'vehicle_ids.*' => 'string',
        ]);

        $user = $request->user();
        $account = $user->account;

        if (!$account) {
            return back()->withErrors(['error' => 'Aucun compte associé à cet utilisateur']);
        }

        $report = Report::find($validated['report_id']);
        $platform = Platform::find($validated['platform_id']);

        // Préparer les paramètres de la requête
        $params = [
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ];

        if (!empty($validated['vehicle_ids'])) {
            $params['vehicle_ids'] = $validated['vehicle_ids'];
        }

        // Récupérer les données depuis tous les endpoints configurés
        $result = $this->reportDataService->fetchReportData(
            $report,
            $account,
            $platform,
            $params
        );

        if (!$result['success']) {
            return back()->withErrors([
                'error' => $result['error'],
            ])->with('partial_data', $result['partial_data'] ?? null);
        }

        // Transformer les données pour le template
        $summaryData = $this->transformDataForTemplate($result['data']);

        return Inertia::render('reports/templates/SummaryTemplate', [
            'data' => $summaryData,
            'period_start' => $validated['start_date'],
            'period_end' => $validated['end_date'],
            'platform' => $platform->name,
            'account' => $account->name,
            'errors' => $result['errors'] ?? [],
        ]);
    }

    /**
     * Transformer les données brutes en format attendu par SummaryTemplate
     */
    protected function transformDataForTemplate(array $rawData): array
    {
        $summary = [];

        // Traiter les événements (events)
        if (isset($rawData['events'])) {
            $events = $rawData['events'];
            
            // Exemple de transformation
            $summary['total_alerts'] = count($events);
            $summary['critical_alerts'] = collect($events)
                ->filter(fn($e) => ($e['severity'] ?? '') === 'critical')
                ->count();
        }

        // Traiter le résumé éco-conduite (eco_summary)
        if (isset($rawData['eco_summary'])) {
            $ecoData = $rawData['eco_summary'];
            
            // Calculer les moyennes
            if (is_array($ecoData) && !empty($ecoData)) {
                $summary['total_distance'] = array_sum(array_column($ecoData, 'distance'));
                $summary['total_fuel_consumption'] = array_sum(array_column($ecoData, 'fuel'));
                $summary['average_fuel_efficiency'] = $summary['total_distance'] / max($summary['total_fuel_consumption'], 1);
                
                // Détails par véhicule
                $summary['vehicle_details'] = collect($ecoData)->map(function ($vehicle) {
                    return [
                        'immatriculation' => $vehicle['registration'] ?? '',
                        'driver' => $vehicle['driver'] ?? '',
                        'distance' => $vehicle['distance'] ?? 0,
                        'harsh_braking' => $vehicle['harsh_braking'] ?? 0,
                        'harsh_acceleration' => $vehicle['harsh_acceleration'] ?? 0,
                        'speed_violations' => $vehicle['speed_violations'] ?? 0,
                    ];
                })->toArray();
            }
        }

        // Traiter les arrêts (stops)
        if (isset($rawData['stops'])) {
            $stops = $rawData['stops'];
            
            if (is_array($stops)) {
                $summary['total_stops'] = count($stops);
                $summary['total_stop_duration'] = array_sum(array_column($stops, 'duration'));
            }
        }

        return $summary;
    }

    /**
     * Générer un rapport PDF
     */
    public function downloadPdf(Request $request)
    {
        // Similaire à generate() mais retourne un PDF
        // À implémenter selon vos besoins (DomPDF, etc.)
    }

    /**
     * Générer un rapport Excel
     */
    public function downloadExcel(Request $request)
    {
        // Similaire à generate() mais retourne un Excel
        // À implémenter selon vos besoins (Laravel Excel, etc.)
    }
}
