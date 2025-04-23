import { NextPage } from "next";
import { usePlants } from "../lib/context/PlantContext";
import { useCarbonSavings } from "../lib/hooks/useCarbonSavings";
import { useReadings, TimeRange } from "../lib/hooks/useReadings";
import DataChart from "../components/ui/DataChart";
import emissions_data from "../emissions_data.json";
import water_data from "../water_footprint.json";

const Footprint: NextPage = () => {
    const { plants, loading: plantsLoading } = usePlants();
    const gramsPerMile = 404; // CO2 grams per mile driven in average car
    const gramsPerTree = 24629; // CO2 grams absorbed by average tree per year

    const getCO2ForPlant = (plantName: string): number | null => {
      const match = emissions_data.find(item =>
        item.Plant?.toLowerCase() === plantName.toLowerCase()
      );
      return match ? (match.CO2Saved) : null;
    };

    const co2Plants = plants.map(plant => {
        const co2 = getCO2ForPlant(plant.name);
        return co2 !== null ? { ...plant, co2 } : null;
    })
    .filter(Boolean) as { id: string; name: string; co2: number }[];

    const getWaterForPlant = (plantName: string): number | null => {
        const match = water_data.find(item =>
          item.Plant?.toLowerCase() === plantName.toLowerCase()
        );
        return match ? (match.Water_Saved) : null;
      };
  
      const waterFootprintPlants = plants.map(plant => {
          const water = getWaterForPlant(plant.name);
          return water !== null ? { ...plant, water } : null;
      })
      .filter(Boolean) as { id: string; name: string; water: number }[];
  
    const totalCO2 = co2Plants.reduce((sum, plant) => sum + plant.co2 * 1000, 0);
    const totalWaterUse = waterFootprintPlants.reduce((sum, plant) => sum + plant.water, 0);

    if (totalCO2 && totalWaterUse) {
        localStorage.setItem('totalCO2', totalCO2.toString());
        localStorage.setItem('totalWater', totalWaterUse.toString());
    }

    return (
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Environmental Footprint</h1>
          <p className="text-gray-600 mb-8 max-w-2xl leading-relaxed text-base">
            Track the positive impact of your plants: see how much CO₂ and water you've saved compared to conventional food production. All calculations are based on your current plants.
          </p>

          {!plantsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {plants.map(plant => {
                const co2 = getCO2ForPlant(plant.name);
                const water = getWaterForPlant(plant.name);
                return co2 !== null ? (
                  <div
                    key={plant.id}
                    className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-lg transition-shadow group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">{plant.name}</h3>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-sm">CO₂ Saved: <span className="font-medium text-primary">{co2 * 1000} g</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-sm">Water Saved: <span className="font-medium text-primary">{water} L</span></span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Total CO₂ Saved</h2>
              <p className="text-2xl font-bold text-primary">{totalCO2} g</p>
            </div>
            <div className="flex flex-col items-start bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Car Miles</h2>
              <p className="text-xs text-gray-700 mb-1">Avg CO₂ emitted per mile</p>
              <p className="text-2xl font-bold text-primary">{(totalCO2 / gramsPerMile).toFixed(2)} mi</p>
            </div>
            <div className="flex flex-col items-start bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Tree Equivalent</h2>
              <p className="text-xs text-gray-700 mb-1">Avg CO₂ absorbed by 1 tree/year</p>
              <p className="text-2xl font-bold text-primary">{(totalCO2 / gramsPerTree).toFixed(2)} trees</p>
            </div>
            <div className="flex flex-col items-start bg-cyan-50 p-6 rounded-xl shadow-sm border border-cyan-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Total Water Saved</h2>
              <p className="text-2xl font-bold text-primary">{totalWaterUse.toLocaleString()} L</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Footprint;