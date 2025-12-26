<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  Configuration des Endpoints - Rapport de Synthèse\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

$endpoints = DB::table('report_platform_endpoints')
    ->join('reports', 'report_platform_endpoints.report_id', '=', 'reports.id')
    ->join('platforms', 'report_platform_endpoints.platform_id', '=', 'platforms.id')
    ->select(
        'reports.name as report_name',
        'platforms.name as platform_name',
        'report_platform_endpoints.endpoint_path',
        'report_platform_endpoints.http_method',
        'report_platform_endpoints.data_key',
        'report_platform_endpoints.order',
        'report_platform_endpoints.is_required',
        'report_platform_endpoints.description'
    )
    ->orderBy('report_platform_endpoints.order')
    ->get();

if ($endpoints->isEmpty()) {
    echo "❌ Aucun endpoint configuré\n\n";
    exit(1);
}

foreach ($endpoints as $endpoint) {
    echo "Rapport: {$endpoint->report_name}\n";
    echo "Plateforme: {$endpoint->platform_name}\n";
    echo "─────────────────────────────────────────────────────────────────\n";
    echo "  Ordre: {$endpoint->order}\n";
    echo "  Méthode: {$endpoint->http_method}\n";
    echo "  Chemin: {$endpoint->endpoint_path}\n";
    echo "  Clé de données: {$endpoint->data_key}\n";
    echo "  Obligatoire: " . ($endpoint->is_required ? 'Oui' : 'Non') . "\n";
    echo "  Description: {$endpoint->description}\n";
    echo "\n";
}

echo "✅ Total: " . $endpoints->count() . " endpoint(s) configuré(s)\n";
