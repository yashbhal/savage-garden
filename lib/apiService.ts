import { CarbonSavingsApiResponse } from "../types";

// Base URL for the API
const API_BASE_URL = "/api";

// Function to fetch carbon savings data
export const fetchCarbonSavings = async (
  plantId?: string
): Promise<CarbonSavingsApiResponse> => {
  const url = plantId
    ? `${API_BASE_URL}/carbon-savings?plantId=${plantId}`
    : `${API_BASE_URL}/carbon-savings`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch carbon savings data: ${response.statusText}`
    );
  }

  return response.json();
};

// Function to fetch real-time sensor data from Particle Cloud
export const fetchParticleData = async () => {
  const response = await fetch(`${API_BASE_URL}/particle-data`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Particle data: ${response.statusText}`);
  }

  return response.json();
};
