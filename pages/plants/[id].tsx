import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { NextPage } from 'next';
import { format } from 'date-fns';
import { usePlants } from '../../lib/context/PlantContext';
import { useSensorData } from '../../lib/hooks/useSensorData';
import { useCarbonSavings } from '../../lib/hooks/useCarbonSavings';
import DataChart from '../../components/ui/DataChart';

const PlantDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { plants, loading: plantsLoading, updatePlant, deletePlant } = usePlants();
  const { sensorData, loading: sensorLoading } = useSensorData(id as string);
  const { carbonSavings, loading: carbonLoading } = useCarbonSavings(id as string);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isDeleting, setIsDeleting] = useState(false);

  // Find the current plant
  const plant = plants.find(p => p.id === id);

  // Loading or not found states
  if (plantsLoading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">Loading plant data...</p>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-medium text-red-700 mb-2">Plant Not Found</h1>
        <p className="text-red-600 mb-4">The plant you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Calculate plant health score (similar to card component)
  const healthScore = Math.min(100, Math.max(0, 
    // Simple random score for demo purposes
    70 + Math.floor(Math.random() * 30)
  ));
  
  const getHealthStatus = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 30) return 'Needs Attention';
    return 'Critical';
  };

  const handleWaterPlant = async () => {
    const success = await updatePlant(plant.id, {
      lastWatered: new Date().toISOString(),
    });

    if (success) {
      alert('Plant has been watered!');
    } else {
      alert('Failed to update watering status. Please try again.');
    }
  };

  const handleDeletePlant = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    
    if (confirm('Are you sure you want to delete this plant?')) {
      const success = await deletePlant(plant.id);
      
      if (success) {
        router.push('/');
      } else {
        alert('Failed to delete the plant. Please try again.');
        setIsDeleting(false);
      }
    } else {
      setIsDeleting(false);
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
  ];

  // Ensure plant has required properties with fallbacks
  const safeLastWatered = plant.lastWatered ? new Date(plant.lastWatered) : new Date();
  const safeDateAdded = plant.dateAdded ? new Date(plant.dateAdded) : new Date();
  const safeCarbonSavings = plant.carbonSavings ?? 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={plant.imageUrl}
                alt={plant.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">{plant.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{plant.species}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Added</p>
                <p className="font-medium">{format(safeDateAdded, 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Watered</p>
                <p className="font-medium">{format(safeLastWatered, 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Health Status</p>
                <p className={`font-medium ${
                  healthScore >= 70 ? 'text-green-700' : 
                  healthScore >= 50 ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {getHealthStatus(healthScore)}
                </p>
              </div>
            </div>
            
            {plant.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{plant.description}</p>
              </div>
            )}
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleDeletePlant}
                disabled={isDeleting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Plant'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sensor Data Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Sensor Data</h2>
          
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
        
        {sensorLoading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Loading sensor data...</p>
          </div>
        ) : sensorData && sensorData.readings && sensorData.readings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataChart
              readings={sensorData.readings}
              dataType="moisture"
              title="Soil Moisture"
              timeRange={timeRange}
            />
            
            <DataChart
              readings={sensorData.readings}
              dataType="temperature"
              title="Temperature"
              timeRange={timeRange}
            />
            
            <DataChart
              readings={sensorData.readings}
              dataType="light"
              title="Light Intensity"
              timeRange={timeRange}
            />
            
            <DataChart
              readings={sensorData.readings}
              dataType="weight"
              title="Plant Weight"
              timeRange={timeRange}
            />
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-700">
              No sensor data available for this plant. Connect an ESP32 device to start monitoring.
            </p>
          </div>
        )}
      </div>
      
      {/* Carbon Savings Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-6">Carbon Impact</h2>
        
        {carbonLoading ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-500">Loading carbon data...</p>
          </div>
        ) : carbonSavings ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Total CO₂ Absorbed</h3>
              <p className="text-2xl font-medium text-gray-900">
                {carbonSavings.totalCO2Absorbed.toFixed(2)}g
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Equivalent Car Miles</h3>
              <p className="text-2xl font-medium text-gray-900">
                {carbonSavings.equivalentCarMiles.toFixed(2)}mi
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Daily CO₂ Absorption</h3>
              <p className="text-2xl font-medium text-gray-900">
                {carbonSavings.dailyRate.toFixed(2)}g/day
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-700">
              Carbon data not available for this plant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetail; 