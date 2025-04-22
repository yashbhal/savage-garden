import { NextPage } from "next";
import { usePlants } from "../lib/context/PlantContext";
import { useCarbonSavings } from "../lib/hooks/useCarbonSavings";
import { useReadings, TimeRange } from "../lib/hooks/useReadings";
import DataChart from "../components/ui/DataChart";
import emissions_data from "../emissions_data.json";

const Emissions: NextPage = () => {
    var totalCO2 = 0;
    
    const { plants, loading: plantsLoading } = usePlants();

  
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

    totalCO2 = co2Plants.reduce((sum, plant) => sum + plant.co2 * 1000, 0);


    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="Title text">Emissions Saved</h1>
          <p className="Text description mb-4">Emissions saved within the food industry for every L of food grown</p>

          {!plantsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plants.map(plant => {
                const co2 = getCO2ForPlant(plant.name);

                return co2 !== null ? (
                  <div key={plant.id} className="bg-green-50 p-4 rounded-lg max-w-xs mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">{plant.name}</h3>
                    <p className="text-sm text-gray-600">
                      CO₂ Saved: <span className="font-medium">{co2 * 1000} g</span>
                    </p> 
                  </div>
                ) : null; 
              })}
            </div>
          )}


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 bg-yellow-50 p-4 max-w-xs rounded-lg mb-6">
            <h2 className="text-lg text-black-500 mb-1">Total CO₂ Saved</h2>
            <p className="text-2xl font-medium text-gray-900">
                {totalCO2.toLocaleString()} g
            </p>
        </div>
        
        </div>
      </div>
    );
  };
  
export default Emissions;