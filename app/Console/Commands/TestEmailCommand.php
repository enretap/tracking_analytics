<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailCommand extends Command
{
    protected $signature = 'mail:test {email?}';
    protected $description = 'Tester la configuration email';

    public function handle()
    {
        $email = $this->argument('email') ?? config('mail.from.address');

        try {
            Mail::raw('Ceci est un test de configuration SMTP depuis TrackingRepports.', function ($message) use ($email) {
                $message->to($email)
                    ->subject('Test Configuration SMTP - TrackingRepports');
            });

            $this->info("✓ Email de test envoyé avec succès à : {$email}");
            $this->info("Configuration SMTP :");
            $this->line("  - Host: " . config('mail.mailers.smtp.host'));
            $this->line("  - Port: " . config('mail.mailers.smtp.port'));
            $this->line("  - Username: " . config('mail.mailers.smtp.username'));
            $this->line("  - Encryption: " . config('mail.mailers.smtp.encryption'));
            $this->line("  - From: " . config('mail.from.address'));

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("✗ Erreur lors de l'envoi de l'email :");
            $this->error($e->getMessage());
            return Command::FAILURE;
        }
    }
}
