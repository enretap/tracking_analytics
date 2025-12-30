# Système de Templates Dynamiques pour les Rapports

## Vue d'ensemble

Le système de templates permet d'afficher des rapports avec des KPI Cards et des sections différentes selon le type de rapport. Chaque type de rapport a son propre template avec des métriques spécifiques.

## Architecture

```
resources/js/
├── components/reports/templates/
│   ├── FleetActivityTemplate.tsx       # Template pour activité de la flotte
│   ├── DriverBehaviorTemplate.tsx      # Template pour comportement conducteurs
│   ├── MaintenanceTemplate.tsx         # Template pour maintenance
│   ├── FuelConsumptionTemplate.tsx     # Template pour consommation carburant
│   ├── SummaryTemplate.tsx             # Template pour résumé général
│   ├── EcoDrivingTemplate.tsx          # Template pour éco-conduite
│   ├── DriverEcoDrivingTemplate.tsx    # Template pour éco-conduite par conducteur
│   └── GeoEcoDrivingTemplate.tsx       # Template pour éco-conduite géographique
├── config/
│   └── reportTemplates.ts              # Configuration des types de rapports
└── pages/reports/
    └── detail.tsx                       # Page qui charge dynamiquement les templates
```

## Templates Disponibles

### 1. **Fleet Activity** (`fleet_activity`)
Affiche les métriques d'activité de la flotte :
- Distance totale parcourue
- Véhicules actifs
- Vitesse moyenne
- Alertes
- Consommation de carburant
- Trajets effectués
- Temps d'exploitation
- Conformité

### 2. **Driver Behavior** (`driver_behavior`)
Affiche l'analyse du comportement des conducteurs :
- Score moyen de conduite
- Nombre de conducteurs excellents
- Freinages brusques
- Accélérations brusques
- Excès de vitesse
- Classement des conducteurs
- Distribution des événements

### 3. **Summary** (`summary`)
Affiche un résumé général complet de toutes les métriques :
- Vue d'ensemble de la flotte (véhicules, distance, trajets)
- Métriques des conducteurs (total, score moyen, conformité)
- Carburant et coûts (consommation, efficacité, dépenses)
- Maintenance (planifiées, complétées, en attente)
- Alertes et incidents (totales, critiques, résolues)
- Performance globale avec indicateurs visuels

### 4. **Maintenance** (`maintenance`)
Affiche le suivi des maintenances :
- Maintenances totales
- Maintenances urgentes
- Coût total et moyen
- Taux de complétion
- Maintenances à venir
- Véhicules à réviser
- Répartition des coûts

### 5. **Fuel Consumption** (`fuel_consumption`)
Affiche l'analyse de consommation :
- Consommation totale
- Coût total
- Consommation moyenne
- Meilleures/pires performances
- Émissions CO₂
- Top véhicules économes
- Évolution mensuelle

### 6. **Eco Driving** (`eco_driving`)
Affiche l'analyse de l'éco-conduite globale :
- Score éco-conduite global
- Efficacité carburant
- Émissions CO₂
- Économies réalisées
- Comportements de conduite (accélérations/freinages doux, vitesse optimale, ralenti)
- Violations et événements (freinages/accélérations brusques, ralenti excessif, excès de vitesse)
- Top conducteurs éco
- Comparaison avec la flotte

### 7. **Driver Eco Driving** (`driver_eco_driving`)
Affiche la performance éco-conduite détaillée par conducteur :
- Score éco-conduite flotte
- Carburant total économisé
- CO₂ total réduit
- Économies totales réalisées
- Statistiques conducteurs (excellents, bons, à améliorer)
- Tableau détaillé par conducteur avec colonnes personnalisables
- Score éco, efficacité carburant, événements de conduite
- Meilleur conducteur éco de la période
- Recommandations éco-conduite

### 8. **Geo Eco Driving** (`geo_eco_driving`)
Affiche l'analyse de l'éco-conduite par zone géographique :
- Zones analysées
- Score éco moyen par zone
- Distance totale
- Zones à risque
- Performance par type de zone (urbain, autoroute, rural)
- Tableau détaillé par zone géographique
- Top routes éco et routes à améliorer
- Impact environnemental et économies par zone

## Comment ajouter un nouveau template

### Étape 1 : Créer le composant template

Créez un nouveau fichier dans `resources/js/components/reports/templates/` :

```tsx
// MonNouveauTemplate.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon1, Icon2 } from 'lucide-react';

interface MonNouveauTemplateData {
    metric1?: number;
    metric2?: string;
    // ... autres métriques
}

interface Props {
    data: MonNouveauTemplateData;
}

export function MonNouveauTemplate({ data }: Props) {
    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ma Métrique
                        </CardTitle>
                        <Icon1 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.metric1 || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Description
                        </p>
                    </CardContent>
                </Card>
                
                {/* Autres cards... */}
            </div>

            {/* Sections détaillées */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Vos sections personnalisées */}
            </div>
        </div>
    );
}
```

### Étape 2 : Enregistrer le type dans la configuration

