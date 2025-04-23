import { useState } from "react";
import type { NextPage } from "next";
import { usePlants } from "../lib/context/PlantContext";
import SearchBar from "../components/ui/SearchBar";
import PlantCard from "../components/plants/PlantCard";
import AddPlantForm from "../components/plants/AddPlantForm";
import { plants } from "./api/plants";
import { Plant } from "../types";

interface HomeProps {
  initialPlants: Plant[];
}

const Home: NextPage<HomeProps> = ({ initialPlants }) => {
  const { plants: contextPlants, loading, error } = usePlants();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingPlant, setIsAddingPlant] = useState(false);

  // Use initial plants if context is still loading
  const displayPlants = loading ? initialPlants : contextPlants;

  // Filter plants based on search query
  const filteredPlants = displayPlants.filter((plant) => {
    const query = searchQuery.toLowerCase();
    return (
      plant.name.toLowerCase().includes(query) ||
      plant.species.toLowerCase().includes(query) ||
      plant.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Remove the direct LightNotification usage since it's now handled by the NotificationProvider */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-96">
            <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />
          </div>
          <button
            onClick={() => setIsAddingPlant(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Plant
          </button>
        </div>
      </div>

      {isAddingPlant && (
        <AddPlantForm
          onSuccess={() => setIsAddingPlant(false)}
          onCancel={() => setIsAddingPlant(false)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-gray-500">Loading plants...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          {filteredPlants.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No plants found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Try a different search term or" : "Start by"}{" "}
                adding your first plant
              </p>
              {!isAddingPlant && (
                <button
                  onClick={() => setIsAddingPlant(true)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Add Plant
                </button>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-medium mb-4">
                {searchQuery
                  ? `Search Results (${filteredPlants.length})`
                  : `Your Plants (${filteredPlants.length})`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {
      initialPlants: plants,
    },
    // Re-generate the page at most once per 10 seconds
    revalidate: 10,
  };
}

export default Home;
