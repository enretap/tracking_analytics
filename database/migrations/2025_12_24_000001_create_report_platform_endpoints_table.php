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
        Schema::create('report_platform_endpoints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained()->cascadeOnDelete();
            $table->foreignId('platform_id')->constrained()->cascadeOnDelete();
            $table->string('endpoint_path'); // Ex: /json/getEventHistoryReport
            $table->string('http_method', 10)->default('GET'); // GET, POST
            $table->string('data_key')->nullable(); // Clé pour identifier les données (ex: 'events', 'eco_summary', 'stops')
            $table->text('additional_params')->nullable(); // JSON pour paramètres supplémentaires spécifiques à cet endpoint
            $table->integer('order')->default(0); // Ordre d'exécution des requêtes
            $table->boolean('is_required')->default(true); // Si false, l'échec n'empêche pas le rapport
            $table->text('description')->nullable(); // Description de ce que cet endpoint récupère
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index(['report_id', 'platform_id']);
            $table->unique(['report_id', 'platform_id', 'data_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_platform_endpoints');
    }
};
