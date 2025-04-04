import { useState, useMemo, useEffect, useCallback } from "react";
import { SensorReading } from "../../types";
import { fetchReadings } from "../apiService"; // Import the new API service

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
    dataType: "moisture" | "temperature" | "light" | "weight"
  ) => number | null;
}

export const useReadings = (
  plantId?: string,
  initialTimeRange: TimeRange = "7d"
): UseReadingsReturn => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshReadings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchReadings(plantId);
      setReadings(data.data || []);
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
    refreshReadings();
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
    dataType: "moisture" | "temperature" | "light" | "weight"
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

// Helper function to generate mock readings for development
const generateMockReadings = (): SensorReading[] => {
  // Generate 30 days of readings, 4 readings per day
  const readings: SensorReading[] = [];
  const now = new Date();

  for (let day = 29; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour += 6) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(hour, 0, 0, 0);

      readings.push({
        timestamp: date.toISOString(),
        moisture: Math.floor(Math.random() * 30) + 60, // 60-90%
        temperature: Math.floor(Math.random() * 10) + 18, // 18-28°C
        light: Math.floor(Math.random() * 700) + 300, // 300-1000 lux
        weight: Math.floor(Math.random() * 50) + 950, // 950-1000g
      });
    }
  }

  return readings;
};
