import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
  Car, 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  MapPin, 
  Clock, 
  Filter, 
  Calendar,
  TrendingUp,
  Award,
  Gauge,
  Fuel,
  Settings,
  Download,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  PauseCircle,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useVehicles } from '@/hooks/useVehicles';

// Lazy load de la carte pour améliorer le temps de chargement initial
const VehicleMap = lazy(() => import('@/components/maps/vehicle-map').then(module => ({ default: module.VehicleMap })));

interface Vehicle {
    id: string;
    name: string;
    plate: string;
    status: 'active' | 'maintenance' | 'inactive';
    distance: number;
    latitude: number;
    longitude: number;
    speed?: number;
    lastUpdate: string;
}

interface Report {
    id: number;
    name: string;
    description?: string;
    type?: string;
    created_at: string;
    preview_image?: string;
}

interface VehicleDriverDetail {
    immatriculation: string;
    driver: string;
    project?: string;
    max_speed?: number;
    distance?: number;
    driving_time?: string;
    idle_time?: string;
    harsh_braking?: number;
    harsh_acceleration?: number;
    dangerous_turns?: number;
    speed_violations?: number;
    driving_time_violations?: number;
    total_violations?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accueil',
        href: dashboard().url,
    },
];

// Données temporaires (à remplacer par vos données réelles)
/* const mockVehicles = [
    { id: 'v1', name: 'Mercedes Sprinter', plate: 'AB-123-CD', status: 'active', distance: 1245 },
    { id: 'v2', name: 'Renault Master', plate: 'EF-456-GH', status: 'active', distance: 892 },
    { id: 'v3', name: 'Peugeot Boxer', plate: 'IJ-789-KL', status: 'inactive', distance: 0 },
    { id: 'v4', name: 'Ford Transit', plate: 'MN-012-OP', status: 'active', distance: 1567 },
    { id: 'v5', name: 'Volkswagen Crafter', plate: 'QR-345-ST', status: 'maintenance', distance: 234 },
]; */

const mockVehicles : Vehicle[]  = [
    /* {
    id: 'vehicle-1',
    name: 'Camion Renault Master',
    plate: 'AB-234-CF',
    status: 'active',
    distance: 12450,
    latitude: 5.3311583,
    longitude: -3.9688833,
    speed: 65,
    lastUpdate: new Date(Date.now() - 30 * 60000).toISOString(), // Il y a 30 minutes
  },
  {
    id: 'vehicle-2',
    name: 'Fourgon Mercedes Sprinter',
    plate: 'CD-567-GH',
    status: 'active',
    distance: 8560,
    latitude: 48.870502,
    longitude: 2.306546,
    speed: 45,
    lastUpdate: new Date(Date.now() - 15 * 60000).toISOString(), // Il y a 15 minutes
  },
  {
    id: 'vehicle-3',
    name: 'Utilitaire Peugeot Partner',
    plate: 'EF-890-IJ',
    status: 'maintenance',
    distance: 23100,
    latitude: 48.835798,
    longitude: 2.329376,
    speed: 0,
    lastUpdate: new Date(Date.now() - 2 * 3600000).toISOString(), // Il y a 2 heures
  },
  {
    id: 'vehicle-4',
    name: 'Camionnette Ford Transit',
    plate: 'GH-123-KL',
    status: 'active',
    distance: 18765,
    latitude: 48.892423,
    longitude: 2.236596,
    speed: 72,
    lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(), // Il y a 5 minutes
  },
  {
    id: 'vehicle-5',
    name: 'Fourgon Renault Trafic',
    plate: 'IJ-456-MN',
    status: 'inactive',
    distance: 15230,
    latitude: 48.826862,
    longitude: 2.270044,
    lastUpdate: new Date(Date.now() - 8 * 3600000).toISOString(), // Il y a 8 heures
  },
  {
    id: 'vehicle-6',
    name: 'Camion Iveco Daily',
    plate: 'KL-789-OP',
    status: 'active',
    distance: 32450,
    latitude: 48.863576,
    longitude: 2.327735,
    speed: 58,
    lastUpdate: new Date(Date.now() - 45 * 60000).toISOString(), // Il y a 45 minutes
  },
  {
    id: 'vehicle-7',
    name: 'Fourgon Volkswagen Crafter',
    plate: 'MN-012-QR',
    status: 'active',
    distance: 28900,
    latitude: 48.847894,
    longitude: 2.389506,
    speed: 38,
    lastUpdate: new Date(Date.now() - 20 * 60000).toISOString(), // Il y a 20 minutes
  },
  {
    id: 'vehicle-8',
    name: 'Utilitaire Citroën Jumper',
    plate: 'OP-345-ST',
    status: 'maintenance',
    distance: 41200,
    latitude: 48.839654,
    longitude: 2.360221,
    lastUpdate: new Date(Date.now() - 3 * 3600000).toISOString(), // Il y a 3 heures
  },
  {
    id: 'vehicle-9',
    name: 'Camionnette Fiat Ducato',
    plate: 'QR-678-UV',
    status: 'active',
    distance: 15600,
    latitude: 48.880856,
    longitude: 2.355398,
    speed: 82,
    lastUpdate: new Date(Date.now() - 10 * 60000).toISOString(), // Il y a 10 minutes
  },
  {
    id: 'vehicle-10',
    name: 'Fourgon Nissan NV400',
    plate: 'ST-901-WX',
    status: 'inactive',
    distance: 27500,
    latitude: 48.812345,
    longitude: 2.398712,
    lastUpdate: new Date(Date.now() - 12 * 3600000).toISOString(), // Il y a 12 heures
  }, */
];

