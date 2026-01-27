<?php

namespace App\Notifications;

use App\Models\UserInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public UserInvitation $invitation
    ) {
        // Send immediately instead of queuing for now
        $this->connection = 'sync';
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = url('/invitation/accept/' . $this->invitation->token);

        return (new MailMessage)
            ->subject('Invitation à rejoindre l\'application')
            ->greeting('Bonjour ' . $this->invitation->name . ',')
            ->line('Vous avez été invité à rejoindre notre application.')
            ->line('Cliquez sur le bouton ci-dessous pour créer votre mot de passe et activer votre compte.')
            ->action('Accepter l\'invitation', $url)
            ->line('Cette invitation expirera le ' . $this->invitation->expires_at->format('d/m/Y à H:i') . '.')
            ->line('Si vous n\'avez pas demandé cette invitation, ignorez cet email.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
