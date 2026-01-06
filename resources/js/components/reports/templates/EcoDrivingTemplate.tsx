import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf,
  TrendingDown,
  TrendingUp,
  Gauge,
  Fuel,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Wind,
  Clock,
  Truck,
  Bell,
  Shield
} from 'lucide-react';

/**
 * Interface pour les détails d'un véhicule/conducteur
 * Correspond aux données de l'endpoint TARGA TELEMATICS: /json/getDailyVehicleEcoSummary
 */
interface VehicleDriverDetail {
    immatriculation: string;        // vehicleName de l'API TARGA
    driver: string;                  // Nom du conducteur (non fourni par TARGA, défaut: "Non assigné")
    project?: string | null;         // Projet associé (optionnel)
    max_speed?: number;              // maxSpeed - Vitesse maximale atteinte (km/h)
    distance?: number;               // realMileage - Distance parcourue (km)
    driving_time?: string;           // realDuration - Temps de conduite formaté "Xh XXmin"
    idle_time?: string;              // idleTime - Temps au ralenti formaté "Xh XXmin"
    harsh_braking?: number;          // dailyViolationBreak - Nombre de freinages brusques
    harsh_acceleration?: number;     // dailyViolationAcceleration - Nombre d'accélérations brusques
    dangerous_turns?: number;        // dailyViolationTurn - Nombre de virages dangereux
    speed_violations?: number;       // dailyViolationOverspeed - Nombre d'excès de vitesse
    driving_time_violations?: number;// Non fourni par l'API TARGA (défaut: 0)
    total_violations?: number;       // totalViolations - Total des infractions
}

/**
 * Interface pour les données d'éco-conduite
 * Données transformées depuis l'endpoint TARGA TELEMATICS: /json/getDailyVehicleEcoSummary
 */
interface EcoDrivingData {
    // Métriques de la flotte
    total_vehicles?: number;         // Nombre total de véhicules
    active_vehicles?: number;        // Véhicules ayant parcouru une distance > 0
    inactive_vehicles?: number;      // total_vehicles - active_vehicles
    total_distance?: number;         // Somme de realMileage de tous les véhicules (km)
    
    // Métriques des conducteurs
    total_drivers?: number;          // Nombre total de conducteurs (proxy: nombre de véhicules)
    active_drivers?: number;         // Conducteurs actifs (proxy: nombre de véhicules)
    average_driver_score?: number;   // Score moyen calculé: 100 - (totalViolations / totalVehicles)
    
    // Métriques opérationnelles
    total_trips?: number;            // Non fourni par l'API TARGA (défaut: 0)
    average_trip_distance?: number;  // Calculé: total_distance / active_vehicles
    operating_hours?: number;        // Non fourni par l'API TARGA (défaut: 0)
    
    // Métriques de carburant
    total_fuel_consumption?: number; // Non fourni par l'API TARGA (défaut: 0)
    average_fuel_efficiency?: number;// Non fourni par l'API TARGA (défaut: 0)
    fuel_cost?: number;              // Non fourni par l'API TARGA (défaut: 0)
    
    // Métriques de maintenance
    scheduled_maintenances?: number; // Non fourni par l'API TARGA (défaut: 0)
    completed_maintenances?: number; // Non fourni par l'API TARGA (défaut: 0)
    pending_maintenances?: number;   // Non fourni par l'API TARGA (défaut: 0)
    maintenance_cost?: number;       // Non fourni par l'API TARGA (défaut: 0)
    
    // Alertes et incidents
    total_alerts?: number;           // Somme de totalViolations de tous les véhicules
    critical_alerts?: number;        // Nombre de véhicules avec total_violations > 50
    resolved_alerts?: number;        // Non fourni par l'API TARGA (défaut: 0)
    
    // Performance
    compliance_rate?: number;        // Calculé: 100 - ((totalViolations / totalVehicles) * 10)
    on_time_delivery?: number;       // Non fourni par l'API TARGA (défaut: 0)
    
    // Période
    period_start?: string;           // Date de début de la période (format: Y-m-d)
    period_end?: string;             // Date de fin de la période (format: Y-m-d)
    
    // Détails véhicules/conducteurs
    vehicle_details?: VehicleDriverDetail[]; // Tableau des données détaillées par véhicule
}

interface Props {
    data: EcoDrivingData;
}

