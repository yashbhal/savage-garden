import { useState, useEffect, useCallback, useRef } from "react";
import { SensorData } from "../../types";
import { fetchParticleData } from "../apiService";

interface UseSensorDataReturn {
  sensorData: SensorData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const POLL_INTERVAL =
  Number(process.env.NEXT_PUBLIC_PARTICLE_POLL_INTERVAL) || 30000; // 30 seconds default

export const useSensorData = (plantId: string | null): UseSensorDataReturn => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pollInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  const refreshData = useCallback(async () => {
    if (!plantId) {
      setSensorData(null);
      return;
    }

    setLoading(true);
    try {
      // Fetch real-time data from Particle Cloud
      const particleData = await fetchParticleData();

      if (particleData.success && particleData.data) {
        // Update sensor data with real-time readings
        setSensorData((prevData) => ({
          sensorId: plantId, // Using plantId as sensorId for now
          plantId,
          currentReading: particleData.data.currentReading,
          readings: prevData?.readings || [], // Keep historical readings
          lastUpdated: particleData.data.lastUpdated,
        }));
        setError(null);
      } else {
        throw new Error(particleData.error || "Failed to fetch Particle data");
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  // Set up polling
  useEffect(() => {
    if (plantId) {
      // Initial fetch
      refreshData();

      // Set up polling interval
      pollInterval.current = setInterval(refreshData, POLL_INTERVAL);

      // Cleanup
      return () => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
      };
    }
  }, [plantId, refreshData]);

  return {
    sensorData,
    loading,
    error,
    refreshData,
  };
};
