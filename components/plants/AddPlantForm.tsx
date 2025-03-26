import { FC, useState, FormEvent } from 'react';
import { usePlants } from '../../lib/context/PlantContext';

interface AddPlantFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPlantForm: FC<AddPlantFormProps> = ({ onSuccess, onCancel }) => {
  const { addPlant } = usePlants();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.name || !formData.species) {
        throw new Error('Name and species are required');
      }

      // Use placeholder image if not provided
      const imageUrl = formData.imageUrl || 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      
      // Current date in ISO format
      const dateAdded = new Date().toISOString();
      const lastWatered = dateAdded;

      const success = await addPlant({
        ...formData,
        location: 'Not specified', // Default value
        imageUrl,
        dateAdded,
        lastWatered,
        carbonSavings: 0, // Initial carbon savings is 0
      });

      if (success) {
        setFormData({
          name: '',
          species: '',
          description: '',
          imageUrl: '',
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add plant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-6">Add New Plant</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Plant Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                        focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="species" className="block text-sm font-medium text-gray-700">
              Species *
            </label>
            <input
              type="text"
              name="species"
              id="species"
              value={formData.species}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                        focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                        focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave blank to use a default image
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                        focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium 
                        text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                      text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Plant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm; 