export function EcoDrivingTemplate({ data }: Props) {
    return (
        <div className="space-y-5 p-3 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-sm">
            {/* En-tête avec période */}
            {(data.period_start || data.period_end) && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-700">Période d'analyse:</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                            {data.period_start && new Date(data.period_start).toLocaleDateString('fr-FR')}
                            {' → '}
                            {data.period_end && new Date(data.period_end).toLocaleDateString('fr-FR')}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Analyse des comportements à risques */}
            {data.vehicle_details && data.vehicle_details.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Contenu principal (4 colonnes) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Card principale */}
                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
                            
                            <CardContent className="p-6 bg-gray-50">
                                {/* Métriques clés */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-90"></div>
                                        <div className="relative p-4 flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <Truck className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">Véhicules actifs</div>
                                                <div className="text-3xl font-bold text-white">
                                                    {data.vehicle_details.filter(v => (v.distance || 0) > 0).length}
                                                </div>
                                                <div className="text-xs text-white/80 mt-1">En circulation</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-90"></div>
                                        <div className="relative p-4 flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <Gauge className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">Véhicules en excès</div>
                                                <div className="text-3xl font-bold text-white">
                                                    {data.vehicle_details.filter(v => (v.max_speed || 0) > 90).length}
                                                </div>
                                                <div className="text-xs text-white/80 mt-1">&gt; 90 km/h</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90"></div>
                                        <div className="relative p-4 flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <TrendingUp className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">Vitesse maximale</div>
                                                <div className="text-3xl font-bold text-white">
                                                    {Math.max(...data.vehicle_details.map(v => v.max_speed || 0))}
                                                </div>
                                                <div className="text-xs text-white/80 mt-1">km/h</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 opacity-90"></div>
                                        <div className="relative p-4 flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <Bell className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">Violations vitesses</div>
                                                <div className="text-3xl font-bold text-white">
                                                    {data.vehicle_details.reduce((sum, v) => sum + (v.speed_violations || 0), 0)}
                                                </div>
                                                <div className="text-xs text-white/80 mt-1">Infractions</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Graphiques */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Répartition des violations de vitesse par véhicule (%) */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                            <CardTitle className="text-base">Répartition des violations de vitesse par véhicule (%)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white p-4">
                                            {(() => {
                                                const totalViolations = data.vehicle_details.reduce((sum, v) => sum + (v.speed_violations || 0), 0);
                                                const topVehicles = data.vehicle_details
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
                                                const speedViolators = data.vehicle_details
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

                                    {/* Distribution des distances parcourues */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                            <CardTitle className="text-base">Distribution des distances parcourues par véhicule (km)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white p-4">
                                            {(() => {
                                                const sortedByDistance = [...data.vehicle_details]
                                                    .filter(v => (v.distance || 0) > 0)
                                                    .sort((a, b) => (b.distance || 0) - (a.distance || 0))
                                                    .slice(0, 8);
                                                
                                                if (sortedByDistance.length === 0) {
                                                    return <div className="text-center text-gray-500 py-8">Aucune distance parcourue</div>;
                                                }
                                                
                                                const maxDistance = Math.max(...sortedByDistance.map(v => v.distance || 0));
                                                
                                                return (
                                                    <div className="space-y-2">
                                                        <div className="flex items-end justify-around h-64 gap-2 pb-6">
                                                            {sortedByDistance.map((vehicle, idx) => {
                                                                const distance = vehicle.distance || 0;
                                                                const heightPercent = maxDistance > 0 ? (distance / maxDistance * 100) : 0;
                                                                return (
                                                                    <div key={idx} className="flex flex-col items-center justify-end flex-1 h-full">
                                                                        <div className="text-xs font-semibold mb-1 text-[#1e3a5f]">
                                                                            {distance.toFixed(1)}
                                                                        </div>
                                                                        <div 
                                                                            className="w-full bg-gradient-to-t from-[#1e3a5f] to-[#3b5998] rounded-t transition-all duration-300 hover:opacity-80 min-h-[4px]"
                                                                            style={{ height: `${heightPercent}%` }}
                                                                        ></div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="flex justify-around gap-2">
                                                            {sortedByDistance.map((vehicle, idx) => (
                                                                <div key={idx} className="flex-1 text-center text-xs">
                                                                    {vehicle.immatriculation}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </CardContent>
                                    </Card>

                                    {/* Accélérations par véhicule */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                            <CardTitle className="text-base">Accélérations par véhicule</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white">
                                            {(() => {
                                                const topAccelerators = data.vehicle_details
                                                    .filter(v => (v.harsh_acceleration || 0) > 0)
                                                    .sort((a, b) => (b.harsh_acceleration || 0) - (a.harsh_acceleration || 0))
                                                    .slice(0, 8);
                                                const maxAccel = Math.max(...topAccelerators.map(v => v.harsh_acceleration || 0));
                                                
                                                return (
                                                    <div className="space-y-2">
                                                        {topAccelerators.map((vehicle, idx) => (
                                                            <div key={idx}>
                                                                <div className="flex justify-between mb-1 text-xs">
                                                                    <span>{vehicle.immatriculation}</span>
                                                                    <span className="font-semibold">{vehicle.harsh_acceleration}</span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded h-4">
                                                                    <div 
                                                                        className="bg-[#1e3a5f] h-4 rounded"
                                                                        style={{ width: `${((vehicle.harsh_acceleration || 0) / maxAccel * 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                        </CardContent>
                                    </Card>

                                    {/* Tendance des vitesses maximales */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white md:col-span-2">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <CardTitle className="text-base text-gray-800">Tendance des vitesses maximales atteintes (Km/h)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white p-4">
                                            {(() => {
                                                const sortedBySpeed = [...data.vehicle_details]
                                                    .sort((a, b) => (b.max_speed || 0) - (a.max_speed || 0))
                                                    .slice(0, 12);
                                                const maxSpeed = Math.max(...sortedBySpeed.map(v => v.max_speed || 0));
                                                const yMax = Math.ceil(maxSpeed / 10) * 10;
                                                
                                                if (sortedBySpeed.length === 0) {
                                                    return <div className="text-center text-gray-500 py-8">Aucune donnée disponible</div>;
                                                }
                                                
                                                return (
                                                    <div className="space-y-4">
                                                        {/* Graphique avec courbe élégante */}
                                                        <div className="relative pt-6 pb-16 px-2">
                                                            <div className="relative h-72">
                                                                {/* Axe Y - échelle à gauche */}
                                                                <div className="absolute left-0 top-0 bottom-12 w-12 flex flex-col justify-between text-xs text-gray-600 font-medium">
                                                                    {[yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0].map((val, i) => (
                                                                        <div key={i} className="flex items-center justify-end pr-2">
                                                                            <span>{val.toFixed(0)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                
                                                                {/* Zone du graphique */}
                                                                <div className="absolute left-12 right-0 top-0 bottom-12 border-l-2 border-b-2 border-gray-300">
                                                                    {/* Lignes de grille horizontales */}
                                                                    <div className="absolute inset-0 flex flex-col justify-between">
                                                                        {[0, 1, 2, 3, 4].map((i) => (
                                                                            <div key={i} className="border-t border-gray-200 border-dashed"></div>
                                                                        ))}
                                                                    </div>
                                                                    
                                                                    {/* SVG pour la courbe */}
                                                                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                                        {/* Zone sous la courbe (gradient) */}
                                                                        <defs>
                                                                            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                                <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.3" />
                                                                                <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.05" />
                                                                            </linearGradient>
                                                                        </defs>
                                                                        
                                                                        {/* Zone remplie sous la courbe */}
                                                                        <polygon
                                                                            fill="url(#speedGradient)"
                                                                            points={`
                                                                                0,100 
                                                                                ${sortedBySpeed.map((v, i) => {
                                                                                    const x = (i / (sortedBySpeed.length - 1)) * 100;
                                                                                    const y = 100 - ((v.max_speed || 0) / yMax * 100);
                                                                                    return `${x},${y}`;
                                                                                }).join(' ')}
                                                                                100,100
                                                                            `}
                                                                        />
                                                                        
                                                                        {/* Courbe principale */}
                                                                        <polyline
                                                                            fill="none"
                                                                            stroke="#1e3a5f"
                                                                            strokeWidth="1"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            vectorEffect="non-scaling-stroke"
                                                                            points={sortedBySpeed.map((v, i) => {
                                                                                const x = (i / (sortedBySpeed.length - 1)) * 100;
                                                                                const y = 100 - ((v.max_speed || 0) / yMax * 100);
                                                                                return `${x},${y}`;
                                                                            }).join(' ')}
                                                                        />
                                                                        
                                                                        {/* Points sur la courbe */}
                                                                        {sortedBySpeed.map((v, i) => {
                                                                            const x = (i / (sortedBySpeed.length - 1)) * 100;
                                                                            const y = 100 - ((v.max_speed || 0) / yMax * 100);
                                                                            const isHighSpeed = (v.max_speed || 0) > 90;
                                                                            return (
                                                                                <g key={i}>
                                                                                    <circle 
                                                                                        cx={x} 
                                                                                        cy={y} 
                                                                                        r="1.8" 
                                                                                        fill="white"
                                                                                        stroke={isHighSpeed ? "#ef4444" : "#1e3a5f"}
                                                                                        strokeWidth="0.8"
                                                                                        vectorEffect="non-scaling-stroke"
                                                                                    />
                                                                                </g>
                                                                            );
                                                                        })}
                                                                    </svg>
                                                                    
                                                                    {/* Labels avec valeurs */}
                                                                    <div className="absolute inset-0 pointer-events-none">
                                                                        {sortedBySpeed.map((v, i) => {
                                                                            const xPercent = (i / (sortedBySpeed.length - 1)) * 100;
                                                                            const yPercent = 100 - ((v.max_speed || 0) / yMax * 100);
                                                                            const isHighSpeed = (v.max_speed || 0) > 90;
                                                                            return (
                                                                                <div 
                                                                                    key={i}
                                                                                    className={`absolute text-[10px] font-bold whitespace-nowrap ${isHighSpeed ? 'text-red-600' : 'text-[#1e3a5f]'}`}
                                                                                    style={{ 
                                                                                        left: `${xPercent}%`, 
                                                                                        top: `${yPercent}%`,
                                                                                        transform: 'translate(-50%, -18px)'
                                                                                    }}
                                                                                >
                                                                                    {v.max_speed}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Axe X - labels véhicules en bas */}
                                                                <div className="absolute left-12 right-0 bottom-0 h-12 pt-2">
                                                                    <div className="relative w-full h-full">
                                                                        {sortedBySpeed.map((v, i) => {
                                                                            const xPercent = (i / (sortedBySpeed.length - 1)) * 100;
                                                                            return (
                                                                                <div 
                                                                                    key={i}
                                                                                    className="absolute text-[9px] font-medium text-gray-700 transform -rotate-45 origin-top-left whitespace-nowrap"
                                                                                    style={{ 
                                                                                        left: `${xPercent}%`,
                                                                                        top: '0px'
                                                                                    }}
                                                                                >
                                                                                    {v.immatriculation}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Légende et seuil */}
                                                        <div className="flex items-center justify-center gap-6 text-xs bg-gray-50 p-2 rounded">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-[#1e3a5f]"></div>
                                                                <span>Vitesse normale (≤90 km/h)</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                                                                <span>Excès de vitesse (&gt;90 km/h)</span>
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
                    </div>

                    {/* Classification des Niveaux de Risque (sidebar) */}
                    <div className="lg:col-span-1">
                        <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-xl border-0 text-white sticky top-6 overflow-hidden">
                            <CardHeader className="border-b border-white/20 pb-3">
                                <CardTitle className="text-center text-sm font-bold">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                    </div>
                                    Classification des Niveaux de Risque
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {(() => {
                                    const getRiskLevel = (vehicle: VehicleDriverDetail) => {
                                        const totalViolations = vehicle.total_violations || 0;
                                        if (totalViolations === 0) return 'ACCEPTABLE';
                                        if (totalViolations < 50) return 'ÉLEVÉ';
                                        return 'CRITIQUE';
                                    };

                                    const classifiedVehicles = data.vehicle_details.map(v => ({
                                        ...v,
                                        risk: getRiskLevel(v)
                                    }));

                                    const acceptable = classifiedVehicles.filter(v => v.risk === 'ACCEPTABLE');
                                    const elevated = classifiedVehicles.filter(v => v.risk === 'ÉLEVÉ');
                                    const critical = classifiedVehicles.filter(v => v.risk === 'CRITIQUE');

                                    return (
                                        <>
                                            {/* ACCEPTABLE */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                    <span className="font-semibold">ACCEPTABLE</span>
                                                </div>
                                                <div className="space-y-1 pl-5 text-sm">
                                                    {acceptable.map((v, i) => (
                                                        <div key={i}>{v.immatriculation}</div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ÉLEVÉ */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                    <span className="font-semibold">ÉLEVÉ</span>
                                                </div>
                                                <div className="space-y-1 pl-5 text-sm">
                                                    {elevated.map((v, i) => (
                                                        <div key={i}>{v.immatriculation}</div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CRITIQUE */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <span className="font-semibold">CRITIQUE</span>
                                                </div>
                                                <div className="space-y-1 pl-5 text-sm">
                                                    {critical.map((v, i) => (
                                                        <div key={i}>{v.immatriculation}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
