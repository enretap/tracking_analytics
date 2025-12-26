# 🔧 Configuration des Plateformes via l'Interface Web

## Vue d'ensemble

Vous pouvez maintenant configurer les URLs API et tokens de vos plateformes de tracking directement depuis l'interface web, sans toucher à la base de données !

## 🚀 Accès à la Configuration

### 1. Via le Menu Latéral

1. **Connectez-vous** à votre application
2. Dans le menu latéral gauche, cliquez sur **"Plateformes API"** (icône éclair ⚡)
3. Vous serez redirigé vers `/settings/platform-api`

### 2. Accès Direct

Naviguez directement vers : `http://localhost/settings/platform-api`

## 🔐 Permissions

- **Administrateurs** : Peuvent configurer les plateformes
- **Super-admins** : Peuvent configurer les plateformes
- **Agents** : N'ont pas accès (protection automatique)

## 📝 Fonctionnalités

### ✅ Configurer une Nouvelle Plateforme

1. Sur la page de configuration, vous verrez toutes les plateformes disponibles
2. Les plateformes déjà configurées sont marquées d'un badge vert "Configuré"
3. Pour configurer une nouvelle plateforme :
   - Cliquez sur le bouton **"Configurer"** sur la carte de la plateforme
   - Remplissez le formulaire :
     * **URL de l'API** : L'URL complète de l'endpoint (ex: `https://api.platform.com/vehicles`)
     * **Token d'authentification** : Votre token API secret
   - **Testez la connexion** (optionnel mais recommandé)
   - Cliquez sur **"Enregistrer"**

### 🔄 Modifier une Configuration Existante

1. Sur la carte d'une plateforme configurée, cliquez sur **"Modifier"**
2. Modifiez l'URL ou le token
3. Testez la connexion si souhaité
4. Enregistrez les modifications

### 🗑️ Supprimer une Configuration

1. Sur la carte d'une plateforme configurée, cliquez sur l'icône **poubelle** (🗑️)
2. Confirmez la suppression
3. Les véhicules de cette plateforme ne seront plus récupérés

### 🧪 Tester la Connexion

Avant d'enregistrer, vous pouvez tester si vos credentials fonctionnent :

1. Remplissez l'URL et le token
2. Cliquez sur **"Tester la connexion"**
3. Vous verrez un message :
   - ✅ **Connexion réussie** : Les credentials sont valides
   - ❌ **Échec de la connexion** : Vérifiez vos paramètres

### 👁️ Afficher/Masquer le Token

- Par défaut, les tokens sont masqués (••••••••)
- Cliquez sur l'icône 👁️ pour afficher le token
- Cliquez à nouveau pour le masquer

## 📋 Exemple de Configuration

### Pour GPS Tracker Pro

```
URL API: https://api.gps-tracker.com/v1/vehicles
Token: Bearer gtp_live_xxxxxxxxxxxx
```

### Pour Fleet Manager

```
URL API: https://api.fleet-manager.com/vehicles
Token: fm-api-key-xxxxxxxxxx
```

### Pour Track Pro

```
URL API: https://api.trackpro.com/v1/units
Token: tk_prod_xxxxxxxxxxxx
```

### Pour les Tests (APIs Mock)

```
URL API: http://localhost/mock-api/gps-tracker/vehicles
Token: test-token-123
```

## 🎯 Interface Utilisateur

L'interface affiche pour chaque plateforme :

- **Nom de la plateforme** : Ex: "GPS Tracker Pro"
- **Fournisseur** : Le provider ou le slug
- **Badge de statut** : "Configuré" si déjà configuré
- **URL API** : L'URL configurée (si configurée)
- **Token** : Le token (masqué par défaut)
- **Dernière mise à jour** : Date de la dernière modification
- **Actions** :
  - Bouton "Configurer" (si non configuré)
  - Bouton "Modifier" (si configuré)
  - Bouton "Supprimer" (si configuré)

## 🔒 Sécurité

- ✅ Authentification requise
- ✅ Vérification des permissions (admin/super-admin)
- ✅ Validation des URLs (format URL valide)
- ✅ Protection CSRF
- ✅ Tokens masqués par défaut
- ✅ Confirmation avant suppression

## 💡 Conseils

### ✅ Bonnes Pratiques

1. **Toujours tester la connexion** avant d'enregistrer
2. **Utiliser HTTPS** pour les URLs API en production
3. **Garder les tokens secrets** - ne les partagez jamais
4. **Vérifier les logs** après configuration (`storage/logs/laravel.log`)
5. **Tester les véhicules** après configuration (allez sur `/vehicles`)

### ⚠️ Erreurs Courantes

**Erreur : "Échec de la connexion"**
- Vérifiez que l'URL est correcte
- Vérifiez que le token est valide
- Vérifiez que l'API est accessible depuis votre serveur
- Consultez les logs Laravel

