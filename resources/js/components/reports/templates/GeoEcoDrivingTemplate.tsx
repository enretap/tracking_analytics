import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin,
  Leaf,
  TrendingUp,
  TrendingDown,
  Map,
  Fuel,
  Award,
  AlertTriangle,
  Navigation,
  Wind,
  Gauge,
  Activity,
  Clock
} from 'lucide-react';



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

interface GeoEcoDrivingData {
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

interface Props {
    data: VehicleEventData;
}

export function GeoEcoDrivingTemplate({ data }: Props) {
    
    return (
        <div className="space-y-6">
            {/* Analyse géospatiale des comportements à risques */}
            {data.events && data.events.length > 0 && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
                    
                    <CardContent className="p-6 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cartographie des infractions */}
                           

                            {/* Cartographie des infractions sur Abidjan */}
                            
                            {/* Nombre de véhicules par Type d'événement */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Nombre de véhicules par Type d'événement</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    {(() => {
                                        // Safety check for event_data
                                        if (!data?.events_by_name || !data?.stats?.events_by_name) {
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
                                        const eventsByName = data.stats.events_by_name;
                                        const totalEvents = data.stats.total_events;
                                        
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
                        </div>

                        {/* Tableau des données par chauffeur */}
                        {/* <Card className="mt-6 border-2">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto p-4">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-900 text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Chauffeur</th>
                                                <th className="px-4 py-3 text-center font-medium">Conduite de nuit</th>
                                                <th className="px-4 py-3 text-center font-medium">Infraction sur durée de conduite</th>
                                                <th className="px-4 py-3 text-center font-medium">SPEED</th>
                                                <th className="px-4 py-3 text-center font-medium bg-gray-800">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {data.events.map((vehicle, index) => {
                                                // Simuler conduite de nuit (basé sur driving_time_violations)
                                                const nightDriving = vehicle.driving_time_violations || 0;
                                                const durationViolation = vehicle.driving_time_violations || 0;
                                                const speedViolation = vehicle.speed_violations || 0;
                                                const total = nightDriving + durationViolation + speedViolation;
                                                
                                                return (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-medium">{vehicle.driver}</td>
                                                        <td className="px-4 py-3 text-center">{nightDriving > 0 ? nightDriving : ''}</td>
                                                        <td className="px-4 py-3 text-center">{durationViolation > 0 ? durationViolation : ''}</td>
                                                        <td className="px-4 py-3 text-center">{speedViolation > 0 ? speedViolation : ''}</td>
                                                        <td className="px-4 py-3 text-center font-semibold bg-gray-50">{total > 0 ? total : ''}</td>
                                                    </tr>
                                                );
                                            })}
                                            <tr className="bg-gray-900 text-white font-bold">
                                                <td className="px-4 py-3">Total</td>
                                                <td className="px-4 py-3 text-center">
                                                    {data.events.reduce((sum, v) => sum + (v.driving_time_violations || 0), 0)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {data.events.reduce((sum, v) => sum + (v.driving_time_violations || 0), 0)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {data.events.reduce((sum, v) => sum + (v.speed_violations || 0), 0)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {data.events.reduce((sum, v) => 
                                                        sum + (v.driving_time_violations || 0) * 2 + (v.speed_violations || 0), 0
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card> */}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
