import { useState, useEffect, useCallback } from 'react';

interface EcoDrivingData {
    total_vehicles?: number;
    active_vehicles?: number;
    inactive_vehicles?: number;
    total_distance?: number;
    total_drivers?: number;
    active_drivers?: number;
    average_driver_score?: number;
    total_trips?: number;
    average_trip_distance?: number;
    operating_hours?: number;
    total_fuel_consumption?: number;
    average_fuel_efficiency?: number;
    fuel_cost?: number;
    scheduled_maintenances?: number;
    completed_maintenances?: number;
    pending_maintenances?: number;
    maintenance_cost?: number;
    total_alerts?: number;
    critical_alerts?: number;
    resolved_alerts?: number;
    compliance_rate?: number;
    on_time_delivery?: number;
    period_start?: string;
    period_end?: string;
    vehicle_details?: VehicleDriverDetail[];
}

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

interface UseEcoDrivingOptions {
    startDate?: string;
    endDate?: string;
    autoRefresh?: boolean;
    refreshInterval?: number; // in milliseconds
}

interface UseEcoDrivingReturn {
    data: EcoDrivingData;
    loading: boolean;
    error: string | null;
    refetch: (forceRefresh?: boolean) => Promise<void>;
}

/**
 * Hook pour récupérer et gérer les données d'éco-conduite depuis TARGA TELEMATICS
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useEcoDriving({
 *   startDate: '2025-12-01',
 *   endDate: '2025-12-31',
 *   autoRefresh: true,
 *   refreshInterval: 300000 // 5 minutes
 * });
 * ```
 */
export function useEcoDriving(options: UseEcoDrivingOptions = {}): UseEcoDrivingReturn {
    const {
        startDate,
        endDate,
        autoRefresh = false,
        refreshInterval = 300000, // 5 minutes par défaut
    } = options;

    const [data, setData] = useState<EcoDrivingData>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (forceRefresh = false) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            if (forceRefresh) params.append('force_refresh', 'true');

            const response = await fetch(`/api/eco-driving?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error || 'Erreur lors du chargement des données');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
            console.error('Error fetching eco-driving data:', err);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-refresh
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchData();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}