**Erreur : "URL invalide"**
- L'URL doit commencer par `http://` ou `https://`
- Exemple valide : `https://api.example.com/vehicles`
- Exemple invalide : `api.example.com/vehicles`

**Erreur : "Token requis"**
- Le champ token ne peut pas être vide
- Assurez-vous d'avoir copié le token complet

## 🔄 Flux de Travail Recommandé

### Configuration d'une Nouvelle Plateforme

1. **Obtenez les credentials** auprès de votre fournisseur de plateforme
2. **Accédez** à `/settings/platform-api`
3. **Trouvez** votre plateforme dans la liste
4. **Cliquez** sur "Configurer"
5. **Collez** l'URL et le token
6. **Testez** la connexion
7. Si le test réussit, **enregistrez**
8. **Vérifiez** que les véhicules apparaissent sur `/vehicles`

### Mise à Jour d'une Configuration

1. **Accédez** à `/settings/platform-api`
2. Sur la plateforme concernée, **cliquez** sur "Modifier"
3. **Modifiez** l'URL ou le token
4. **Testez** la nouvelle configuration
5. **Enregistrez** les modifications
6. **Vérifiez** que les véhicules sont toujours récupérés

## 📊 Vérification

Après configuration, vérifiez que tout fonctionne :

### 1. Via l'Interface Web

- Allez sur `/vehicles`
- Vous devriez voir les véhicules de la plateforme configurée
- Vérifiez que les informations sont correctes

### 2. Via l'API

```bash
# Testez l'endpoint API
curl http://localhost/api/vehicles \
  -H "Accept: application/json" \
  --cookie "laravel_session=..."
```

### 3. Via le Dashboard

- Allez sur `/dashboard`
- Les statistiques devraient inclure les véhicules de la nouvelle plateforme

## 🐛 Dépannage

### Aucun véhicule après configuration

1. **Vérifiez les logs** : `tail -f storage/logs/laravel.log`
2. **Testez l'API directement** : Utilisez le bouton "Tester la connexion"
3. **Vérifiez le mapper** : Le slug de la plateforme doit avoir un mapper dans `VehicleService.php`

### Token ne fonctionne plus

1. **Régénérez** le token chez le fournisseur
2. **Mettez à jour** la configuration via l'interface
3. **Testez** la nouvelle connexion

### Page ne charge pas

1. **Vérifiez les permissions** : Êtes-vous admin ou super-admin ?
2. **Consultez les erreurs** dans les logs Laravel
3. **Vérifiez la console** du navigateur pour des erreurs JS

## 🎓 Tutoriel Vidéo (Pas à Pas)

### Étape 1 : Connexion
- Connectez-vous avec un compte administrateur

### Étape 2 : Navigation
- Dans le menu latéral, cliquez sur "Plateformes API"

### Étape 3 : Configuration
- Trouvez la plateforme "GPS Tracker Pro"
- Cliquez sur "Configurer"

### Étape 4 : Remplissage
- URL : `http://localhost/mock-api/gps-tracker/vehicles`
- Token : `test-token-123`

### Étape 5 : Test
- Cliquez sur "Tester la connexion"
- Attendez la confirmation "✅ Connexion réussie"

### Étape 6 : Enregistrement
- Cliquez sur "Enregistrer"
- Vous verrez un message de succès

### Étape 7 : Vérification
- Allez sur `/vehicles`
- Vous devriez voir 3 véhicules de GPS Tracker Pro

## 📱 Interface Mobile

L'interface est entièrement responsive :
- ✅ Fonctionne sur mobile, tablette et desktop
- ✅ Cards empilées verticalement sur petit écran
- ✅ Dialogs adaptés à la taille de l'écran

## 🎨 Personnalisation

Si vous voulez ajouter d'autres champs à la configuration :

1. **Ajoutez une migration** pour la nouvelle colonne
2. **Modifiez le contrôleur** pour gérer le nouveau champ
3. **Modifiez la page** pour afficher le champ dans le formulaire

Exemple pour ajouter un champ `api_version` :

```php
// Migration
$table->string('api_version')->nullable()->after('api_token');

// Contrôleur - validation
'api_version' => 'nullable|string|max:20',

// Page - formulaire
<Input
  id="api_version"
  placeholder="v1"
  value={data.api_version}
  onChange={(e) => setData('api_version', e.target.value)}
/>
```

## 📚 Ressources

- **Documentation Backend** : [VEHICLE_SERVICE_README.md](VEHICLE_SERVICE_README.md)
- **Configuration Manuelle** : [API_CONFIGURATION.md](API_CONFIGURATION.md)
- **Tests** : [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Code Source** :
  - Contrôleur : `app/Http/Controllers/Settings/PlatformConfigurationController.php`
  - Page React : `resources/js/pages/Settings/PlatformConfiguration.tsx`
  - Routes : `routes/web.php` (section Platform Configuration)

---

**✨ Interface créée le 19 décembre 2025**

**Maintenant vous pouvez gérer vos plateformes sans toucher à la base de données ! 🎉**