const timePeriods = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'yesterday', label: 'Hier' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' },
    { value: 'custom', label: 'Période personnalisée' },
];

interface EcoDrivingData {
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
    
    // Détails véhicules/conducteurs
    vehicle_details?: VehicleDriverDetail[];
}

interface Props {
    eco_data: EcoDrivingData;
}

export default function Dashboard({ eco_data }: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
    const [reports, setReports] = useState<Report[]>([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [totalReports, setTotalReports] = useState(0);

    // Récupérer les véhicules depuis l'API
    const { vehicles: apiVehicles, loading: vehiclesLoading, refetch: refetchVehicles } = useVehicles();
    
    // Charger les rapports de l'utilisateur
    useEffect(() => {
        const fetchReports = async () => {
            setLoadingReports(true);
            try {
                const response = await fetch('/api/reports');
                if (response.ok) {
                    const data = await response.json();
                    setReports(data.data || []);
                    setTotalReports(data.total || 0);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des rapports:', error);
            } finally {
                setLoadingReports(false);
            }
        };
        fetchReports();
    }, []);
    
    // Utiliser les véhicules de l'API ou les mocks comme fallback
    const vehicles = apiVehicles.length > 0 ? apiVehicles : mockVehicles;
    
    // État pour les véhicules sélectionnés (initialisé avec les actifs)
    const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
    
    // Initialiser avec les véhicules actifs au chargement
    useEffect(() => {
        if (vehicles.length > 0 && selectedVehicleIds.length === 0) {
            const activeIds = vehicles.filter(v => v.status === 'active').map(v => v.id);
            setSelectedVehicleIds(activeIds);
        }
    }, [vehicles]);
    
    // Véhicules à afficher sur la carte (optimisé avec useMemo)
    const displayedVehicles = useMemo(
        () => vehicles.filter(v => selectedVehicleIds.includes(v.id)),
        [vehicles, selectedVehicleIds]
    );
    
    // Statistiques calculées (optimisé avec useMemo)
    const stats = useMemo(() => ({
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === 'active').length,
        inactiveVehicles: vehicles.filter(v => v.status === 'inactive').length,
        maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
    }), [vehicles]);
    
    // Top 5 des véhicules par distance (optimisé avec useMemo)
    const topVehiclesByDistance = useMemo(
        () => [...vehicles]
            .filter(v => v.distance > 0)
            .sort((a, b) => b.distance - a.distance)
            .slice(0, 5),
        [vehicles]
    );

    // Données pour le graphique de tendance des vitesses
    const speedTrendData = [
        { hour: '00:00', maxSpeed: 85 },
        { hour: '04:00', maxSpeed: 75 },
        { hour: '08:00', maxSpeed: 95 },
        { hour: '12:00', maxSpeed: 110 },
        { hour: '16:00', maxSpeed: 105 },
        { hour: '20:00', maxSpeed: 90 },
    ];

    const handleToggleVehicle = (vehicleId: string) => {
        setSelectedVehicleIds(prev => 
            prev.includes(vehicleId)
                ? prev.filter(id => id !== vehicleId)
                : [...prev, vehicleId]
        );
    };

    const handleSelectAll = () => {
        setSelectedVehicleIds(vehicles.map(v => v.id));
    };

    const handleSelectActiveOnly = () => {
        const activeIds = vehicles.filter(v => v.status === 'active').map(v => v.id);
        setSelectedVehicleIds(activeIds);
    };

    const handleDeselectAll = () => {
        setSelectedVehicleIds([]);
    };

    // Filtrer les véhicules par recherche
    const filteredVehicles = useMemo(() => {
        if (!vehicleSearchQuery.trim()) return vehicles;
        const query = vehicleSearchQuery.toLowerCase();
        return vehicles.filter(v => 
            v.name.toLowerCase().includes(query) || 
            v.plate.toLowerCase().includes(query)
        );
    }, [vehicles, vehicleSearchQuery]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Tracking Analytics" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4 pt-2">
                {/* En-tête du Dashboard */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Tableau de bord
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Vue d'ensemble des activités de votre flotte
                        </p>
                    </div>
                    
                    {/* <div className="flex flex-wrap items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Actualisation...' : 'Actualiser'}
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exporter
                        </Button>
                        
                        <Button size="sm" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500">
                            <Settings className="h-4 w-4" />
                            Paramètres
                        </Button>
                    </div> */}
                </div>

                {/* Filtres */}
                {/* <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Filtres</span>
                        </div>
                        
                        <div className="flex w-full flex-wrap items-center gap-4 lg:w-auto">
                            <div className="flex-1 lg:flex-none">
                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                    <SelectTrigger className="w-full lg:w-[180px]">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <SelectValue placeholder="Période" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timePeriods.map((period) => (
                                            <SelectItem key={period.value} value={period.value}>
                                                {period.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {selectedPeriod === 'custom' && (
                                <div className="w-full lg:w-auto">
                                    <DateRangePicker
                                    date={dateRange}
                                    onDateChange={(date) => {
                                        if (!date) return; // ignore undefined (or handle/reset as needed)
                                        setDateRange({
                                        from: (date as any).from ?? (date as any).start ?? (date as any).startDate,
                                        to:   (date as any).to   ?? (date as any).end   ?? (date as any).endDate,
                                        });
                                    }}
                                    />
                                </div>
                            )}
                            
                            <div className="flex-1 lg:flex-none">
                                <Select>
                                    <SelectTrigger className="w-full lg:w-[200px]">
                                        <div className="flex items-center gap-2">
                                            <Car className="h-4 w-4" />
                                            <SelectValue placeholder="Sélectionner véhicule(s)" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les véhicules</SelectItem>
                                        {vehicles.map((vehicle) => (
                                            <SelectItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.name} ({vehicle.plate})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white dark:border-yellow-700 dark:from-yellow-900/20 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                                Total des véhicules de la flotte
                            </CardTitle>
                            <Car className="h-8 w-8 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalVehicles}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Tous les véhicules de la flotte
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-800 dark:from-green-900/20 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-green-600 dark:text-green-400">
                                Véhicules en mouvement
                            </CardTitle>
                            <Activity className="h-8 w-8 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.activeVehicles}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                En déplacement actuellement
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:border-slate-700 dark:from-slate-800/30 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                Véhicules à l'arrêt
                            </CardTitle>
                            <PauseCircle className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalVehicles - stats.activeVehicles}</div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Tous les véhicules à l'arrêt
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:border-orange-800 dark:from-orange-900/20 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                Véhicules en maintenance
                            </CardTitle>
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.maintenanceVehicles}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Véhicules en réparation
                            </p>
                        </CardContent>
                    </Card>
                    
                </div>

                {/* Analyse des comportements à risques */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Analyse des comportements à risques
                                </CardTitle>
                                <CardDescription>
                                    Vue d'ensemble des infractions et comportements à risques de la flotte
                                </CardDescription>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                {(() => {
                                    const ecoReport = reports.find(r => r.type === 'eco_driving');
                                    if (ecoReport) {
                                        return (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/reports/${ecoReport.id}`}
                                                className="flex items-center gap-2"
                                            >
                                                <FileText className="h-4 w-4" />
                                                Voir le rapport complet
                                            </Button>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-gray-50">
                        {/* Graphiques */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Répartition des violations de vitesse par véhicule (%) */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Répartition des violations de vitesse (%)</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white p-4">
                                    {(() => {
                                        // Safety check for vehicle_details
                                        if (!eco_data?.vehicle_details || eco_data.vehicle_details.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucune violation</div>;
                                        }
                                        const totalViolations = eco_data.vehicle_details.reduce((sum, v) => sum + (v.speed_violations || 0), 0);
                                        const topVehicles = eco_data.vehicle_details
                                            .filter(v => (v.speed_violations || 0) > 0)
                                            .sort((a, b) => (b.speed_violations || 0) - (a.speed_violations || 0))
                                            .slice(0, 5);
                                        
                                        if (totalViolations === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucune violation de vitesse</div>;
                                        }

                                        const colors = ['#1e3a5f', '#8B4513', '#d946ef', '#f59e0b', '#10b981'];
                                        
                                        return (
                                            <div className="flex flex-col items-center gap-4">
                                                {/* Pie Chart */}
                                                <div className="relative w-56 h-56">
                                                    <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                                        {(() => {
                                                            let currentAngle = 0;
                                                            return topVehicles.map((vehicle, idx) => {
                                                                const percentage = (vehicle.speed_violations || 0) / totalViolations;
                                                                const angle = percentage * 360;
                                                                const startAngle = currentAngle;
                                                                const endAngle = currentAngle + angle;
                                                                currentAngle = endAngle;
                                                                
                                                                // Convertir les angles en radians
                                                                const startRad = (startAngle * Math.PI) / 180;
                                                                const endRad = (endAngle * Math.PI) / 180;
                                                                
                                                                // Calculer les points du segment
                                                                const x1 = 100 + 80 * Math.cos(startRad);
                                                                const y1 = 100 + 80 * Math.sin(startRad);
                                                                const x2 = 100 + 80 * Math.cos(endRad);
                                                                const y2 = 100 + 80 * Math.sin(endRad);
                                                                
                                                                const largeArc = angle > 180 ? 1 : 0;
                                                                
                                                                return (
                                                                    <path
                                                                        key={idx}
                                                                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                        fill={colors[idx]}
                                                                        stroke="white"
                                                                        strokeWidth="2"
                                                                    />
                                                                );
                                                            });
                                                        })()}
                                                    </svg>
                                                    {/* Centre avec total */}
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <div className="text-2xl font-bold text-gray-800">{totalViolations}</div>
                                                        <div className="text-xs text-gray-500">Total</div>
                                                    </div>
                                                </div>
                                                
                                                {/* Légende */}
                                                <div className="grid grid-cols-1 gap-2 w-full text-xs">
                                                    {topVehicles.map((vehicle, idx) => {
                                                        const percentage = ((vehicle.speed_violations || 0) / totalViolations * 100).toFixed(1);
                                                        return (
                                                            <div key={idx} className="flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[idx] }}></div>
                                                                    <span className="font-medium">{vehicle.immatriculation}</span>
                                                                </div>
                                                                <span className="text-gray-600">{percentage}% ({vehicle.speed_violations})</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>

                            {/* Véhicules en infractions de vitesse */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Véhicules en infractions de vitesse (Km/h)</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    {(() => {
                                        // Safety check for vehicle_details
                                        if (!eco_data?.vehicle_details || eco_data.vehicle_details.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucun véhicule</div>;
                                        }
                                        const speedViolators = eco_data.vehicle_details
                                            .filter(v => (v.max_speed || 0) > 90)
                                            .sort((a, b) => (b.max_speed || 0) - (a.max_speed || 0))
                                            .slice(0, 5);
                                        const maxSpeed = Math.max(...speedViolators.map(v => v.max_speed || 0));
                                        
                                        return (
                                            <div className="space-y-2">
                                                {speedViolators.map((vehicle, idx) => (
                                                    <div key={idx}>
                                                        <div className="flex justify-between mb-1 text-sm">
                                                            <span>{vehicle.immatriculation}</span>
                                                            <span className="font-bold text-[#8B4513]">{vehicle.max_speed}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded h-5">
                                                            <div 
                                                                className="bg-[#1e3a5f] h-5 rounded"
                                                                style={{ width: `${((vehicle.max_speed || 0) / maxSpeed * 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {/* Analyse des comportements à risques par conducteur */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Analyse des comportements à risques par conducteur
                                </CardTitle>
                                <CardDescription>
                                    Performance et comportements de conduite par conducteur
                                </CardDescription>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                {(() => {
                                    const driverReport = reports.find(r => r.type === 'driver_eco_driving');
                                    if (driverReport) {
                                        return (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/reports/${driverReport.id}`}
                                                className="flex items-center gap-2"
                                            >
                                                <FileText className="h-4 w-4" />
                                                Voir le rapport complet
                                            </Button>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-gray-50">
                        {/* Graphiques */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Répartition des infractions par véhicule (%) */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Répartition des infractions par véhicule (%)</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white p-4">
                                    {(() => {
                                        // Safety check for vehicle_details
                                        if (!eco_data?.vehicle_details || eco_data.vehicle_details.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                        }

                                        const totalViolations = eco_data.vehicle_details.reduce((sum, v) => sum + (v.total_violations || 0), 0);
                                        const topViolators = eco_data.vehicle_details
                                            .filter(v => (v.total_violations || 0) > 0)
                                            .sort((a, b) => (b.total_violations || 0) - (a.total_violations || 0))
                                            .slice(0, 6);
                                        
                                        if (totalViolations === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                        }

                                        const colors = ['#1e3a5f', '#8B4513', '#d946ef', '#f59e0b', '#10b981', '#ef4444'];
        
                                        return (
                                            <div className="flex flex-col items-center gap-1">
                                                {/* Donut chart */}
                                                <div className="relative w-64 h-64">
                                                    <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                                        {(() => {
                                                            let currentAngle = 0;
                                                            return topViolators.map((vehicle, idx) => {
                                                                const percentage = (vehicle.total_violations || 0) / totalViolations;
                                                                const angle = percentage * 360;
                                                                const startAngle = currentAngle;
                                                                currentAngle += angle;
                                                                
                                                                const startRad = (startAngle * Math.PI) / 180;
                                                                const endRad = (currentAngle * Math.PI) / 180;
                                                                
                                                                const x1 = 100 + 75 * Math.cos(startRad);
                                                                const y1 = 100 + 75 * Math.sin(startRad);
                                                                const x2 = 100 + 75 * Math.cos(endRad);
                                                                const y2 = 100 + 75 * Math.sin(endRad);
                                                                
                                                                const largeArc = angle > 180 ? 1 : 0;
                                                                
                                                                return (
                                                                    <path
                                                                        key={idx}
                                                                        d={`M 100 100 L ${x1} ${y1} A 75 75 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                        fill={colors[idx]}
                                                                        stroke="white"
                                                                        strokeWidth="2"
                                                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                                                    />
                                                                );
                                                            });
                                                        })()}
                                                        <circle cx="100" cy="100" r="50" fill="white" />
                                                    </svg>
                                                    {/* Total au centre */}
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <div className="text-3xl font-bold text-gray-800">{totalViolations}</div>
                                                        <div className="text-xs text-gray-500">Total</div>
                                                    </div>
                                                </div>
                                                
                                                {/* Légende améliorée */}
                                                <div className="w-full grid grid-cols-2 gap-1.5 text-xs">
                                                    {topViolators.map((vehicle, idx) => {
                                                        const percentage = ((vehicle.total_violations || 0) / totalViolations * 100).toFixed(1);
                                                        return (
                                                            <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-gray-50">
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[idx] }}></div>
                                                                    <span className="font-medium truncate">{vehicle.immatriculation}</span>
                                                                </div>
                                                                <div className="flex flex-col items-end text-right flex-shrink-0">
                                                                    <span className="font-bold text-gray-800">{percentage}%</span>
                                                                    <span className="text-gray-500 text-[10px]">({vehicle.total_violations})</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>

                            {/* Nombre d'infractions par véhicules */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Nombre d'infractions par véhicules</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white p-4">
                                    {(() => {
                                        // Early return if vehicle_details doesn't exist
                                        if (!eco_data?.vehicle_details) {
                                            return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                        }

                                        const topViolators = eco_data.vehicle_details
                                            .filter((v: VehicleDriverDetail) => 
                                                (v.harsh_braking || 0) + (v.harsh_acceleration || 0) + (v.dangerous_turns || 0) > 0
                                            )
                                            .sort((a: VehicleDriverDetail, b: VehicleDriverDetail) => 
                                                ((b.harsh_braking || 0) + (b.harsh_acceleration || 0) + (b.dangerous_turns || 0)) -
                                                ((a.harsh_braking || 0) + (a.harsh_acceleration || 0) + (a.dangerous_turns || 0))
                                            )
                                            .slice(0, 4);
                                        
                                        const maxValue = Math.max(
                                            ...topViolators.map((v: VehicleDriverDetail) => 
                                                Math.max(v.harsh_braking || 0, v.harsh_acceleration || 0, v.dangerous_turns || 0)
                                            ),
                                            0 // Fallback if topViolators is empty
                                        );
                                        
                                        // ...existing code...
                                    })()}
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {/* Analyse géospatiale des comportements à risques */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Analyse géospatiale des comportements à risques
                                </CardTitle>
                                <CardDescription>
                                    Analyse des comportements par zones géographiques et itinéraires
                                </CardDescription>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                {(() => {
                                    const geoReport = reports.find(r => r.type === 'geo_eco_driving');
                                    if (geoReport) {
                                        return (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/reports/${geoReport.id}`}
                                                className="flex items-center gap-2"
                                            >
                                                <FileText className="h-4 w-4" />
                                                Voir le rapport complet
                                            </Button>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-gray-50">
                        {/* Graphiques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Cartographie des infractions */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-gray-200">
                                    <CardTitle className="text-base font-semibold text-gray-800">Cartographie génarale des infractions</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    <div className="aspect-square bg-gray-100 rounded flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                                            {/* Simuler une carte avec des points */}
                                            {!eco_data?.vehicle_details ? (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                        Aucune infraction disponible
                                                    </div>
                                                ) :(eco_data.vehicle_details.map((vehicle, idx) => {
                                                    const totalViolations = vehicle.total_violations || 0;
                                                    if (totalViolations === 0) return null;
                                                    
                                                    // Position pseudo-aléatoire basée sur l'index
                                                    const left = 20 + (idx * 17) % 60;
                                                    const top = 15 + (idx * 23) % 70;
                                                    const size = Math.min(10 + totalViolations / 10, 40);
                                                    
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="absolute rounded-full bg-red-500 opacity-60 border-2 border-red-600"
                                                            style={{
                                                                left: `${left}%`,
                                                                top: `${top}%`,
                                                                width: `${size}px`,
                                                                height: `${size}px`
                                                            }}
                                                            title={`${vehicle.immatriculation}: ${totalViolations} infractions`}
                                                        ></div>
                                                    );
                                            }))}
                                        </div>
                                        <div className="relative z-10 text-center">
                                            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Carte des infractions</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cartographie des infractions sur Abidjan */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Cartographie des infractions sur Abidjan</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    <div className="aspect-square bg-gray-100 rounded flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                                            {/* Points concentrés pour simulation zone urbaine */}
                                            {!eco_data?.vehicle_details ? (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    Aucune infraction disponible
                                                </div>
                                            ) :(eco_data.vehicle_details.slice(0, 8).map((vehicle, idx) => {
                                                const totalViolations = vehicle.total_violations || 0;
                                                if (totalViolations === 0) return null;
                                                
                                                // Concentré au centre pour simuler Abidjan
                                                const left = 35 + (idx * 7) % 30;
                                                const top = 35 + (idx * 11) % 30;
                                                const size = Math.min(8 + totalViolations / 15, 30);
                                                const color = totalViolations > 100 ? 'bg-red-500 border-red-600' : 'bg-blue-500 border-blue-600';
                                            
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`absolute rounded-full ${color} opacity-70 border-2`}
                                                        style={{
                                                            left: `${left}%`,
                                                            top: `${top}%`,
                                                            width: `${size}px`,
                                                            height: `${size}px`
                                                        }}
                                                        title={`${vehicle.immatriculation}: ${totalViolations} infractions`}
                                                    ></div>
                                                );
                                            }))}
                                        </div>
                                        <div className="relative z-10 text-center">
                                            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Zone Abidjan</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Nombre de véhicules par Type d'événement */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Nombre de véhicules par Type d'événement</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    {(() => {
                                        // Safety check for vehicle_details
                                        if (!eco_data?.vehicle_details || eco_data.vehicle_details.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucun véhicule</div>;
                                        }
                                        
                                        const nightDriving = eco_data.vehicle_details.filter(v => (v.driving_time_violations || 0) > 0).length;
                                        const durationViolation = eco_data.vehicle_details.filter(v => (v.driving_time_violations || 0) > 0).length;
                                        const speedViolation = eco_data.vehicle_details.filter(v => (v.speed_violations || 0) > 0).length;
                                        const total = eco_data.vehicle_details.length;
                                        
                                        const nightPercent = (nightDriving / total * 100).toFixed(2);
                                        const durationPercent = (durationViolation / total * 100).toFixed(2);
                                        const speedPercent = (speedViolation / total * 100).toFixed(2);
                                        
                                        return (
                                            <div>
                                                {/* Donut chart */}
                                                <div className="relative w-48 h-48 mx-auto mb-4">
                                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                                        {(() => {
                                                            let currentAngle = 0;
                                                            const data = [
                                                                { value: parseFloat(speedPercent), color: '#ef4444', label: 'Conduite de nuit' },
                                                                { value: parseFloat(durationPercent), color: '#06b6d4', label: 'Infraction sur durée' },
                                                                { value: parseFloat(nightPercent), color: '#10b981', label: 'SPEED' }
                                                            ];
                                                            
                                                            return data.map((item, idx) => {
                                                                const angle = (item.value / 100) * 360;
                                                                const startAngle = currentAngle;
                                                                currentAngle += angle;
                                                                
                                                                const startRad = (startAngle * Math.PI) / 180;
                                                                const endRad = (currentAngle * Math.PI) / 180;
                                                                
                                                                const x1 = 50 + 40 * Math.cos(startRad);
                                                                const y1 = 50 + 40 * Math.sin(startRad);
                                                                const x2 = 50 + 40 * Math.cos(endRad);
                                                                const y2 = 50 + 40 * Math.sin(endRad);
                                                                
                                                                const largeArc = angle > 180 ? 1 : 0;
                                                                
                                                                return (
                                                                    <path
                                                                        key={idx}
                                                                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                        fill={item.color}
                                                                        stroke="white"
                                                                        strokeWidth="0.5"
                                                                    />
                                                                );
                                                            });
                                                        })()}
                                                        <circle cx="50" cy="50" r="25" fill="white" />
                                                    </svg>
                                                    {/* Percentages */}
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        <div className="text-xs font-semibold">{speedPercent}%</div>
                                                    </div>
                                                </div>
                                                
                                                {/* Légende */}
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                            <span>Conduite de nuit</span>
                                                        </div>
                                                        <span className="font-semibold">{nightPercent}%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                                            <span>Infraction sur durée de...</span>
                                                        </div>
                                                        <span className="font-semibold">{durationPercent}%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                            <span>SPEED</span>
                                                        </div>
                                                        <span className="font-semibold">{speedPercent}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>

                           
                        </div>
                    </CardContent>
                </Card>

                {/* Graphiques et tableaux */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Vue d'ensemble
                        </TabsTrigger>
                        <TabsTrigger value="ranking" className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Classement
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Top 10 des distances */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Top 5 des distances parcourues
                                    </CardTitle>
                                    <CardDescription>
                                        Classement des véhicules par distance parcourue
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {topVehiclesByDistance.map((vehicle, index) => (
                                            <div key={vehicle.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {vehicle.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-500">
                                                            {vehicle.plate}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-gray-900 dark:text-white">
                                                        {vehicle.distance.toLocaleString()} km
                                                    </div>
                                                    <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                                                        {vehicle.status === 'active' ? 'Actif' : 
                                                         vehicle.status === 'maintenance' ? 'Maintenance' : 'À l\'arrêt'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tendance des vitesses */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Gauge className="h-5 w-5" />
                                        Tendance des vitesses maximales
                                    </CardTitle>
                                    <CardDescription>
                                        Évolution des vitesses maximales atteintes par heure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {speedTrendData.map((data) => (
                                            <div key={data.hour} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {data.hour}
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {data.maxSpeed} km/h
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                                                    <div 
                                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                                        style={{ width: `${(data.maxSpeed / 120) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="ranking" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Classement détaillé</CardTitle>
                                <CardDescription>
                                    Analyse complète des performances par véhicule
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-800">
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Position</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Véhicule</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Distance (km)</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Temps actif</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Vitesse max</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topVehiclesByDistance.map((vehicle, index) => (
                                                <tr key={vehicle.id} className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="px-4 py-3">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-gray-900 dark:text-white">{vehicle.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-500">{vehicle.plate}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-bold text-gray-900 dark:text-white">
                                                            {vehicle.distance.toLocaleString()} km
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-gray-500" />
                                                            <span className="text-gray-700 dark:text-gray-300">
                                                                {Math.floor(Math.random() * 24)}h {Math.floor(Math.random() * 60)}min
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Gauge className="h-4 w-4 text-green-500" />
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {Math.floor(Math.random() * 60) + 60} km/h
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge 
                                                            variant={vehicle.status === 'active' ? 'default' : 'secondary'}
                                                            className={vehicle.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                                     vehicle.status === 'maintenance' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                                                     'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}
                                                        >
                                                            {vehicle.status === 'active' ? 'Actif' : 
                                                             vehicle.status === 'maintenance' ? 'Maintenance' : 'À l\'arrêt'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Fuel className="h-5 w-5" />
                                        Consommation moyenne
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                            8.2 L/100km
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            Moyenne de la flotte sur la période sélectionnée
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Temps d'utilisation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                            78%
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            Taux d'utilisation moyen des véhicules
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
              
                {/* Carte de la flotte */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Localisation en temps réel
                                </CardTitle>
                                <CardDescription>
                                    {selectedVehicleIds.length} véhicule{selectedVehicleIds.length > 1 ? 's' : ''} affiché{selectedVehicleIds.length > 1 ? 's' : ''} sur {stats.totalVehicles}
                                </CardDescription>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectActiveOnly}
                                    className="flex items-center gap-2"
                                >
                                    <Activity className="h-4 w-4" />
                                    Actifs seulement
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    className="flex items-center gap-2"
                                >
                                    <Car className="h-4 w-4" />
                                    Tout afficher
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeselectAll}
                                    disabled={selectedVehicleIds.length === 0}
                                >
                                    Tout masquer
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Sélection des véhicules avec recherche */}
                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou plaque..."
                                    value={vehicleSearchQuery}
                                    onChange={(e) => setVehicleSearchQuery(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                {vehicleSearchQuery && (
                                    <button
                                        onClick={() => setVehicleSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            
                            <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800">
                                {filteredVehicles.length > 0 ? (
                                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {filteredVehicles.map((vehicle) => (
                                            <label
                                                key={vehicle.id}
                                                className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedVehicleIds.includes(vehicle.id)}
                                                    onChange={() => handleToggleVehicle(vehicle.id)}
                                                    className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                                />
                                                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                                                    <span className="font-medium text-gray-900 dark:text-white shrink-0">
                                                        {vehicle.plate}
                                                    </span>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                        {vehicle.name}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs shrink-0 ${
                                                            vehicle.status === 'active'
                                                                ? 'border-green-500 text-green-600 dark:text-green-400'
                                                                : vehicle.status === 'maintenance'
                                                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                                                : 'border-gray-500 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        {vehicle.status === 'active' ? 'Actif' :
                                                         vehicle.status === 'maintenance' ? 'Maint.' : 'À l\'arrêt'}
                                                    </Badge>
                                                    {vehicle.speed !== undefined && vehicle.speed > 0 && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-auto">
                                                            <Gauge className="h-3 w-3" />
                                                            <span>{vehicle.speed} km/h</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        <Car className="mx-auto h-12 w-12 opacity-50" />
                                        <p className="mt-2 text-sm">
                                            {vehicleSearchQuery ? 'Aucun véhicule trouvé' : 'Aucun véhicule disponible'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Carte avec lazy loading */}
                        
                        <Suspense fallback={
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Chargement de la carte...</p>
                            </div>
                        }>
                            <VehicleMap 
                                vehicles={displayedVehicles.map(v => ({
                                    ...v,
                                    status: v.status === 'unknown' ? 'inactive' : v.status
                                }))} 
                            />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}