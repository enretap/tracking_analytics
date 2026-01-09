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
  FileKey,
  DollarSign,
  CheckCircle,
  Columns2,
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
import { useVehicles } from '@/hooks/useVehicles';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

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
    address: string;
    speed?: number;
    lastUpdate: string;
    active: boolean;
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

const mockVehicles : Vehicle[]  = [];

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
    total_vehicles?: number;
    active_vehicles?: number;
    inactive_vehicles?: number;
    total_distance?: number;
    total_drivers?: number;
    active_drivers?: number;
    average_driver_score?: number;
    total_trips?: number;
    average_trip_distance?: number;
    operating_hours?: number;
    total_fuel_consumption?: number;
    average_fuel_efficiency?: number;
    fuel_cost?: number;
    scheduled_maintenances?: number;
    completed_maintenances?: number;
    pending_maintenances?: number;
    maintenance_cost?: number;
    total_alerts?: number;
    critical_alerts?: number;
    resolved_alerts?: number;
    compliance_rate?: number;
    on_time_delivery?: number;
    period_start?: string;
    period_end?: string;
    vehicle_details?: VehicleDriverDetail[];
}

interface Props {
    eco_data: EcoDrivingData;
    event_data?: VehicleEventData;
}

export default function LeasingDashboard({ eco_data, event_data }: Props) {
    const { auth } = usePage<SharedData>().props;
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
    
    const vehicles = apiVehicles.length > 0 ? apiVehicles : mockVehicles;
    
    const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [visibleColumns, setVisibleColumns] = useState({
        plate: true,
        brand: true,
        model: true,
        distance: true,
        position: true,
        lastUpdate: true,
        status: true,
    });
    
    useEffect(() => {
        if (vehicles.length > 0 && selectedVehicleIds.length === 0) {
            const activeIds = vehicles.filter(v => v.status === 'active').map(v => v.id);
            setSelectedVehicleIds(activeIds);
        }
    }, [vehicles]);
    
    const displayedVehicles = useMemo(
        () => vehicles.filter(v => selectedVehicleIds.includes(v.id)),
        [vehicles, selectedVehicleIds]
    );
    
    const stats = useMemo(() => {
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        
        return {
            totalVehicles: vehicles.length,
            activeVehicles: vehicles.filter(v => v.status === 'active').length,
            inactiveVehicles: vehicles.filter(v => v.status === 'inactive').length,
            maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
            outdatedVehicles: vehicles.filter(v => {
                const lastUpdate = new Date(v.lastUpdate);
                return lastUpdate < threeDaysAgo;
            }).length,
        };
    }, [vehicles]);
    
    const topVehiclesByDistance = useMemo(
        () => [...vehicles]
            .filter(v => v.distance > 0)
            .sort((a, b) => b.distance - a.distance)
            .slice(0, 5),
        [vehicles]
    );

    // Réinitialiser la page courante quand la recherche change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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
            <Head title="Tableau de bord Leasing - Tracking Analytics" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4 pt-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                {/* En-tête du Dashboard Leasing */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            <FileKey className="h-8 w-8 text-purple-600" />
                            <span>Tableau de bord Leasing - {auth.user.account_name || auth.user.name}</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestion et suivi de votre flotte
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
                </div>

                {/* KPI Cards Spécifiques Leasing */}
                {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:border-purple-700 dark:from-purple-900/20 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                Véhicules en leasing
                            </CardTitle>
                            <Car className="h-8 w-8 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalVehicles}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Contrats actifs
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-800 dark:from-green-900/20 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-green-600 dark:text-green-400">
                                Contrats conformes
                            </CardTitle>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.activeVehicles}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Aucun dépassement kilométrique
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:border-blue-700 dark:from-blue-800/30 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                Coûts mensuels
                            </CardTitle>
                            <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">45 250 €</div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                +2.5% vs mois précédent
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:border-orange-800 dark:from-orange-900/20 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                Maintenances planifiées
                            </CardTitle>
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.maintenanceVehicles}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Ce mois-ci
                            </p>
                        </CardContent>
                    </Card>
                </div> */}

                 {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

                    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white dark:border-red-800 dark:from-red-900/20 dark:to-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-red-600 dark:text-red-400">
                                Non actualisés (+3j)
                            </CardTitle>
                            <Clock className="h-8 w-8 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.outdatedVehicles}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Dernière actualisation &gt; 3 jours
                            </p>
                        </CardContent>
                    </Card>
                    
                </div>

                {/* Suivi des contrats de leasing */}
                {/* <Card className="border-purple-200">
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileKey className="h-5 w-5 text-purple-600" />
                                    Suivi des contrats de leasing
                                </CardTitle>
                                <CardDescription>
                                    État des kilométrages et échéances contractuelles
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-6 dark:border-purple-900/30 dark:bg-purple-900/10">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-medium">Contrats conformes</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">{stats.activeVehicles}</div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Kilométrage dans les limites
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                        <span className="text-sm font-medium">Alertes proximité</span>
                                    </div>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {Math.floor(stats.totalVehicles * 0.15)}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        À surveiller (80-95%)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <span className="text-sm font-medium">Dépassements</span>
                                    </div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {Math.floor(stats.totalVehicles * 0.05)}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Kilométrage dépassé
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Coûts et facturation */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Analyse des coûts
                        </CardTitle>
                        <CardDescription>
                            Répartition des coûts de leasing et frais associés
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-0 shadow-md">
                                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Répartition des coûts mensuels</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white p-4">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Loyers de leasing</span>
                                            <span className="font-bold">38 500 €</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded h-2">
                                            <div className="bg-purple-600 h-2 rounded" style={{ width: '85%' }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Entretien & Maintenance</span>
                                            <span className="font-bold">4 250 €</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded h-2">
                                            <div className="bg-blue-600 h-2 rounded" style={{ width: '9.4%' }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Assurances</span>
                                            <span className="font-bold">2 500 €</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded h-2">
                                            <div className="bg-green-600 h-2 rounded" style={{ width: '5.5%' }}></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-md">
                                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Échéances à venir</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                                            <div>
                                                <div className="font-medium">3 contrats</div>
                                                <div className="text-xs text-gray-600">Fin dans 30 jours</div>
                                            </div>
                                            <Badge variant="outline" className="border-orange-500 text-orange-600">
                                                Urgent
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                                            <div>
                                                <div className="font-medium">7 contrats</div>
                                                <div className="text-xs text-gray-600">Fin dans 90 jours</div>
                                            </div>
                                            <Badge variant="outline" className="border-blue-500 text-blue-600">
                                                À planifier
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                            <div>
                                                <div className="font-medium">12 contrats</div>
                                                <div className="text-xs text-gray-600">Fin dans 6 mois</div>
                                            </div>
                                            <Badge variant="outline" className="border-gray-500 text-gray-600">
                                                Normal
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Liste complète des véhicules en tableau */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Car className="h-5 w-5 text-purple-600" />
                                    Liste des véhicules
                                </CardTitle>
                                <CardDescription>
                                    {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''} au total
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Barre de recherche */}
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-9 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                {/* Sélecteur de colonnes */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-9 border-purple-200 hover:bg-purple-50">
                                            <Columns2 className="h-4 w-4 mr-2" />
                                            Colonnes
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>Colonnes visibles</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem
                                            checked={visibleColumns.plate}
                                            onCheckedChange={(checked) => 
                                                setVisibleColumns(prev => ({ ...prev, plate: checked }))
                                            }
                                        >
                                            Immatriculation
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={visibleColumns.brand}
                                            onCheckedChange={(checked) => 
                                                setVisibleColumns(prev => ({ ...prev, brand: checked }))
                                            }
                                        >
                                            Marque
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={visibleColumns.model}
                                            onCheckedChange={(checked) => 
                                                setVisibleColumns(prev => ({ ...prev, model: checked }))
                                            }
                                        >
                                            Modèle
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={visibleColumns.distance}
                                            onCheckedChange={(checked) => 
                                                setVisibleColumns(prev => ({ ...prev, distance: checked }))
                                            }
                                        >
                                            Distance
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={visibleColumns.position}
                                            onCheckedChange={(checked) => 
                                                setVisibleColumns(prev => ({ ...prev, position: checked }))
                                            }
                                        >
                                            Dernière position
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={visibleColumns.lastUpdate}
                                            onCheckedChange={(checked) => 
                                                setVisibleColumns(prev => ({ ...prev, lastUpdate: checked }))
                                            }
                                        >
                                            Dernière actualisation
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={visibleColumns.status}
                                            onCheckedChange={(checked) => 
                                                setVisibleColumns(prev => ({ ...prev, status: checked }))
                                            }
                                        >
                                            Statut
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-purple-100 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-full divide-y divide-purple-100">
                                    <thead className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
                                        <tr>
                                            {visibleColumns.plate && (
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                                                    Immatriculation
                                                </th>
                                            )}
                                            {visibleColumns.brand && (
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                                                    Marque
                                                </th>
                                            )}
                                            {visibleColumns.model && (
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                                                    Modèle
                                                </th>
                                            )}
                                            {visibleColumns.distance && (
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                                                    Distance
                                                </th>
                                            )}
                                            {visibleColumns.position && (
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                                                    Dernière position
                                                </th>
                                            )}
                                            {visibleColumns.lastUpdate && (
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                                                    Dernière actualisation
                                                </th>
                                            )}
                                            {visibleColumns.status && (
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                                                    Statut
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                        {(() => {
                                            // Filtrer les véhicules selon la recherche
                                            const filteredVehicles = vehicles.filter(vehicle => {
                                                if (!searchQuery.trim()) return true;
                                                const query = searchQuery.toLowerCase();
                                                return (
                                                    vehicle.plate?.toLowerCase().includes(query) ||
                                                    vehicle.name?.toLowerCase().includes(query) ||
                                                    vehicle.address?.toLowerCase().includes(query)
                                                );
                                            });

                                            // Calculer la pagination
                                            const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
                                            const startIndex = (currentPage - 1) * itemsPerPage;
                                            const endIndex = startIndex + itemsPerPage;
                                            const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

                                            if (filteredVehicles.length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan={7} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                                                                <Car className="h-16 w-16 opacity-30" />
                                                                <p className="text-sm font-medium">
                                                                    {searchQuery ? 'Aucun véhicule trouvé' : 'Aucun véhicule disponible'}
                                                                </p>
                                                                {searchQuery && (
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm"
                                                                        onClick={() => setSearchQuery('')}
                                                                        className="mt-2"
                                                                    >
                                                                        Réinitialiser la recherche
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return paginatedVehicles.map((vehicle, index) => {
                                                // Extraire marque et modèle du nom du véhicule
                                                const nameParts = vehicle.name.split(' ');
                                                const marque = nameParts[0] || '-';
                                                const modele = nameParts.slice(1).join(' ') || '-';
                                                
                                                // Récupérer l'adresse
                                                const position = vehicle.address || 'Adresse inconnue';
                                                
                                                // Formater la date
                                                const lastUpdate = new Date(vehicle.lastUpdate);
                                                const formattedDate = lastUpdate.toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                });
                                                const formattedTime = lastUpdate.toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                });
                                                
                                                return (
                                                    <tr 
                                                        key={vehicle.id}
                                                        className="group hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-200"
                                                    >
                                                        {visibleColumns.plate && (
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                                        <Car className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {vehicle.plate}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {visibleColumns.brand && (
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                                    {marque}
                                                                </span>
                                                            </td>
                                                        )}
                                                        {visibleColumns.model && (
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                    {modele}
                                                                </span>
                                                            </td>
                                                        )}
                                                        {visibleColumns.distance && (
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-sm font-bold text-purple-700 dark:text-purple-400">
                                                                        {vehicle.distance.toLocaleString()}
                                                                    </div>
                                                                    <span className="text-xs text-gray-500">km</span>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {visibleColumns.position && (
                                                            <td className="px-6 py-2">
                                                                <div className="flex items-start gap-2 max-w-xs">
                                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                        {position}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {visibleColumns.lastUpdate && (
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                        <div className="font-medium">{formattedDate}</div>
                                                                        <div className="text-[10px] text-gray-500">{formattedTime}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {visibleColumns.status && (
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                <Badge 
                                                                    variant="outline"
                                                                    className={`text-xs font-medium ${
                                                                        vehicle.status === 'active'
                                                                            ? 'border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                                                                            : vehicle.status === 'maintenance'
                                                                            ? 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                                                                            : 'border-gray-500 text-gray-700 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400'
                                                                    }`}
                                                                >
                                                                    {vehicle.status === 'active' ? '● Actif' :
                                                                     vehicle.status === 'maintenance' ? '● Maintenance' : '● À l\'arrêt'}
                                                                </Badge>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Résumé et pagination */}
                        <div className="mt-4 space-y-4">
                            {/* Résumé du tableau */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div>
                                    {(() => {
                                        const filteredVehicles = vehicles.filter(v => {
                                            if (!searchQuery.trim()) return true;
                                            const query = searchQuery.toLowerCase();
                                            return v.plate?.toLowerCase().includes(query) ||
                                                   v.name?.toLowerCase().includes(query) ||
                                                   v.address?.toLowerCase().includes(query);
                                        });
                                        const totalFiltered = filteredVehicles.length;
                                        const startIndex = (currentPage - 1) * itemsPerPage + 1;
                                        const endIndex = Math.min(currentPage * itemsPerPage, totalFiltered);
                                        
                                        if (totalFiltered === 0) {
                                            return <span>Aucun résultat</span>;
                                        }
                                        
                                        return (
                                            <span>
                                                Affichage de {startIndex} à {endIndex} sur {totalFiltered} véhicule{totalFiltered > 1 ? 's' : ''}
                                                {searchQuery && ' (filtré)'}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <div className="text-xs">
                                    {Object.values(visibleColumns).filter(Boolean).length} / 7 colonnes affichées
                                </div>
                            </div>

                            {/* Contrôles de pagination */}
                            {(() => {
                                const filteredVehicles = vehicles.filter(v => {
                                    if (!searchQuery.trim()) return true;
                                    const query = searchQuery.toLowerCase();
                                    return v.plate?.toLowerCase().includes(query) ||
                                           v.name?.toLowerCase().includes(query) ||
                                           v.address?.toLowerCase().includes(query);
                                });
                                const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
                                
                                if (totalPages <= 1) return null;

                                return (
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="h-9 w-9 p-0"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                                                // Afficher seulement quelques pages autour de la page courante
                                                if (
                                                    pageNum === 1 ||
                                                    pageNum === totalPages ||
                                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`h-9 w-9 p-0 ${
                                                                currentPage === pageNum 
                                                                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                                                                    : ''
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                } else if (
                                                    pageNum === currentPage - 2 ||
                                                    pageNum === currentPage + 2
                                                ) {
                                                    return <span key={pageNum} className="px-1">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-9 w-9 p-0"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })()}
                        </div>
                    </CardContent>
                </Card>

                {/* Top 5 des distances */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <MapPin className="h-6 w-6 text-purple-600" />
                                    Suivi kilométrique - Top 5
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Véhicules les plus utilisés ce mois
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2.5">
                            {topVehiclesByDistance.map((vehicle, index) => (
                                <div 
                                    key={vehicle.id} 
                                    className="group flex items-center justify-between rounded-lg border border-purple-200 bg-gradient-to-r from-white to-purple-50/50 p-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] dark:border-purple-700 dark:from-gray-800 dark:to-purple-800/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                                            <span className="text-sm font-bold text-white">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        
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
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
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
                                    <MapPin className="h-5 w-5 text-purple-600" />
                                    Dernière position des véhicules en leasing
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
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                                
                                <div className="h-[550px] overflow-y-auto rounded-lg border border-purple-200 dark:border-purple-800">
                                    {filteredVehicles.length > 0 ? (
                                        <div className="divide-y divide-purple-100 dark:divide-purple-800">
                                            {filteredVehicles.map((vehicle) => (
                                                <label
                                                    key={vehicle.id}
                                                    className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedVehicleIds.includes(vehicle.id)}
                                                        onChange={() => handleToggleVehicle(vehicle.id)}
                                                        className="h-4 w-4 shrink-0 rounded border-purple-300 text-purple-600 focus:ring-purple-500 dark:border-purple-600 dark:bg-gray-700"
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
                                        <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
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
