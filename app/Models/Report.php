<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Account;
use App\Models\Platform;
use App\Models\ReportPlatformEndpoint;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'schedule',
        'params',
        'created_by',
        'is_enabled',
    ];

    protected $casts = [
        'schedule' => 'array',
        'params' => 'array',
        'is_enabled' => 'boolean',
    ];

    public function accounts(): BelongsToMany
    {
        return $this->belongsToMany(Account::class, 'account_report');
    }

    /**
     * Get all platform endpoints for this report.
     */
    public function platformEndpoints(): HasMany
    {
        return $this->hasMany(ReportPlatformEndpoint::class)->orderBy('order');
    }

    /**
     * Get the platforms that have endpoints configured for this report.
     */
    public function platforms(): BelongsToMany
    {
        return $this->belongsToMany(Platform::class, 'report_platform_endpoints')
            ->withPivot(['endpoint_path', 'http_method', 'data_key', 'additional_params', 'order', 'is_required', 'description'])
            ->withTimestamps();
    }

    /**
     * Get endpoints for a specific platform.
     */
    public function getEndpointsForPlatform(int $platformId)
    {
        return $this->platformEndpoints()
            ->where('platform_id', $platformId)
            ->where('is_active', true)
            ->orderBy('order')
            ->get();
    }
}
