import api from './index';

export const vehicleService = {
  // Get all vehicle services
  getAllVehicleServices: async () => {
    try {
      const response = await api.get('/vehicle-services');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle services');
    }
  },

  // Get vehicle service by ID
  getVehicleServiceById: async (id) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid vehicle service ID provided');
      }

      const response = await api.get(`/vehicle-services/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle service');
    }
  },

  // Create new vehicle service
  createVehicleService: async (vehicleServiceData) => {
    try {
      const response = await api.post('/vehicle-services', vehicleServiceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create vehicle service');
    }
  },

  // Update vehicle service
  updateVehicleService: async (id, vehicleServiceData) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid vehicle service ID provided');
      }

      console.log('📝 Updating vehicle service with ID:', id, 'Data:', vehicleServiceData);

      const url = `/vehicle-services/${id}`;
      console.log('🔗 Update URL:', url);

      const response = await api.put(url, vehicleServiceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update vehicle service');
    }
  },

  // Delete vehicle service
  deleteVehicleService: async (id) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid vehicle service ID provided');
      }

      console.log('🗑️ Deleting vehicle service with ID:', id);

      const url = `/vehicle-services/${id}`;
      console.log('🔗 Delete URL:', url);

      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete vehicle service');
    }
  },
};
