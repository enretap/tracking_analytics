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
            $table->string('http_method', 10)->default('GET')->after('api_token'); // GET, POST
            $table->string('token_type', 20)->default('bearer')->after('http_method'); // bearer, header, body
            $table->string('token_key', 50)->nullable()->after('token_type'); // Ex: 'sessionId', 'Authorization'
            $table->text('additional_params')->nullable()->after('token_key'); // JSON pour paramètres supplémentaires
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('account_platform', function (Blueprint $table) {
            $table->dropColumn(['http_method', 'token_type', 'token_key', 'additional_params']);
        });
    }
};
