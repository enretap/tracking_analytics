import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Fuel,
  DollarSign,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Droplet,
  Gauge,
  Calendar
} from 'lucide-react';

interface FuelConsumptionData {
    total_fuel?: number;
    total_cost?: number;
    average_consumption?: number;
    best_vehicle_consumption?: number;
    worst_vehicle_consumption?: number;
    fuel_savings?: number;
    total_distance?: number;
    co2_emissions?: number;
}

interface Props {
    data: FuelConsumptionData;
}

export function FuelConsumptionTemplate({ data }: Props) {
    return (
        <div className="space-y-6">
            {/* KPI Cards principaux */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consommation totale</CardTitle>
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(data.total_fuel || 0).toLocaleString()} L
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sur la période
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Coût total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(data.total_cost || 0).toLocaleString()} €
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Dépenses en carburant
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consommation moyenne</CardTitle>
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(data.average_consumption || 0).toFixed(1)} L/100km
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Moyenne de la flotte
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Économies réalisées</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {(data.fuel_savings || 0).toLocaleString()} €
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Vs. période précédente
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* KPI Cards secondaires */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Meilleure performance</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {(data.best_vehicle_consumption || 0).toFixed(1)} L/100km
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Véhicule le plus économe
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pire performance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {(data.worst_vehicle_consumption || 0).toFixed(1)} L/100km
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Nécessite optimisation
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Émissions CO₂</CardTitle>
                        <Droplet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(data.co2_emissions || 0).toLocaleString()} kg
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Empreinte carbone
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Distance totale</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(data.total_distance || 0).toLocaleString()} km
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sur la période
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Sections détaillées */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Fuel className="h-5 w-5" />
                            Top véhicules par consommation
                        </CardTitle>
                        <CardDescription>Classement des plus économes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { vehicle: 'AB-123-CD', consumption: 6.2, savings: '+15%' },
                                { vehicle: 'EF-456-GH', consumption: 6.8, savings: '+10%' },
                                { vehicle: 'IJ-789-KL', consumption: 7.1, savings: '+8%' },
                                { vehicle: 'MN-012-OP', consumption: 7.5, savings: '+5%' },
                                { vehicle: 'QR-345-ST', consumption: 8.2, savings: '-3%' },
                            ].map((vehicle, index) => (
                                <div key={index} className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                            index === 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            index === 4 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <span className="font-medium">{vehicle.vehicle}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">{vehicle.consumption} L/100km</div>
                                        <div className={`text-xs ${
                                            vehicle.savings.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {vehicle.savings}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Évolution mensuelle
                        </CardTitle>
                        <CardDescription>Tendance de consommation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Janvier</span>
                                    <span className="font-medium">7.2 L/100km</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '72%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Février</span>
                                    <span className="font-medium">6.8 L/100km</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: '68%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Mars</span>
                                    <span className="font-medium">6.5 L/100km</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: '65%' }} />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-900 dark:text-white">Amélioration globale</span>
                                    <span className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                        <TrendingDown className="h-4 w-4" />
                                        -9.7%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
