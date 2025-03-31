import { useState, useEffect, useCallback } from "react";
import { CarbonSavings, CarbonSavingsApiResponse } from "../../types";

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

  const fetchCarbonSavings = useCallback(async () => {
    try {
      setLoading(true);

      // If plantId is provided, fetch for specific plant, otherwise fetch total
      const url = plantId
        ? `/api/carbon-savings?plantId=${plantId}`
        : "/api/carbon-savings";

      const response = await fetch(url);
      const data: CarbonSavingsApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch carbon savings data");
      }

      setCarbonSavings(data.data || null);
      setError(null);
    } catch (err) {
      console.error("Error fetching carbon savings:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    fetchCarbonSavings();
  }, [fetchCarbonSavings]);

  return {
    carbonSavings,
    loading,
    error,
    refreshData: fetchCarbonSavings,
  };
};
