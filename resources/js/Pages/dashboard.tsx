import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
  Globe,
  User,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
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

interface VehicleEventDetail {
    id: number;
    vehicle: string;
    plate_number: string;
    reference: string;
    driver: string;
    event_time: string;
    event_name: string;
    event_type: string;
    speed: number;
    position: {
        latitude: number | null;
        longitude: number | null;
    };
    address: string;
    poi_name: string;
    is_poi: boolean;
    initiator: string | null;
    additional_info: string | null;
    comment: string | null;
    creation_date: string;
}

interface VehicleEventData {
    success: boolean;
    events: VehicleEventDetail[];
    events_by_type: Record<string, VehicleEventDetail[]>;
    events_by_name: Record<string, VehicleEventDetail[]>;
    events_by_vehicle: Record<string, {
        vehicle: string;
        plate_number: string;
        events: VehicleEventDetail[];
    }>;
    events_by_date: Record<string, VehicleEventDetail[]>;
    stats: {
        total_events: number;
        events_by_type: Record<string, number>;
        events_by_name: Record<string, number>;
        events_by_vehicle: Record<string, number>;
        unique_vehicles: number;
        date_range: {
            start: string | null;
            end: string | null;
        };
    };
    raw_total: number;
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
    event_data?: VehicleEventData; // Optionnel car peut ne pas être passé
}

