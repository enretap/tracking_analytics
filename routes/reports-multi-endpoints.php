<?php

/**
 * Routes additionnelles pour le système de rapports multi-endpoints
 * 
 * À ajouter dans routes/web.php après les autres routes de rapports
 */

use App\Http\Controllers\Reports\SummaryReportController;
use App\Http\Controllers\Settings\ReportEndpointConfigurationController;

Route::middleware(['auth', 'verified'])->group(function () {
    
    // ═══════════════════════════════════════════════════════════════════
    // Routes pour le Rapport de Synthèse (exemple avec multi-endpoints)
    // ═══════════════════════════════════════════════════════════════════
    
    Route::prefix('reports/summary')->name('reports.summary.')->group(function () {
        // Formulaire de génération
        Route::get('/create', [SummaryReportController::class, 'create'])
            ->name('create');
        
        // Génération du rapport
        Route::post('/generate', [SummaryReportController::class, 'generate'])
            ->name('generate');
        
        // Export PDF
        Route::post('/pdf', [SummaryReportController::class, 'downloadPdf'])
            ->name('pdf');
        
        // Export Excel
        Route::post('/excel', [SummaryReportController::class, 'downloadExcel'])
            ->name('excel');
    });
    
    // ═══════════════════════════════════════════════════════════════════
    // Routes pour la configuration des endpoints de rapports
    // ═══════════════════════════════════════════════════════════════════
    
    Route::prefix('settings/report-endpoints')->name('settings.report-endpoints.')->group(function () {
        // Page de configuration
        Route::get('/', [ReportEndpointConfigurationController::class, 'index'])
            ->name('index');
        
        // Sauvegarder la configuration
        Route::post('/', [ReportEndpointConfigurationController::class, 'store'])
            ->name('store');
        
        // Supprimer une configuration
        Route::delete('/{reportId}/{platformId}', [ReportEndpointConfigurationController::class, 'destroy'])
            ->name('destroy');
    });
});
