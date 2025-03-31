import { useState, useEffect, useCallback } from "react";
import { SensorData, SensorDataApiResponse } from "../../types";

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

  const fetchSensorData = useCallback(async () => {
    if (!plantId) {
      setSensorData(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/plants/${plantId}/sensor-data`);
      const data: SensorDataApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch sensor data");
      }

      setSensorData(data.data || null);
      setError(null);
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    if (plantId) {
      fetchSensorData();
    }
  }, [plantId, fetchSensorData]);

  return {
    sensorData,
    loading,
    error,
    refreshData: fetchSensorData,
  };
};
