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
  temperature: number; // Celsius
  light: number; // Lux
  humidity: number; // 0-100%
  pressure: number; // hPa or mbar
}

// Sensor Data Interface
export interface SensorData {
  sensorId: string; // Unique identifier for the sensor
  plantId: string; // ID of the plant associated with this sensor
  currentReading: SensorReading; // Current sensor reading
  readings: SensorReading[]; // Historical readings
  lastUpdated: string; // Timestamp of the last update
}

// Carbon Savings Interface
export interface CarbonSavings {
  CO2: number; // Grams
  equivalentCarMiles: number;
  treesEquivalent: number;
  dailyRate: number; // Grams per day
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PlantsApiResponse extends ApiResponse<Plant[]> {
  totalCount?: number; // Optional property to indicate total number of plants
}

export interface PlantApiResponse extends ApiResponse<Plant> {
  message?: string; // Optional message for additional context
}

export interface ReadingsApiResponse extends ApiResponse<SensorReading[]> {
  lastUpdated?: string; // Optional property to indicate when the data was last updated
}

export interface SensorDataApiResponse extends ApiResponse<SensorData> {
  lastUpdated?: string; // Optional property to indicate when the data was last updated
}

export interface CarbonSavingsApiResponse extends ApiResponse<CarbonSavings> {
  calculationMethod?: string; // Optional property to describe how the savings were calculated
}
