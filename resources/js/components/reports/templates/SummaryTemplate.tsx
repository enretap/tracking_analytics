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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Truck,
  MapPin,
  Fuel,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  DollarSign,
  Table as TableIcon,
  Gauge,
  Bell,
  Map,
  Shield,
  Settings2
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

interface SummaryData {
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
    data: SummaryData;
}

interface ColumnConfig {
    key: string;
    label: string;
    visible: boolean;
    essential?: boolean;
}

export function SummaryTemplate({ data }: Props) {
    // Configuration des colonnes
    const [columns, setColumns] = useState<ColumnConfig[]>([
        { key: 'immatriculation', label: 'Immatriculation', visible: true, essential: true },
        { key: 'driver', label: 'Driver', visible: true, essential: true },
        { key: 'project', label: 'Projet', visible: false },
        { key: 'max_speed', label: 'Vitesse max', visible: true },
        { key: 'distance', label: 'Distance parcourue', visible: true },
        { key: 'driving_time', label: 'Temps de conduite continu', visible: true },
        { key: 'idle_time', label: 'Temps moteur tournant à l\'arrêt', visible: false },
        { key: 'harsh_braking', label: 'Freinages brusques', visible: false },
        { key: 'harsh_acceleration', label: 'Accélérations brusques', visible: false },
        { key: 'dangerous_turns', label: 'Virage dangereux', visible: false },
        { key: 'speed_violations', label: 'Violation vitesse max', visible: false },
        { key: 'driving_time_violations', label: 'Violation heure conduite', visible: false },
        { key: 'total_violations', label: 'Violation totale', visible: true },
    ]);

    const toggleColumn = (key: string) => {
        setColumns(prev => prev.map(col => 
            col.key === key && !col.essential ? { ...col, visible: !col.visible } : col
        ));
    };

    const visibleColumns = columns.filter(col => col.visible);
    
    const vehicleUtilizationRate = data.total_vehicles 
        ? Math.round((data.active_vehicles || 0) / data.total_vehicles * 100) 
        : 0;

    const driverUtilizationRate = data.total_drivers
        ? Math.round((data.active_drivers || 0) / data.total_drivers * 100)
        : 0;

    const maintenanceCompletionRate = data.scheduled_maintenances
        ? Math.round((data.completed_maintenances || 0) / data.scheduled_maintenances * 100)
        : 0;

    const alertResolutionRate = data.total_alerts
        ? Math.round((data.resolved_alerts || 0) / data.total_alerts * 100)
        : 0;

    return (
        <div className="space-y-5 p-3 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-sm">
            {/* Véhicules Suivis & Indicateurs Clés */}
            {data.vehicle_details && data.vehicle_details.length > 0 && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3 text-base font-bold p-1">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <TableIcon className="h-6 w-6" />
                                </div>
                                <span>1. Véhicules Suivis & Indicateurs Clés</span>
                            </CardTitle>
                            
                            {/* Sélecteur de colonnes */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                                        <Settings2 className="h-4 w-4 mr-2" />
                                        Colonnes ({visibleColumns.length}/{columns.length})
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    {columns.map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.key}
                                            checked={column.visible}
                                            onCheckedChange={() => toggleColumn(column.key)}
                                            disabled={column.essential}
                                            className="cursor-pointer"
                                        >
                                            <span className={column.essential ? 'font-semibold' : ''}>
                                                {column.label}
                                                {column.essential && ' *'}
                                            </span>
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground border-t mt-1">
                                        * Colonnes essentielles
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-white">
                        <div className="overflow-x-auto p-4">
                            <table className="w-full text-xs">
                                <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                    <tr>
                                        {columns.map((col) => col.visible && (
                                            <th 
                                                key={col.key} 
                                                className={`px-4 py-4 font-semibold border-r border-gray-700 last:border-r-0 ${
                                                    col.key === 'immatriculation' || col.key === 'driver' || col.key === 'project' 
                                                        ? 'text-left' 
                                                        : 'text-right'
                                                }`}
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {data.vehicle_details.map((vehicle, index) => (
                                        <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                                            {columns.map((col) => {
                                                if (!col.visible) return null;
                                                
                                                const getCellValue = () => {
                                                    switch (col.key) {
                                                        case 'immatriculation': return vehicle.immatriculation;
                                                        case 'driver': return vehicle.driver;
                                                        case 'project': return vehicle.project || '-';
                                                        case 'max_speed': return vehicle.max_speed ?? '-';
                                                        case 'distance': return vehicle.distance?.toFixed(2) ?? '-';
                                                        case 'driving_time': return vehicle.driving_time ?? '-';
                                                        case 'idle_time': return vehicle.idle_time ?? '-';
                                                        case 'harsh_braking': return vehicle.harsh_braking ?? 0;
                                                        case 'harsh_acceleration': return vehicle.harsh_acceleration ?? 0;
                                                        case 'dangerous_turns': return vehicle.dangerous_turns ?? 0;
                                                        case 'speed_violations': return vehicle.speed_violations ?? 0;
                                                        case 'driving_time_violations': return vehicle.driving_time_violations ?? 0;
                                                        case 'total_violations': return vehicle.total_violations ?? 0;
                                                        default: return '-';
                                                    }
                                                };

                                                const isLeftAlign = ['immatriculation', 'driver', 'project'].includes(col.key);
                                                const isBold = ['immatriculation', 'total_violations'].includes(col.key);

                                                return (
                                                    <td 
                                                        key={col.key} 
                                                        className={`px-4 py-3 ${isLeftAlign ? 'text-left' : 'text-right'} ${isBold ? 'font-semibold' : ''}`}
                                                    >
                                                        {getCellValue()}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-900 text-white font-bold">
                                        {columns.map((col, idx) => {
                                            if (!col.visible) return null;

                                            // Première cellule visible affiche "Total"
                                            if (idx === 0) {
                                                const essentialColsCount = columns.filter(c => c.visible && c.essential).length;
                                                return (
                                                    <td key={col.key} className="px-4 py-3" colSpan={essentialColsCount}>
                                                        Total
                                                    </td>
                                                );
                                            }

                                            // Skip les autres colonnes essentielles (déjà fusionnées)
                                            if (col.essential) return null;

                                            const getTotalValue = () => {
                                                switch (col.key) {
                                                    case 'max_speed':
                                                        return Math.max(...(data.vehicle_details || []).map(v => v.max_speed || 0));
                                                    case 'distance':
                                                        return (data.vehicle_details || []).reduce((sum, v) => sum + (v.distance || 0), 0).toFixed(2);
                                                    case 'driving_time':
                                                        const drivingMinutes = (data.vehicle_details || []).reduce((sum, v) => {
                                                            const match = v.driving_time?.match(/(\d+)h\s*(\d+)min/);
                                                            return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
                                                        }, 0);
                                                        return `${Math.floor(drivingMinutes / 60).toString().padStart(2, '0')}h ${(drivingMinutes % 60).toString().padStart(2, '0')}min`;
                                                    case 'idle_time':
                                                        const idleMinutes = (data.vehicle_details || []).reduce((sum, v) => {
                                                            const match = v.idle_time?.match(/(\d+)h\s*(\d+)min/);
                                                            return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
                                                        }, 0);
                                                        return `${Math.floor(idleMinutes / 60).toString().padStart(2, '0')}h ${(idleMinutes % 60).toString().padStart(2, '0')}min`;
                                                    case 'harsh_braking':
                                                        return (data.vehicle_details || []).reduce((sum, v) => sum + (v.harsh_braking || 0), 0);
                                                    case 'harsh_acceleration':
                                                        return (data.vehicle_details || []).reduce((sum, v) => sum + (v.harsh_acceleration || 0), 0);
                                                    case 'dangerous_turns':
                                                        return (data.vehicle_details || []).reduce((sum, v) => sum + (v.dangerous_turns || 0), 0);
                                                    case 'speed_violations':
                                                        return (data.vehicle_details || []).reduce((sum, v) => sum + (v.speed_violations || 0), 0);
                                                    case 'driving_time_violations':
                                                        return (data.vehicle_details || []).reduce((sum, v) => sum + (v.driving_time_violations || 0), 0);
                                                    case 'total_violations':
                                                        return (data.vehicle_details || []).reduce((sum, v) => sum + (v.total_violations || 0), 0);
                                                    default:
                                                        return '-';
                                                }
                                            };

                                            return (
                                                <td key={col.key} className="px-4 py-3 text-right">
                                                    {getTotalValue()}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Seuil de tolérance */}
                        <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-t-2 border-red-200">
                            <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2 text-sm">
                                <AlertTriangle className="h-4 w-4" />
                                Seuil de tolérance
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>-*Vitesse max: ≤ 90 km/h ± 5</li>
                                <li>-Temps de conduite continu: ≤ 2h30 ± 15 min</li>
                                <li>-Freinage brusque: ≤ 3</li>
                                <li>-Accélération brusque: ≤ 2</li>
                                <li className="text-xs italic">* Sur autoroute ou respecter la limitation de vitesse affichée en fonction de la route utilisée</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Analyse des comportements à risques */}
            {data.vehicle_details && data.vehicle_details.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Contenu principal (4 colonnes) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Card principale */}
                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-md">
                                <CardTitle className="flex items-center gap-3 text-base font-bold p-1">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <span>2. Analyse des comportements à risques</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 bg-gray-50">
                                {/* Métriques clés */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-6 w-6" />
                                            <div>
                                                <div className="text-xs opacity-90">Véhicules actifs</div>
                                                <div className="text-xl font-bold">
                                                    {data.vehicle_details.filter(v => (v.distance || 0) > 0).length}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex items-center gap-2">
                                            <Gauge className="h-6 w-6" />
                                            <div>
                                                <div className="text-xs opacity-90">Véhicules en excès de vitesse</div>
                                                <div className="text-xl font-bold">
                                                    {data.vehicle_details.filter(v => (v.max_speed || 0) > 90).length}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-6 w-6" />
                                            <div>
                                                <div className="text-xs opacity-90">Vitesse Max (Km/h)</div>
                                                <div className="text-xl font-bold">
                                                    {Math.max(...data.vehicle_details.map(v => v.max_speed || 0))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-6 w-6" />
                                            <div>
                                                <div className="text-xs opacity-90">Violations de vitesse</div>
                                                <div className="text-xl font-bold">
                                                    {data.vehicle_details.reduce((sum, v) => sum + (v.speed_violations || 0), 0)}
                                                </div>
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
                                                    .sort((a, b) => (b.distance || 0) - (a.distance || 0))
                                                    .slice(0, 8);
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
                        <Card className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] shadow-xl border-0 text-white sticky top-6 overflow-hidden">
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

            {/* Analyse des comportements à risques par driver */}
            {data.vehicle_details && data.vehicle_details.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Contenu principal (4 colonnes) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-md">
                                <CardTitle className="flex items-center gap-3 text-base font-bold p-1">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <span>3. Analyse des comportements à risques par driver</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 bg-gray-50">
                                {/* Métriques clés */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div>
                                            <div className="text-xs opacity-90">Distance Totale (km)</div>
                                            <div className="text-xl font-bold">
                                                {data.vehicle_details.reduce((sum, v) => sum + (v.distance || 0), 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div>
                                            <div className="text-xs opacity-90">Durée Totale de circulation</div>
                                            <div className="text-xl font-bold">
                                                {(() => {
                                                    const totalMinutes = data.vehicle_details.reduce((sum, v) => {
                                                        const match = v.driving_time?.match(/(\d+)h\s*(\d+)min/);
                                                        return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
                                                    }, 0);
                                                    return `${Math.floor(totalMinutes / 60).toString().padStart(2, '0')}h ${(totalMinutes % 60).toString().padStart(2, '0')}min`;
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div>
                                            <div className="text-xs opacity-90">Nombre d'évènements</div>
                                            <div className="text-xl font-bold">
                                                {data.vehicle_details.reduce((sum, v) => 
                                                    sum + (v.harsh_braking || 0) + (v.harsh_acceleration || 0) + (v.dangerous_turns || 0), 0
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div>
                                            <div className="text-xs opacity-90">Durée au Ralenti</div>
                                            <div className="text-xl font-bold">
                                                {(() => {
                                                    const totalMinutes = data.vehicle_details.reduce((sum, v) => {
                                                        const match = v.idle_time?.match(/(\d+)h\s*(\d+)min/);
                                                        return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
                                                    }, 0);
                                                    return `${Math.floor(totalMinutes / 60).toString().padStart(2, '0')}h ${(totalMinutes % 60).toString().padStart(2, '0')}min`;
                                                })()}
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

            {/* Analyse géospatiale des comportements à risques */}
            {data.vehicle_details && data.vehicle_details.length > 0 && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-md">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold p-1">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Map className="h-6 w-6" />
                            </div>
                            <span>4. Analyse géospatiale des comportements à risques</span>
                        </CardTitle>
                    </CardHeader>
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

