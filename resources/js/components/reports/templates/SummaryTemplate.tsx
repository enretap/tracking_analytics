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

        </div>
    );
}

