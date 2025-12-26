# Exemple de Données Retournées - Rapport de Synthèse

Ce document montre un exemple de structure de données retournée par le `ReportDataService` pour le Rapport de Synthèse avec TARGE TELEMATICS.

## 📊 Requête

```php
$service = new ReportDataService();

$result = $service->fetchReportData(
    $summaryReport,  // Rapport de Synthèse
    $apmAccount,     // Compte APM
    $targePlatform,  // TARGE TELEMATICS
    [
        'start_date' => '2025-12-01',
        'end_date' => '2025-12-24',
        'vehicle_id' => 'VEH001',
    ]
);
```

## 📦 Réponse Complète

```json
{
    "success": true,
    "platform": "TARGE TELEMATICS",
    "account": "APM",
    "data": {
        "events": {
            "status": "success",
            "total": 156,
            "records": [
                {
                    "vehicle_id": "VEH001",
                    "event_type": "harsh_braking",
                    "severity": "warning",
                    "timestamp": "2025-12-15 14:23:45",
                    "location": {
                        "lat": 48.8566,
                        "lng": 2.3522
                    },
                    "speed": 75,
                    "address": "Avenue des Champs-Élysées, Paris"
                },
                {
                    "vehicle_id": "VEH001",
                    "event_type": "speed_violation",
                    "severity": "critical",
                    "timestamp": "2025-12-16 09:15:22",
                    "location": {
                        "lat": 48.8606,
                        "lng": 2.3376
                    },
                    "speed": 95,
                    "speed_limit": 70,
                    "address": "Rue de Rivoli, Paris"
                }
            ],
            "summary": {
                "harsh_braking": 45,
                "harsh_acceleration": 38,
                "speed_violations": 23,
                "dangerous_turns": 12,
                "total_violations": 118
            }
        },
        "eco_summary": {
            "status": "success",
            "period": {
                "start": "2025-12-01",
                "end": "2025-12-24"
            },
            "vehicles": [
                {
                    "vehicle_id": "VEH001",
                    "registration": "AB-123-CD",
                    "driver": "Jean Dupont",
                    "project": "Livraison Paris",
                    "distance": 1245.7,
                    "fuel_consumption": 89.3,
                    "fuel_efficiency": 13.94,
                    "driving_time": 42.5,
                    "idle_time": 5.2,
                    "co2_emission": 210.5,
                    "eco_score": 78,
                    "harsh_events": {
                        "braking": 12,
                        "acceleration": 8,
                        "turns": 3
                    }
                },
                {
                    "vehicle_id": "VEH002",
                    "registration": "EF-456-GH",
                    "driver": "Marie Martin",
                    "project": "Service Technique",
                    "distance": 890.2,
                    "fuel_consumption": 65.1,
                    "fuel_efficiency": 13.67,
                    "driving_time": 35.8,
                    "idle_time": 3.1,
                    "co2_emission": 153.2,
                    "eco_score": 85,
                    "harsh_events": {
                        "braking": 5,
                        "acceleration": 3,
                        "turns": 1
                    }
                }
            ],
            "fleet_summary": {
                "total_distance": 2135.9,
                "total_fuel": 154.4,
                "average_efficiency": 13.83,
                "total_driving_time": 78.3,
                "total_idle_time": 8.3,
                "average_eco_score": 81.5
            }
        },
        "stops": {
            "status": "success",
            "total_stops": 89,
            "records": [
                {
                    "vehicle_id": "VEH001",
                    "registration": "AB-123-CD",
                    "start_time": "2025-12-15 10:30:00",
                    "end_time": "2025-12-15 11:15:00",
                    "duration": 45,
                    "location": {
                        "lat": 48.8566,
                        "lng": 2.3522
                    },
                    "address": "123 Rue de la Paix, Paris",
                    "type": "delivery",
                    "engine_status": "off"
                },
                {
                    "vehicle_id": "VEH001",
                    "registration": "AB-123-CD",
                    "start_time": "2025-12-15 14:00:00",
                    "end_time": "2025-12-15 14:20:00",
                    "duration": 20,
                    "location": {
                        "lat": 48.8606,
                        "lng": 2.3376
                    },
                    "address": "Gare du Nord, Paris",
                    "type": "pause",
                    "engine_status": "idle"
                }
            ],
            "summary": {
                "total_duration": 3420,
                "average_duration": 38.4,
                "stops_with_engine_on": 12,
                "stops_with_engine_off": 77
            }
        }
    },
    "errors": []
}
```

