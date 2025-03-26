import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Plant, PlantApiResponse, PlantsApiResponse } from '../../types';

interface PlantContextType {
  plants: Plant[];
  loading: boolean;
  error: string | null;
  addPlant: (plant: Omit<Plant, 'id'>) => Promise<boolean>;
  updatePlant: (id: string, plantData: Partial<Plant>) => Promise<boolean>;
  deletePlant: (id: string) => Promise<boolean>;
  refreshPlants: () => Promise<void>;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider = ({ children }: { children: ReactNode }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plants');
      const data: PlantsApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch plants');
      }

      setPlants(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching plants:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const addPlant = async (plantData: Omit<Plant, 'id'>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantData),
      });
      
      const data: PlantApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to add plant');
      }

      if (data.data) {
        setPlants(prev => [...prev, data.data as Plant]);
      }
      
      return true;
    } catch (err) {
      console.error('Error adding plant:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePlant = async (id: string, plantData: Partial<Plant>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/plants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantData),
      });
      
      const data: PlantApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update plant');
      }

      if (data.data) {
        setPlants(prev => 
          prev.map(plant => (plant.id === id ? { ...plant, ...data.data } as Plant : plant))
        );
      }
      
      return true;
    } catch (err) {
      console.error('Error updating plant:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePlant = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/plants/${id}`, {
        method: 'DELETE',
      });
      
      const data: PlantApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete plant');
      }

      setPlants(prev => prev.filter(plant => plant.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting plant:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshPlants = fetchPlants;

  const value = {
    plants,
    loading,
    error,
    addPlant,
    updatePlant,
    deletePlant,
    refreshPlants,
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
}; 