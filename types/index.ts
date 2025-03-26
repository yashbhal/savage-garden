// Plant Interface
export interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  imageUrl: string;
  dateAdded: string;
  lastWatered: string;
  description?: string;
  sensorId?: string;
  carbonSavings: number;
}

// Sensor Reading Interface
export interface SensorReading {
  timestamp: string;
  moisture: number; // 0-100%
  temperature: number; // celsius
  light: number; // lux
  weight: number; // grams
}

// Sensor Data Interface (includes readings history)
export interface SensorData {
  sensorId: string;
  plantId: string;
  currentReading: SensorReading;
  readings: SensorReading[];
}

// Carbon Savings Interface
export interface CarbonSavings {
  totalCO2Absorbed: number; // grams
  equivalentCarMiles: number;
  treesEquivalent: number;
  dailyRate: number; // grams per day
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PlantsApiResponse extends ApiResponse<Plant[]> {}
export interface PlantApiResponse extends ApiResponse<Plant> {}
export interface SensorDataApiResponse extends ApiResponse<SensorData> {}
export interface CarbonSavingsApiResponse extends ApiResponse<CarbonSavings> {} 