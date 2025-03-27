import { NextApiRequest, NextApiResponse } from 'next';
import { SensorDataApiResponse, SensorData, SensorReading } from '../../../../types';
import { plants } from '../index';

// Constants
const SENSOR_READING_INTERVAL_HOURS = 6;
const MOCK_DAYS_OF_HISTORY = 30;
const API_RESPONSE_DELAY_MS = 500;
const DEFAULT_VALUES = {
  moisture: { min: 60, max: 90 },
  temperature: { min: 18, max: 28 },
  light: { min: 300, max: 1000 },
  weight: { min: 950, max: 1000 }
};

// Mock sensor data for the demo
const mockSensorData: Record<string, SensorData> = {
  'sensor-001': createMockSensorData('sensor-001', '1'),
  'sensor-002': createMockSensorData('sensor-002', '2'),
};

/**
 * Creates mock sensor data with historical readings
 */
function createMockSensorData(sensorId: string, plantId: string): SensorData {
  return {
    sensorId,
    plantId,
    currentReading: {
      timestamp: new Date().toISOString(),
      moisture: getRandomValue(DEFAULT_VALUES.moisture),
      temperature: getRandomValue(DEFAULT_VALUES.temperature),
      light: getRandomValue(DEFAULT_VALUES.light),
      weight: getRandomValue(DEFAULT_VALUES.weight),
    },
    readings: generateMockReadings(),
  };
}

/**
 * Returns a random value between min and max
 */
function getRandomValue(range: { min: number, max: number }): number {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Generate mock historical readings for a sensor
 */
function generateMockReadings(): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = new Date();
  
  // Generate readings for the last MOCK_DAYS_OF_HISTORY days
  for (let day = MOCK_DAYS_OF_HISTORY; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour += SENSOR_READING_INTERVAL_HOURS) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(hour, 0, 0, 0);
      
      readings.push({
        timestamp: date.toISOString(),
        moisture: getRandomValue(DEFAULT_VALUES.moisture),
        temperature: getRandomValue(DEFAULT_VALUES.temperature),
        light: getRandomValue(DEFAULT_VALUES.light),
        weight: getRandomValue(DEFAULT_VALUES.weight),
      });
    }
  }
  
  return readings;
}

/**
 * Create empty sensor data for a plant with no sensor
 */
function createEmptySensorData(plantId: string): SensorData {
  return {
    sensorId: '',
    plantId,
    readings: [],
    currentReading: {
      timestamp: new Date().toISOString(),
      moisture: 0,
      temperature: 0,
      light: 0,
      weight: 0
    }
  };
}

/**
 * Main API handler
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorDataApiResponse>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid plant ID' 
    });
  }

  // Add artificial delay to simulate real API
  setTimeout(() => {
    if (req.method === 'GET') {
      handleGetSensorData(req, res, id);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ 
        success: false, 
        error: `Method ${req.method} Not Allowed` 
      });
    }
  }, API_RESPONSE_DELAY_MS);
}

/**
 * Handler for GET requests
 */
function handleGetSensorData(
  req: NextApiRequest, 
  res: NextApiResponse<SensorDataApiResponse>, 
  plantId: string
) {
  try {
    // Find the plant to check if it exists
    const plant = plants.find(p => p.id === plantId);

    if (!plant) {
      return res.status(404).json({ 
        success: false, 
        error: 'Plant not found' 
      });
    }

    // Get sensor data if available
    if (plant.sensorId && mockSensorData[plant.sensorId]) {
      return res.status(200).json({ 
        success: true, 
        data: mockSensorData[plant.sensorId] 
      });
    }

    // No sensor data available - return empty data instead of error
    return res.status(200).json({ 
      success: true, 
      data: createEmptySensorData(plantId) 
    });
    
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error while fetching sensor data' 
    });
  }
} 