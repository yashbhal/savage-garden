import { useState, useMemo, useEffect, useCallback } from "react";
import { SensorReading } from "../../types";

export type TimeRange = "24h" | "7d" | "30d";

interface ReadingsApiResponse {
  success: boolean;
  data?: SensorReading[];
  error?: string;
}

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

  const fetchReadings = useCallback(async () => {
    try {
      setLoading(true);

      // If plantId is provided, fetch for specific plant, otherwise fetch all plants
      const url = plantId ? `/api/plants/${plantId}/readings` : "/api/readings";

      const response = await fetch(url);
      const data: ReadingsApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch readings data");
      }

      setReadings(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching readings:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );

      // For demo purposes, generate mock data if fetch fails
      if (process.env.NODE_ENV === "development") {
        setReadings(generateMockReadings());
      }
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

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
    refreshReadings: fetchReadings,
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
