import { NextApiRequest, NextApiResponse } from "next";
import {
  SensorDataApiResponse,
  SensorData,
  SensorReading,
} from "../../../../types";
import { plants } from "../index";

// Constants
const API_RESPONSE_DELAY_MS = 500;

// Mock sensor data for the demo
const mockSensorData: Record<string, SensorData> = {
  "sensor-001": createMockSensorData("sensor-001", "1"),
  "sensor-002": createMockSensorData("sensor-002", "2"),
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
      moisture: Math.floor(Math.random() * 31) + 60,
      temperature: Math.floor(Math.random() * 11) + 18,
      light: Math.floor(Math.random() * 701) + 300,
      weight: Math.floor(Math.random() * 51) + 950,
    },
    readings: generateMockReadings(),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Returns a random value between min and max
 */
function getRandomValue(range: { min: number; max: number }): number {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Generate mock historical readings for a sensor
 */
function generateMockReadings(): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = new Date();

  // Generate readings for the last 30 days
  for (let day = 29; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour += 6) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(hour, 0, 0, 0);

      readings.push({
        timestamp: date.toISOString(),
        moisture: Math.floor(Math.random() * 31) + 60,
        temperature: Math.floor(Math.random() * 11) + 18,
        light: Math.floor(Math.random() * 701) + 300,
        weight: Math.floor(Math.random() * 51) + 950,
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
    sensorId: "",
    plantId,
    readings: [],
    currentReading: {
      timestamp: new Date().toISOString(),
      moisture: 0,
      temperature: 0,
      light: 0,
      weight: 0,
    },
    lastUpdated: new Date().toISOString(),
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

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "Invalid plant ID",
    });
  }

  // Add artificial delay to simulate real API
  setTimeout(() => {
    if (req.method === "GET") {
      handleGetSensorData(req, res, id);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`,
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
    const plant = plants.find((p) => p.id === plantId);

    if (!plant) {
      return res.status(404).json({
        success: false,
        error: "Plant not found",
      });
    }

    // Get sensor data if available
    if (plant.sensorId && mockSensorData[plant.sensorId]) {
      return res.status(200).json({
        success: true,
        data: mockSensorData[plant.sensorId],
      });
    }

    // No sensor data available - return empty data instead of error
    return res.status(200).json({
      success: true,
      data: createEmptySensorData(plantId),
    });
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching sensor data",
    });
  }
}
