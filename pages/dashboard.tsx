import { NextPage } from "next";
import { usePlants } from "../lib/context/PlantContext";
import { useCarbonSavings } from "../lib/hooks/useCarbonSavings";
import { useReadings, TimeRange } from "../lib/hooks/useReadings";
import DataChart from "../components/ui/DataChart";

const Dashboard: NextPage = () => {
  const { plants, loading: plantsLoading } = usePlants();
  const { carbonSavings, loading: carbonLoading } = useCarbonSavings();
  const {
    filteredReadings,
    timeRange,
    setTimeRange,
    loading: readingsLoading,
    aggregateData,
  } = useReadings();

  const timeRangeOptions = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-medium mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Total Plants</h3>
            <p className="text-2xl font-medium text-gray-900">
              {plantsLoading ? "..." : plants.length}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">CO₂ Absorbed</h3>
            <p className="text-2xl font-medium text-gray-900">
              {carbonLoading
                ? "..."
                : `${carbonSavings?.totalCO2Absorbed.toFixed(2) || 0}g`}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Equivalent Car Miles</h3>
            <p className="text-2xl font-medium text-gray-900">
              {carbonLoading
                ? "..."
                : `${carbonSavings?.equivalentCarMiles.toFixed(2) || 0}mi`}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Trees Equivalent</h3>
            <p className="text-2xl font-medium text-gray-900">
              {carbonLoading
                ? "..."
                : `${carbonSavings?.treesEquivalent.toFixed(2) || 0}`}
            </p>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTimeRange(option.value as TimeRange)}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">
              Average Soil Moisture
            </h3>
            <p className="text-2xl font-medium text-gray-900">
              {readingsLoading ? "..." : `${aggregateData("moisture") || 0}%`}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Average Temperature</h3>
            <p className="text-2xl font-medium text-gray-900">
              {readingsLoading
                ? "..."
                : `${aggregateData("temperature") || 0}°C`}
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Average Light</h3>
            <p className="text-2xl font-medium text-gray-900">
              {readingsLoading ? "..." : `${aggregateData("light") || 0} lux`}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Average Humidity</h3>
            <p className="text-2xl font-medium text-gray-900">
              {readingsLoading ? "..." : `${aggregateData("humidity") || 0}%`}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Average Pressure</h3>
            <p className="text-2xl font-medium text-gray-900">
              {readingsLoading
                ? "..."
                : `${aggregateData("pressure") || 0} hPa`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataChart
            readings={filteredReadings}
            dataType="moisture"
            title="Soil Moisture Over Time"
            timeRange={timeRange}
          />

          <DataChart
            readings={filteredReadings}
            dataType="temperature"
            title="Temperature Over Time"
            timeRange={timeRange}
          />

          <DataChart
            readings={filteredReadings}
            dataType="light"
            title="Light Intensity Over Time"
            timeRange={timeRange}
          />

          <DataChart
            readings={filteredReadings}
            dataType="humidity"
            title="Humidity Over Time"
            timeRange={timeRange}
          />

          <DataChart
            readings={filteredReadings}
            dataType="pressure"
            title="Pressure Over Time"
            timeRange={timeRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
