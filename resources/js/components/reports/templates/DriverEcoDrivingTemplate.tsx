import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Leaf,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  MapPin,
  Fuel,
  AlertTriangle,
  CheckCircle,
  Activity,
  Gauge,
  Zap,
  Wind,
  Clock,
  Settings2,
  Table as TableIcon
} from 'lucide-react';
import { useState } from 'react';

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

interface DriverEcoDrivingData {
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
    data: DriverEcoDrivingData;
}

interface ColumnConfig {
    key: string;
    label: string;
    visible: boolean;
    essential?: boolean;
}

export function DriverEcoDrivingTemplate({ data }: Props) {
    
    return (
        <div className="space-y-5 p-3 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-sm">
             {/* Analyse des comportements à risques par driver */}
            {data.vehicle_details && data.vehicle_details.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Contenu principal (4 colonnes) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
                            
                            <CardContent className="p-6 bg-gray-50">
                                {/* Métriques clés */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90"></div>
                                        <div className="relative p-4 flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <MapPin className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">Distance totale</div>
                                                <div className="text-3xl font-bold text-white">
                                                    {data.vehicle_details.reduce((sum, v) => sum + (v.distance || 0), 0).toFixed(0)}
                                                </div>
                                                <div className="text-xs text-white/80 mt-1">km parcourus</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-90"></div>
                                        <div className="relative p-4 flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <Clock className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">Temps de conduite</div>
                                                <div className="text-2xl font-bold text-white">
                                                    {(() => {
                                                        const totalMinutes = data.vehicle_details.reduce((sum, v) => {
                                                            const match = v.driving_time?.match(/(\d+)h\s*(\d+)min/);
                                                            return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
                                                        }, 0);
                                                        return `${Math.floor(totalMinutes / 60)}h ${(totalMinutes % 60).toString().padStart(2, '0')}`;
                                                    })()}
                                                </div>
                                                <div className="text-xs text-white/80 mt-1">En circulation</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-90"></div>
                                        <div className="relative p-4 flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <AlertTriangle className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">Évènements totaux</div>
                                                <div className="text-3xl font-bold text-white">
                                                    {data.vehicle_details.reduce((sum, v) => 
                                                        sum + (v.harsh_braking || 0) + (v.harsh_acceleration || 0) + (v.dangerous_turns || 0), 0
                                                    )}
                                                </div>
                                                <div className="text-xs text-white/80 mt-1">Infractions détectées</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 opacity-90"></div>
                                        <div className="relative p-4 flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <Zap className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">Temps au ralenti</div>
                                                <div className="text-2xl font-bold text-white">
                                                    {(() => {
                                                        const totalMinutes = data.vehicle_details.reduce((sum, v) => {
                                                            const match = v.idle_time?.match(/(\d+)h\s*(\d+)min/);
                                                            return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
                                                        }, 0);
                                                        return `${Math.floor(totalMinutes / 60)}h ${(totalMinutes % 60).toString().padStart(2, '0')}`;
                                                    })()}
                                                </div>
                                                <div className="text-xs text-white/80 mt-1">Moteur au ralenti</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Graphiques */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Répartition des infractions par véhicule (%) */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                            <CardTitle className="text-base">Répartition des infractions par véhicule (%)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white p-4">
                                            {(() => {
                                                const totalViolations = data.vehicle_details.reduce((sum, v) => sum + (v.total_violations || 0), 0);
                                                const topViolators = data.vehicle_details
                                                    .filter(v => (v.total_violations || 0) > 0)
                                                    .sort((a, b) => (b.total_violations || 0) - (a.total_violations || 0))
                                                    .slice(0, 6);
                                                
                                                if (totalViolations === 0) {
                                                    return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                                }

                                                const colors = ['#1e3a5f', '#8B4513', '#d946ef', '#f59e0b', '#10b981', '#ef4444'];
                                                
                                                return (
                                                    <div className="flex flex-col items-center gap-1">
                                                        {/* Donut chart */}
                                                        <div className="relative w-64 h-64">
                                                            <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                                                {(() => {
                                                                    let currentAngle = 0;
                                                                    return topViolators.map((vehicle, idx) => {
                                                                        const percentage = (vehicle.total_violations || 0) / totalViolations;
                                                                        const angle = percentage * 360;
                                                                        const startAngle = currentAngle;
                                                                        currentAngle += angle;
                                                                        
                                                                        const startRad = (startAngle * Math.PI) / 180;
                                                                        const endRad = (currentAngle * Math.PI) / 180;
                                                                        
                                                                        const x1 = 100 + 75 * Math.cos(startRad);
                                                                        const y1 = 100 + 75 * Math.sin(startRad);
                                                                        const x2 = 100 + 75 * Math.cos(endRad);
                                                                        const y2 = 100 + 75 * Math.sin(endRad);
                                                                        
                                                                        const largeArc = angle > 180 ? 1 : 0;
                                                                        
                                                                        return (
                                                                            <path
                                                                                key={idx}
                                                                                d={`M 100 100 L ${x1} ${y1} A 75 75 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                                fill={colors[idx]}
                                                                                stroke="white"
                                                                                strokeWidth="2"
                                                                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                                                            />
                                                                        );
                                                                    });
                                                                })()}
                                                                <circle cx="100" cy="100" r="50" fill="white" />
                                                            </svg>
                                                            {/* Total au centre */}
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                <div className="text-3xl font-bold text-gray-800">{totalViolations}</div>
                                                                <div className="text-xs text-gray-500">Total</div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Légende améliorée */}
                                                        <div className="w-full grid grid-cols-2 gap-1.5 text-xs">
                                                            {topViolators.map((vehicle, idx) => {
                                                                const percentage = ((vehicle.total_violations || 0) / totalViolations * 100).toFixed(1);
                                                                return (
                                                                    <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-gray-50">
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[idx] }}></div>
                                                                            <span className="font-medium truncate">{vehicle.immatriculation}</span>
                                                                        </div>
                                                                        <div className="flex flex-col items-end text-right flex-shrink-0">
                                                                            <span className="font-bold text-gray-800">{percentage}%</span>
                                                                            <span className="text-gray-500 text-[10px]">({vehicle.total_violations})</span>
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

                                    {/* Nombre d'infractions par véhicules */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                            <CardTitle className="text-base">Nombre d'infractions par véhicules</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white p-4">
                                            {(() => {
                                                const topViolators = data.vehicle_details
                                                    .filter(v => (v.harsh_braking || 0) + (v.harsh_acceleration || 0) + (v.dangerous_turns || 0) > 0)
                                                    .sort((a, b) => 
                                                        ((b.harsh_braking || 0) + (b.harsh_acceleration || 0) + (b.dangerous_turns || 0)) -
                                                        ((a.harsh_braking || 0) + (a.harsh_acceleration || 0) + (a.dangerous_turns || 0))
                                                    )
                                                    .slice(0, 4);
                                                
                                                const maxValue = Math.max(
                                                    ...topViolators.map(v => 
                                                        Math.max(v.harsh_braking || 0, v.harsh_acceleration || 0, v.dangerous_turns || 0)
                                                    )
                                                );
                                                
                                                if (topViolators.length === 0) {
                                                    return <div className="text-center text-gray-500 py-8">Aucune infraction</div>;
                                                }
                                                
                                                return (
                                                    <div className="space-y-3">
                                                        {/* Légende */}
                                                        <div className="flex gap-4 text-xs justify-center bg-gray-50 p-2 rounded">
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-3 h-3 rounded bg-[#1e3a5f]"></div>
                                                                <span>Virages dangereux</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-3 h-3 rounded bg-[#d946ef]"></div>
                                                                <span>Freinages brusques</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-3 h-3 rounded bg-[#8B4513]"></div>
                                                                <span>Accélérations brusques</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Barres groupées */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-end justify-around h-56 gap-6 pb-2">
                                                                {topViolators.map((vehicle, idx) => (
                                                                    <div key={idx} className="flex-1 flex gap-2 items-end justify-center h-full">
                                                                        {/* Virages */}
                                                                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                                                                            <div className="text-xs font-bold mb-1 text-[#1e3a5f]">{vehicle.dangerous_turns || 0}</div>
                                                                            <div 
                                                                                className="w-full bg-gradient-to-t from-[#1e3a5f] to-[#3b5998] rounded-t transition-all duration-300 hover:opacity-80 min-h-[6px]"
                                                                                style={{ height: `${((vehicle.dangerous_turns || 0) / maxValue * 100)}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        {/* Freinages */}
                                                                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                                                                            <div className="text-xs font-bold mb-1 text-[#d946ef]">{vehicle.harsh_braking || 0}</div>
                                                                            <div 
                                                                                className="w-full bg-gradient-to-t from-[#d946ef] to-[#f0abfc] rounded-t transition-all duration-300 hover:opacity-80 min-h-[6px]"
                                                                                style={{ height: `${((vehicle.harsh_braking || 0) / maxValue * 100)}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        {/* Accélérations */}
                                                                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                                                                            <div className="text-xs font-bold mb-1 text-[#8B4513]">{vehicle.harsh_acceleration || 0}</div>
                                                                            <div 
                                                                                className="w-full bg-gradient-to-t from-[#8B4513] to-[#D4A76A] rounded-t transition-all duration-300 hover:opacity-80 min-h-[6px]"
                                                                                style={{ height: `${((vehicle.harsh_acceleration || 0) / maxValue * 100)}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            
                                                            {/* Labels des véhicules */}
                                                            <div className="flex justify-around gap-6">
                                                                {topViolators.map((vehicle, idx) => (
                                                                    <div key={idx} className="flex-1 text-center text-xs font-semibold text-gray-700">
                                                                        {vehicle.immatriculation}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </CardContent>
                                    </Card>

                                    {/* Score de risque par véhicule */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                            <CardTitle className="text-base">Score de risque par véhicule</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white">
                                            {(() => {
                                                const getRiskColor = (violations: number) => {
                                                    if (violations === 0) return '#10b981'; // Vert - ACCEPTABLE
                                                    if (violations < 50) return '#f59e0b'; // Jaune - ÉLEVÉ
                                                    return '#ef4444'; // Rouge - CRITIQUE
                                                };
                                                
                                                const sortedVehicles = [...data.vehicle_details]
                                                    .sort((a, b) => (b.total_violations || 0) - (a.total_violations || 0))
                                                    .slice(0, 10);
                                                
                                                const maxViolations = Math.max(...sortedVehicles.map(v => v.total_violations || 0));
                                                
                                                return (
                                                    <div className="space-y-2">
                                                        {sortedVehicles.map((vehicle, idx) => (
                                                            <div key={idx}>
                                                                <div className="flex justify-between mb-1 text-xs">
                                                                    <span>{vehicle.immatriculation}</span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded h-5">
                                                                    <div 
                                                                        className="h-5 rounded transition-all"
                                                                        style={{ 
                                                                            width: `${maxViolations > 0 ? ((vehicle.total_violations || 0) / maxViolations * 100) : 0}%`,
                                                                            backgroundColor: getRiskColor(vehicle.total_violations || 0),
                                                                            minWidth: (vehicle.total_violations || 0) > 0 ? '20px' : '0'
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                        </CardContent>
                                    </Card>

                                    {/* Distribution des distances parcourues par véhicule */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                            <CardTitle className="text-base">Distribution des distances parcourues par véhicule (km)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white p-4">
                                            {(() => {
                                                const sortedByDistance = [...data.vehicle_details]
                                                    .sort((a, b) => (b.distance || 0) - (a.distance || 0))
                                                    .slice(0, 9);
                                                const maxDistance = Math.max(...sortedByDistance.map(v => v.distance || 0));
                                                
                                                return (
                                                    <div className="space-y-2">
                                                        <div className="flex items-end justify-around h-64 gap-2 pb-6">
                                                            {sortedByDistance.map((vehicle, idx) => {
                                                                const heightPercent = (vehicle.distance || 0) / maxDistance * 100;
                                                                return (
                                                                    <div key={idx} className="flex flex-col items-center justify-end flex-1 h-full">
                                                                        <div className="text-xs font-semibold mb-1 text-[#1e3a5f]">
                                                                            {vehicle.distance ? (vehicle.distance).toFixed(0) : '0'}
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

                                    {/* Taux d'utilisation des véhicules */}
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white md:col-span-2">
                                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                            <CardTitle className="text-base">Taux d'utilisation des véhicules (Durée de conduite VS Temps au ralenti)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white p-4">
                                            {(() => {
                                                const vehiclesWithTime = data.vehicle_details
                                                    .map(v => {
                                                        const drivingMatch = v.driving_time?.match(/(\d+)h\s*(\d+)min/);
                                                        const idleMatch = v.idle_time?.match(/(\d+)h\s*(\d+)min/);
                                                        const drivingMinutes = drivingMatch ? parseInt(drivingMatch[1]) * 60 + parseInt(drivingMatch[2]) : 0;
                                                        const idleMinutes = idleMatch ? parseInt(idleMatch[1]) * 60 + parseInt(idleMatch[2]) : 0;
                                                        const totalMinutes = drivingMinutes + idleMinutes;
                                                        return {
                                                            ...v,
                                                            drivingMinutes,
                                                            idleMinutes,
                                                            totalMinutes,
                                                            drivingPercent: totalMinutes > 0 ? (drivingMinutes / totalMinutes * 100) : 0,
                                                            idlePercent: totalMinutes > 0 ? (idleMinutes / totalMinutes * 100) : 0
                                                        };
                                                    })
                                                    .filter(v => v.totalMinutes > 0)
                                                    .sort((a, b) => b.drivingPercent - a.drivingPercent)
                                                    .slice(0, 10);
                                                
                                                if (vehiclesWithTime.length === 0) {
                                                    return <div className="text-center text-gray-500 py-8">Aucune donnée disponible</div>;
                                                }
                                                
                                                const maxPercent = Math.max(
                                                    ...vehiclesWithTime.map(v => Math.max(v.drivingPercent, v.idlePercent))
                                                );
                                                const yMax = Math.ceil(maxPercent / 10) * 10;
                                                
                                                return (
                                                    <div className="space-y-4">
                                                        {/* Légende */}
                                                        <div className="flex gap-6 text-xs justify-center bg-gray-50 p-3 rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-0.5 bg-[#1e3a5f]"></div>
                                                                    <div className="w-2 h-2 rounded-full bg-[#1e3a5f] -ml-1"></div>
                                                                </div>
                                                                <span className="font-medium text-[#1e3a5f]">Durée de conduite (%)</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-0.5 bg-[#f59e0b]"></div>
                                                                    <div className="w-2 h-2 rounded-full bg-[#f59e0b] -ml-1"></div>
                                                                </div>
                                                                <span className="font-medium text-[#f59e0b]">Temps au ralenti (%)</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Graphique avec courbes */}
                                                        <div className="relative pt-4 pb-12">
                                                            <div className="relative h-64 border-l-2 border-b-2 border-gray-300 ml-8">
                                                                {/* Axe Y - échelle */}
                                                                <div className="absolute -left-8 inset-y-0 flex flex-col justify-between text-xs text-gray-600 font-medium">
                                                                    {[yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0].map((val, i) => (
                                                                        <div key={i} className="relative">
                                                                            <span className="absolute right-1 -translate-y-1/2">{val.toFixed(0)}%</span>
                                                                            <div className="absolute left-8 w-full border-t border-gray-200 border-dashed"></div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                
                                                                {/* SVG pour les courbes */}
                                                                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                                    {/* Courbe durée de conduite */}
                                                                    <polyline
                                                                        fill="none"
                                                                        stroke="#1e3a5f"
                                                                        strokeWidth="0.8"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        vectorEffect="non-scaling-stroke"
                                                                        points={vehiclesWithTime.map((v, i) => {
                                                                            const x = (i / (vehiclesWithTime.length - 1)) * 100;
                                                                            const y = 100 - (v.drivingPercent / yMax * 100);
                                                                            return `${x},${y}`;
                                                                        }).join(' ')}
                                                                    />
                                                                    
                                                                    {/* Points et valeurs - durée de conduite */}
                                                                    {vehiclesWithTime.map((v, i) => {
                                                                        const x = (i / (vehiclesWithTime.length - 1)) * 100;
                                                                        const y = 100 - (v.drivingPercent / yMax * 100);
                                                                        return (
                                                                            <g key={`driving-${i}`}>
                                                                                <circle 
                                                                                    cx={x} 
                                                                                    cy={y} 
                                                                                    r="1.5" 
                                                                                    fill="white"
                                                                                    stroke="#1e3a5f"
                                                                                    strokeWidth="0.6"
                                                                                    vectorEffect="non-scaling-stroke"
                                                                                />
                                                                            </g>
                                                                        );
                                                                    })}
                                                                    
                                                                    {/* Courbe temps au ralenti */}
                                                                    <polyline
                                                                        fill="none"
                                                                        stroke="#f59e0b"
                                                                        strokeWidth="0.8"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeDasharray="2,2"
                                                                        vectorEffect="non-scaling-stroke"
                                                                        points={vehiclesWithTime.map((v, i) => {
                                                                            const x = (i / (vehiclesWithTime.length - 1)) * 100;
                                                                            const y = 100 - (v.idlePercent / yMax * 100);
                                                                            return `${x},${y}`;
                                                                        }).join(' ')}
                                                                    />
                                                                    
                                                                    {/* Points et valeurs - temps au ralenti */}
                                                                    {vehiclesWithTime.map((v, i) => {
                                                                        const x = (i / (vehiclesWithTime.length - 1)) * 100;
                                                                        const y = 100 - (v.idlePercent / yMax * 100);
                                                                        return (
                                                                            <g key={`idle-${i}`}>
                                                                                <circle 
                                                                                    cx={x} 
                                                                                    cy={y} 
                                                                                    r="1.5" 
                                                                                    fill="white"
                                                                                    stroke="#f59e0b"
                                                                                    strokeWidth="0.6"
                                                                                    vectorEffect="non-scaling-stroke"
                                                                                />
                                                                            </g>
                                                                        );
                                                                    })}
                                                                </svg>
                                                                
                                                                {/* Labels avec valeurs au-dessus du graphique */}
                                                                <div className="absolute inset-0 pointer-events-none">
                                                                    {vehiclesWithTime.map((v, i) => {
                                                                        const xPercent = (i / (vehiclesWithTime.length - 1)) * 100;
                                                                        const yDrivingPercent = 100 - (v.drivingPercent / yMax * 100);
                                                                        const yIdlePercent = 100 - (v.idlePercent / yMax * 100);
                                                                        return (
                                                                            <div key={i}>
                                                                                {/* Valeur durée de conduite */}
                                                                                <div 
                                                                                    className="absolute text-[10px] font-bold text-[#1e3a5f] whitespace-nowrap"
                                                                                    style={{ 
                                                                                        left: `${xPercent}%`, 
                                                                                        top: `${yDrivingPercent}%`,
                                                                                        transform: 'translate(-50%, -20px)'
                                                                                    }}
                                                                                >
                                                                                    {v.drivingPercent.toFixed(1)}%
                                                                                </div>
                                                                                {/* Valeur temps au ralenti */}
                                                                                <div 
                                                                                    className="absolute text-[10px] font-bold text-[#f59e0b] whitespace-nowrap"
                                                                                    style={{ 
                                                                                        left: `${xPercent}%`, 
                                                                                        top: `${yIdlePercent}%`,
                                                                                        transform: 'translate(-50%, 12px)'
                                                                                    }}
                                                                                >
                                                                                    {v.idlePercent.toFixed(1)}%
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                
                                                                {/* Axe X - labels véhicules */}
                                                                <div className="absolute -bottom-10 left-0 right-0 flex justify-between px-1">
                                                                    {vehiclesWithTime.map((v, i) => (
                                                                        <div 
                                                                            key={i} 
                                                                            className="text-[10px] font-medium text-gray-700 transform -rotate-45 origin-top-left"
                                                                            style={{ width: '60px' }}
                                                                        >
                                                                            {v.immatriculation}
                                                                        </div>
                                                                    ))}
                                                                </div>
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

                    {/* Classification des Niveaux de Risque (sidebar) - Identique à la section 2 */}
                    <div className="lg:col-span-1">
                        <Card className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] shadow-lg text-white sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-center text-base">
                                    Classification des Niveaux de Risque
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
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

                                            {/* ACCEPTABLE */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    <span className="font-semibold">ACCEPTABLE</span>
                                                </div>
                                                <div className="space-y-1 pl-5 text-sm">
                                                    {acceptable.map((v, i) => (
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
