import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin,
  Activity,
  TrendingUp,
  AlertTriangle,
  Fuel,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';

interface FleetActivityData {
    total_distance?: number;
    total_vehicles?: number;
    active_vehicles?: number;
    alerts?: number;
    average_speed?: number;
    fuel_consumption?: number;
    trip_count?: number;
    operating_time?: number;
}

interface Props {
    data: FleetActivityData;
}

export function FleetActivityTemplate({ data }: Props) {
    return (
        <div className="space-y-6">
            {/* KPI Cards principaux */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Distance totale</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.total_distance?.toLocaleString() || '0'} km
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Parcourue durant la période
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Véhicules actifs</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.active_vehicles || 0} / {data.total_vehicles || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.total_vehicles ? Math.round((data.active_vehicles || 0) / data.total_vehicles * 100) : 0}% de la flotte
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vitesse moyenne</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.average_speed || 0} km/h
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Moyenne de la flotte
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertes</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.alerts || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.alerts === 0 ? 'Aucune alerte' : 'Alertes enregistrées'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* KPI Cards secondaires */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consommation</CardTitle>
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.fuel_consumption?.toFixed(1) || '0.0'} L/100km
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Moyenne de la flotte
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trajets effectués</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.trip_count || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sur la période
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Temps d'exploitation</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.operating_time || 0}h
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total de la flotte
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conformité</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            95%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Taux de conformité
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Section de détails */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Statistiques détaillées
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Distance moyenne par véhicule</span>
                                <span className="font-medium">
                                    {data.total_vehicles && data.total_distance 
                                        ? Math.round(data.total_distance / data.total_vehicles).toLocaleString() 
                                        : '0'} km
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Trajets moyens par véhicule</span>
                                <span className="font-medium">
                                    {data.total_vehicles && data.trip_count 
                                        ? Math.round(data.trip_count / data.total_vehicles) 
                                        : '0'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Temps moyen par trajet</span>
                                <span className="font-medium">
                                    {data.trip_count && data.operating_time 
                                        ? (data.operating_time / data.trip_count).toFixed(1) 
                                        : '0'}h
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Distance moyenne par trajet</span>
                                <span className="font-medium">
                                    {data.trip_count && data.total_distance 
                                        ? Math.round(data.total_distance / data.trip_count) 
                                        : '0'} km
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Taux d'utilisation</span>
                                    <span className="font-medium">
                                        {data.total_vehicles && data.active_vehicles 
                                            ? Math.round((data.active_vehicles / data.total_vehicles) * 100) 
                                            : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{ 
                                            width: `${data.total_vehicles && data.active_vehicles 
                                                ? Math.round((data.active_vehicles / data.total_vehicles) * 100) 
                                                : 0}%` 
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Conformité</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">95%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div 
                                        className="bg-green-600 h-2 rounded-full transition-all"
                                        style={{ width: '95%' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Efficacité énergétique</span>
                                    <span className="font-medium text-yellow-600 dark:text-yellow-400">78%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div 
                                        className="bg-yellow-600 h-2 rounded-full transition-all"
                                        style={{ width: '78%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