export default function Dashboard({ eco_data: initialEcoData, event_data: initialEventData }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
    const [reports, setReports] = useState<Report[]>([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [totalReports, setTotalReports] = useState(0);
    
    // États pour les données actualisables
    const [ecoData, setEcoData] = useState<EcoDrivingData>(initialEcoData);
    const [eventData, setEventData] = useState<VehicleEventData | undefined>(initialEventData);
    
    // États pour le tableau d'événements
    const [eventsSearchQuery, setEventsSearchQuery] = useState('');
    const [eventsCurrentPage, setEventsCurrentPage] = useState(1);
    const eventsItemsPerPage = 5;

    // Récupérer les véhicules depuis l'API
    const { vehicles: apiVehicles, loading: vehiclesLoading, refetch: refetchVehicles } = useVehicles();
    
    // Fonction pour calculer les dates selon la période sélectionnée
    const getDateRangeFromPeriod = (period: string) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate = new Date(today);
        let endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        
        switch (period) {
            case 'today':
                startDate = new Date(today);
                break;
            case 'yesterday':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 1);
                endDate = new Date(today);
                endDate.setDate(today.getDate() - 1);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'week':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 30);
                break;
            case 'quarter':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 90);
                break;
            case 'year':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 365);
                break;
            case 'custom':
                return { startDate: dateRange.from, endDate: dateRange.to };
            default:
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
        }
        
        return { startDate, endDate };
    };
    
    // Fonction pour rafraîchir les données depuis les endpoints
    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            const { startDate, endDate } = getDateRangeFromPeriod(selectedPeriod);
            
            // Formater les dates pour l'API (YYYY-MM-DD)
            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            
            const startDateStr = formatDate(startDate);
            const endDateStr = formatDate(endDate);
            
            // Appel parallèle aux deux endpoints
            const [ecoResponse, eventResponse] = await Promise.all([
                fetch(`/api/getDailyVehicleEcoSummary?start_date=${startDateStr}&end_date=${endDateStr}`),
                fetch(`/api/getEventHistoryReport?start_date=${startDateStr}&end_date=${endDateStr}`)
            ]);
            
            if (ecoResponse.ok) {
                const ecoDataResult = await ecoResponse.json();
                setEcoData(ecoDataResult);
            }
            
            if (eventResponse.ok) {
                const eventDataResult = await eventResponse.json();
                setEventData(eventDataResult);
            }
        } catch (error) {
            console.error('Erreur lors du rafraîchissement des données:', error);
        } finally {
            setIsRefreshing(false);
        }
    };
    
    // Rafraîchir les données quand la période change
    useEffect(() => {
        refreshData();
    }, [selectedPeriod]);
    
    // Rafraîchir les données quand la plage de dates personnalisée change
    useEffect(() => {
        if (selectedPeriod === 'custom') {
            refreshData();
        }
    }, [dateRange]);
    
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

    // console.log(apiVehicles);
    
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

    // Générer l'URL du rapport avec les paramètres de date
    const getReportUrl = (reportId: number) => {
        const { startDate, endDate } = getDateRangeFromPeriod(selectedPeriod);
        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);
        return `/reports/${reportId}?start_date=${startDateStr}&end_date=${endDateStr}`;
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

    // ecoData contient toutes les données TARGA TELEMATICS
    // console.log(ecoData.total_vehicles);
    
    // Vérifier si eventData existe avant d'accéder à ses propriétés
    /* if (eventData && eventData.events) {
        console.log('Events:', eventData.events);
        console.log('Total événements:', eventData.stats.total_events);
    } else {
        console.log('Aucune donnée d\'événements disponible');
    } */

    /* if (vehicles.length) {
        console.log('Vehicles:', vehicles);
    } else {
        console.log('Aucune donnée de véhicules disponible');
    } */

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Tracking Analytics" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4 pt-2 bg-gray-100 dark:bg-gray-900">
                {/* En-tête du Dashboard */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Tableau de bord - {auth.user.account_name || auth.user.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Vue d'ensemble des activités de votre flotte
                        </p>
                    </div>
                    
                    <div className="flex items-center">
                        {auth.user.account_logo ? (
                            <img 
                                src={`/storage/${auth.user.account_logo}`} 
                                alt={auth.user.account_name || auth.user.name}
                                className="h-16 w-16 rounded-lg object-cover shadow-md"
                            />
                        ) : (
                            <Building2 className="h-16 w-16 text-gray-400" />
                        )}
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
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Filtres</span>
                        </div>
                        
                        <div className="flex w-full flex-wrap items-center gap-4 lg:w-auto">
                            <div className="flex-1 lg:flex-none">
                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod} disabled={isRefreshing}>
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
                                        if (!date) return;
                                        setDateRange({
                                        from: (date as any).from ?? (date as any).start ?? (date as any).startDate,
                                        to:   (date as any).to   ?? (date as any).end   ?? (date as any).endDate,
                                        });
                                    }}
                                    />
                                </div>
                            )}
                            
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={refreshData}
                                disabled={isRefreshing}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
                            </Button>
                        </div>
                    </div>
                </div>

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
                                                onClick={() => window.location.href = getReportUrl(driverReport.id)}
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
                    <CardContent className="space-y-4">
                        {/* Graphiques */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Répartition des infractions par véhicule (%) */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Répartition des infractions par véhicule (%)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {(() => {
                                        // Safety check for vehicle_details
                                        if (!ecoData?.vehicle_details || ecoData.vehicle_details.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                        }

                                        const totalViolations = ecoData.vehicle_details.reduce((sum, v) => sum + (v.total_violations || 0), 0);
                                        const topViolators = ecoData.vehicle_details
                                            .filter(v => (v.total_violations || 0) > 0)
                                            .sort((a, b) => (b.total_violations || 0) - (a.total_violations || 0))
                                            .slice(0, 6);
                                        
                                        if (totalViolations === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                        }

                                        const colors = ['#1e3a5f', '#8B4513', '#d946ef', '#f59e0b', '#10b981', '#ef4444'];
                                        
                                        // Calculer le total des 6 premiers
                                        const topViolationsSum = topViolators.reduce((sum, v) => sum + (v.total_violations || 0), 0);
                                        const othersViolations = totalViolations - topViolationsSum;
                                        const othersPercentage = (othersViolations / totalViolations) * 100;
        
                                        return (
                                            <div className="flex flex-col items-center gap-1">
                                                {/* Donut chart */}
                                                <div className="relative w-64 h-64">
                                                    <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                                        {(() => {
                                                            let currentAngle = 0;
                                                            const segments = [];
                                                            
                                                            // Ajouter les 6 premiers véhicules
                                                            topViolators.forEach((vehicle, idx) => {
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
                                                                
                                                                segments.push(
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
                                                            
                                                            // Ajouter la portion "Autres" en gris si nécessaire
                                                            if (othersViolations > 0) {
                                                                const percentage = othersViolations / totalViolations;
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
                                                                
                                                                segments.push(
                                                                    <path
                                                                        key="others"
                                                                        d={`M 100 100 L ${x1} ${y1} A 75 75 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                        fill="#9ca3af"
                                                                        stroke="white"
                                                                        strokeWidth="2"
                                                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                                                    />
                                                                );
                                                            }
                                                            
                                                            return segments;
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
                                                    {othersViolations > 0 && (
                                                        <div className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-gray-50">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: '#9ca3af' }}></div>
                                                                <span className="font-medium truncate">Autres</span>
                                                            </div>
                                                            <div className="flex flex-col items-end text-right flex-shrink-0">
                                                                <span className="font-bold text-gray-800">{othersPercentage.toFixed(1)}%</span>
                                                                <span className="text-gray-500 text-[10px]">({othersViolations})</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>

                            {/* Nombre d'infractions par véhicules */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Nombre d'infractions par véhicules</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {(() => {
                                        // Safety check for vehicle_details
                                        if (!ecoData?.vehicle_details || ecoData.vehicle_details.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                        }

                                        // Récupérer le top 10 des véhicules avec le plus de violations
                                        const topViolators = ecoData.vehicle_details
                                            .filter((v: VehicleDriverDetail) => (v.total_violations || 0) > 0)
                                            .sort((a: VehicleDriverDetail, b: VehicleDriverDetail) => 
                                                (b.total_violations || 0) - (a.total_violations || 0)
                                            )
                                            .slice(0, 10);
                                        
                                        if (topViolators.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                        }
                                        
                                        // Valeur maximale pour l'échelle
                                        const maxViolations = Math.max(...topViolators.map((v: VehicleDriverDetail) => v.total_violations || 0));
                                        
                                        // Couleur unique pour toutes les barres
                                        const barColor = '#f59e0b'; // Bleu foncé uniforme
                                        
                                        return (
                                            <div className="space-y-3">
                                                {/* Graphique à bandes verticales avec axe Y */}
                                                <div className="flex gap-2">
                                                    {/* Axe Y avec graduations */}
                                                    <div className="flex flex-col justify-between text-[9px] text-gray-500 font-medium" style={{ height: '160px' }}>
                                                        <span>{maxViolations}</span>
                                                        <span>{Math.round(maxViolations * 0.75)}</span>
                                                        <span>{Math.round(maxViolations * 0.5)}</span>
                                                        <span>{Math.round(maxViolations * 0.25)}</span>
                                                        <span>0</span>
                                                    </div>
                                                    
                                                    {/* Graphique */}
                                                    <div className="flex-1 flex justify-between gap-1 border-l border-b border-gray-200 pl-2 pb-6 relative" style={{ height: '230px' }}>
                                                        {topViolators.map((vehicle, idx) => {
                                                            const violations = vehicle.total_violations || 0;
                                                            // Hauteur max disponible pour les barres (160px - 30px pour les labels)
                                                            const maxHeight = 200;
                                                            const barHeight = (violations / maxViolations) * maxHeight;
                                                            
                                                            return (
                                                                <div key={idx} className="flex-1 flex flex-col items-center justify-end relative">
                                                                    {/* Nombre de violations au-dessus de la barre */}
                                                                    <div className="absolute text-[10px] font-bold text-gray-700" style={{ bottom: `${barHeight + 5}px` }}>
                                                                        {violations}
                                                                    </div>
                                                                    {/* Barre verticale */}
                                                                    <div 
                                                                        className="w-full rounded-t-md hover:opacity-80 hover:shadow-lg transition-all cursor-pointer relative group"
                                                                        style={{ 
                                                                            height: `${Math.max(barHeight, 4)}px`,
                                                                            backgroundColor: barColor
                                                                        }}
                                                                        title={`${vehicle.immatriculation}: ${violations} infractions`}
                                                                    >
                                                                        {/* Tooltip hover */}
                                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg">
                                                                            <div className="font-semibold">{vehicle.immatriculation}</div>
                                                                            <div className="text-gray-300">{violations} infraction{violations > 1 ? 's' : ''}</div>
                                                                        </div>
                                                                    </div>
                                                                    {/* Numéro de rang */}
                                                                    <div className="absolute text-[9px] font-medium text-gray-500" style={{ bottom: '-20px' }}>
                                                                        #{idx + 1}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                
                                                {/* Légende avec les 10 premiers véhicules */}
                                                <div className="border-t border-gray-200 pt-3 space-y-1.5">
                                                    <div className="text-[10px] font-semibold text-gray-600 mb-2">TOP 10 VÉHICULES</div>
                                                    {topViolators.slice(0, 10).map((vehicle, idx) => {
                                                        const violations = vehicle.total_violations || 0;
                                                        
                                                        return (
                                                            <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                    <div 
                                                                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0" 
                                                                        style={{ backgroundColor: barColor }}
                                                                    ></div>
                                                                    <span className="font-medium truncate" title={vehicle.immatriculation}>
                                                                        {vehicle.immatriculation}
                                                                    </span>
                                                                </div>
                                                                <span className="font-bold text-gray-800 flex-shrink-0">
                                                                    {violations}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

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
                                                onClick={() => window.location.href = getReportUrl(ecoReport.id)}
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
                    <CardContent className="space-y-4">
                        {/* Graphiques */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Répartition des freinages brusques par véhicule (%) */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Répartition des freinages brusques par véhicule (%)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {(() => {
                                        // Safety check for vehicle_details
                                        if (!ecoData?.vehicle_details || ecoData.vehicle_details.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucun freinage brusque</div>;
                                        }
                                        
                                        // Calculer le total des freinages brusques
                                        const totalHarshBraking = ecoData.vehicle_details.reduce((sum, v) => sum + (v.harsh_braking || 0), 0);
                                        
                                        // Récupérer les 5 véhicules avec le plus de freinages brusques
                                        const topVehicles = ecoData.vehicle_details
                                            .filter(v => (v.harsh_braking || 0) > 0)
                                            .sort((a, b) => (b.harsh_braking || 0) - (a.harsh_braking || 0))
                                            .slice(0, 5);
                                        
                                        if (totalHarshBraking === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucun freinage brusque</div>;
                                        }

                                        // Couleurs distinctes pour chaque véhicule
                                        const colors = ['#1e3a5f', '#8B4513', '#d946ef', '#f59e0b', '#10b981'];
                                        
                                        return (
                                            <div className="flex flex-col items-center gap-4">
                                                {/* Pie Chart avec tooltips */}
                                                <div className="relative w-56 h-56">
                                                    <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                                        {(() => {
                                                            let currentAngle = 0;
                                                            return topVehicles.map((vehicle, idx) => {
                                                                const harshBraking = vehicle.harsh_braking || 0;
                                                                const percentage = harshBraking / totalHarshBraking;
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
                                                                const percentDisplay = (percentage * 100).toFixed(1);
                                                                
                                                                return (
                                                                    <g key={idx}>
                                                                        <title>{`${vehicle.immatriculation}: ${harshBraking} freinages brusques (${percentDisplay}%)`}</title>
                                                                        <path
                                                                            d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                            fill={colors[idx]}
                                                                            stroke="white"
                                                                            strokeWidth="2"
                                                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                                                        />
                                                                    </g>
                                                                );
                                                            });
                                                        })()}
                                                    </svg>
                                                    {/* Centre avec total */}
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <div className="text-2xl font-bold text-gray-800">{totalHarshBraking}</div>
                                                        <div className="text-xs text-gray-500">Total</div>
                                                    </div>
                                                </div>
                                                
                                                {/* Légende améliorée */}
                                                <div className="grid grid-cols-1 gap-2 w-full text-xs">
                                                    {topVehicles.map((vehicle, idx) => {
                                                        const harshBraking = vehicle.harsh_braking || 0;
                                                        const percentage = ((harshBraking / totalHarshBraking) * 100).toFixed(1);
                                                        return (
                                                            <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-gray-50 transition-colors">
                                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[idx] }}></div>
                                                                    <span className="font-medium truncate" title={vehicle.immatriculation}>
                                                                        {vehicle.immatriculation}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <span className="font-bold text-gray-800">{percentage}%</span>
                                                                    <span className="text-gray-500">({harshBraking})</span>
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

                            {/* Véhicules avec les vitesses maximales */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Véhicules avec les vitesses maximales (Km/h)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {(() => {
                                        // Safety check for vehicle_details
                                        if (!ecoData?.vehicle_details || ecoData.vehicle_details.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucun véhicule</div>;
                                        }
                                        const speedViolators = ecoData.vehicle_details
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
                                                onClick={() => window.location.href = getReportUrl(geoReport.id)}
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
                    <CardContent className="space-y-4">
                        {/* Graphiques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Nombre de véhicules par Type d'événement */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Alertes par Type d'événement</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {(() => {
                                        // Safety check for event_data
                                        if (!eventData?.events_by_name || !eventData?.stats?.events_by_name) {
                                            return <div className="text-center text-gray-500 py-8">Aucune donnée d'événements disponible</div>;
                                        }
                                        
                                        // Fonction pour traduire les noms d'événements
                                        const getEventDisplayName = (eventName: string): string => {
                                            if (eventName === '2HS_Between 20h and 04h') {
                                                return 'Conduite de nuit';
                                            }
                                            if (eventName === 'SPEED') {
                                                return 'Vitesse';
                                            }
                                            return eventName;
                                        };
                                        
                                        // Récupérer les événements groupés par nom
                                        const eventsByName = eventData.stats.events_by_name;
                                        const totalEvents = eventData.stats.total_events;
                                        
                                        if (totalEvents === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucun événement trouvé</div>;
                                        }
                                        
                                        // Prendre les 5 premiers types d'événements les plus fréquents
                                        const topEvents = Object.entries(eventsByName)
                                            .sort((a, b) => b[1] - a[1])
                                            .slice(0, 5);
                                        
                                        const colors = ['#ef4444', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];
                                        
                                        return (
                                            <div>
                                                {/* Donut chart */}
                                                <div className="relative w-48 h-48 mx-auto mb-4">
                                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                                        {(() => {
                                                            let currentAngle = 0;
                                                            return topEvents.map(([eventName, count], idx) => {
                                                                const percentage = (count / totalEvents) * 100;
                                                                const angle = (percentage / 100) * 360;
                                                                const startAngle = currentAngle;
                                                                currentAngle += angle;
                                                                
                                                                const startRad = (startAngle * Math.PI) / 180;
                                                                const endRad = (currentAngle * Math.PI) / 180;
                                                                
                                                                const x1 = 50 + 40 * Math.cos(startRad);
                                                                const y1 = 50 + 40 * Math.sin(startRad);
                                                                const x2 = 50 + 40 * Math.cos(endRad);
                                                                const y2 = 50 + 40 * Math.sin(endRad);
                                                                
                                                                const largeArc = angle > 180 ? 1 : 0;
                                                                const displayName = getEventDisplayName(eventName);
                                                                
                                                                return (
                                                                    <g key={idx}>
                                                                        <title>{`${displayName}: ${count} (${percentage.toFixed(1)}%)`}</title>
                                                                        <path
                                                                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                            fill={colors[idx]}
                                                                            stroke="white"
                                                                            strokeWidth="0.5"
                                                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                                                        />
                                                                    </g>
                                                                );
                                                            });
                                                        })()}
                                                        <circle cx="50" cy="50" r="25" fill="white" />
                                                    </svg>
                                                    {/* Total au centre */}
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                                        <div className="text-xl font-bold text-gray-800">{totalEvents}</div>
                                                        <div className="text-xs text-gray-500">Total</div>
                                                    </div>
                                                </div>
                                                
                                                {/* Légende */}
                                                <div className="space-y-2 text-xs">
                                                    {topEvents.map(([eventName, count], idx) => {
                                                        const percentage = ((count / totalEvents) * 100).toFixed(1);
                                                        const displayName = getEventDisplayName(eventName);
                                                        return (
                                                            <div key={idx} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                    <div 
                                                                        className="w-3 h-3 rounded-full flex-shrink-0" 
                                                                        style={{ backgroundColor: colors[idx] }}
                                                                    ></div>
                                                                    <span className="truncate" title={displayName}>
                                                                        {displayName.length > 20 ? displayName.substring(0, 20) + '...' : displayName}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                                    <span className="font-semibold">{percentage}%</span>
                                                                    <span className="text-gray-500">({count})</span>
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

                            {/* Tableau de détail des évènements */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 md:col-span-2">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Tableau de détail des évènements</CardTitle>
                                        <Badge variant="outline" className="text-xs">
                                            {eventData?.stats?.total_events || 0} événements
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {(() => {
                                        // Safety check for event_data
                                        if (!eventData?.events || eventData.events.length === 0) {
                                            return <div className="text-center text-gray-500 py-8">Aucun événement disponible</div>;
                                        }
                                        
                                        // Filtrer les événements selon la recherche
                                        const filteredEvents = eventData.events.filter(event => {
                                            if (!eventsSearchQuery.trim()) return true;
                                            const query = eventsSearchQuery.toLowerCase();
                                            return (
                                                event.vehicle?.toLowerCase().includes(query) ||
                                                event.driver?.toLowerCase().includes(query) ||
                                                event.event_type?.toLowerCase().includes(query) ||
                                                event.address?.toLowerCase().includes(query)
                                            );
                                        });
                                        
                                        // Calculer la pagination
                                        const totalPages = Math.ceil(filteredEvents.length / eventsItemsPerPage);
                                        const startIndex = (eventsCurrentPage - 1) * eventsItemsPerPage;
                                        const endIndex = startIndex + eventsItemsPerPage;
                                        const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
                                        
                                        return (
                                            <div className="space-y-4">
                                                {/* Barre de recherche */}
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Rechercher par véhicule, conducteur, type ou adresse..."
                                                        value={eventsSearchQuery}
                                                        onChange={(e) => {
                                                            setEventsSearchQuery(e.target.value);
                                                            setEventsCurrentPage(1);
                                                        }}
                                                        className="pl-9 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                
                                                {/* Tableau */}
                                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        Véhicule
                                                                    </th>
                                                                    <th className="px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        Conducteur
                                                                    </th>
                                                                    <th className="px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        Nom de l'événement
                                                                    </th>
                                                                    <th className="px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        Vitesse
                                                                    </th>
                                                                    <th className="px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        Adresse
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {paginatedEvents.length > 0 ? (
                                                                    paginatedEvents.map((event, idx) => (
                                                                        <tr key={event.id || idx} className="hover:bg-gray-50 transition-colors">
                                                                            <td className="px-4 py-2 whitespace-nowrap">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Car className="h-4 w-4 text-gray-400" />
                                                                                    <div>
                                                                                        <div className="text-sm font-medium text-gray-900">
                                                                                            {event.vehicle || 'N/A'}
                                                                                        </div>
                                                                                        <div className="text-xs text-gray-500">
                                                                                            {event.plate_number || ''}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-4 py-2 whitespace-nowrap">
                                                                                <div className="flex items-center gap-2">
                                                                                    <User className="h-4 w-4 text-gray-400" />
                                                                                    <span className="text-sm text-gray-900">
                                                                                        {event.driver || 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-4 py-2 whitespace-nowrap">
                                                                                <span className="text-sm text-gray-700">
                                                                                    {(() => {
                                                                                        const eventName = event.event_name || 'N/A';
                                                                                        if (eventName === '2HS_Between 20h and 04h') {
                                                                                            return 'Conduite de nuit';
                                                                                        }
                                                                                        if (eventName === 'SPEED') {
                                                                                            return 'Vitesse';
                                                                                        }
                                                                                        return eventName;
                                                                                    })()}
                                                                                </span>
                                                                            </td>
                                                                            
                                                                            <td className="px-4 py-2 whitespace-nowrap">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Gauge className="h-4 w-4 text-gray-400" />
                                                                                    <span className="text-sm font-semibold text-gray-900">
                                                                                        {event.speed || 0}
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">km/h</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-4 py-2">
                                                                                <div className="flex items-start gap-2 max-w-xs">
                                                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                                    <span className="text-xs text-gray-600 line-clamp-2">
                                                                                        {event.address || 'Adresse inconnue'}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                                            Aucun événement trouvé
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                
                                                {/* Pagination */}
                                                {totalPages > 1 && (
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-gray-600">
                                                            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredEvents.length)} sur {filteredEvents.length} événements
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setEventsCurrentPage(prev => Math.max(1, prev - 1))}
                                                                disabled={eventsCurrentPage === 1}
                                                                className="h-9 w-9 p-0"
                                                            >
                                                                <ChevronLeft className="h-4 w-4" />
                                                            </Button>
                                                            
                                                            <div className="flex items-center gap-1">
                                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                                                                    if (
                                                                        pageNum === 1 ||
                                                                        pageNum === totalPages ||
                                                                        (pageNum >= eventsCurrentPage - 1 && pageNum <= eventsCurrentPage + 1)
                                                                    ) {
                                                                        return (
                                                                            <Button
                                                                                key={pageNum}
                                                                                variant={eventsCurrentPage === pageNum ? "default" : "outline"}
                                                                                size="sm"
                                                                                onClick={() => setEventsCurrentPage(pageNum)}
                                                                                className={`h-9 w-9 p-0 ${
                                                                                    eventsCurrentPage === pageNum 
                                                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                                                                                        : ''
                                                                                }`}
                                                                            >
                                                                                {pageNum}
                                                                            </Button>
                                                                        );
                                                                    } else if (
                                                                        pageNum === eventsCurrentPage - 2 ||
                                                                        pageNum === eventsCurrentPage + 2
                                                                    ) {
                                                                        return <span key={pageNum} className="px-1">...</span>;
                                                                    }
                                                                    return null;
                                                                })}
                                                            </div>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setEventsCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                                disabled={eventsCurrentPage === totalPages}
                                                                className="h-9 w-9 p-0"
                                                            >
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>

                        </div>
                    </CardContent>
                </Card>

                 {/* Top 5 des distances */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                    Top 5 des distances parcourues
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Classement des véhicules par distance parcourue
                                </CardDescription>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <Activity className="h-5 w-5 text-green-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {topVehiclesByDistance.filter(v => v.status === 'active').length} actifs
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2.5">
                            {topVehiclesByDistance.map((vehicle, index) => (
                                <div 
                                    key={vehicle.id} 
                                    className="group flex items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-r from-white to-gray-50/50 p-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Position badge with gradient */}
                                        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                                            <span className="text-sm font-bold text-white">
                                                #{index + 1}
                                            </span>
                                            {index === 0 && (
                                                <div className="absolute -top-0.5 -right-0.5">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse"></div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Vehicle info */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {vehicle.name}
                                                </span>
                                                {vehicle.status === 'active' && (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30">
                                                        <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></div>
                                                        <span className="text-[10px] font-medium text-green-700 dark:text-green-400">En mouvement</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Car className="h-3 w-3 text-gray-400" />
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {vehicle.plate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Distance and status */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                                {vehicle.distance.toLocaleString()}
                                            </div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                                kilomètres
                                            </div>
                                        </div>
                                        
                                        <Badge 
                                            variant={vehicle.status === 'active' ? 'default' : 'secondary'} 
                                            className={`px-2 py-0.5 text-xs ${
                                                vehicle.status === 'active' 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                                                    : vehicle.status === 'maintenance' 
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            {vehicle.status === 'active' ? 'Actif' : 
                                                vehicle.status === 'maintenance' ? 'Maintenance' : 'À l\'arrêt'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
              
                {/* Carte de la flotte */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Dernière position des véhicules
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
                    <CardContent>
                        <div className="flex gap-4">
                            {/* Sélection des véhicules avec recherche - 25% */}
                            <div className="w-1/4 space-y-3">
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
                                
                                <div className="h-[550px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800">
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
                            
                            {/* Carte avec lazy loading - 75% */}
                            <div className="w-3/4">
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
                                        height="600px"
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}