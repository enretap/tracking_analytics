<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreReportRequest;
use App\Http\Requests\Settings\UpdateReportRequest;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;

class ReportController extends Controller
{
    public function store(StoreReportRequest $request): RedirectResponse
    {
        $data = $request->validated();
        // decode JSON fields if provided as JSON strings from textarea inputs
        if (isset($data['schedule']) && is_string($data['schedule'])) {
            $data['schedule'] = json_decode($data['schedule'], true);
        }
        if (isset($data['params']) && is_string($data['params'])) {
            $data['params'] = json_decode($data['params'], true);
        }
        $data['created_by'] = $request->user()->id;
        $report = Report::create($data);

        // sync associated accounts if provided
        if (isset($data['account_ids'])) {
            $report->accounts()->sync($data['account_ids']);
        }

        return redirect()->route('settings.reports')->with('success', 'Rapport créé.');
    }

    public function update(UpdateReportRequest $request, Report $report): RedirectResponse
    {
        $data = $request->validated();
        if (isset($data['schedule']) && is_string($data['schedule'])) {
            $data['schedule'] = json_decode($data['schedule'], true);
        }
        if (isset($data['params']) && is_string($data['params'])) {
            $data['params'] = json_decode($data['params'], true);
        }
        $report->update($data);

        // sync associated accounts if provided
        if (isset($data['account_ids'])) {
            $report->accounts()->sync($data['account_ids']);
        }

        return redirect()->route('settings.reports')->with('success', 'Rapport mis à jour.');
    }

    public function destroy(Report $report): RedirectResponse
    {
        $report->delete();

        return redirect()->route('settings.reports')->with('success', 'Rapport supprimé.');
    }
}
