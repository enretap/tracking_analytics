import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Vehicle {
  id: string;
  platform_id: number;
  platform_slug: string;
  name: string;
  plate: string;
  status: 'active' | 'inactive' | 'maintenance' | 'unknown';
  distance: number;
  latitude: number;
  longitude: number;
  speed: number;
  lastUpdate: string;
}

interface UseVehiclesResult {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVehicles(): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/vehicles');
      
      if (response.data.success) {
        setVehicles(response.data.data);
      } else {
        setError('Failed to fetch vehicles');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
  };
}
