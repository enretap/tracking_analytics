import { useState, useEffect } from "react";
import axios from "axios";
function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/vehicles");
      if (response.data.success) {
        setVehicles(response.data.data);
      } else {
        setError("Failed to fetch vehicles");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching vehicles");
      console.error("Error fetching vehicles:", err);
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
    refetch: fetchVehicles
  };
}
export {
  useVehicles as u
};
