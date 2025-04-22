import { NextApiRequest, NextApiResponse } from 'next';
import { CarbonSavings, CarbonSavingsApiResponse } from '../../types';
import { plants } from './plants/index';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CarbonSavingsApiResponse>
) {
  // Add artificial delay to simulate real API
  setTimeout(() => {
    if (req.method === 'GET') {
      handleGetCarbonSavings(req, res);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
  }, 500);
}

function handleGetCarbonSavings(req: NextApiRequest, res: NextApiResponse<CarbonSavingsApiResponse>) {
  const { plantId } = req.query;

  try {
    // If plantId is provided, get carbon savings for specific plant
    if (plantId && typeof plantId === 'string') {
      const plant = plants.find(p => p.id === plantId);
      
      if (!plant) {
        return res.status(404).json({ success: false, error: 'Plant not found' });
      }
      
      const carbonSavings = calculateCarbonSavings(plant.carbonSavings);
      return res.status(200).json({ success: true, data: carbonSavings });
    }
    
    // Otherwise, calculate total carbon savings across all plants
    const totalCarbonSavings = plants.reduce((total, plant) => total + plant.carbonSavings, 0);
    const carbonSavings = calculateCarbonSavings(totalCarbonSavings);
    
    return res.status(200).json({ success: true, data: carbonSavings });
  } catch (error) {
    console.error('Error calculating carbon savings:', error);
    return res.status(500).json({ success: false, error: 'Failed to calculate carbon savings' });
  }
}

// Helper function to calculate carbon savings metrics
function calculateCarbonSavings(co2Grams: number): CarbonSavings {
  // Conversion factors (these would be more scientifically accurate in a real app)
  const gramsPerMile = 404; // CO2 grams per mile driven in average car
  const gramsPerTree = 21000; // CO2 grams absorbed by average tree per year
  const dailyRate = co2Grams / 365; // Assume this amount is over a year
  
  return {
    CO2Saved: co2Grams,
    equivalentCarMiles: co2Grams / gramsPerMile,
    treesEquivalent: co2Grams / gramsPerTree,
    dailyRate: dailyRate,
  };
} 