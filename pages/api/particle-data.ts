import { NextApiRequest, NextApiResponse } from "next";
import { SensorReading } from "../../types";

interface ParticleVariable {
  name: string;
  result: number;
  coreInfo: {
    last_heard: string;
  };
}

interface ParticleDataResponse {
  success: boolean;
  data?: {
    currentReading: SensorReading;
    lastUpdated: string;
  };
  error?: string;
}

async function fetchParticleVariable(
  variableName: string
): Promise<ParticleVariable> {
  const deviceId = process.env.PARTICLE_DEVICE_ID;
  const accessToken = process.env.PARTICLE_ACCESS_TOKEN;

  if (!deviceId || !accessToken) {
    throw new Error("Particle Cloud credentials not configured");
  }

  const response = await fetch(
    `https://api.particle.io/v1/devices/${deviceId}/${variableName}?access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${variableName}: ${response.statusText}`);
  }

  return response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParticleDataResponse>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    // Fetch all sensor variables in parallel
    const [light, moisture, temperature, humidity, pressure] =
      await Promise.all([
        fetchParticleVariable("light"),
        fetchParticleVariable("moisture"),
        fetchParticleVariable("temperature"),
        fetchParticleVariable("humidity"),
        fetchParticleVariable("pressure"),
      ]);

    // Create a sensor reading from the Particle data
    const currentReading: SensorReading = {
      timestamp: new Date().toISOString(),
      light: light.result,
      moisture: moisture.result,
      temperature: temperature.result,
      humidity: humidity.result,
      pressure: pressure.result,
      weight: 0, // Keeping weight but setting to 0 as requested
    };

    return res.status(200).json({
      success: true,
      data: {
        currentReading,
        lastUpdated: new Date(light.coreInfo.last_heard).toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching Particle data:", error);
    return res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch sensor data",
    });
  }
}
