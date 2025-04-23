import { NextPage } from "next";
import { usePlants } from "../lib/context/PlantContext";
import { useCarbonSavings } from "../lib/hooks/useCarbonSavings";
import { useReadings, TimeRange } from "../lib/hooks/useReadings";
import DataChart from "../components/ui/DataChart";
import emissions_data from "../emissions_data.json";
import water_data from "../water_footprint.json";

const Emissions: NextPage = () => {
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
          <h1 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">Environmental Footprint</h1>
          <p className="text-gray-600 mb-10 max-w-2xl leading-relaxed">
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600">
                        {/* Plant icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 0C8.134 3 5 6.134 5 10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4 0-3.866-3.134-7-7-7z" />
                        </svg>
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{plant.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
                        {/* CO2 icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
                        </svg>
                      </span>
                      <span className="text-sm">CO₂ Saved: <span className="font-medium text-primary">{co2 * 1000} g</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-600">
                        {/* Water icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75C12 3.75 7.5 9.5 7.5 13a4.5 4.5 0 009 0c0-3.5-4.5-9.25-4.5-9.25z" />
                        </svg>
                      </span>
                      <span className="text-sm">Water Saved: <span className="font-medium text-primary">{water} L</span></span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-200 text-green-700">
                  {/* Leaf/CO2 icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 0C8.134 3 5 6.134 5 10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4 0-3.866-3.134-7-7-7z" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Total CO₂ Saved</h2>
              </div>
              <p className="text-2xl font-bold text-primary">{totalCO2} g</p>
            </div>
            <div className="flex flex-col items-start bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-700">
                  {/* Car icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V12a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 12v1.5m-18 0V17a2 2 0 002 2h14a2 2 0 002-2v-3.5m-18 0h18" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Car Miles</h2>
              </div>
              <p className="text-xs text-gray-700 mb-1">Avg CO₂ emitted per mile</p>
              <p className="text-2xl font-bold text-primary">{(totalCO2 / gramsPerMile).toFixed(2)} mi</p>
            </div>
            <div className="flex flex-col items-start bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-200 text-yellow-700">
                  {/* Tree icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 6.13 5 10c0 2.54 1.92 4.71 4.5 5.19V20h5v-5.81C17.08 13.71 19 11.54 19 9c0-3.87-3.13-7-7-7z" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Tree Equivalent</h2>
              </div>
              <p className="text-xs text-gray-700 mb-1">Avg CO₂ absorbed by 1 tree/year</p>
              <p className="text-2xl font-bold text-primary">{(totalCO2 / gramsPerTree).toFixed(2)} trees</p>
            </div>
            <div className="flex flex-col items-start bg-cyan-50 p-6 rounded-xl shadow-sm border border-cyan-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-200 text-cyan-700">
                  {/* Water drop icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75C12 3.75 7.5 9.5 7.5 13a4.5 4.5 0 009 0c0-3.5-4.5-9.25-4.5-9.25z" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Total Water Saved</h2>
              </div>
              <p className="text-2xl font-bold text-primary">{totalWaterUse.toLocaleString()} L</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Emissions;