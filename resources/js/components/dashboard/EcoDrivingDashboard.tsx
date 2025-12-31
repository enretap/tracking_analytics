import React from 'react';
import { useEcoDriving } from '@/hooks/useEcoDriving';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Activity, Car } from 'lucide-react';

/**
 * Exemple de composant utilisant les données d'éco-conduite en temps réel
 * 
 * Ce composant peut être utilisé à la place des données passées en props
 * pour avoir un rafraîchissement en temps réel.
 */
export function EcoDrivingDashboard() {
    const { data, loading, error, refetch } = useEcoDriving({
        // Période des 7 derniers jours par défaut
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        autoRefresh: true,      // Rafraîchissement automatique activé
        refreshInterval: 300000 // Toutes les 5 minutes
    });

    const handleRefresh = async () => {
        await refetch(true); // Force le rafraîchissement (bypass cache)
    };

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Erreur de chargement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600">{error}</p>
                    <Button 
                        onClick={handleRefresh} 
                        variant="outline" 
                        className="mt-4"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Réessayer
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête avec bouton de rafraîchissement */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Données d'Éco-conduite</h2>
                    <p className="text-gray-600">
                        Données TARGA TELEMATICS - 
                        Période: {data.period_start} au {data.period_end}
                    </p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Actualisation...' : 'Actualiser'}
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-yellow-600">
                            Total des véhicules
                        </CardTitle>
                        <Car className="h-8 w-8 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '...' : data.total_vehicles || 0}
                        </div>
                        <p className="text-xs text-gray-600">
                            {data.active_vehicles || 0} actifs
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-green-600">
                            Distance totale
                        </CardTitle>
                        <Activity className="h-8 w-8 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '...' : (data.total_distance || 0).toFixed(1)} km
                        </div>
                        <p className="text-xs text-gray-600">
                            Moyenne: {((data.total_distance || 0) / (data.total_vehicles || 1)).toFixed(1)} km/véhicule
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-orange-600">
                            Total infractions
                        </CardTitle>
                        <AlertTriangle className="h-8 w-8 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '...' : data.total_alerts || 0}
                        </div>
                        <p className="text-xs text-gray-600">
                            {data.critical_alerts || 0} critiques
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-medium text-blue-600">
                            Conducteurs
                        </CardTitle>
                        <Activity className="h-8 w-8 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '...' : data.total_drivers || 0}
                        </div>
                        <p className="text-xs text-gray-600">
                            Score moyen: {(data.average_driver_score || 0).toFixed(1)}%
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tableau des véhicules */}
            {!loading && data.vehicle_details && data.vehicle_details.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Détails des véhicules</CardTitle>
                        <CardDescription>
                            Données en temps réel depuis TARGA TELEMATICS
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Véhicule</th>
                                        <th className="px-4 py-2 text-left">Conducteur</th>
                                        <th className="px-4 py-2 text-right">Distance</th>
                                        <th className="px-4 py-2 text-right">Vitesse max</th>
                                        <th className="px-4 py-2 text-right">Infractions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {data.vehicle_details.slice(0, 10).map((vehicle, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium">
                                                {vehicle.immatriculation}
                                            </td>
                                            <td className="px-4 py-2">
                                                {vehicle.driver}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {vehicle.distance?.toFixed(1)} km
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {vehicle.max_speed} km/h
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    (vehicle.total_violations || 0) > 50 
                                                        ? 'bg-red-100 text-red-800'
                                                        : (vehicle.total_violations || 0) > 0
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {vehicle.total_violations || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {data.vehicle_details.length > 10 && (
                            <p className="text-sm text-gray-500 mt-4 text-center">
                                Affichage de 10 véhicules sur {data.vehicle_details.length}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">Chargement des données...</span>
                </div>
            )}
        </div>
    );
}
