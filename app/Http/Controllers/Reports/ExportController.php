<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Dompdf\Dompdf;
use App\Models\Account;
use App\Models\Platform;
use App\Models\Report;

class ExportController extends Controller
{
    public function export(Request $request)
    {
        $data = $request->validate([
            'account_ids' => ['nullable', 'array'],
            'account_ids.*' => ['integer', 'exists:accounts,id'],
            'platform_ids' => ['nullable', 'array'],
            'platform_ids.*' => ['integer', 'exists:platforms,id'],
            'report_ids' => ['nullable', 'array'],
            'report_ids.*' => ['integer', 'exists:reports,id'],
            'format' => ['required', 'in:csv,xlsx,pdf'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        // Build a simple result set: list combinations of account, platforms and reports
        $accounts = Account::with(['platforms', 'reports'])->when(!empty($data['account_ids']), function ($q) use ($data) {
            $q->whereIn('id', $data['account_ids']);
        })->get();

        $rows = [];
        foreach ($accounts as $account) {
            $platformNames = $account->platforms->pluck('name')->join(', ');
            $reportNames = $account->reports->pluck('name')->join(', ');
            $rows[] = [
                'account_id' => $account->id,
                'account_name' => $account->name,
                'platforms' => $platformNames,
                'reports' => $reportNames,
            ];
        }

        $format = $data['format'];

        if ($format === 'csv') {
            $filename = 'reports_export_'.now()->format('Ymd_His').'.csv';
            $callback = function () use ($rows) {
                $FH = fopen('php://output', 'w');
                fputcsv($FH, ['Account ID', 'Account Name', 'Platforms', 'Reports']);
                foreach ($rows as $r) {
                    fputcsv($FH, [$r['account_id'], $r['account_name'], $r['platforms'], $r['reports']]);
                }
                fclose($FH);
            };

            return Response::stream($callback, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        }

        // XLSX export via PhpSpreadsheet
        if ($format === 'xlsx') {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->fromArray(['Account ID', 'Account Name', 'Platforms', 'Reports'], null, 'A1');
            $rowIdx = 2;
            foreach ($rows as $r) {
                $sheet->fromArray([$r['account_id'], $r['account_name'], $r['platforms'], $r['reports']], null, 'A'.$rowIdx);
                $rowIdx++;
            }

            $writer = new Xlsx($spreadsheet);
            $filename = 'reports_export_'.now()->format('Ymd_His').'.xlsx';

            // Stream the file
            $tempFile = tmpfile();
            $meta = stream_get_meta_data($tempFile);
            $tmpPath = $meta['uri'];
            $writer->save($tmpPath);
            $stream = fopen($tmpPath, 'rb');
            $contents = stream_get_contents($stream);
            fclose($stream);

            return Response::make($contents, 200, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        }

        // PDF export via Dompdf — render a simple HTML table
        if ($format === 'pdf') {
            $html = '<h3>Export de rapports</h3>';
            $html .= '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;width:100%">';
            $html .= '<thead><tr><th>Account ID</th><th>Account Name</th><th>Platforms</th><th>Reports</th></tr></thead><tbody>';
            foreach ($rows as $r) {
                $html .= '<tr>';
                $html .= '<td>'.htmlspecialchars($r['account_id']).'</td>';
                $html .= '<td>'.htmlspecialchars($r['account_name']).'</td>';
                $html .= '<td>'.htmlspecialchars($r['platforms']).'</td>';
                $html .= '<td>'.htmlspecialchars($r['reports']).'</td>';
                $html .= '</tr>';
            }
            $html .= '</tbody></table>';

            $dompdf = new Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $output = $dompdf->output();
            $filename = 'reports_export_'.now()->format('Ymd_His').'.pdf';

            return Response::make($output, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        }
    }

    /**
     * Export a single report as PDF
     */
    public function exportReportPdf($reportId)
    {
        $user = auth()->user();
        
        if (!$user || !$user->account_id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $report = Report::whereHas('accounts', function ($query) use ($user) {
                $query->where('accounts.id', $user->account_id);
            })
            ->find($reportId);

        if (!$report) {
            return response()->json(['error' => 'Report not found'], 404);
        }

        // Récupérer le contenu HTML envoyé depuis le frontend
        $htmlContent = request('html_content');
        $reportName = request('report_name', $report->name);
        $periodStart = request('period_start');
        $periodEnd = request('period_end');

        // Générer le HTML complet pour le PDF avec les styles
        $html = $this->generatePdfFromHtml($htmlContent, $reportName, $periodStart, $periodEnd);

        $dompdf = new Dompdf([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
        ]);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();
        $output = $dompdf->output();
        
        $filename = \Illuminate\Support\Str::slug($reportName) . '_' . now()->format('Y-m-d') . '.pdf';

        return Response::make($output, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Share a report by email
     */
    public function shareReport($reportId)
    {
        $user = auth()->user();
        
        if (!$user || !$user->account_id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $report = Report::whereHas('accounts', function ($query) use ($user) {
                $query->where('accounts.id', $user->account_id);
            })
            ->find($reportId);

        if (!$report) {
            return response()->json(['error' => 'Report not found'], 404);
        }

        try {
            // Récupérer le contenu HTML envoyé depuis le frontend
            $htmlContent = request('html_content');
            $reportName = request('report_name', $report->name);
            $periodStart = request('period_start');
            $periodEnd = request('period_end');

            // Générer le HTML complet pour le PDF
            $html = $this->generatePdfFromHtml($htmlContent, $reportName, $periodStart, $periodEnd);
            
            $dompdf = new Dompdf([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ]);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $pdfContent = base64_encode($dompdf->output());
            
            $fileName = \Illuminate\Support\Str::slug($reportName) . '_' . date('Y-m-d') . '.pdf';
            
            // Envoyer l'email à l'utilisateur connecté
            $emails = [$user->email];
            
            // Dispatcher le job en arrière-plan
            \App\Jobs\SendReportEmail::dispatch(
                $emails,
                $pdfContent,
                $reportName,
                $fileName
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Le rapport est en cours d\'envoi. Vous recevrez une confirmation par email.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors du partage du rapport: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de l\'envoi du rapport.'], 500);
        }
    }

    /**
     * Generate PDF HTML from captured content
     */
    private function generatePdfFromHtml($htmlContent, $reportName, $periodStart = null, $periodEnd = null)
    {
        $html = '<!DOCTYPE html>';
        $html .= '<html><head>';
        $html .= '<meta charset="UTF-8">';
        $html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
        $html .= '<style>';
        
        // Reset et base
        $html .= '* { margin: 0; padding: 0; box-sizing: border-box; }';
        $html .= 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 10px; line-height: 1.4; color: #1f2937; background: #ffffff; padding: 10px; }';
        
        // Spacing utilities
        $html .= '.space-y-1 > * + * { margin-top: 0.25rem; }';
        $html .= '.space-y-2 > * + * { margin-top: 0.5rem; }';
        $html .= '.space-y-3 > * + * { margin-top: 0.75rem; }';
        $html .= '.space-y-4 > * + * { margin-top: 1rem; }';
        $html .= '.space-y-5 > * + * { margin-top: 1.25rem; }';
        $html .= '.space-y-6 > * + * { margin-top: 1.5rem; }';
        $html .= '.gap-1 { gap: 0.25rem; }';
        $html .= '.gap-2 { gap: 0.5rem; }';
        $html .= '.gap-3 { gap: 0.75rem; }';
        $html .= '.gap-4 { gap: 1rem; }';
        $html .= '.gap-6 { gap: 1.5rem; }';
        
        // Padding
        $html .= '.p-1 { padding: 0.25rem; }';
        $html .= '.p-2 { padding: 0.5rem; }';
        $html .= '.p-3 { padding: 0.75rem; }';
        $html .= '.p-4 { padding: 1rem; }';
        $html .= '.p-6 { padding: 1.5rem; }';
        $html .= '.p-8 { padding: 2rem; }';
        $html .= '.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }';
        $html .= '.px-4 { padding-left: 1rem; padding-right: 1rem; }';
        $html .= '.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }';
        $html .= '.py-4 { padding-top: 1rem; padding-bottom: 1rem; }';
        $html .= '.py-8 { padding-top: 2rem; padding-bottom: 2rem; }';
        $html .= '.pb-3 { padding-bottom: 0.75rem; }';
        $html .= '.pt-4 { padding-top: 1rem; }';
        
        // Margin
        $html .= '.m-0 { margin: 0; }';
        $html .= '.mb-1 { margin-bottom: 0.25rem; }';
        $html .= '.mb-2 { margin-bottom: 0.5rem; }';
        $html .= '.mb-6 { margin-bottom: 1.5rem; }';
        $html .= '.mt-1 { margin-top: 0.25rem; }';
        $html .= '.mt-2 { margin-top: 0.5rem; }';
        
        // Grid system
        $html .= '.grid { display: grid; }';
        $html .= '.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }';
        $html .= '.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }';
        $html .= '.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }';
        $html .= '.md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }';
        $html .= '.md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }';
        $html .= '.md\\:col-span-2 { grid-column: span 2 / span 2; }';
        
        // Flex
        $html .= '.flex { display: flex; }';
        $html .= '.flex-1 { flex: 1 1 0%; }';
        $html .= '.flex-col { flex-direction: column; }';
        $html .= '.flex-shrink-0 { flex-shrink: 0; }';
        $html .= '.items-center { align-items: center; }';
        $html .= '.items-start { align-items: flex-start; }';
        $html .= '.items-end { align-items: flex-end; }';
        $html .= '.justify-between { justify-content: space-between; }';
        $html .= '.justify-center { justify-content: center; }';
        $html .= '.justify-around { justify-content: space-around; }';
        
        // Backgrounds
        $html .= '.bg-white { background-color: #ffffff; }';
        $html .= '.bg-gray-50 { background-color: #f9fafb; }';
        $html .= '.bg-gray-100 { background-color: #f3f4f6; }';
        $html .= '.bg-gray-200 { background-color: #e5e7eb; }';
        $html .= '.bg-gray-500 { background-color: #6b7280; }';
        $html .= '.bg-gray-800 { background-color: #1f2937; }';
        
        // Borders
        $html .= '.border { border-width: 1px; }';
        $html .= '.border-0 { border-width: 0; }';
        $html .= '.border-b { border-bottom-width: 1px; }';
        $html .= '.border-gray-200 { border-color: #e5e7eb; }';
        $html .= '.border-dashed { border-style: dashed; }';
        
        // Border radius
        $html .= '.rounded { border-radius: 0.25rem; }';
        $html .= '.rounded-sm { border-radius: 0.125rem; }';
        $html .= '.rounded-lg { border-radius: 0.5rem; }';
        $html .= '.rounded-xl { border-radius: 0.75rem; }';
        $html .= '.rounded-t { border-top-left-radius: 0.25rem; border-top-right-radius: 0.25rem; }';
        $html .= '.rounded-full { border-radius: 9999px; }';
        
        // Shadows
        $html .= '.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }';
        $html .= '.shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }';
        $html .= '.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }';
        $html .= '.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }';
        
        // Text sizes
        $html .= '.text-xs { font-size: 0.75rem; line-height: 1rem; }';
        $html .= '.text-sm { font-size: 0.875rem; line-height: 1.25rem; }';
        $html .= '.text-base { font-size: 1rem; line-height: 1.5rem; }';
        $html .= '.text-lg { font-size: 1.125rem; line-height: 1.75rem; }';
        $html .= '.text-xl { font-size: 1.25rem; line-height: 1.75rem; }';
        $html .= '.text-2xl { font-size: 1.5rem; line-height: 2rem; }';
        $html .= '.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }';
        
        // Font weights
        $html .= '.font-normal { font-weight: 400; }';
        $html .= '.font-medium { font-weight: 500; }';
        $html .= '.font-semibold { font-weight: 600; }';
        $html .= '.font-bold { font-weight: 700; }';
        
        // Text colors
        $html .= '.text-white { color: #ffffff; }';
        $html .= '.text-gray-500 { color: #6b7280; }';
        $html .= '.text-gray-600 { color: #4b5563; }';
        $html .= '.text-gray-700 { color: #374151; }';
        $html .= '.text-gray-800 { color: #1f2937; }';
        $html .= '.text-gray-900 { color: #111827; }';
        $html .= '.text-red-500 { color: #ef4444; }';
        $html .= '.text-blue-600 { color: #2563eb; }';
        
        // Text utilities
        $html .= '.text-center { text-align: center; }';
        $html .= '.text-right { text-align: right; }';
        $html .= '.uppercase { text-transform: uppercase; }';
        $html .= '.tracking-wide { letter-spacing: 0.025em; }';
        $html .= '.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
        
        // Width & Height
        $html .= '.w-full { width: 100%; }';
        $html .= '.w-3 { width: 0.75rem; }';
        $html .= '.w-8 { width: 2rem; }';
        $html .= '.w-64 { width: 16rem; }';
        $html .= '.h-3 { height: 0.75rem; }';
        $html .= '.h-5 { height: 1.25rem; }';
        $html .= '.h-56 { height: 14rem; }';
        $html .= '.h-64 { height: 16rem; }';
        $html .= '.min-h-\\[4px\\] { min-height: 4px; }';
        $html .= '.min-h-\\[6px\\] { min-height: 6px; }';
        
        // Position
        $html .= '.relative { position: relative; }';
        $html .= '.absolute { position: absolute; }';
        $html .= '.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }';
        
        // Display
        $html .= '.block { display: block; }';
        $html .= '.inline-block { display: inline-block; }';
        $html .= '.hidden { display: none; }';
        
        // Overflow
        $html .= '.overflow-hidden { overflow: hidden; }';
        
        // Opacity
        $html .= '.opacity-90 { opacity: 0.9; }';
        
        // Images
        $html .= 'img { max-width: 100%; height: auto; display: block; }';
        
        // Custom card styles pour les rapports
        $html .= '.group { position: relative; }';
        $html .= 'table { border-collapse: collapse; width: 100%; }';
        $html .= 'th, td { padding: 0.5rem; text-align: left; border: 1px solid #e5e7eb; }';
        $html .= 'th { background-color: #f9fafb; font-weight: 600; }';
        
        $html .= '</style>';
        $html .= '</head><body style="background: #f9fafb; padding: 10px;">';
        
        // En-tête du document
        $html .= '<div style="text-align: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">';
        $html .= '<h1 style="color: #1e3a5f; font-size: 18px; font-weight: bold; margin: 0 0 8px 0;">' . htmlspecialchars($reportName) . '</h1>';
        if ($periodStart && $periodEnd) {
            $html .= '<p style="color: #6b7280; font-size: 11px; margin: 4px 0;">Période: ' . 
                     date('d/m/Y', strtotime($periodStart)) . ' - ' . 
                     date('d/m/Y', strtotime($periodEnd)) . '</p>';
        }
        $html .= '<p style="color: #9ca3af; font-size: 9px; margin: 4px 0;">Généré le ' . now()->format('d/m/Y à H:i') . '</p>';
        $html .= '</div>';
        
        // Contenu du rapport
        $html .= '<div style="background: #f9fafb;">';
        $html .= $htmlContent;
        $html .= '</div>';
        
        // Pied de page
        $html .= '<div style="text-align: center; margin-top: 15px; padding: 8px; border-top: 1px solid #e5e7eb; font-size: 8px; color: #9ca3af; background: white;">';
        $html .= '<p style="margin: 0;">Document confidentiel - ' . config('app.name') . ' - © ' . date('Y') . '</p>';
        $html .= '</div>';
        
        $html .= '</body></html>';
        
        return $html;
    }

    /**
     * Get report data based on report type
     */
    private function getReportData($report, $user)
    {
        $defaultEndDate = now()->format('Y-m-d');
        $defaultStartDate = now()->subDays(30)->format('Y-m-d');
        $startDate = request('start_date', $defaultStartDate);
        $endDate = request('end_date', $defaultEndDate);
        
        $data = [];
        
        switch ($report->type) {
            case 'eco_driving':
            case 'driver_eco_driving':
            case 'summary':
                $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
                $data = $ecoDrivingService->fetchEcoDrivingData($user->account, $startDate, $endDate);
                $data['period_start'] = $data['period_start'] ?? $startDate;
                $data['period_end'] = $data['period_end'] ?? $endDate;
                break;
            
            case 'geo_eco_driving':
                $ecoDrivingService = app(\App\Services\EcoDrivingService::class);
                $eventHistoryService = app(\App\Services\EventHistoryService::class);
                $ecoData = $ecoDrivingService->fetchEcoDrivingData($user->account, $startDate, $endDate);
                $eventData = $eventHistoryService->fetchEventHistoryData($user->account, $startDate, $endDate);
                $data = $eventData;
                $data['eco_data'] = $ecoData;
                $data['period_start'] = $startDate;
                $data['period_end'] = $endDate;
                break;
                
            default:
                $data['period_start'] = $startDate;
                $data['period_end'] = $endDate;
        }
        
        return $data;
    }

    /**
     * Generate HTML for a report
     */
    private function generateReportHtml($report, $data)
    {
        $html = '<!DOCTYPE html>';
        $html .= '<html><head>';
        $html .= '<meta charset="UTF-8">';
        $html .= '<style>';
        $html .= 'body { font-family: Arial, sans-serif; padding: 15px; font-size: 11px; }';
        $html .= 'h1 { color: #1e3a5f; border-bottom: 3px solid #1e3a5f; padding-bottom: 10px; font-size: 20px; margin: 0 0 15px 0; }';
        $html .= 'h2 { color: #3b5998; margin-top: 20px; font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #3b5998; padding-bottom: 5px; }';
        $html .= 'h3 { color: #1e3a5f; font-size: 13px; margin: 15px 0 8px 0; }';
        $html .= 'table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10px; }';
        $html .= 'th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }';
        $html .= 'th { background-color: #1e3a5f; color: white; font-weight: bold; }';
        $html .= 'tr:nth-child(even) { background-color: #f9f9f9; }';
        $html .= '.header { text-align: center; margin-bottom: 20px; border-bottom: 3px solid #1e3a5f; padding-bottom: 15px; }';
        $html .= '.footer { text-align: center; margin-top: 20px; font-size: 9px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }';
        $html .= '.card { background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 12px; margin: 10px 0; page-break-inside: avoid; }';
        $html .= '.card-title { font-size: 13px; font-weight: bold; color: #1e3a5f; margin-bottom: 8px; }';
        $html .= '.metrics-grid { display: table; width: 100%; margin: 10px 0; }';
        $html .= '.metric-row { display: table-row; }';
        $html .= '.metric-cell { display: table-cell; width: 25%; padding: 8px; background: white; border: 1px solid #e0e0e0; margin: 2px; }';
        $html .= '.metric-label { font-size: 9px; color: #666; text-transform: uppercase; }';
        $html .= '.metric-value { font-size: 18px; font-weight: bold; color: #1e3a5f; }';
        $html .= '.metric-unit { font-size: 10px; color: #888; }';
        $html .= '</style>';
        $html .= '</head><body>';
        
        // En-tête
        $html .= '<div class="header">';
        $html .= '<h1>' . htmlspecialchars($report->name) . '</h1>';
        if ($report->description) {
            $html .= '<p style="margin: 5px 0;">' . htmlspecialchars($report->description) . '</p>';
        }
        if (isset($data['period_start']) && isset($data['period_end'])) {
            $html .= '<p style="margin: 5px 0;"><strong>Période:</strong> ' . 
                     date('d/m/Y', strtotime($data['period_start'])) . ' - ' . 
                     date('d/m/Y', strtotime($data['period_end'])) . '</p>';
        }
        $html .= '<p style="margin: 5px 0; font-size: 10px;">Généré le ' . now()->format('d/m/Y à H:i') . '</p>';
        $html .= '</div>';
        
        // Contenu selon le type de rapport
        $html .= $this->generateReportContent($report->type, $data);
        
        // Pied de page
        $html .= '<div class="footer">';
        $html .= '<p>Document confidentiel - ' . config('app.name') . ' - © ' . date('Y') . '</p>';
        $html .= '</div>';
        
        $html .= '</body></html>';
        
        return $html;
    }
    
    /**
     * Generate report content based on type
     */
    private function generateReportContent($type, $data)
    {
        $html = '';
        
        switch ($type) {
            case 'eco_driving':
            case 'driver_eco_driving':
                $html .= $this->generateEcoDrivingContent($data);
                break;
            case 'geo_eco_driving':
                $html .= $this->generateGeoEcoDrivingContent($data);
                break;
            default:
                $html .= $this->generateDefaultContent($data);
        }
        
        return $html;
    }
    
    /**
     * Generate eco driving content
     */
    private function generateEcoDrivingContent($data)
    {
        $html = '<h2>Analyse Éco-conduite</h2>';
        
        // Métriques clés
        $html .= '<div class="metrics-grid">';
        $html .= '<div class="metric-row">';
        
        if (isset($data['vehicle_details'])) {
            $totalDistance = array_sum(array_column($data['vehicle_details'], 'distance'));
            $html .= '<div class="metric-cell">';
            $html .= '<div class="metric-label">Distance totale</div>';
            $html .= '<div class="metric-value">' . number_format($totalDistance, 0) . '</div>';
            $html .= '<div class="metric-unit">km parcourus</div>';
            $html .= '</div>';
            
            $totalViolations = array_sum(array_column($data['vehicle_details'], 'total_violations'));
            $html .= '<div class="metric-cell">';
            $html .= '<div class="metric-label">Évènements totaux</div>';
            $html .= '<div class="metric-value">' . number_format($totalViolations, 0) . '</div>';
            $html .= '<div class="metric-unit">Infractions détectées</div>';
            $html .= '</div>';
        }
        
        $html .= '</div></div>';
        
        // Tableau des détails par véhicule
        if (isset($data['vehicle_details']) && count($data['vehicle_details']) > 0) {
            $html .= '<h3>Détails par véhicule et conducteur</h3>';
            $html .= '<table>';
            $html .= '<thead><tr>';
            $html .= '<th>Immatriculation</th>';
            $html .= '<th>Conducteur</th>';
            $html .= '<th>Distance (km)</th>';
            $html .= '<th>Temps conduite</th>';
            $html .= '<th>Freinages brusques</th>';
            $html .= '<th>Accélérations brusques</th>';
            $html .= '<th>Virages dangereux</th>';
            $html .= '<th>Violations vitesse</th>';
            $html .= '<th>Total violations</th>';
            $html .= '</tr></thead><tbody>';
            
            foreach ($data['vehicle_details'] as $vehicle) {
                $html .= '<tr>';
                $html .= '<td>' . htmlspecialchars($vehicle['immatriculation'] ?? 'N/A') . '</td>';
                $html .= '<td>' . htmlspecialchars($vehicle['driver'] ?? 'N/A') . '</td>';
                $html .= '<td>' . number_format($vehicle['distance'] ?? 0, 2) . '</td>';
                $html .= '<td>' . htmlspecialchars($vehicle['driving_time'] ?? 'N/A') . '</td>';
                $html .= '<td>' . ($vehicle['harsh_braking'] ?? 0) . '</td>';
                $html .= '<td>' . ($vehicle['harsh_acceleration'] ?? 0) . '</td>';
                $html .= '<td>' . ($vehicle['dangerous_turns'] ?? 0) . '</td>';
                $html .= '<td>' . ($vehicle['speed_violations'] ?? 0) . '</td>';
                $html .= '<td><strong>' . ($vehicle['total_violations'] ?? 0) . '</strong></td>';
                $html .= '</tr>';
            }
            
            $html .= '</tbody></table>';
        }
        
        return $html;
    }
    
    /**
     * Generate geo eco driving content
     */
    private function generateGeoEcoDrivingContent($data)
    {
        $html = '<h2>Analyse Géospatiale des Comportements</h2>';
        
        if (isset($data['stats'])) {
            $html .= '<div class="card">';
            $html .= '<div class="card-title">Statistiques des Événements</div>';
            $html .= '<table>';
            $html .= '<tr><th>Total événements</th><td>' . ($data['stats']['total_events'] ?? 0) . '</td></tr>';
            $html .= '<tr><th>Véhicules uniques</th><td>' . ($data['stats']['unique_vehicles'] ?? 0) . '</td></tr>';
            $html .= '</table>';
            $html .= '</div>';
        }
        
        if (isset($data['events']) && count($data['events']) > 0) {
            $html .= '<h3>Liste des Événements</h3>';
            $html .= '<table>';
            $html .= '<thead><tr>';
            $html .= '<th>Date/Heure</th>';
            $html .= '<th>Véhicule</th>';
            $html .= '<th>Conducteur</th>';
            $html .= '<th>Type d\'événement</th>';
            $html .= '<th>Vitesse</th>';
            $html .= '<th>Adresse</th>';
            $html .= '</tr></thead><tbody>';
            
            foreach (array_slice($data['events'], 0, 50) as $event) {
                $html .= '<tr>';
                $html .= '<td>' . date('d/m/Y H:i', strtotime($event['event_time'] ?? now())) . '</td>';
                $html .= '<td>' . htmlspecialchars($event['plate_number'] ?? 'N/A') . '</td>';
                $html .= '<td>' . htmlspecialchars($event['driver'] ?? 'N/A') . '</td>';
                $html .= '<td>' . htmlspecialchars($event['event_name'] ?? 'N/A') . '</td>';
                $html .= '<td>' . ($event['speed'] ?? 0) . ' km/h</td>';
                $html .= '<td>' . htmlspecialchars($event['address'] ?? 'N/A') . '</td>';
                $html .= '</tr>';
            }
            
            $html .= '</tbody></table>';
            if (count($data['events']) > 50) {
                $html .= '<p style="font-style: italic; color: #666;">Affichage limité aux 50 premiers événements sur ' . count($data['events']) . ' au total.</p>';
            }
        }
        
        return $html;
    }
    
    /**
     * Generate default content
     */
    private function generateDefaultContent($data)
    {
        $html = '<h2>Données du rapport</h2>';
        $html .= '<div class="card">';
        $html .= '<p>Type de rapport : ' . htmlspecialchars($data['type'] ?? 'Non spécifié') . '</p>';
        $html .= '</div>';
        return $html;
    }
}
