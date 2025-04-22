import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetStaticProps, GetStaticPaths } from "next";
import { format } from "date-fns";
import { usePlants } from "../../lib/context/PlantContext";
import { useSensorData } from "../../lib/hooks/useSensorData";
import { useCarbonSavings } from "../../lib/hooks/useCarbonSavings";
import DataChart from "../../components/ui/DataChart";
import { plants } from "../api/plants";
import { Plant } from "../../types";

// Constants for plant health calculations
const HEALTH_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  FAIR: 50,
  NEEDS_ATTENTION: 30,
};

// Get health status text based on score
const getHealthStatus = (score: number): string => {
  if (score >= HEALTH_THRESHOLDS.EXCELLENT) return "Excellent";
  if (score >= HEALTH_THRESHOLDS.GOOD) return "Good";
  if (score >= HEALTH_THRESHOLDS.FAIR) return "Fair";
  if (score >= HEALTH_THRESHOLDS.NEEDS_ATTENTION) return "Needs Attention";
  return "Critical";
};

// Get CSS class for health status
const getHealthStatusClass = (score: number): string => {
  if (score >= HEALTH_THRESHOLDS.GOOD) return "text-green-700";
  if (score >= HEALTH_THRESHOLDS.FAIR) return "text-yellow-700";
  return "text-red-700";
};

// Time range options
const TIME_RANGE_OPTIONS = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

type TimeRangeType = "24h" | "7d" | "30d";

interface PlantDetailProps {
  plant: Plant;
}

const PlantDetail = ({ plant }: PlantDetailProps) => {
  const router = useRouter();
  const { deletePlant } = usePlants();
  const { sensorData, loading: sensorLoading } = useSensorData(
    plant?.id ?? null
  );
  const { carbonSavings, loading: carbonLoading } = useCarbonSavings(
    plant?.id ?? null
  );
  const [timeRange, setTimeRange] = useState<TimeRangeType>("24h");
  const [isDeleting, setIsDeleting] = useState(false);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback || !plant) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">Loading plant data...</p>
      </div>
    );
  }

  // Calculate plant health score
  const healthScore = Math.min(
    100,
    Math.max(0, 70 + Math.floor(Math.random() * 30))
  );

  const handleDeletePlant = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    if (confirm("Are you sure you want to delete this plant?")) {
      const success = await deletePlant(plant.id);

      if (success) {
        router.push("/");
      } else {
        alert("Failed to delete the plant. Please try again.");
        setIsDeleting(false);
      }
    } else {
      setIsDeleting(false);
    }
  };

  // Ensure plant has required properties with fallbacks
  const safeLastWatered = plant.lastWatered
    ? new Date(plant.lastWatered)
    : new Date();
  const safeDateAdded = plant.dateAdded
    ? new Date(plant.dateAdded)
    : new Date();

  // Render plant header section
  const renderPlantHeader = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src={plant.imageUrl}
              alt={plant.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            {plant.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{plant.species}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Added</p>
              <p className="font-medium">
                {format(safeDateAdded, "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Watered</p>
              <p className="font-medium">
                {format(safeLastWatered, "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Health Status</p>
              <p className={`font-medium ${getHealthStatusClass(healthScore)}`}>
                {getHealthStatus(healthScore)}
              </p>
            </div>
          </div>

          {plant.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Description
              </h3>
              <p className="text-gray-600">{plant.description}</p>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleDeletePlant}
              disabled={isDeleting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Plant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render sensor data section
  const renderSensorData = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">Sensor Data</h2>

        <div className="inline-flex rounded-md shadow-sm">
          {TIME_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTimeRange(option.value as TimeRangeType)}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === option.value
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } ${
                option.value === "24h"
                  ? "rounded-l-md"
                  : option.value === "30d"
                  ? "rounded-r-md"
                  : ""
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
      ) : sensorData &&
        sensorData.readings &&
        sensorData.readings.length > 0 ? (
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
            dataType="humidity"
            title="Humidity"
            timeRange={timeRange}
          />

          <DataChart
            readings={sensorData.readings}
            dataType="pressure"
            title="Pressure"
            timeRange={timeRange}
          />
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">
            No sensor data available for this plant. Connect an ESP32 device to
            start monitoring.
          </p>
        </div>
      )}
    </div>
  );

  // Render carbon impact section
  const renderCarbonImpact = () => (
    <div className="bg-clear p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-medium mb-6"></h2>

      {carbonLoading ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-gray-500">Loading carbon data...</p>
        </div>
      ) : carbonSavings ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-clear-50 p-4 rounded-lg">
            {/* <h3 className="text-sm text-gray-500 mb-1">CO₂ Saved (for a L of food item)</h3>
            <p className="text-2xl font-medium text-gray-900">
              {carbonSavings.CO2Saved}
            </p> */}
          </div>
        </div>
      ) : (
        <div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderPlantHeader()}
      {renderSensorData()}
      {renderCarbonImpact()}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on plants
  const paths = plants.map((plant) => ({
    params: { id: plant.id.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } means other routes will be rendered at runtime
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<PlantDetailProps> = async ({
  params,
}) => {
  // Find the plant data
  const plant = plants.find((p) => p.id === params?.id);

  // If no plant is found, return 404
  if (!plant) {
    return {
      notFound: true,
    };
  }

  // Pass plant data to the page via props
  return {
    props: { plant },
    // Re-generate the page at most once per 10 seconds
    revalidate: 10,
  };
};

export default PlantDetail;
