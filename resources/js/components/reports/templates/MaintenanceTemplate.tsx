import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wrench,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MaintenanceData {
    total_maintenances?: number;
    scheduled_maintenances?: number;
    urgent_maintenances?: number;
    completed_maintenances?: number;
    total_cost?: number;
    average_cost?: number;
    vehicles_due?: number;
    upcoming_maintenances?: number;
}

interface Props {
    data: MaintenanceData;
}

export function MaintenanceTemplate({ data }: Props) {
    return (
        <div className="space-y-6">
            {/* KPI Cards principaux */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maintenances totales</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.total_maintenances || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sur la période
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maintenances urgentes</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {data.urgent_maintenances || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Nécessitent attention
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
                            Dépenses de maintenance
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {data.total_maintenances 
                                ? Math.round(((data.completed_maintenances || 0) / data.total_maintenances) * 100) 
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Maintenances complétées
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* KPI Cards secondaires */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Coût moyen</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(data.average_cost || 0).toLocaleString()} €
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Par intervention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Planifiées</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {data.scheduled_maintenances || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Maintenances programmées
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Véhicules à réviser</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {data.vehicles_due || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Révision en retard
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prochainement</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.upcoming_maintenances || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Prévues ce mois
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Sections détaillées */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Maintenances à venir
                        </CardTitle>
                        <CardDescription>Planifiées pour les 30 prochains jours</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { vehicle: 'AB-123-CD', type: 'Révision complète', date: '2025-12-25', urgent: false },
                                { vehicle: 'EF-456-GH', type: 'Changement pneus', date: '2025-12-28', urgent: false },
                                { vehicle: 'IJ-789-KL', type: 'Vidange moteur', date: '2026-01-02', urgent: true },
                                { vehicle: 'MN-012-OP', type: 'Contrôle technique', date: '2026-01-05', urgent: false },
                            ].map((maintenance, index) => (
                                <div key={index} className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800 last:border-0">
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {maintenance.vehicle}
                                            {maintenance.urgent && (
                                                <Badge variant="destructive" className="text-xs">
                                                    Urgent
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {maintenance.type}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(maintenance.date).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Répartition des coûts
                        </CardTitle>
                        <CardDescription>Par type de maintenance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Révisions</span>
                                    <span className="font-medium">45%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '45%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Réparations</span>
                                    <span className="font-medium">30%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: '30%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Pièces détachées</span>
                                    <span className="font-medium">25%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                                    <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: '25%' }} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