Ajoutez votre nouveau type dans `resources/js/config/reportTemplates.ts` :

```typescript
export const REPORT_TYPES = {
    FLEET_ACTIVITY: 'fleet_activity',
    DRIVER_BEHAVIOR: 'driver_behavior',
    MAINTENANCE: 'maintenance',
    FUEL_CONSUMPTION: 'fuel_consumption',
    MON_NOUVEAU_TYPE: 'mon_nouveau_type', // ← Ajouter ici
} as const;

export const REPORT_TYPE_CONFIG: Record<string, ReportTypeConfig> = {
    // ... autres configs
    [REPORT_TYPES.MON_NOUVEAU_TYPE]: {
        name: 'Mon Nouveau Type',
        description: 'Description de mon nouveau type de rapport',
        icon: 'MonIcone',
        color: 'purple',
    },
};
```

### Étape 3 : Importer et utiliser dans detail.tsx

Dans `resources/js/pages/reports/detail.tsx` :

```tsx
// 1. Importer le template
import { MonNouveauTemplate } from '@/components/reports/templates/MonNouveauTemplate';

// 2. Ajouter le case dans renderTemplate()
const renderTemplate = () => {
    const data = report.data || {};

    switch (report.type) {
        // ... autres cases
        case REPORT_TYPES.MON_NOUVEAU_TYPE:
            return <MonNouveauTemplate data={data} />;
        
        default:
            return <FleetActivityTemplate data={data} />;
    }
};
```

### Étape 4 : Mettre à jour la route backend

Dans `routes/web.php`, ajoutez la génération de données pour votre type :

```php
switch ($report->type) {
    // ... autres cases
    
    case 'mon_nouveau_type':
        $reportData['data'] = [
            'metric1' => rand(100, 1000),
            'metric2' => 'valeur',
            // ... autres données
        ];
        break;
}
```

### Étape 5 : (Optionnel) Mettre à jour la base de données

Si vous voulez stocker les vraies données dans la base de données, créez une table ou ajoutez des colonnes :

```php
// Migration exemple
Schema::create('report_fleet_data', function (Blueprint $table) {
    $table->id();
    $table->foreignId('report_id')->constrained()->onDelete('cascade');
    $table->integer('metric1')->nullable();
    $table->string('metric2')->nullable();
    $table->timestamps();
});
```

Puis modifiez la route pour récupérer les vraies données :

```php
case 'mon_nouveau_type':
    $reportData['data'] = $report->fleetData->toArray();
    break;
```

## Bonnes pratiques

1. **Réutilisation** : Utilisez les composants UI existants (`Card`, `Badge`, etc.)
2. **Cohérence** : Gardez la même structure (KPI Cards en haut, détails en bas)
3. **Responsive** : Utilisez les grilles responsive (`md:grid-cols-2 lg:grid-cols-4`)
4. **Mode sombre** : Pensez aux classes dark mode (`dark:bg-gray-800`)
5. **Types** : Définissez toujours une interface TypeScript pour vos données
6. **Fallback** : Gérez les données manquantes avec `|| 0` ou valeurs par défaut

## Exemple d'utilisation

Depuis le backend, créez un rapport avec le bon type :

```php
$report = Report::create([
    'name' => 'Rapport Mensuel',
    'type' => 'fleet_activity', // ou 'driver_behavior', 'maintenance', etc.
    'description' => 'Rapport d\'activité de décembre',
]);

$report->accounts()->attach($account->id);
```

Le système affichera automatiquement le template approprié selon le `type` du rapport.

## Structure des données

Chaque template attend des données dans un format spécifique. Voici les interfaces :

### FleetActivityTemplate
```typescript
{
    total_distance?: number;
    total_vehicles?: number;
    active_vehicles?: number;
    alerts?: number;
    average_speed?: number;
    fuel_consumption?: number;
    trip_count?: number;
    operating_time?: number;
}
```

### DriverBehaviorTemplate
```typescript
{
    total_drivers?: number;
    excellent_drivers?: number;
    harsh_braking_events?: number;
    harsh_acceleration_events?: number;
    speeding_violations?: number;
    average_score?: number;
    total_driving_time?: number;
    safe_driving_percentage?: number;
}
```

### SummaryTemplate
```typescript
{
    // Métriques de la flotte
    total_vehicles?: number;
    active_vehicles?: number;
    inactive_vehicles?: number;
    total_distance?: number;
    
    // Métriques des conducteurs
    total_drivers?: number;
    active_drivers?: number;
    average_driver_score?: number;
    
    // Métriques opérationnelles
    total_trips?: number;
    average_trip_distance?: number;
    operating_hours?: number;
    
    // Métriques de carburant
    total_fuel_consumption?: number;
    average_fuel_efficiency?: number;
    fuel_cost?: number;
    
    // Métriques de maintenance
    scheduled_maintenances?: number;
    completed_maintenances?: number;
    pending_maintenances?: number;
    maintenance_cost?: number;
    
    // Alertes et incidents
    total_alerts?: number;
    critical_alerts?: number;
    resolved_alerts?: number;
    
    // Performance
    compliance_rate?: number;
    on_time_delivery?: number;
    
    // Période
    period_start?: string;
    period_end?: string;
}
```

