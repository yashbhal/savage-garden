import { useState, useEffect } from 'react';
import { CarbonSavings, CarbonSavingsApiResponse } from '../../types';
import emissions_data from '../../emissions_data.json';

interface UseCarbonSavingsReturn {
  carbonSavings: CarbonSavings | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useCarbonSavings = (plantId?: string): UseCarbonSavingsReturn => {
    const [carbonSavings, setCarbonSavings] = useState<CarbonSavings | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCarbonSavings = async () => {
      try {
        setLoading(true);

        let selectedData: CarbonSavings | null = null;

        if (plantId) {
          let selectedData = emissions_data.find(item =>
            item.Plant?.toLowerCase() === plantId.toLowerCase()
          ) || null;
        } else {
          selectedData = null; 
        }
    
        setCarbonSavings(selectedData);
        setError(null);
      } catch (err) {
        console.error('Error loading carbon savings from JSON:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
    };

    useEffect(() => {
      fetchCarbonSavings();
    }, [plantId]);
  }; 

  return {
    carbonSavings,
    loading,
    error,
    refreshData: fetchCarbonSavings,
  };
};