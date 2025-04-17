import { useState, useMemo, useEffect, useCallback } from "react";
import { SensorReading } from "../../types";
import { fetchParticleData } from "../apiService";

export type TimeRange = "24h" | "7d" | "30d";

interface UseReadingsReturn {
  readings: SensorReading[];
  filteredReadings: SensorReading[];
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  loading: boolean;
  error: string | null;
  refreshReadings: () => Promise<void>;
  aggregateData: (
    dataType: "moisture" | "temperature" | "light" | "humidity" | "pressure"
  ) => number | null;
}

export const useReadings = (
  initialTimeRange: TimeRange = "7d"
): UseReadingsReturn => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshReadings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchParticleData();
      if (data.success && data.data) {
        // Add the new reading to the array
        setReadings((prevReadings) => {
          const newReading = {
            ...data.data.currentReading,
            humidity: data.data.currentReading.humidity || 0,
            pressure: data.data.currentReading.pressure || 0,
          };
          // Keep only readings from the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const filteredReadings = prevReadings.filter(
            (reading) => new Date(reading.timestamp) >= thirtyDaysAgo
          );

          return [...filteredReadings, newReading];
        });
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up polling for real-time updates
  useEffect(() => {
    // Initial fetch
    refreshReadings();

    // Set up polling interval (every 30 seconds)
    const interval = setInterval(refreshReadings, 30000);

    // Cleanup
    return () => clearInterval(interval);
  }, [refreshReadings]);

  const filteredReadings = useMemo(() => {
    if (!readings || readings.length === 0) return [];

    const now = new Date();
    const filterDate = new Date();

    switch (timeRange) {
      case "7d":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        filterDate.setDate(now.getDate() - 30);
        break;
      default: // 24h
        filterDate.setDate(now.getDate() - 1);
    }

    return readings
      .filter((reading) => new Date(reading.timestamp) >= filterDate)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }, [readings, timeRange]);

  // Function to calculate average of a specific data type
  const aggregateData = (
    dataType: "moisture" | "temperature" | "light" | "humidity" | "pressure"
  ): number | null => {
    if (filteredReadings.length === 0) return null;

    const sum = filteredReadings.reduce(
      (total, reading) => total + reading[dataType],
      0
    );
    return parseFloat((sum / filteredReadings.length).toFixed(2));
  };

  return {
    readings,
    filteredReadings,
    timeRange,
    setTimeRange,
    loading,
    error,
    refreshReadings,
    aggregateData,
  };
};
