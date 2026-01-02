# Guide Rapide - API Event History

## ✅ Problème Résolu

La route `/api/events` retournait une erreur 404. Elle est maintenant fonctionnelle !

## 🎯 Ce qui a été fait

1. **Création du contrôleur API** : `app/Http/Controllers/Api/EventController.php`
2. **Création des routes API** : `routes/api.php`
3. **Configuration du routing** : Modification de `bootstrap/app.php` pour charger les routes API
4. **Composant React d'exemple** : `resources/js/components/EventHistoryExample.tsx`

## 🚀 Endpoints disponibles

### 1. Récupérer tous les événements
```bash
GET /api/events?start_date=2025-12-01&end_date=2025-12-31
```

**Réponse :**
```json
{
    "success": true,
    "events": [...],
    "events_by_type": {...},
    "events_by_vehicle": {...},
    "events_by_date": {...},
    "stats": {
        "total_events": 10,
        "unique_vehicles": 5,
        "events_by_type": {...}
    }
}
```

### 2. Récupérer les statistiques seulement
```bash
GET /api/events/stats?start_date=2025-12-01&end_date=2025-12-31
```

### 3. Récupérer les événements par type
```bash
GET /api/events/type/SPEED?start_date=2025-12-01
```

### 4. Récupérer les événements par véhicule
```bash
GET /api/events/vehicle/350612070785660
```

## 💻 Utilisation dans le Frontend

### Avec Fetch API

```javascript
// Récupérer les événements
const response = await fetch('/api/events?start_date=2025-12-01&end_date=2025-12-31');
const data = await response.json();

if (data.success) {
    console.log('Total événements:', data.stats.total_events);
    console.log('Événements:', data.events);
}
```

### Avec Axios

```javascript
import axios from 'axios';

const { data } = await axios.get('/api/events', {
    params: {
        start_date: '2025-12-01',
        end_date: '2025-12-31'
    }
});
```

### Composant React Complet

Un composant React complet d'exemple est disponible :
- **Fichier** : `resources/js/components/EventHistoryExample.tsx`
- **Features** :
  - Filtres de dates
  - Statistiques en temps réel
  - Graphiques de répartition par type
  - Table des événements
  - Gestion du loading et des erreurs

Pour l'utiliser :

```tsx
import EventHistoryExample from '@/components/EventHistoryExample';

export default function EventsPage() {
    return <EventHistoryExample />;
}
```

## 🧪 Tests

### Tester les routes API
```bash
php artisan route:list --path=api/events
```

### Tester avec le script PHP
```bash
php test-events-api.php
```

### Tester dans le navigateur
Connectez-vous à l'application et accédez à :
```
http://localhost/api/events?start_date=2025-12-01&end_date=2025-12-31
```

## 📝 Paramètres de requête

| Paramètre | Type | Obligatoire | Format | Description |
|-----------|------|-------------|--------|-------------|
| `start_date` | string | Non | Y-m-d | Date de début (défaut: 7 jours avant) |
| `end_date` | string | Non | Y-m-d | Date de fin (défaut: aujourd'hui) |
| `event_type` | string | Non | - | Filtrer par type (SPEED, IDLE, etc.) |
| `vehicle_reference` | string | Non | - | Filtrer par référence véhicule |

## 🔒 Authentification

Les routes API nécessitent une authentification. L'utilisateur doit être connecté via la session web.

Si vous utilisez l'API depuis un autre domaine, vous devrez configurer CORS ou utiliser Laravel Sanctum pour l'authentification par tokens.

## ⚡ Performance

- **Cache** : Les données sont mises en cache pendant 5 minutes
- **Pagination** : Le composant React affiche par défaut 50 événements
- **Timeout** : Les appels API ont un timeout de 30 secondes

## 🐛 Dépannage

### Erreur 404
✅ Résolu ! Les routes API sont maintenant configurées.

### Erreur 401/403
- Vérifiez que vous êtes bien connecté
- Vérifiez que l'utilisateur a un compte associé

### Aucun événement retourné
- Vérifiez que la plage de dates contient des événements
- Testez avec : `php test-event-api-direct.php`
- Consultez les logs : `storage/logs/laravel.log`

### Erreur CORS
Si vous accédez à l'API depuis un autre domaine :
1. Installez le package CORS : `composer require fruitcake/laravel-cors`
2. Configurez dans `config/cors.php`

## 📚 Documentation complète

Pour plus de détails, consultez : [EVENT_HISTORY_SERVICE.md](EVENT_HISTORY_SERVICE.md)

## 🎉 Prêt à l'emploi !

Les routes API sont maintenant fonctionnelles et prêtes à être utilisées dans votre dashboard React/Vue !
