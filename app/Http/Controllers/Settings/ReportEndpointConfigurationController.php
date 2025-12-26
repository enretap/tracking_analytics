<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Platform;
use App\Models\ReportPlatformEndpoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportEndpointConfigurationController extends Controller
{
    /**
     * Display the endpoint configuration page
     */
    public function index()
    {
        // Get all reports with their configured platforms and endpoints
        $reports = Report::with(['platformEndpoints.platform'])
            ->orderBy('name')
            ->get()
            ->map(function ($report) {
                $platforms = Platform::where('is_active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(function ($platform) use ($report) {
                        $endpoints = $report->platformEndpoints()
                            ->where('platform_id', $platform->id)
                            ->orderBy('order')
                            ->get();

                        return [
                            'id' => $platform->id,
                            'name' => $platform->name,
                            'slug' => $platform->slug,
                            'has_endpoints' => $endpoints->isNotEmpty(),
                            'endpoints' => $endpoints->map(function ($endpoint) {
                                return [
                                    'id' => $endpoint->id,
                                    'endpoint_path' => $endpoint->endpoint_path,
                                    'http_method' => $endpoint->http_method,
                                    'data_key' => $endpoint->data_key,
                                    'additional_params' => $endpoint->additional_params,
                                    'order' => $endpoint->order,
                                    'is_required' => $endpoint->is_required,
                                    'description' => $endpoint->description,
                                ];
                            }),
                        ];
                    });

                return [
                    'id' => $report->id,
                    'name' => $report->name,
                    'type' => $report->type,
                    'description' => $report->description,
                    'platforms' => $platforms,
                ];
            });

        return Inertia::render('settings/ReportEndpointConfiguration', [
            'reports' => $reports,
        ]);
    }

    /**
     * Store or update endpoint configuration
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_id' => 'required|exists:reports,id',
            'platform_id' => 'required|exists:platforms,id',
            'endpoints' => 'required|array|min:1',
            'endpoints.*.endpoint_path' => 'required|string|max:500',
            'endpoints.*.http_method' => 'nullable|in:GET,POST',
            'endpoints.*.data_key' => 'required|string|max:100',
            'endpoints.*.additional_params' => 'nullable|json',
            'endpoints.*.order' => 'nullable|integer|min:0',
            'endpoints.*.is_required' => 'nullable|boolean',
            'endpoints.*.description' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();
        try {
            // Delete existing endpoints for this report/platform combination
            ReportPlatformEndpoint::where('report_id', $validated['report_id'])
                ->where('platform_id', $validated['platform_id'])
                ->delete();

            // Create new endpoints
            foreach ($validated['endpoints'] as $index => $endpointData) {
                ReportPlatformEndpoint::create([
                    'report_id' => $validated['report_id'],
                    'platform_id' => $validated['platform_id'],
                    'endpoint_path' => $endpointData['endpoint_path'],
                    'http_method' => $endpointData['http_method'] ?? 'GET',
                    'data_key' => $endpointData['data_key'],
                    'additional_params' => $endpointData['additional_params'] ?? null,
                    'order' => $endpointData['order'] ?? $index,
                    'is_required' => $endpointData['is_required'] ?? true,
                    'description' => $endpointData['description'] ?? null,
                ]);
            }

            DB::commit();

            $report = Report::find($validated['report_id']);
            $platform = Platform::find($validated['platform_id']);

            return back()->with('success', "Endpoints configurés avec succès pour {$report->name} sur {$platform->name}");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error saving report endpoints: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Erreur lors de la sauvegarde: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete all endpoints for a report/platform combination
     */
    public function destroy(Request $request, int $reportId, int $platformId)
    {
        ReportPlatformEndpoint::where('report_id', $reportId)
            ->where('platform_id', $platformId)
            ->delete();

        return back()->with('success', 'Endpoints supprimés avec succès');
    }
}
