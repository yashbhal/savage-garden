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
    const gramsPerTree = 21000; // CO2 grams absorbed by average tree per year

    const getCO2ForPlant = (plantName: string): number | null => {
      const match = emissions_data.find(item =>
        item.Plant?.toLowerCase() === plantName.toLowerCase()
      );

      return match ? (match.CO2Saved) : null;
    };
  

    const co2Plants = plants.map(plant => {
        const co2 = getCO2ForPlant(plant.name);
        return co2 !== null ? { ...plant, co2 } : 0;
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
          return water !== null ? { ...plant, water } : 0;
      })
      .filter(Boolean) as { id: string; name: string; water: number }[];
  

    const totalCO2 = co2Plants.reduce((sum, plant) => sum + plant.co2 * 1000, 0);
    const totalWaterUse = waterFootprintPlants.reduce((sum, plant) => sum + plant.water, 0);

    if (totalCO2 && totalWaterUse) {
        localStorage.setItem('totalCO2', totalCO2.toString());
        localStorage.setItem('totalWater', totalWaterUse.toString());
    }

    // const updateTotals = (() => {
    //     localStorage.setItem('totalCO2', totalCO2.toString());
    //     localStorage.setItem('totalWater', totalWaterUse.toString());
    // })

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="Title text">Emissions And Water Usage</h1>
          <p className="Text description mb-5">Shows the emissions and water levels that would have been used within the food industry for every L of food produced</p>

          {!plantsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plants.map(plant => {
                const co2 = getCO2ForPlant(plant.name);
                const water = getWaterForPlant(plant.name);

                return co2 !== null ? (
                  <div key={plant.id} className="bg-green-50 p-4 rounded-lg max-w-xs mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">{plant.name}</h3>
                    <p className="text-sm text-gray-600">
                      CO₂ Saved: <span className="font-medium">{co2 * 1000} g</span>
                    </p> 
                    <p className="text-sm text-gray-600">
                      Water Saved: <span className="font-medium">{water} L</span>
                    </p> 
                  </div>
                ) : null; 
              })}
            </div>
          )}
        <div className="flex flex-wrap gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 bg-yellow-50 p-4 max-w-xs rounded-lg mb-6">
                <h2 className="text-lg text-black-500 font-bold  mb-1">Total CO₂ Saved</h2>
                <br />
                <p className="text-2xl font-medium text-gray-900">
                    {totalCO2} g
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 bg-yellow-50 p-4 max-w-xs rounded-lg mb-6">
                <h3 className="text-sm text-black-500 font-semibold  mb-1">Equivalent Car Miles</h3>
                <br />
                <p className="text-2xl font-medium text-gray-900">
                    {(totalCO2 / gramsPerMile).toFixed(2)} mi
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 bg-yellow-50 p-4 max-w-xs rounded-lg mb-6">
                <h2 className="text-sm text-black-500 font-semibold  mb-1">Trees Equivalent</h2>
                <br />
                <p className="text-2xl font-medium text-gray-900">
                {(totalCO2 / gramsPerTree).toFixed(2)} g
                </p>
            </div>

        </div>

        <div className="grid lg:grid-cols-1 bg-blue-50 p-4 max-w-xs rounded-lg mb-6">
            <h2 className="text-lg text-black-500 font-bold mb-1">Total Water Saved</h2>
            <p className="text-2xl font-medium text-gray-900">
                {totalWaterUse.toLocaleString()} L
            </p>
        </div>
        
        </div>
      </div>
    );
  };
  
export default Emissions;