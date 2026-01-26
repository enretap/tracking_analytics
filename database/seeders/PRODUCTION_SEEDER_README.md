# Production Data Seeder

Ce seeder permet d'importer les données de production (plateformes, comptes, rapports) dans la base de données du serveur.

## Prérequis

Les fichiers JSON de données doivent être présents dans `database/seeders/data/` :
- `platforms.json`
- `accounts.json`
- `reports.json`

## Exportation des données (Local)

Pour exporter les données depuis votre base locale :

```bash
php artisan data:export
```

Cette commande créera les fichiers JSON dans `database/seeders/data/`.

## Importation des données (Serveur)

Une fois déployé sur le serveur, exécutez :

```bash
php artisan db:seed --class=ProductionDataSeeder
```

Cette commande va :
1. Importer toutes les plateformes avec leurs configurations
2. Importer tous les comptes avec leurs relations aux plateformes
3. Importer tous les rapports avec leurs endpoints
4. Créer un utilisateur Super Admin avec les identifiants :
   - **Email** : `admin@tracking-dashboard.com`
   - **Mot de passe** : `AdminPass123!`

## ⚠️ IMPORTANT

**Changez immédiatement le mot de passe du Super Admin après la première connexion !**

## Données exportées

### Plateformes
- ID, nom, slug
- Provider et configuration API
- Statut actif/inactif

### Comptes
- ID, nom, domaine
- Référence CTrack
- Logo et paramètres
- Relations avec les plateformes (avec tokens API)

### Rapports
- ID, nom, description
- Type et paramètres
- Endpoints des plateformes
- Configuration des appels API

## Notes

- La commande utilise `updateOrCreate()` donc elle peut être exécutée plusieurs fois sans créer de doublons
- Les IDs sont préservés pour maintenir les relations
- Les configurations API sensibles sont incluses (assurez-vous de sécuriser les fichiers JSON)
