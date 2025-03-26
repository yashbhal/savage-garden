import { NextApiRequest, NextApiResponse } from 'next';
import { SensorDataApiResponse, SensorData, SensorReading } from '../../../../types';
import { plants } from '../index';

// Mock sensor data for the demo
const mockSensorData: Record<string, SensorData> = {
  'sensor-001': {
    sensorId: 'sensor-001',
    plantId: '1',
    currentReading: {
      timestamp: new Date().toISOString(),
      moisture: 72,
      temperature: 22.5,
      light: 650,
      weight: 980,
    },
    readings: generateMockReadings(),
  },
  'sensor-002': {
    sensorId: 'sensor-002',
    plantId: '2',
    currentReading: {
      timestamp: new Date().toISOString(),
      moisture: 65,
      temperature: 21.8,
      light: 450,
      weight: 800,
    },
    readings: generateMockReadings(),
  },
};

// Generate mock historical readings for a sensor
function generateMockReadings(): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = new Date();
  
  // Generate readings for the last 30 days, 4 per day
  for (let day = 30; day >= 0; day--) {
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
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorDataApiResponse>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid plant ID' });
  }

  // Add artificial delay to simulate real API
  setTimeout(() => {
    if (req.method === 'GET') {
      handleGetSensorData(req, res, id);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
  }, 500);
}

function handleGetSensorData(req: NextApiRequest, res: NextApiResponse<SensorDataApiResponse>, plantId: string) {
  // Find the plant to check if it exists
  const plant = plants.find(p => p.id === plantId);

  if (!plant) {
    return res.status(404).json({ success: false, error: 'Plant not found' });
  }

  // Get sensor data if available
  if (plant.sensorId && mockSensorData[plant.sensorId]) {
    return res.status(200).json({ success: true, data: mockSensorData[plant.sensorId] });
  }

  // No sensor data available - return empty data instead of error
  const emptyData: SensorData = {
    sensorId: '',
    plantId: plantId,
    readings: [],
    currentReading: {
      timestamp: new Date().toISOString(),
      moisture: 0,
      temperature: 0,
      light: 0,
      weight: 0
    }
  };
  
  return res.status(200).json({ success: true, data: emptyData });
} 