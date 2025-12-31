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

interface Props {
    data: GeoEcoDrivingData;
}

export function GeoEcoDrivingTemplate({ data }: Props) {
    
    return (
        <div className="space-y-6">
            {/* Analyse géospatiale des comportements à risques */}
            {data.vehicle_details && data.vehicle_details.length > 0 && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
                    
                    <CardContent className="p-6 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cartographie des infractions */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                    <CardTitle className="text-base font-semibold text-gray-800">Cartographie des infractions</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    <div className="aspect-square bg-gray-100 rounded flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                                            {/* Simuler une carte avec des points */}
                                            {data.vehicle_details.map((vehicle, idx) => {
                                                const totalViolations = vehicle.total_violations || 0;
                                                if (totalViolations === 0) return null;
                                                
                                                // Position pseudo-aléatoire basée sur l'index
                                                const left = 20 + (idx * 17) % 60;
                                                const top = 15 + (idx * 23) % 70;
                                                const size = Math.min(10 + totalViolations / 10, 40);
                                                
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="absolute rounded-full bg-red-500 opacity-60 border-2 border-red-600"
                                                        style={{
                                                            left: `${left}%`,
                                                            top: `${top}%`,
                                                            width: `${size}px`,
                                                            height: `${size}px`
                                                        }}
                                                        title={`${vehicle.immatriculation}: ${totalViolations} infractions`}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                        <div className="relative z-10 text-center">
                                            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Carte des infractions</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cartographie des infractions sur Abidjan */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Cartographie des infractions sur Abidjan</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    <div className="aspect-square bg-gray-100 rounded flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                                            {/* Points concentrés pour simulation zone urbaine */}
                                            {data.vehicle_details.slice(0, 8).map((vehicle, idx) => {
                                                const totalViolations = vehicle.total_violations || 0;
                                                if (totalViolations === 0) return null;
                                                
                                                // Concentré au centre pour simuler Abidjan
                                                const left = 35 + (idx * 7) % 30;
                                                const top = 35 + (idx * 11) % 30;
                                                const size = Math.min(8 + totalViolations / 15, 30);
                                                const color = totalViolations > 100 ? 'bg-red-500 border-red-600' : 'bg-blue-500 border-blue-600';
                                                
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`absolute rounded-full ${color} opacity-70 border-2`}
                                                        style={{
                                                            left: `${left}%`,
                                                            top: `${top}%`,
                                                            width: `${size}px`,
                                                            height: `${size}px`
                                                        }}
                                                        title={`${vehicle.immatriculation}: ${totalViolations} infractions`}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                        <div className="relative z-10 text-center">
                                            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Zone Abidjan</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Nombre de véhicules par Type d'événement */}
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                    <CardTitle className="text-base">Nombre de véhicules par Type d'événement</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    {(() => {
                                        const nightDriving = data.vehicle_details.filter(v => (v.driving_time_violations || 0) > 0).length;
                                        const durationViolation = data.vehicle_details.filter(v => (v.driving_time_violations || 0) > 0).length;
                                        const speedViolation = data.vehicle_details.filter(v => (v.speed_violations || 0) > 0).length;
                                        const total = data.vehicle_details.length;
                                        
                                        const nightPercent = (nightDriving / total * 100).toFixed(2);
                                        const durationPercent = (durationViolation / total * 100).toFixed(2);
                                        const speedPercent = (speedViolation / total * 100).toFixed(2);
                                        
                                        return (
                                            <div>
                                                {/* Donut chart */}
                                                <div className="relative w-48 h-48 mx-auto mb-4">
                                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                                        {(() => {
                                                            let currentAngle = 0;
                                                            const data = [
                                                                { value: parseFloat(speedPercent), color: '#ef4444', label: 'Conduite de nuit' },
                                                                { value: parseFloat(durationPercent), color: '#06b6d4', label: 'Infraction sur durée' },
                                                                { value: parseFloat(nightPercent), color: '#10b981', label: 'SPEED' }
                                                            ];
                                                            
                                                            return data.map((item, idx) => {
                                                                const angle = (item.value / 100) * 360;
                                                                const startAngle = currentAngle;
                                                                currentAngle += angle;
                                                                
                                                                const startRad = (startAngle * Math.PI) / 180;
                                                                const endRad = (currentAngle * Math.PI) / 180;
                                                                
                                                                const x1 = 50 + 40 * Math.cos(startRad);
                                                                const y1 = 50 + 40 * Math.sin(startRad);
                                                                const x2 = 50 + 40 * Math.cos(endRad);
                                                                const y2 = 50 + 40 * Math.sin(endRad);
                                                                
                                                                const largeArc = angle > 180 ? 1 : 0;
                                                                
                                                                return (
                                                                    <path
                                                                        key={idx}
                                                                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                        fill={item.color}
                                                                        stroke="white"
                                                                        strokeWidth="0.5"
                                                                    />
                                                                );
                                                            });
                                                        })()}
                                                        <circle cx="50" cy="50" r="25" fill="white" />
                                                    </svg>
                                                    {/* Percentages */}
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        <div className="text-xs font-semibold">{speedPercent}%</div>
                                                    </div>
                                                </div>
                                                
                                                {/* Légende */}
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                            <span>Conduite de nuit</span>
                                                        </div>
                                                        <span className="font-semibold">{nightPercent}%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                                            <span>Infraction sur durée de...</span>
                                                        </div>
                                                        <span className="font-semibold">{durationPercent}%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                            <span>SPEED</span>
                                                        </div>
                                                        <span className="font-semibold">{speedPercent}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tableau des données par chauffeur */}
                        <Card className="mt-6 border-2">
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
                                            {data.vehicle_details.map((vehicle, index) => {
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
                                                    {data.vehicle_details.reduce((sum, v) => sum + (v.driving_time_violations || 0), 0)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {data.vehicle_details.reduce((sum, v) => sum + (v.driving_time_violations || 0), 0)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {data.vehicle_details.reduce((sum, v) => sum + (v.speed_violations || 0), 0)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {data.vehicle_details.reduce((sum, v) => 
                                                        sum + (v.driving_time_violations || 0) * 2 + (v.speed_violations || 0), 0
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
