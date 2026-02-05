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

        // Générer le HTML du rapport pour le PDF
        $html = $this->generateReportHtml($report);

        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $output = $dompdf->output();
        
        $filename = \Illuminate\Support\Str::slug($report->name) . '_' . now()->format('Y-m-d') . '.pdf';

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
            // Générer le PDF du rapport
            $html = $this->generateReportHtml($report);
            
            $dompdf = new Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            $pdfContent = base64_encode($dompdf->output());
            
            $fileName = \Illuminate\Support\Str::slug($report->name) . '_' . date('Y-m-d') . '.pdf';
            
            // Envoyer l'email à l'utilisateur connecté
            $emails = [$user->email];
            
            // Dispatcher le job en arrière-plan
            \App\Jobs\SendReportEmail::dispatch(
                $emails,
                $pdfContent,
                $report->name,
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
     * Generate HTML for a report
     */
    private function generateReportHtml($report)
    {
        $html = '<!DOCTYPE html>';
        $html .= '<html><head>';
        $html .= '<meta charset="UTF-8">';
        $html .= '<style>';
        $html .= 'body { font-family: Arial, sans-serif; padding: 20px; }';
        $html .= 'h1 { color: #1e3a5f; border-bottom: 3px solid #1e3a5f; padding-bottom: 10px; }';
        $html .= 'h2 { color: #3b5998; margin-top: 20px; }';
        $html .= 'table { width: 100%; border-collapse: collapse; margin: 20px 0; }';
        $html .= 'th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }';
        $html .= 'th { background-color: #1e3a5f; color: white; }';
        $html .= 'tr:nth-child(even) { background-color: #f2f2f2; }';
        $html .= '.header { text-align: center; margin-bottom: 30px; }';
        $html .= '.footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }';
        $html .= '</style>';
        $html .= '</head><body>';
        
        $html .= '<div class="header">';
        $html .= '<h1>' . htmlspecialchars($report->name) . '</h1>';
        if ($report->description) {
            $html .= '<p>' . htmlspecialchars($report->description) . '</p>';
        }
        $html .= '<p>Généré le ' . now()->format('d/m/Y à H:i') . '</p>';
        $html .= '</div>';
        
        $html .= '<h2>Informations du rapport</h2>';
        $html .= '<table>';
        $html .= '<tr><th>Type</th><td>' . htmlspecialchars($report->type ?? 'N/A') . '</td></tr>';
        $html .= '<tr><th>Date de création</th><td>' . $report->created_at->format('d/m/Y') . '</td></tr>';
        $html .= '</table>';
        
        $html .= '<div class="footer">';
        $html .= '<p>Document confidentiel - ' . config('app.name') . '</p>';
        $html .= '</div>';
        
        $html .= '</body></html>';
        
        return $html;
    }
}
