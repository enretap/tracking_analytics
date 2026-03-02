import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { 
  MapPin,
  Activity,
  TrendingUp,
  AlertTriangle,
  Fuel,
  BarChart3,
  Clock,
  CheckCircle,
  Users,
  Route,
  Download
} from 'lucide-react';

interface VehicleDetail {
    immatriculation: string;
    driver: string | null;
    project: string | null;
    max_speed: number;
    distance: number;
    driving_time: number;
    idle_time: number;
    harsh_braking: number;
    harsh_acceleration: number;
    dangerous_turns: number;
    speed_violations: number;
    driving_time_violations: number;
    total_violations: number;
    zone_agence?: string | null;
    zone_rattachement?: string | null;
    nom_distributeur?: string | null;
    decoupage_distributeur?: string | null;
    chef_mission?: string | null;
}

interface DistributorData {
    name: string;
    zone_agence?: string | null;
    zone_rattachement?: string | null;
    decoupage_distributeur?: string | null;
    chef_mission?: string | null;
    active_vehicles: number;
    inactive_vehicles: number;
    distance: number;
    trips: number;
    total_driving_time?: number; // en secondes
    vehicles?: VehicleDetail[];
}

interface FleetActivityData {
    // Métriques principales
    total_vehicles?: number;
    inactive_vehicles?: number;
    vehicles_with_trips?: number;
    distributors_count?: number;
    total_trips?: number;
    total_distance?: number;
    total_duration?: string; // Format: HH:MM:SS
    
    // Détails par distributeur
    distributors?: DistributorData[];
    
    // Support ancien format
    active_vehicles?: number;
    alerts?: number;
    total_alerts?: number;
    average_speed?: number;
    fuel_consumption?: number;
    total_fuel_consumption?: number;
    average_fuel_efficiency?: number;
    trip_count?: number;
    operating_time?: number;
    operating_hours?: number;
    compliance_rate?: number;
    average_driver_score?: number;
}

interface Props {
    data: FleetActivityData;
}

