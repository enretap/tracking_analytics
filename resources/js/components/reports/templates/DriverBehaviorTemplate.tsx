import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User,
  Gauge,
  TrendingDown,
  AlertTriangle,
  Award,
  Clock,
  Route,
  ShieldCheck
} from 'lucide-react';

interface DriverBehaviorData {
    total_drivers?: number;
    excellent_drivers?: number;
    harsh_braking_events?: number;
    harsh_acceleration_events?: number;
    speeding_violations?: number;
    average_score?: number;
    total_driving_time?: number;
    safe_driving_percentage?: number;
}

interface Props {
    data: DriverBehaviorData;
}

export function DriverBehaviorTemplate({ data }: Props) {
    return (
        <div className="space-y-6">
            {/* KPI Cards principaux */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {data.average_score || 0}/100
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Score de conduite
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conducteurs</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.excellent_drivers || 0} / {data.total_drivers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Excellents conducteurs
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Freinages brusques</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {data.harsh_braking_events || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Événements enregistrés
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Excès de vitesse</CardTitle>
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {data.speeding_violations || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Infractions détectées
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* KPI Cards secondaires */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Accélérations brusques</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {data.harsh_acceleration_events || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Événements enregistrés
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Temps de conduite</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.total_driving_time || 0}h
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total de la période
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conduite sécuritaire</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {data.safe_driving_percentage || 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Du temps total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Amélioration</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            +12%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Vs. période précédente
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Graphiques et détails */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Classement des conducteurs
                        </CardTitle>
                        <CardDescription>Top 5 des meilleurs scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'Jean Dupont', score: 98, rank: 1 },
                                { name: 'Marie Martin', score: 95, rank: 2 },
                                { name: 'Pierre Bernard', score: 92, rank: 3 },
                                { name: 'Sophie Petit', score: 88, rank: 4 },
                                { name: 'Luc Durand', score: 85, rank: 5 },
                            ].map((driver) => (
                                <div key={driver.rank} className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                            driver.rank === 1 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            driver.rank === 2 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                                            driver.rank === 3 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {driver.rank}
                                        </div>
                                        <span className="font-medium">{driver.name}</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {driver.score}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Distribution des événements
                        </CardTitle>
                        <CardDescription>Répartition des incidents</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Freinages brusques</span>
                                    <span className="font-medium">{data.harsh_braking_events || 0}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div 
                                        className="bg-orange-600 h-2 rounded-full transition-all"
                                        style={{ 
                                            width: `${Math.min(100, ((data.harsh_braking_events || 0) / 50) * 100)}%` 
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Accélérations brusques</span>
                                    <span className="font-medium">{data.harsh_acceleration_events || 0}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div 
                                        className="bg-amber-600 h-2 rounded-full transition-all"
                                        style={{ 
                                            width: `${Math.min(100, ((data.harsh_acceleration_events || 0) / 50) * 100)}%` 
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Excès de vitesse</span>
                                    <span className="font-medium">{data.speeding_violations || 0}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div 
                                        className="bg-red-600 h-2 rounded-full transition-all"
                                        style={{ 
                                            width: `${Math.min(100, ((data.speeding_violations || 0) / 50) * 100)}%` 
                                        }}
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
