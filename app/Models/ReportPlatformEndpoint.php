<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportPlatformEndpoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'platform_id',
        'endpoint_path',
        'http_method',
        'data_key',
        'additional_params',
        'order',
        'is_required',
        'description',
    ];

    protected $casts = [
        'additional_params' => 'array',
        'is_required' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the report that owns the endpoint.
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    /**
     * Get the platform that owns the endpoint.
     */
    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class);
    }
}