export function FleetActivityTemplate({ data }: Props) {
    // Données par défaut pour les distributeurs si non fournies
    const distributors = data.distributors || [];
    
    // État pour le distributeur sélectionné
    const [selectedDistributor, setSelectedDistributor] = useState<string | null>(
        distributors.length > 0 ? distributors[0].name : null
    );
    
    // État pour le KPI sélectionné dans l'analyse par distributeur
    const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
    
    // Calculer les totaux
    const totalVehicles = data.total_vehicles || 0;
    const inactiveVehicles = data.inactive_vehicles || 0;
    const vehiclesWithTrips = data.vehicles_with_trips || (totalVehicles - inactiveVehicles);
    const distributorsCount = data.distributors_count || distributors.length;
    const totalTrips = data.total_trips || data.trip_count || 0;
    const totalDistance = data.total_distance || 0;
    const totalDuration = data.total_duration || '0:00:00';
    
    // Log des données complètes dans la console
    console.log('FleetActivityData complètes:', data);
    console.log('Distributeurs:', distributors);
    
    // Log de la liste des distributeurs avec leurs statistiques
    console.table(distributors.map(d => {
        const drivingHours = d.total_driving_time ? (d.total_driving_time / 3600).toFixed(2) : 0;
        return {
            'Nom': d.name,
            'Zone Agence': d.zone_agence || '-',
            'Zone Rattachement': d.zone_rattachement || '-',
            'Chef Mission': d.chef_mission || '-',
            'Véhicules actifs': d.active_vehicles,
            'Véhicules inactifs': d.inactive_vehicles,
            'Total véhicules': d.active_vehicles + d.inactive_vehicles,
            'Distance (km)': d.distance.toFixed(2),
            'Trajets': d.trips,
            'Heures conduite': drivingHours
        };
    }));
    
    // Extraire et afficher tous les distributeurs des véhicules (nom_distributeur)
    const allVehicles = distributors.flatMap(d => d.vehicles || []);
    const uniqueDistributeurs = [...new Set(allVehicles.map(v => v.nom_distributeur).filter(Boolean))];
    console.log('Liste des distributeurs extraits des véhicules (nom_distributeur):', uniqueDistributeurs);
    
    // Statistiques par nom_distributeur
    const statsByDistributeur: Record<string, any> = {};
    allVehicles.forEach(v => {
        const dist = v.nom_distributeur || 'Non défini';
        if (!statsByDistributeur[dist]) {
            statsByDistributeur[dist] = {
                nom: dist,
                zone_agence: v.zone_agence,
                zone_rattachement: v.zone_rattachement,
                decoupage_distributeur: v.decoupage_distributeur,
                chef_mission: v.chef_mission,
                nb_vehicules: 0,
                distance_totale: 0,
                heures_conduite: 0
            };
        }
        statsByDistributeur[dist].nb_vehicules++;
        statsByDistributeur[dist].distance_totale += v.distance || 0;
        statsByDistributeur[dist].heures_conduite += (v.driving_time || 0) / 3600;
    });
    console.table(Object.values(statsByDistributeur));
    
    // Formater la distance
    const formatDistance = (distance: number) => {
        if (distance >= 1000) {
            return `${(distance / 1000).toFixed(0)}K`;
        }
        return distance.toLocaleString();
    };
    
    // Calculer les pourcentages pour le donut chart
    const activeVehicles = totalVehicles - inactiveVehicles;
    const activePercent = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;
    const inactivePercent = totalVehicles > 0 ? (inactiveVehicles / totalVehicles) * 100 : 0;
    
    return (
        <div className="space-y-6">
            {/* KPI Cards principaux - 7 cartes */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                <Card>
                    <CardHeader className="pb-2 pt-4">
                        <div className="h-1 w-full bg-blue-600 rounded-full mb-3"></div>
                        <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                            Totale Flotte
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-3xl font-bold text-center text-blue-600">
                            {totalVehicles}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 pt-4">
                        <div className="h-1 w-full bg-red-600 rounded-full mb-3"></div>
                        <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                            Totale Véhicule Inactive
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-3xl font-bold text-center text-red-600">
                            {inactiveVehicles}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 pt-4">
                        <div className="h-1 w-full bg-green-600 rounded-full mb-3"></div>
                        <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                            Véhicules Avec Trajets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-3xl font-bold text-center text-green-600">
                            {vehiclesWithTrips}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 pt-4">
                        <div className="h-1 w-full bg-cyan-600 rounded-full mb-3"></div>
                        <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                            Distributeurs Concernés
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-3xl font-bold text-center text-cyan-600">
                            {distributorsCount}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 pt-4">
                        <div className="h-1 w-full bg-yellow-600 rounded-full mb-3"></div>
                        <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                            Nombre de Trajets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-3xl font-bold text-center text-yellow-600">
                            {totalTrips.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 pt-4">
                        <div className="h-1 w-full bg-purple-600 rounded-full mb-3"></div>
                        <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                            Distance Totale
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-3xl font-bold text-center text-purple-600">
                            {formatDistance(totalDistance)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 pt-4">
                        <div className="h-1 w-full bg-orange-600 rounded-full mb-3"></div>
                        <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                            Durée Totale (H)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-2xl font-bold text-center text-orange-600">
                            {totalDuration}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Graphiques - 2 lignes */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Véhicules actifs / Inactifs par distributeur */}
                <Card>
                    <CardHeader className="bg-indigo-700 text-white">
                        <CardTitle className="text-sm font-semibold text-center">
                            Véhicules actifs / Inactifs par distributeur
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {distributors.length > 0 ? (
                            <StackedBarChart distributors={distributors} />
                        ) : (
                            <div className="text-center text-gray-500 py-8">Aucune donnée disponible</div>
                        )}
                    </CardContent>
                </Card>

                {/* Véhicules actifs vs Véhicules Inactifs */}
                <Card>
                    <CardHeader className="bg-indigo-700 text-white">
                        <CardTitle className="text-sm font-semibold text-center">
                            Véhicules actifs vs Véhicules Inactifs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <DonutChart 
                            active={activeVehicles}
                            inactive={inactiveVehicles}
                            activePercent={activePercent}
                            inactivePercent={inactivePercent}
                        />
                    </CardContent>
                </Card>

                {/* Distances Parcourues Par Distributeur */}
                <Card>
                    <CardHeader className="bg-indigo-700 text-white">
                        <CardTitle className="text-sm font-semibold text-center">
                            Distances Parcourues Par Distributeur
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {distributors.length > 0 ? (
                            <SimpleBarChart 
                                data={distributors}
                                valueKey="distance"
                                color="#3b82f6"
                            />
                        ) : (
                            <div className="text-center text-gray-500 py-8">Aucune donnée disponible</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Deuxième ligne de graphiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Nombre de Trajets Par Distributeur */}
                <Card className="lg:col-span-2">
                    <CardHeader className="bg-indigo-700 text-white">
                        <CardTitle className="text-sm font-semibold text-center">
                            Nombre de Trajets Par Distributeur
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {distributors.length > 0 ? (
                            <SimpleBarChart 
                                data={distributors}
                                valueKey="trips"
                                color="#3b82f6"
                            />
                        ) : (
                            <div className="text-center text-gray-500 py-8">Aucune donnée disponible</div>
                        )}
                    </CardContent>
                </Card>

                {/* Taux d'Utilisation Par Distributeur */}
                <Card>
                    <CardHeader className="bg-indigo-700 text-white">
                        <CardTitle className="text-sm font-semibold text-center">
                            Taux d'Utilisation Par Distributeur
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {distributors.length > 0 ? (
                            <PieChart distributors={distributors} />
                        ) : (
                            <div className="text-center text-gray-500 py-8">Aucune donnée disponible</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Section Analyse par distributeurs */}
            {distributors.length > 0 && selectedDistributor && (
                <>
                    <div className="mt-8 mb-6">
                        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">Analyse par distributeurs</h2>
                        
                        {/* Sélecteur de distributeur */}
                        <div className="flex justify-center mb-6">
                            <select 
                                value={selectedDistributor}
                                onChange={(e) => {
                                    setSelectedDistributor(e.target.value);
                                    setSelectedKPI(null); // Réinitialiser le filtre KPI
                                }}
                                className="px-4 py-2 border-2 border-indigo-600 rounded-lg bg-white text-indigo-700 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {distributors.map((dist) => (
                                    <option key={dist.name} value={dist.name}>
                                        {dist.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {(() => {
                            const currentDist = distributors.find(d => d.name === selectedDistributor);
                            if (!currentDist) return null;
                            
                            const distVehicles = currentDist.vehicles || [];
                            const activeVehiclesCount = distVehicles.filter(v => (v.distance || 0) > 0).length;
                            const inactiveVehiclesCount = distVehicles.length - activeVehiclesCount;
                            const vehiclesWithTripsCount = distVehicles.filter(v => v.distance > 0).length;
                            
                            // Calculer les zones de rattachement uniques
                            const uniqueZoneRattachements = new Set(
                                distVehicles.map(v => v.zone_rattachement).filter(Boolean)
                            ).size;
                            
                            // Calculer distance totale du distributeur
                            const totalDistanceDist = distVehicles.reduce((sum, v) => sum + (v.distance || 0), 0);
                            
                            // Calculer durée totale
                            const totalDrivingSeconds = distVehicles.reduce((sum, v) => sum + (v.driving_time || 0), 0);
                            const hours = Math.floor(totalDrivingSeconds / 3600);
                            const minutes = Math.floor((totalDrivingSeconds % 3600) / 60);
                            const seconds = totalDrivingSeconds % 60;
                            const durationFormatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                            
                            // Grouper véhicules par zone d'agence
                            const vehiclesByZoneAgence: Record<string, VehicleDetail[]> = {};
                            distVehicles.forEach(v => {
                                const zone = v.zone_agence || 'Non défini';
                                if (!vehiclesByZoneAgence[zone]) {
                                    vehiclesByZoneAgence[zone] = [];
                                }
                                vehiclesByZoneAgence[zone].push(v);
                            });
                            
                            // Filtrer les véhicules selon le KPI sélectionné
                            const getFilteredVehicles = () => {
                                if (!selectedKPI) return distVehicles;
                                
                                switch (selectedKPI) {
                                    case 'total':
                                        return distVehicles;
                                    case 'inactive':
                                        return distVehicles.filter(v => (v.distance || 0) === 0);
                                    case 'with_trips':
                                        return distVehicles.filter(v => v.distance > 0);
                                    default:
                                        return distVehicles;
                                }
                            };
                            
                            const filteredVehicles = getFilteredVehicles();
                            
                            // Fonction d'export Excel
                            const exportToExcel = () => {
                                const vehiclesToExport = filteredVehicles;
                                
                                // Créer les en-têtes
                                const headers = [
                                    'Immatriculation',
                                    'Vehicule',
                                    'Zone Agence',
                                    'Zone de rattachement',
                                    'Chef de Mission',
                                    'Distance Totale (km)',
                                    'Durée Totale',
                                    'Nombre de Trajets'
                                ];
                                
                                // Créer les lignes de données
                                const rows = vehiclesToExport.map(vehicle => {
                                    const vehicleHours = Math.floor((vehicle.driving_time || 0) / 3600);
                                    const vehicleMinutes = Math.floor(((vehicle.driving_time || 0) % 3600) / 60);
                                    const vehicleDuration = `${vehicleHours}h ${vehicleMinutes}m`;
                                    
                                    return [
                                        vehicle.immatriculation,
                                        vehicle.driver || '-',
                                        vehicle.zone_agence || '-',
                                        vehicle.zone_rattachement || '-',
                                        vehicle.chef_mission || '-',
                                        (vehicle.distance || 0).toFixed(1),
                                        vehicleDuration,
                                        vehicle.distance > 0 ? Math.max(1, Math.floor(vehicle.distance / 10)) : 0
                                    ];
                                });
                                
                                // Créer le contenu CSV
                                const csvContent = [
                                    headers.join(','),
                                    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
                                ].join('\n');
                                
                                // Créer le blob et télécharger
                                const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                const url = URL.createObjectURL(blob);
                                
                                const fileName = `FleetActivity_${selectedDistributor}_${new Date().toISOString().split('T')[0]}.csv`;
                                link.setAttribute('href', url);
                                link.setAttribute('download', fileName);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            };
                            
                            return (
                                <>
                                    {/* KPI Cards pour le distributeur sélectionné */}
                                    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
                                        <Card 
                                            className={`cursor-pointer transition-all duration-200 ${
                                                selectedKPI === 'total' ? 'ring-4 ring-blue-400 shadow-xl scale-105' : 'hover:shadow-lg hover:scale-102'
                                            }`}
                                            onClick={() => setSelectedKPI(selectedKPI === 'total' ? null : 'total')}
                                        >
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="h-1 w-full bg-blue-600 rounded-full mb-3"></div>
                                                <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                                                    Totale Flotte
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="text-3xl font-bold text-center text-blue-600">
                                                    {distVehicles.length}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card 
                                            className={`cursor-pointer transition-all duration-200 ${
                                                selectedKPI === 'inactive' ? 'ring-4 ring-red-400 shadow-xl scale-105' : 'hover:shadow-lg hover:scale-102'
                                            }`}
                                            onClick={() => setSelectedKPI(selectedKPI === 'inactive' ? null : 'inactive')}
                                        >
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="h-1 w-full bg-red-600 rounded-full mb-3"></div>
                                                <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                                                    Totale Véhicule Inactive
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="text-3xl font-bold text-center text-red-600">
                                                    {inactiveVehiclesCount}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card 
                                            className={`cursor-pointer transition-all duration-200 ${
                                                selectedKPI === 'with_trips' ? 'ring-4 ring-green-400 shadow-xl scale-105' : 'hover:shadow-lg hover:scale-102'
                                            }`}
                                            onClick={() => setSelectedKPI(selectedKPI === 'with_trips' ? null : 'with_trips')}
                                        >
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="h-1 w-full bg-green-600 rounded-full mb-3"></div>
                                                <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                                                    Véhicules Avec Trajets
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="text-3xl font-bold text-center text-green-600">
                                                    {vehiclesWithTripsCount}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="opacity-50">
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="h-1 w-full bg-cyan-600 rounded-full mb-3"></div>
                                                <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                                                    Zone de Rattachements
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="text-3xl font-bold text-center text-cyan-600">
                                                    {uniqueZoneRattachements}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="opacity-50">
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="h-1 w-full bg-yellow-600 rounded-full mb-3"></div>
                                                <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                                                    Nombre des trajts
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="text-3xl font-bold text-center text-yellow-600">
                                                    {currentDist.trips}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="opacity-50">
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="h-1 w-full bg-purple-600 rounded-full mb-3"></div>
                                                <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                                                    Distance Totale2
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="text-3xl font-bold text-center text-purple-600">
                                                    {Math.round(totalDistanceDist)}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="opacity-50">
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="h-1 w-full bg-orange-600 rounded-full mb-3"></div>
                                                <CardTitle className="text-xs text-gray-600 dark:text-gray-400 text-center font-normal">
                                                    Durée Totale (H)
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="text-2xl font-bold text-center text-orange-600">
                                                    {durationFormatted}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Nom du distributeur et indicateur de filtre */}
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-orange-500 underline">{selectedDistributor}</h3>
                                        {selectedKPI && (
                                            <button
                                                onClick={() => setSelectedKPI(null)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold flex items-center gap-2"
                                            >
                                                <span>✕</span>
                                                <span>Afficher tous les véhicules ({distVehicles.length})</span>
                                            </button>
                                        )}
                                    </div>
                                    
                                    {selectedKPI && (
                                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                                            <p className="text-sm text-blue-800 font-medium">
                                                📊 Filtre actif : {selectedKPI === 'total' && 'Tous les véhicules'}
                                                {selectedKPI === 'inactive' && 'Véhicules inactifs uniquement'}
                                                {selectedKPI === 'with_trips' && 'Véhicules avec trajets uniquement'}
                                                {' '}({filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''})
                                            </p>
                                        </div>
                                    )}

                                    {/* Bouton d'export Excel */}
                                    <div className="mb-4 flex justify-end">
                                        <button
                                            onClick={exportToExcel}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
                                        >
                                            <Download className="h-4 w-4" />
                                            <span>Exporter vers Excel ({filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''})</span>
                                        </button>
                                    </div>

                                    {/* Tableau des véhicules */}
                                    <Card className="mb-6 shadow-lg">
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide">Immatriculation</th>
                                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide">Vehicule</th>
                                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide">Zone Agence</th>
                                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide">Zone de rattachement</th>
                                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide">Chef de Mission</th>
                                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide">Distance Totale</th>
                                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide">Durée Totale</th>
                                                            <th className="px-4 py-2 text-center text-xs font-bold uppercase tracking-wide">Trajets</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {filteredVehicles.map((vehicle, idx) => {
                                                            const vehicleHours = Math.floor((vehicle.driving_time || 0) / 3600);
                                                            const vehicleMinutes = Math.floor(((vehicle.driving_time || 0) % 3600) / 60);
                                                            const vehicleDuration = `${vehicleHours}h ${vehicleMinutes}m`;
                                                            const isActive = vehicle.distance > 0;
                                                            
                                                            return (
                                                                <tr 
                                                                    key={idx} 
                                                                    className={`
                                                                        ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                                                        hover:bg-indigo-50 transition-colors duration-150
                                                                        ${!isActive ? 'opacity-60' : ''}
                                                                    `}
                                                                >
                                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                                        <span className="font-semibold text-indigo-700">{vehicle.immatriculation}</span>
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <span className="text-gray-900">{vehicle.driver || '-'}</span>
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {vehicle.zone_agence || '-'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <span className="text-gray-700">{vehicle.zone_rattachement || '-'}</span>
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <span className="text-gray-700">{vehicle.chef_mission || '-'}</span>
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <span className="font-semibold text-purple-600">
                                                                            {(vehicle.distance || 0).toFixed(1)} km
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <span className="font-medium text-orange-600">{vehicleDuration}</span>
                                                                    </td>
                                                                    <td className="px-4 py-2 text-center">
                                                                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                                                            {vehicle.distance > 0 ? Math.max(1, Math.floor(vehicle.distance / 10)) : 0}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Graphiques pour le distributeur */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Nombre de Véhicules Actifs Par Zone Agence */}
                                        <Card>
                                            <CardHeader className="bg-indigo-700 text-white">
                                                <CardTitle className="text-sm font-semibold text-center">
                                                    Nombre de Véhicules Actifs Par Zone Agence
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-6">
                                                <ZoneAgenceBarChart vehiclesByZone={vehiclesByZoneAgence} />
                                            </CardContent>
                                        </Card>

                                        {/* Taux d'utilisation (%) par Véhicule */}
                                        <Card>
                                            <CardHeader className="bg-indigo-700 text-white">
                                                <CardTitle className="text-sm font-semibold text-center">
                                                    Taux d'utilisation (%) par Véhicule
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-6">
                                                <VehicleUtilizationChart vehicles={distVehicles} />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </>
            )}
        </div>
    );
}

// Composant Graphique en barres empilées
function StackedBarChart({ distributors }: { distributors: DistributorData[] }) {
    const maxTotal = Math.max(...distributors.map(d => d.active_vehicles + d.inactive_vehicles));
    const barWidth = 40;
    const spacing = 60;
    const chartHeight = 250;
    const chartWidth = distributors.length * spacing + 40;
    
    return (
        <div className="w-full overflow-x-auto">
            <div className="flex items-center gap-4 justify-center mb-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span>Totale Véhicules Actifs</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                    <span>Totale Véhicule Inactive</span>
                </div>
            </div>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64">
                {distributors.map((dist, idx) => {
                    const total = dist.active_vehicles + dist.inactive_vehicles;
                    const activeHeight = maxTotal > 0 ? (dist.active_vehicles / maxTotal) * 180 : 0;
                    const inactiveHeight = maxTotal > 0 ? (dist.inactive_vehicles / maxTotal) * 180 : 0;
                    const x = 40 + idx * spacing;
                    
                    return (
                        <g key={idx}>
                            {/* Barre active (en bas) */}
                            <rect
                                x={x - barWidth / 2}
                                y={200 - activeHeight}
                                width={barWidth}
                                height={activeHeight}
                                fill="#06b6d4"
                            />
                            {/* Texte sur barre active */}
                            {dist.active_vehicles > 0 && (
                                <text
                                    x={x}
                                    y={200 - activeHeight / 2}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="12"
                                    fontWeight="bold"
                                >
                                    {dist.active_vehicles}
                                </text>
                            )}
                            
                            {/* Barre inactive (en haut) */}
                            <rect
                                x={x - barWidth / 2}
                                y={200 - activeHeight - inactiveHeight}
                                width={barWidth}
                                height={inactiveHeight}
                                fill="#1e3a8a"
                            />
                            {/* Texte sur barre inactive */}
                            {dist.inactive_vehicles > 0 && (
                                <text
                                    x={x}
                                    y={200 - activeHeight - inactiveHeight / 2}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="12"
                                    fontWeight="bold"
                                >
                                    {dist.inactive_vehicles}
                                </text>
                            )}
                            
                            {/* Label */}
                            <text
                                x={x}
                                y={220}
                                textAnchor="middle"
                                fill="#374151"
                                fontSize="9"
                                transform={`rotate(-15, ${x}, 220)`}
                            >
                                {dist.name.length > 10 ? dist.name.substring(0, 10) + '...' : dist.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// Composant Graphique Donut
function DonutChart({ active, inactive, activePercent, inactivePercent }: { 
    active: number; 
    inactive: number; 
    activePercent: number; 
    inactivePercent: number; 
}) {
    const total = active + inactive;
    
    // Calculer les segments du donut
    const radius = 80;
    const innerRadius = 50;
    const circumference = 2 * Math.PI * radius;
    
    // Le segment actif commence à 0
    const activeAngle = (activePercent / 100) * 360;
    const inactiveAngle = (inactivePercent / 100) * 360;
    
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-56 h-56">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                    {/* Segment actif (cyan) */}
                    {activePercent > 0 && (
                        <path
                            d={describeArc(100, 100, radius, 0, activeAngle)}
                            fill="url(#activeGradient)"
                            stroke="white"
                            strokeWidth="2"
                        />
                    )}
                    {/* Segment inactif (bleu foncé) */}
                    {inactivePercent > 0 && (
                        <path
                            d={describeArc(100, 100, radius, activeAngle, activeAngle + inactiveAngle)}
                            fill="#1e3a8a"
                            stroke="white"
                            strokeWidth="2"
                        />
                    )}
                    {/* Centre blanc */}
                    <circle cx="100" cy="100" r={innerRadius} fill="white" />
                    
                    {/* Gradients */}
                    <defs>
                        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#0891b2" />
                        </linearGradient>
                    </defs>
                </svg>
                
                {/* Pourcentages dans le centre */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-xl font-bold text-cyan-600">{activePercent.toFixed(2)}%</div>
                        <div className="text-xs text-orange-500">{inactivePercent.toFixed(2)}%</div>
                    </div>
                </div>
            </div>
            
            {/* Légende */}
            <div className="flex gap-6 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span>Véhicules Actifs</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                    <span>Véhicule Inactifs</span>
                </div>
            </div>
        </div>
    );
}

// Composant Graphique en barres simples
function SimpleBarChart({ data, valueKey, color }: { 
    data: DistributorData[]; 
    valueKey: 'distance' | 'trips'; 
    color: string;
}) {
    const values = data.map(d => d[valueKey]);
    const maxValue = Math.max(...values);
    const barWidth = 50;
    const spacing = 80;
    const chartHeight = 300;
    const chartWidth = data.length * spacing + 40;
    
    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64">
                {data.map((dist, idx) => {
                    const value = dist[valueKey];
                    const barHeight = maxValue > 0 ? (value / maxValue) * 200 : 0;
                    const x = 40 + idx * spacing;
                    
                    return (
                        <g key={idx}>
                            {/* Barre */}
                            <rect
                                x={x - barWidth / 2}
                                y={220 - barHeight}
                                width={barWidth}
                                height={barHeight}
                                fill={color}
                            />
                            
                            {/* Valeur au-dessus de la barre */}
                            <text
                                x={x}
                                y={210 - barHeight}
                                textAnchor="middle"
                                fill="#f97316"
                                fontSize="12"
                                fontWeight="bold"
                            >
                                {value}
                            </text>
                            
                            {/* Label */}
                            <text
                                x={x}
                                y={250}
                                textAnchor="middle"
                                fill="#374151"
                                fontSize="10"
                                transform={`rotate(-25, ${x}, 250)`}
                            >
                                {dist.name.length > 12 ? dist.name.substring(0, 12) + '...' : dist.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// Composant Graphique Pie
function PieChart({ distributors }: { distributors: DistributorData[] }) {
    const total = distributors.reduce((sum, d) => sum + d.active_vehicles, 0);
    
    // Couleurs pour chaque distributeur
    const colors = ['#3b82f6', '#1e3a8a', '#f97316', '#a855f7', '#ec4899', '#06b6d4', '#eab308'];
    
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            <div className="relative w-56 h-56">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                    {(() => {
                        let currentAngle = 0;
                        return distributors.map((dist, idx) => {
                            const percentage = dist.active_vehicles / total;
                            const angle = percentage * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + angle;
                            currentAngle = endAngle;
                            
                            return (
                                <path
                                    key={idx}
                                    d={describeArc(100, 100, 80, startAngle, endAngle)}
                                    fill={colors[idx % colors.length]}
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            );
                        });
                    })()}
                </svg>
            </div>
            
            {/* Légende */}
            <div className="grid grid-cols-1 gap-2 text-xs">
                {distributors.map((dist, idx) => {
                    const percentage = ((dist.active_vehicles / total) * 100).toFixed(2);
                    return (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                            <div className="flex-1">
                                <div className="font-medium">{dist.name}</div>
                                <div className="text-gray-600">{percentage}%</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Composant Graphique en barres pour les zones d'agence
function ZoneAgenceBarChart({ vehiclesByZone }: { vehiclesByZone: Record<string, VehicleDetail[]> }) {
    const zones = Object.keys(vehiclesByZone);
    const counts = zones.map(zone => vehiclesByZone[zone].filter(v => v.distance > 0).length);
    const maxCount = Math.max(...counts, 1);
    
    const barWidth = 60;
    const spacing = 100;
    const chartHeight = 300;
    const chartWidth = zones.length * spacing + 80;
    
    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64">
                {zones.map((zone, idx) => {
                    const count = counts[idx];
                    const barHeight = maxCount > 0 ? (count / maxCount) * 200 : 0;
                    const x = 60 + idx * spacing;
                    
                    return (
                        <g key={idx}>
                            {/* Barre */}
                            <rect
                                x={x - barWidth / 2}
                                y={240 - barHeight}
                                width={barWidth}
                                height={barHeight}
                                fill="#3b82f6"
                            />
                            
                            {/* Valeur au-dessus de la barre */}
                            <text
                                x={x}
                                y={230 - barHeight}
                                textAnchor="middle"
                                fill="#f97316"
                                fontSize="14"
                                fontWeight="bold"
                            >
                                {count}
                            </text>
                            
                            {/* Label */}
                            <text
                                x={x}
                                y={260}
                                textAnchor="middle"
                                fill="#374151"
                                fontSize="11"
                                fontWeight="600"
                            >
                                {zone.length > 10 ? zone.substring(0, 10) + '...' : zone}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// Composant Graphique Donut pour taux d'utilisation par véhicule
function VehicleUtilizationChart({ vehicles }: { vehicles: VehicleDetail[] }) {
    const activeVehicles = vehicles.filter(v => v.distance > 0);
    const totalDistance = activeVehicles.reduce((sum, v) => sum + v.distance, 0);
    
    // Prendre top 13 véhicules par distance
    const topVehicles = activeVehicles
        .sort((a, b) => b.distance - a.distance)
        .slice(0, 13);
    
    // Couleurs variées
    const colors = [
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
        '#10b981', '#ef4444', '#6366f1', '#f97316', '#14b8a6',
        '#a855f7', '#84cc16', '#f43f5e'
    ];
    
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                    {(() => {
                        let currentAngle = 0;
                        return topVehicles.map((vehicle, idx) => {
                            const percentage = vehicle.distance / totalDistance;
                            const angle = percentage * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + angle;
                            currentAngle = endAngle;
                            
                            return (
                                <path
                                    key={idx}
                                    d={describeArc(100, 100, 80, startAngle, endAngle)}
                                    fill={colors[idx % colors.length]}
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            );
                        });
                    })()}
                    
                    {/* Centre blanc */}
                    <circle cx="100" cy="100" r={45} fill="white" />
                </svg>
            </div>
            
            {/* Légende */}
            <div className="grid grid-cols-1 gap-1 text-xs max-h-64 overflow-y-auto">
                {topVehicles.map((vehicle, idx) => {
                    const percentage = ((vehicle.distance / totalDistance) * 100).toFixed(2);
                    return (
                        <div key={idx} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{vehicle.immatriculation}</div>
                                <div className="text-orange-500 font-semibold">{percentage}%</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Fonction helper pour créer un arc SVG
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
        'M', x, y,
        'L', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        'Z'
    ].join(' ');
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    };
}
