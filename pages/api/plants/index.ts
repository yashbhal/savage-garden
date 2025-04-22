import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { Plant, PlantsApiResponse, PlantApiResponse } from "../../../types";

// In a real application, this would be a database
// For this demo, we'll use in-memory storage
export const plants: Plant[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    species: "Monstera deliciosa",
    location: "Living Room",
    imageUrl: "/images/default-plant.svg",
    dateAdded: "2023-01-15T12:00:00Z",
    lastWatered: "2023-05-10T08:30:00Z",
    description:
      "Also known as the Swiss Cheese Plant, featuring large, heart-shaped leaves with distinctive splits and holes.",
    sensorId: "sensor-001",
    carbonSavings: 120,
  },
  {
    id: "2",
    name: "Peace Lily",
    species: "Spathiphyllum wallisii",
    location: "Bedroom",
    imageUrl: "/images/default-plant.svg",
    dateAdded: "2023-02-20T15:30:00Z",
    lastWatered: "2023-05-12T09:15:00Z",
    description:
      "An elegant plant with glossy leaves and white flowers, known for its air-purifying qualities.",
    sensorId: "sensor-002",
    carbonSavings: 85,
  },
  {
    id: "3",
    name: "Snake Plant",
    species: "Sansevieria trifasciata",
    location: "Home Office",
    imageUrl: "/images/default-plant.svg",
    dateAdded: "2023-03-05T10:15:00Z",
    lastWatered: "2023-05-08T18:00:00Z",
    description:
      "A hardy, drought-resistant succulent with tall, stiff leaves. Excellent for beginners.",
    carbonSavings: 95,
  },
  {
    id: "4",
    name: "Tomato",
    species: "Solanum lycopersicum",
    location: "Home Office",
    imageUrl: "/images/default-plant.svg",
    dateAdded: "2023-03-05T10:15:00Z",
    lastWatered: "2023-05-08T18:00:00Z",
    description:
      "...",
    carbonSavings: 95,
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlantsApiResponse | PlantApiResponse>
) {
  // Add artificial delay to simulate real API
  setTimeout(() => {
    switch (req.method) {
      case "GET":
        handleGetPlants(req, res);
        break;
      case "POST":
        handleAddPlant(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res
          .status(405)
          .json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
  }, 500);
}

function handleGetPlants(
  req: NextApiRequest,
  res: NextApiResponse<PlantsApiResponse>
) {
  // In a real app, this would have filtering, pagination, etc.
  res.status(200).json({ success: true, data: plants });
}

function handleAddPlant(
  req: NextApiRequest,
  res: NextApiResponse<PlantApiResponse>
) {
  try {
    const newPlant: Plant = {
      ...req.body,
      id: uuidv4(),
    };

    // Validate required fields
    if (!newPlant.name || !newPlant.species || !newPlant.location) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: name, species, and location are required",
      });
    }

    plants.push(newPlant);

    res.status(201).json({ success: true, data: newPlant });
  } catch (error) {
    console.error("Error adding plant:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add plant",
    });
    
  }
}
