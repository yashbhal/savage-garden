import { NextApiRequest, NextApiResponse } from 'next';
import { Plant, PlantApiResponse } from '../../../types';
import { plants } from './index';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlantApiResponse>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid plant ID' });
  }

  // Add artificial delay to simulate real API
  setTimeout(() => {
    switch (req.method) {
      case 'GET':
        handleGetPlant(req, res, id);
        break;
      case 'PUT':
        handleUpdatePlant(req, res, id);
        break;
      case 'DELETE':
        handleDeletePlant(req, res, id);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
  }, 500);
}

function handleGetPlant(req: NextApiRequest, res: NextApiResponse<PlantApiResponse>, id: string) {
  const plant = plants.find(p => p.id === id);

  if (!plant) {
    return res.status(404).json({ success: false, error: 'Plant not found' });
  }

  res.status(200).json({ success: true, data: plant });
}

function handleUpdatePlant(req: NextApiRequest, res: NextApiResponse<PlantApiResponse>, id: string) {
  try {
    const plantIndex = plants.findIndex(p => p.id === id);

    if (plantIndex === -1) {
      return res.status(404).json({ success: false, error: 'Plant not found' });
    }

    const updatedPlant: Plant = {
      ...plants[plantIndex],
      ...req.body,
      id, // Ensure the ID doesn't change
    };

    plants[plantIndex] = updatedPlant;

    res.status(200).json({ success: true, data: updatedPlant });
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ success: false, error: 'Failed to update plant' });
  }
}

function handleDeletePlant(req: NextApiRequest, res: NextApiResponse<PlantApiResponse>, id: string) {
  try {
    const plantIndex = plants.findIndex(p => p.id === id);

    if (plantIndex === -1) {
      return res.status(404).json({ success: false, error: 'Plant not found' });
    }

    const deletedPlant = plants[plantIndex];
    plants.splice(plantIndex, 1);

    res.status(200).json({ success: true, data: deletedPlant });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ success: false, error: 'Failed to delete plant' });
  }
} 