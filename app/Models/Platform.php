<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Account;
use App\Models\Report;
use App\Models\ReportPlatformEndpoint;

class Platform extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'provider',
        'config',
        'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];

    public function accounts(): BelongsToMany
    {
        return $this->belongsToMany(Account::class, 'account_platform');
    }

    /**
     * Get all report endpoints for this platform.
     */
    public function reportEndpoints(): HasMany
    {
        return $this->hasMany(ReportPlatformEndpoint::class);
    }

    /**
     * Get the reports that have endpoints configured on this platform.
     */
    public function reports(): BelongsToMany
    {
        return $this->belongsToMany(Report::class, 'report_platform_endpoints')
            ->withPivot(['endpoint_path', 'http_method', 'data_key', 'additional_params', 'order', 'is_required', 'description'])
            ->withTimestamps();
    }
}
