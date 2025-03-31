import { useState, useEffect, useCallback } from "react";
import { SensorData } from "../../types";
import { fetchSensorData } from "../apiService"; // Import the new API service

interface UseSensorDataReturn {
  sensorData: SensorData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useSensorData = (plantId: string | null): UseSensorDataReturn => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!plantId) {
      setSensorData(null);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchSensorData(plantId);
      setSensorData(data.data || null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    if (plantId) {
      refreshData();
    }
  }, [plantId, refreshData]);

  return {
    sensorData,
    loading,
    error,
    refreshData,
  };
};
