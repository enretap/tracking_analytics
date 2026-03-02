<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('account_platform', function (Blueprint $table) {
            $table->string('external_account_id')->nullable()->after('api_token')
                ->comment('Identifiant du compte dans le système externe (ex: ID client CTRACK)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('account_platform', function (Blueprint $table) {
            $table->dropColumn('external_account_id');
        });
    }
};
