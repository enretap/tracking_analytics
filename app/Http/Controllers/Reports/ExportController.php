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
}
