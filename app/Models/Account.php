<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Platform;
use App\Models\Report;
use App\Models\User;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'domain',
        'reference_ctrack',
        'logo',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function platforms()
    {
        return $this->belongsToMany(Platform::class, 'account_platform')
            ->withPivot(['api_url', 'api_token', 'http_method', 'token_type', 'token_key', 'additional_params', 'is_active'])
            ->withTimestamps();
    }

    public function reports()
    {
        return $this->belongsToMany(Report::class, 'account_report');
    }

    /**
     * Get the users for the account.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
