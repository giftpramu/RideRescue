import api from './index';

export const vehicle = {
  // Get all vehicles
  getAllVehicles: async () => {
    try {
      const response = await api.get('/vehicles');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicles');
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id) => {
    try {
      // Ensure ID is properly defined
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid vehicle ID provided');
      }
      
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle');
    }
  },

  // Get vehicle by license plate
  getVehicleByLicensePlate: async (licensePlate) => {
    try {
      if (!licensePlate || licensePlate === 'undefined') {
        throw new Error('Invalid license plate provided');
      }
      
      const response = await api.get(`/vehicles/license-plate/${licensePlate}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle by license plate');
    }
  },

  // Get vehicles by owner ID
  getVehiclesByOwnerId: async (ownerId) => {
    try {
      if (!ownerId || ownerId === 'undefined') {
        throw new Error('Invalid owner ID provided');
      }
      
      console.log('🚗 Fetching vehicles for owner ID:', ownerId);
      const response = await api.get(`/vehicles/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicles by owner');
    }
  },

  // Get vehicles by model ID
  getVehiclesByModelId: async (modelId) => {
    try {
      if (!modelId || modelId === 'undefined') {
        throw new Error('Invalid model ID provided');
      }
      
      console.log('🚗 Fetching vehicles for model ID:', modelId);
      const response = await api.get(`/vehicles/model/${modelId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicles by model');
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    try {
      console.log('➕ Creating new vehicle:', vehicleData);
      const response = await api.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Vehicle with this license plate already exists');
      }
      if (error.response?.status === 400) {
        throw new Error('Invalid vehicle data or model not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to create vehicle');
    }
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    try {
      // Ensure ID is properly defined and not undefined
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid vehicle ID provided');
      }
      
      console.log('📝 Updating vehicle with ID:', id, 'Data:', vehicleData);
      
      // Construct URL properly
      const url = `/vehicles/${id}`;
      console.log('🔗 Update URL:', url);
      
      const response = await api.put(url, vehicleData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Invalid vehicle data or model not found');
      }
      if (error.response?.status === 404) {
        throw new Error('Vehicle not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update vehicle');
    }
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    try {
      // Ensure ID is properly defined
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid vehicle ID provided');
      }
      
      console.log('🗑️ Deleting vehicle with ID:', id);
      
      // Construct URL properly
      const url = `/vehicles/${id}`;
      console.log('🔗 Delete URL:', url);
      
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Vehicle not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete vehicle');
    }
  },

  // Check if vehicle exists by license plate
  checkVehicleExists: async (licensePlate) => {
    try {
      if (!licensePlate) {
        throw new Error('License plate is required');
      }
      
      await api.get(`/vehicles/license-plate/${licensePlate}`);
      return true; // Vehicle exists
    } catch (error) {
      if (error.response?.status === 404) {
        return false; // Vehicle doesn't exist
      }
      throw new Error(error.response?.data?.message || 'Failed to check vehicle existence');
    }
  },
};