import type { NextApiRequest, NextApiResponse } from 'next';
import { SensorReading } from '../../types';

interface ReadingsApiResponse {
  success: boolean;
  data?: SensorReading[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReadingsApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // In a real application, you would fetch this data from a database
    // For now, it's generating mock data
    const mockReadings = generateMockReadings();
    
    return res.status(200).json({
      success: true,
      data: mockReadings,
    });
  } catch (error) {
    console.error('Error in readings API:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch readings',
    });
  }
}

// Helper function to generate mock readings
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