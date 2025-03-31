import { FC, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import { SensorReading } from "../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataChartProps {
  readings: SensorReading[];
  dataType: "moisture" | "temperature" | "light" | "weight";
  title?: string;
  timeRange?: "24h" | "7d" | "30d";
}

const DataChart: FC<DataChartProps> = ({
  readings,
  dataType,
  title = "",
  timeRange = "24h",
}) => {
  const filteredReadings = useMemo(() => {
    if (!readings || readings.length === 0) return [];

    const now = new Date();
    const filterDate = new Date();

    switch (timeRange) {
      case "7d":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        filterDate.setDate(now.getDate() - 30);
        break;
      default: // 24h
        filterDate.setDate(now.getDate() - 1);
    }

    return readings
      .filter((reading) => new Date(reading.timestamp) >= filterDate)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }, [readings, timeRange]);

  // Chart data and options
  const chartData = {
    labels: filteredReadings.map((reading) =>
      format(
        new Date(reading.timestamp),
        timeRange === "24h" ? "HH:mm" : "MMM dd"
      )
    ),
    datasets: [
      {
        label: getDataTypeLabel(dataType),
        data: filteredReadings.map((reading) => reading[dataType]),
        borderColor: getDataTypeColor(dataType),
        backgroundColor: `${getDataTypeColor(dataType)}33`, // Add transparency
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: dataType === "moisture" || dataType === "light",
        title: {
          display: true,
          text: getDataTypeUnit(dataType),
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {filteredReadings.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available for the selected time range
        </div>
      )}
    </div>
  );
};

// Helper functions
function getDataTypeLabel(dataType: string): string {
  switch (dataType) {
    case "moisture":
      return "Soil Moisture";
    case "temperature":
      return "Temperature";
    case "light":
      return "Light Intensity";
    case "weight":
      return "Plant Weight";
    default:
      return dataType;
  }
}

function getDataTypeColor(dataType: string): string {
  switch (dataType) {
    case "moisture":
      return "#3b82f6"; // blue
    case "temperature":
      return "#ef4444"; // red
    case "light":
      return "#f59e0b"; // amber
    case "weight":
      return "#10b981"; // emerald
    default:
      return "#6366f1"; // indigo
  }
}

function getDataTypeUnit(dataType: string): string {
  switch (dataType) {
    case "moisture":
      return "Moisture (%)";
    case "temperature":
      return "Temperature (°C)";
    case "light":
      return "Light (lux)";
    case "weight":
      return "Weight (g)";
    default:
      return "";
  }
}

export default DataChart;
