# Configuration des Emails

## ⚠️ Problème : Les emails d'invitation ne sont pas envoyés

### Cause
Les notifications étaient mises en queue (`QUEUE_CONNECTION=database`) mais le worker de queue n'était pas actif sur le serveur.

### Solution appliquée
La notification `UserInvitationNotification` a été modifiée pour envoyer les emails **immédiatement** (sans queue) en utilisant `connection = 'sync'`.

## Configuration Mail actuelle

### Local (.env)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=norepplynorepply753@gmail.com
MAIL_PASSWORD="qkua vgmy cunc vpkw"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=norepplynorepply753@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Production (à configurer sur Forge)
Sur le serveur, assurez-vous que les variables d'environnement suivantes sont définies :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=norepplynorepply753@gmail.com
MAIL_PASSWORD="qkua vgmy cunc vpkw"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=norepplynorepply753@gmail.com
MAIL_FROM_NAME="TrackingRepports"
```

## Test des emails

### Localement
```bash
php artisan tinker
```

Puis :
```php
Notification::route('mail', 'test@example.com')
    ->notify(new App\Notifications\UserInvitationNotification(
        App\Models\UserInvitation::first()
    ));
```

### Sur le serveur
Via l'interface Forge ou SSH :
1. Allez dans l'onglet "Environment" 
2. Vérifiez que toutes les variables `MAIL_*` sont définies
3. Cliquez sur "Save" et redéployez

## Queue (optionnel - pour plus tard)

Si vous souhaitez utiliser les queues pour améliorer les performances :

### 1. Sur Forge
- Allez dans "Queue"
- Activez le worker de queue
- Configurez : `php artisan queue:work --tries=3`

### 2. Modifier la notification
Supprimez la ligne `$this->connection = 'sync';` dans le constructeur de `UserInvitationNotification.php`

### 3. Vérifier la queue
```bash
# Voir les jobs en attente
php artisan queue:monitor

# Traiter manuellement
php artisan queue:work --once
```

## Dépannage

### Email pas reçu ?
1. **Vérifier les logs** : `storage/logs/laravel.log`
2. **Tester la connexion SMTP** : 
   ```bash
   php artisan tinker
   Mail::raw('Test', function($message) {
       $message->to('votre@email.com')->subject('Test');
   });
   ```
3. **Vérifier Gmail** : 
   - Les "App Passwords" sont activés
   - Le compte n'est pas bloqué
   - Vérifier le dossier spam

### Email bloqué par Gmail ?
- Utilisez un service comme Mailtrap (dev) ou SendGrid/Mailgun (prod)
- Ou configurez SPF/DKIM pour votre domaine

## Recommandations pour la production

Pour la production, il est recommandé d'utiliser :
- **Mailgun** (gratuit jusqu'à 5000 emails/mois)
- **SendGrid** (gratuit jusqu'à 100 emails/jour)
- **Amazon SES** (très économique)

Au lieu de Gmail qui peut bloquer ou limiter les envois.
