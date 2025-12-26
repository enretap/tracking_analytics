<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendReportEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 120;
    
    /**
     * Create a new job instance.
     */
    public function __construct(
        public array $emails,
        public string $pdfContent,
        public string $reportName,
        public string $fileName
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $tempPath = storage_path('app/temp/' . $this->fileName);
        
        try {
            // Créer le dossier temp s'il n'existe pas
            if (!file_exists(dirname($tempPath))) {
                mkdir(dirname($tempPath), 0755, true);
            }
            
            // Sauvegarder le PDF
            file_put_contents($tempPath, base64_decode($this->pdfContent));
            
            // Envoyer à chaque destinataire
            foreach ($this->emails as $email) {
                try {
                    Mail::raw(
                        "Bonjour,\n\nVeuillez trouver ci-joint le rapport '{$this->reportName}'.\n\n" .
                        "Cordialement,\nTracking Analytics By Comafrique Technologies",
                        function ($message) use ($email, $tempPath) {
                            $message->to($email)
                                ->subject("Rapport: {$this->reportName}")
                                ->attach($tempPath, [
                                    'as' => $this->fileName,
                                    'mime' => 'application/pdf',
                                ]);
                        }
                    );
                    
                    Log::info("Email envoyé avec succès à: {$email}");
                } catch (\Exception $e) {
                    Log::error("Échec d'envoi à {$email}: " . $e->getMessage());
                }
            }
        } finally {
            // Supprimer le fichier temporaire
            if (file_exists($tempPath)) {
                unlink($tempPath);
            }
        }
    }
}