## ⚠️ Réponse avec Erreur Partielle

Si un endpoint optionnel échoue :

```json
{
    "success": true,
    "platform": "TARGE TELEMATICS",
    "account": "APM",
    "data": {
        "events": {
            "status": "success",
            "total": 156,
            "records": [...]
        },
        "eco_summary": {
            "status": "success",
            "vehicles": [...]
        }
        // "stops" manquant car l'endpoint a échoué
    },
    "errors": [
        {
            "endpoint": "/json/getStopReport",
            "error": "HTTP 500: Internal Server Error"
        }
    ]
}
```

## ❌ Réponse en cas d'Échec Total

Si un endpoint obligatoire échoue :

```json
{
    "success": false,
    "error": "Error fetching data from /json/getEventHistoryReport: HTTP 401: Unauthorized",
    "partial_data": {},
    "platform": "TARGE TELEMATICS",
    "account": "APM"
}
```

## 🔄 Transformation pour SummaryTemplate

Le contrôleur transforme ces données brutes en format attendu par le template :

```php
// Avant transformation (données brutes)
$rawData = [
    'events' => [...],
    'eco_summary' => [...],
    'stops' => [...],
];

// Après transformation pour le template
$summaryData = [
    // Métriques de la flotte
    'total_vehicles' => 2,
    'active_vehicles' => 2,
    'total_distance' => 2135.9,
    
    // Métriques de carburant
    'total_fuel_consumption' => 154.4,
    'average_fuel_efficiency' => 13.83,
    
    // Alertes et incidents
    'total_alerts' => 156,
    'critical_alerts' => 23,
    
    // Détails par véhicule
    'vehicle_details' => [
        [
            'immatriculation' => 'AB-123-CD',
            'driver' => 'Jean Dupont',
            'project' => 'Livraison Paris',
            'distance' => 1245.7,
            'harsh_braking' => 12,
            'harsh_acceleration' => 8,
            'speed_violations' => 23,
            'total_violations' => 118,
        ],
        [
            'immatriculation' => 'EF-456-GH',
            'driver' => 'Marie Martin',
            'project' => 'Service Technique',
            'distance' => 890.2,
            'harsh_braking' => 5,
            'harsh_acceleration' => 3,
            'speed_violations' => 0,
            'total_violations' => 9,
        ],
    ],
    
    // Période
    'period_start' => '2025-12-01',
    'period_end' => '2025-12-24',
];
```

## 🎯 URLs Appelées

Pour générer ces données, le service appelle les 3 endpoints suivants :

1. **Événements**
   ```
   POST https://fleet.securysat.com/json/getEventHistoryReport
   Headers: Authorization: Bearer {token}
   Body: {
       "start_date": "2025-12-01",
       "end_date": "2025-12-24",
       "vehicle_id": "VEH001",
       "format": "json"
   }
   ```

2. **Éco-conduite**
   ```
   POST https://fleet.securysat.com/json/getDailyVehicleEcoSummary
   Headers: Authorization: Bearer {token}
   Body: {
       "start_date": "2025-12-01",
       "end_date": "2025-12-24",
       "vehicle_id": "VEH001",
       "format": "json"
   }
   ```

3. **Arrêts**
   ```
   POST https://fleet.securysat.com/json/getStopReport
   Headers: Authorization: Bearer {token}
   Body: {
       "start_date": "2025-12-01",
       "end_date": "2025-12-24",
       "vehicle_id": "VEH001",
       "format": "json",
       "min_duration": 300
   }
   ```

## 💡 Personnalisation

### Ajouter des paramètres supplémentaires

Pour ajouter des paramètres spécifiques à un endpoint :

```sql
UPDATE report_platform_endpoints
SET additional_params = '{
    "include_location": true,
    "include_address": true,
    "format": "json"
}'
WHERE data_key = 'events';
```

### Modifier l'ordre d'exécution

```sql
UPDATE report_platform_endpoints
SET `order` = 0
WHERE data_key = 'eco_summary';

-- Maintenant eco_summary sera appelé en premier
```

### Rendre un endpoint optionnel

```sql
UPDATE report_platform_endpoints
SET is_required = false
WHERE data_key = 'stops';

-- Maintenant si stops échoue, le rapport continue
```
