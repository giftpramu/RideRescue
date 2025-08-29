import api from './index';

export const serviceProviderService = {
  // Get nearby service providers
  getNearbyProviders: async (latitude, longitude, radius = 25) => {
    try {
      const response = await api.get('/service-providers/nearby', {
        params: {
          lat: latitude,
          lng: longitude,
          radius: radius
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get provider details by ID
  getProviderDetails: async (providerId) => {
    try {
      const response = await api.get(`/api/service-providers/${providerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};