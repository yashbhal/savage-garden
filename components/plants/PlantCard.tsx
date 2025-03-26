import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Plant } from '../../types';

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: FC<PlantCardProps> = ({ plant }) => {
  // Calculate a simple health score between 0-100
  const healthScore = Math.min(100, Math.max(0, 
    // This is a simplified example calculation - in a real app
    // this would use real sensor data
    70 + Math.floor(Math.random() * 30)
  ));
  
  // Determine health status text based on score
  const getHealthStatus = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 30) return 'Needs Attention';
    return 'Critical';
  };
  
  return (
    <Link 
      href={`/plants/${plant.id}`}
      className="block h-full"
    >
      <div className="h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="relative h-48">
          <Image 
            src={plant.imageUrl} 
            alt={plant.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{plant.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{plant.species}</p>
          
          <div className="flex justify-between text-xs text-gray-500 mb-3">
            <span>Added: {format(new Date(plant.dateAdded), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  healthScore >= 70 ? 'bg-green-500' : 
                  healthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-gray-600">{getHealthStatus(healthScore)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlantCard; 