// Configuration des templates de rapports
// Chaque type de rapport est associé à un template spécifique

export const REPORT_TYPES = {
    FLEET_ACTIVITY: 'fleet_activity',
    DRIVER_BEHAVIOR: 'driver_behavior',
    MAINTENANCE: 'maintenance',
    FUEL_CONSUMPTION: 'fuel_consumption',
    SUMMARY: 'summary',
    ECO_DRIVING: 'eco_driving',
    DRIVER_ECO_DRIVING: 'driver_eco_driving',
    GEO_ECO_DRIVING: 'geo_eco_driving',
} as const;

export type ReportType = typeof REPORT_TYPES[keyof typeof REPORT_TYPES];

interface ReportTypeConfig {
    name: string;
    description: string;
    icon: string;
    color: string;
}

export const REPORT_TYPE_CONFIG: Record<string, ReportTypeConfig> = {
    [REPORT_TYPES.FLEET_ACTIVITY]: {
        name: 'Activité de la flotte',
        description: 'Vue d\'ensemble des activités de votre flotte de véhicules',
        icon: 'Activity',
        color: 'blue',
    },
    [REPORT_TYPES.DRIVER_BEHAVIOR]: {
        name: 'Comportement des conducteurs',
        description: 'Analyse du comportement et des performances des conducteurs',
        icon: 'User',
        color: 'purple',
    },
    [REPORT_TYPES.MAINTENANCE]: {
        name: 'Maintenance',
        description: 'Suivi des maintenances et interventions sur les véhicules',
        icon: 'Wrench',
        color: 'orange',
    },
    [REPORT_TYPES.FUEL_CONSUMPTION]: {
        name: 'Consommation de carburant',
        description: 'Analyse détaillée de la consommation et des coûts en carburant',
        icon: 'Fuel',
        color: 'green',
    },
    [REPORT_TYPES.SUMMARY]: {
        name: 'Résumé général',
        description: 'Vue d\'ensemble complète de toutes les métriques de votre flotte',
        icon: 'BarChart3',
        color: 'indigo',
    },
    [REPORT_TYPES.ECO_DRIVING]: {
        name: 'Éco-Conduite',
        description: 'Analyse de l\'éco-conduite et des économies de carburant',
        icon: 'Leaf',
        color: 'green',
    },    [REPORT_TYPES.DRIVER_ECO_DRIVING]: {
        name: 'Éco-Conduite par Conducteur',
        description: 'Performance éco-conduite détaillée de chaque conducteur',
        icon: 'Users',
        color: 'emerald',
    },
    [REPORT_TYPES.GEO_ECO_DRIVING]: {
        name: 'Éco-Conduite Géographique',
        description: 'Analyse de l'éco-conduite par zone géographique et routes',
        icon: 'MapPin',
        color: 'cyan',
    },
};

// Fonction pour obtenir la configuration d'un type de rapport
export function getReportTypeConfig(type: string): ReportTypeConfig {
    return REPORT_TYPE_CONFIG[type] || {
        name: 'Rapport personnalisé',
        description: 'Rapport avec configuration personnalisée',
        icon: 'FileText',
        color: 'gray',
    };
}
