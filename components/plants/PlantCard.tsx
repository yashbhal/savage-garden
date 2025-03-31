import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Plant } from "../../types";

// Constants for health calculation - shared with detail page
const HEALTH_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  FAIR: 50,
  NEEDS_ATTENTION: 30,
};

// Calculate health score - can be moved to a shared utility file
const calculateHealthScore = (plant: Plant): number => {
  // This is a simplified example calculation - in a real app
  // this would use real sensor data from the plant
  return Math.min(100, Math.max(0, 70 + Math.floor(Math.random() * 30)));
};

// Get health status text based on score
const getHealthStatus = (score: number): string => {
  if (score >= HEALTH_THRESHOLDS.EXCELLENT) return "Excellent";
  if (score >= HEALTH_THRESHOLDS.GOOD) return "Good";
  if (score >= HEALTH_THRESHOLDS.FAIR) return "Fair";
  if (score >= HEALTH_THRESHOLDS.NEEDS_ATTENTION) return "Needs Attention";
  return "Critical";
};

// Get CSS class for health status bar
const getHealthBarClass = (score: number): string => {
  if (score >= HEALTH_THRESHOLDS.GOOD) return "bg-green-500";
  if (score >= HEALTH_THRESHOLDS.FAIR) return "bg-yellow-500";
  return "bg-red-500";
};

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: FC<PlantCardProps> = ({ plant }) => {
  // Handle missing date
  const safeDateAdded = plant.dateAdded
    ? new Date(plant.dateAdded)
    : new Date();

  // Calculate health score
  const healthScore = calculateHealthScore(plant);

  return (
    <Link href={`/plants/${plant.id}`} className="block h-full">
      <div className="h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="relative h-48">
          <Image
            src={plant.imageUrl}
            alt={plant.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {plant.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{plant.species}</p>

          <div className="flex justify-between text-xs text-gray-500 mb-3">
            <span>Added: {format(safeDateAdded, "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getHealthBarClass(healthScore)}`}
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-gray-600">
              {getHealthStatus(healthScore)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlantCard;
