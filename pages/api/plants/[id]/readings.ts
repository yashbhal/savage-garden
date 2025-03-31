import type { NextApiRequest, NextApiResponse } from "next";
import { SensorReading } from "../../../../types"; // Ensure this import is correct

interface ReadingsApiResponse {
  success: boolean;
  data?: SensorReading[]; // Ensure this is used correctly
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReadingsApiResponse>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Plant ID is required" });
  }

  try {
    // In a real application, you would fetch this data from a database
    // For now, it's generating mock data with some variation based on plant ID
    const mockReadings = generateMockReadings(id);

    return res.status(200).json({
      success: true,
      data: mockReadings,
    });
  } catch (error) {
    console.error(`Error fetching readings for plant ${id}:`, error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch readings",
    });
  }
}

// Helper function to generate mock readings with variation based on plant ID
const generateMockReadings = (plantId: string): SensorReading[] => {
  // Use the plant ID to seed some variance in the readings
  // This way different plants have different patterns
  const idSum = plantId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const moistureBase = (idSum % 20) + 60; // 60-80% base moisture
  const temperatureBase = (idSum % 5) + 18; // 18-23°C base temperature
  const lightBase = (idSum % 400) + 300; // 300-700 lux base light
  const weightBase = (idSum % 100) + 900; // 900-1000g base weight

  // Generate 30 days of readings, 4 readings per day
  const readings: SensorReading[] = [];
  const now = new Date();

  for (let day = 29; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour += 6) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(hour, 0, 0, 0);

      // Add some daily and hourly variance to make the data look realistic
      const dayVariance = Math.sin(day / 5) * 5;
      const hourVariance = Math.sin(hour / 6) * 3;
      const randomVariance = () => Math.random() * 5 - 2.5;

      readings.push({
        timestamp: date.toISOString(),
        moisture: Math.min(
          100,
          Math.max(0, Math.floor(moistureBase + dayVariance + randomVariance()))
        ),
        temperature:
          Math.floor(
            (temperatureBase + hourVariance / 2 + randomVariance() / 2) * 10
          ) / 10,
        light: Math.floor(
          lightBase +
            hourVariance * 50 +
            dayVariance * 30 +
            randomVariance() * 20
        ),
        weight: Math.floor(
          weightBase + dayVariance / 5 + hourVariance / 10 + randomVariance()
        ),
      });
    }
  }

  return readings;
};
