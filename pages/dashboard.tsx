import { useState } from 'react';
import type { NextPage } from 'next';
import { usePlants } from '../lib/context/PlantContext';
import { useCarbonSavings } from '../lib/hooks/useCarbonSavings';
import DataChart from '../components/ui/DataChart';
import { SensorReading } from '../types';

// Mock data for sensor readings
const generateMockReadings = (): SensorReading[] => {
  // Generate 7 days of readings, 4 readings per day
  const readings: SensorReading[] = [];
  const now = new Date();
  
  for (let day = 6; day >= 0; day--) {
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

const Dashboard: NextPage = () => {
  const { plants, loading: plantsLoading } = usePlants();
  const { carbonSavings, loading: carbonLoading } = useCarbonSavings();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  
  // Generate mock readings for the charts
  const mockReadings = generateMockReadings();

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-medium mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Total Plants</h3>
            <p className="text-2xl font-medium text-gray-900">{plantsLoading ? '...' : plants.length}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">CO₂ Absorbed</h3>
            <p className="text-2xl font-medium text-gray-900">
              {carbonLoading ? '...' : `${carbonSavings?.totalCO2Absorbed.toFixed(2) || 0}g`}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Equivalent Car Miles</h3>
            <p className="text-2xl font-medium text-gray-900">
              {carbonLoading ? '...' : `${carbonSavings?.equivalentCarMiles.toFixed(2) || 0}mi`}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Trees Equivalent</h3>
            <p className="text-2xl font-medium text-gray-900">
              {carbonLoading ? '...' : `${carbonSavings?.treesEquivalent.toFixed(2) || 0}`}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTimeRange(option.value as '24h' | '7d' | '30d')}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === option.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${
                  option.value === '24h'
                    ? 'rounded-l-md'
                    : option.value === '30d'
                    ? 'rounded-r-md'
                    : ''
                } border border-gray-300`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataChart
            readings={mockReadings}
            dataType="moisture"
            title="Average Soil Moisture"
            timeRange={timeRange}
          />
          
          <DataChart
            readings={mockReadings}
            dataType="temperature"
            title="Average Temperature"
            timeRange={timeRange}
          />
          
          <DataChart
            readings={mockReadings}
            dataType="light"
            title="Average Light Intensity"
            timeRange={timeRange}
          />
          
          <DataChart
            readings={mockReadings}
            dataType="weight"
            title="Average Plant Weight"
            timeRange={timeRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 