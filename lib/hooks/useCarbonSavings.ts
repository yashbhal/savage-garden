import { useState, useEffect, useCallback } from "react";
import { CarbonSavings } from "../../types";
import { fetchCarbonSavings } from "../apiService"; // Import the new API service

interface UseCarbonSavingsReturn {
  carbonSavings: CarbonSavings | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useCarbonSavings = (plantId?: string): UseCarbonSavingsReturn => {
  const [carbonSavings, setCarbonSavings] = useState<CarbonSavings | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCarbonSavings(plantId);
      setCarbonSavings(data.data || null);
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
    refreshData();
  }, [refreshData]);

  return {
    carbonSavings,
    loading,
    error,
    refreshData,
  };
};