### MaintenanceTemplate
```typescript
{
    total_maintenances?: number;
    scheduled_maintenances?: number;
    urgent_maintenances?: number;
    completed_maintenances?: number;
    total_cost?: number;
    average_cost?: number;
    vehicles_due?: number;
    upcoming_maintenances?: number;
}
```

### FuelConsumptionTemplate
```typescript
{
    total_fuel?: number;
    total_cost?: number;
    average_consumption?: number;
    best_vehicle_consumption?: number;
    worst_vehicle_consumption?: number;
    fuel_savings?: number;
    total_distance?: number;
    co2_emissions?: number;
}
```

### EcoDrivingTemplate
```typescript
{
    // Métriques éco-conduite
    eco_score?: number;
    fuel_efficiency?: number;
    co2_emissions?: number;
    eco_driving_percentage?: number;
    
    // Comportements de conduite
    smooth_acceleration_rate?: number;
    smooth_braking_rate?: number;
    optimal_speed_rate?: number;
    idle_time_reduction?: number;
    
    // Économies réalisées
    fuel_saved?: number;
    cost_saved?: number;
    co2_reduced?: number;
    
    // Comparaisons
    previous_eco_score?: number;
    fleet_average_eco_score?: number;
    best_eco_score?: number;
    worst_eco_score?: number;
    
    // Violations éco-conduite
    harsh_braking_events?: number;
    harsh_acceleration_events?: number;
    excessive_idling_events?: number;
    speeding_events?: number;
    
    // Classement conducteurs
    top_eco_drivers?: Array<{
        name: string;
        score: number;
        fuel_saved: number;
    }>;
    
    // Période
    period_start?: string;
    period_end?: string;
}
```

### DriverEcoDrivingTemplate
```typescript
{
    // Métriques globales éco-conduite
    fleet_eco_score?: number;
    total_fuel_saved?: number;
    total_co2_reduced?: number;
    total_cost_saved?: number;
    
    // Comportements de conduite
    average_smooth_acceleration?: number;
    average_smooth_braking?: number;
    average_optimal_speed?: number;
    average_idle_reduction?: number;
    
    // Statistiques conducteurs
    total_drivers?: number;
    excellent_eco_drivers?: number;
    good_eco_drivers?: number;
    poor_eco_drivers?: number;
    
    // Violations
    total_harsh_braking?: number;
    total_harsh_acceleration?: number;
    total_excessive_idling?: number;
    total_speeding_events?: number;
    
    // Classement
    best_eco_driver?: {
        name: string;
        score: number;
        fuel_saved: number;
    };
    
    // Période
    period_start?: string;
    period_end?: string;
    
    // Détails conducteurs
    driver_details?: Array<{
        immatriculation: string;
        driver: string;
        project?: string;
        eco_score?: number;
        fuel_efficiency?: number;
        distance?: number;
        driving_time?: string;
        smooth_acceleration_rate?: number;
        smooth_braking_rate?: number;
        harsh_braking?: number;
        harsh_acceleration?: number;
        excessive_idling?: number;
        speed_violations?: number;
        fuel_saved?: number;
        co2_emissions?: number;
    }>;
}
```

### GeoEcoDrivingTemplate
```typescript
{
    // Métriques globales
    total_zones?: number;
    best_zone_eco_score?: number;
    worst_zone_eco_score?: number;
    average_zone_eco_score?: number;
    
    // Métriques par type de zone
    urban_eco_score?: number;
    highway_eco_score?: number;
    rural_eco_score?: number;
    
    // Performance globale
    total_distance?: number;
    total_fuel_saved?: number;
    total_co2_reduced?: number;
    
    // Zones à risque
    high_risk_zones?: number;
    accident_prone_areas?: number;
    
    // Période
    period_start?: string;
    period_end?: string;
    
    // Détails par zone
    zone_details?: Array<{
        zone_name: string;
        zone_type?: string; // 'urban', 'highway', 'rural'
        eco_score?: number;
        fuel_efficiency?: number;
        distance?: number;
        average_speed?: number;
        harsh_events?: number;
        fuel_saved?: number;
        co2_emissions?: number;
        vehicle_count?: number;
    }>;
    
    // Routes principales
    top_routes?: Array<{
        route_name: string;
        start_location?: string;
        end_location?: string;
        eco_score?: number;
        distance?: number;
        fuel_consumption?: number;
        average_speed?: number;
        optimal_speed_rate?: number;
        trip_count?: number;
    }>;
}
```

## Personnalisation avancée

Vous pouvez également créer des templates hybrides ou personnalisés :

```tsx
// Dans detail.tsx
const renderTemplate = () => {
    const data = report.data || {};

    // Template personnalisé basé sur des paramètres
    if (report.params?.custom_layout) {
        return <CustomTemplate data={data} params={report.params} />;
    }

    // Logique standard
    switch (report.type) {
        // ...
    }
};
```

Cela permet une flexibilité maximale pour créer des rapports vraiment personnalisés.
