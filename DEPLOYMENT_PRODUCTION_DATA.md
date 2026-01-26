# Guide de déploiement - Données de production

## 📋 Résumé

Ce guide explique comment déployer votre application avec toutes les données de production (plateformes, comptes, rapports, et utilisateur super admin).

## ✅ Ce qui a été fait

### 1. Export automatique des données
Une commande Artisan a été créée pour exporter toutes vos données locales :

```bash
php artisan data:export
```

Cette commande exporte :
- **3 Plateformes** : CTRACK, TARGA TELEMATICS, TARGE TELEMATICS
- **10 Comptes** avec leurs configurations API
- **5 Rapports** avec leurs endpoints API
- Toutes les relations et configurations

### 2. Seeder de production
Le fichier `database/seeders/ProductionDataSeeder.php` importe automatiquement :
- Toutes les plateformes
- Tous les comptes avec leurs relations aux plateformes
- Tous les rapports avec leurs endpoints
- **Un utilisateur Super Admin**

### 3. Utilisateur Super Admin créé

**Identifiants par défaut** :
- Email : `admin@tracking-dashboard.com`
- Mot de passe : `AdminPass123!`
- Rôle : `super-admin`

⚠️ **IMPORTANT** : Changez ce mot de passe immédiatement après la première connexion !

### 4. Script de déploiement mis à jour
Le fichier `.forge-deploy` exécute automatiquement le seeder lors du déploiement.

## 🚀 Déploiement

### Étape 1 : Vérification
Le déploiement a été poussé sur Forge. Attendez qu'il se termine.

### Étape 2 : Vérification de l'import
Une fois le déploiement terminé, connectez-vous à votre application :

1. Allez sur `https://tracking-dashboard.on-forge.com/login`
2. Utilisez les identifiants du Super Admin :
   - Email : `admin@tracking-dashboard.com`
   - Mot de passe : `AdminPass123!`

### Étape 3 : Changement du mot de passe
**Immédiatement après la connexion**, changez le mot de passe du Super Admin.

### Étape 4 : Vérification des données
Vérifiez que toutes les données sont présentes :
- [ ] 3 plateformes dans les paramètres
- [ ] 10 comptes configurés
- [ ] 5 rapports disponibles
- [ ] Configurations API présentes

### Étape 5 : Désactiver le seeder
Après le premier déploiement réussi, commentez la ligne du seeder dans `.forge-deploy` :

```bash
# Seed production data (only runs on first deployment or when needed)
# php artisan db:seed --class=ProductionDataSeeder --force
```

## 📝 Fichiers de données

Les fichiers JSON sont dans `database/seeders/data/` :
- `platforms.json` - Configuration des 3 plateformes
- `accounts.json` - 10 comptes avec tokens API
- `reports.json` - 5 rapports avec endpoints

**Note** : Ces fichiers contiennent des informations sensibles (tokens API). Après le premier déploiement, vous pouvez les supprimer du repo si souhaité.

## 🔄 Pour réimporter les données

Si vous devez réimporter les données sur le serveur :

```bash
# Via SSH sur le serveur
cd /home/forge/tracking-dashboard.on-forge.com/current
php artisan db:seed --class=ProductionDataSeeder --force
```

Ou décommentez la ligne dans `.forge-deploy` et redéployez.

## 🔐 Sécurité

1. **Mot de passe par défaut** : Le mot de passe `AdminPass123!` doit être changé immédiatement
2. **Tokens API** : Les fichiers JSON contiennent les tokens API. Sécurisez-les.
3. **Accès super-admin** : Limitez l'accès à ce compte

## 📚 Documentation

- `database/seeders/PRODUCTION_SEEDER_README.md` - Guide détaillé du seeder
- `app/Console/Commands/ExportProductionData.php` - Commande d'export
- `database/seeders/ProductionDataSeeder.php` - Seeder de production
