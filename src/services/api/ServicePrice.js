// services/api/ServicePriceService.js
import api from './index';

export const servicePrice = {
  // Create new service price
  createServicePrice: async (servicePriceData) => {
    try {
      console.log('📝 Creating service price:', servicePriceData);
      const response = await api.post('/service-prices', servicePriceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create service price');
    }
  },

  // Get all service prices
  getAllServicePrices: async () => {
    try {
      const response = await api.get('/service-prices');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service prices');
    }
  },

  // Get service price by ID
  getServicePriceById: async (id) => {
    try {
      // Ensure ID is properly defined
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid service price ID provided');
      }

      console.log('🔍 Fetching service price with ID:', id);
      const url = '/service-prices/' + id;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service price');
    }
  },

  // Get service prices by provider ID
  getServicePricesByProvider: async (providerId) => {
    try {
      // Ensure provider ID is properly defined
      if (!providerId || providerId === 'undefined' || providerId === '${providerId}') {
        throw new Error('Invalid provider ID provided');
      }

      console.log('🔍 Fetching service prices for provider:', providerId);
      const response = await api.get('/service-prices', {
        params: { providerId: providerId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch provider service prices');
    }
  },

  // Get service prices by service ID
  getServicePricesByService: async (serviceId) => {
    try {
      // Ensure service ID is properly defined
      if (!serviceId || serviceId === 'undefined' || serviceId === '${serviceId}') {
        throw new Error('Invalid service ID provided');
      }

      console.log('🔍 Fetching service prices for service:', serviceId);
      const response = await api.get('/service-prices', {
        params: { serviceId: serviceId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service prices for service');
    }
  },

  // Get service prices by provider using direct endpoint
  getProviderServicePrices: async (providerId) => {
    try {
      // Ensure provider ID is properly defined
      if (!providerId || providerId === 'undefined' || providerId === '${providerId}') {
        throw new Error('Invalid provider ID provided');
      }

      console.log('🔍 Fetching service prices for provider (direct endpoint):', providerId);
      const url = '/service-prices/provider/' + providerId;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch provider service prices');
    }
  },

  // Get service prices by service using direct endpoint
  getServiceServicePrices: async (serviceId) => {
    try {
      // Ensure service ID is properly defined
      if (!serviceId || serviceId === 'undefined' || serviceId === '${serviceId}') {
        throw new Error('Invalid service ID provided');
      }

      console.log('🔍 Fetching service prices for service (direct endpoint):', serviceId);
      const url = '/service-prices/service/' + serviceId;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service prices for service');
    }
  },

  // Update service price
  updateServicePrice: async (id, servicePriceData) => {
    try {
      // Ensure ID is properly defined and not undefined
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid service price ID provided');
      }

      console.log('📝 Updating service price with ID:', id, 'Data:', servicePriceData);
      
      // Construct URL properly
      const url = '/service-prices/' + id;
      console.log('🔗 Update URL:', url);
      
      const response = await api.put(url, servicePriceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update service price');
    }
  },

  // Delete service price
  deleteServicePrice: async (id) => {
    try {
      // Ensure ID is properly defined
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid service price ID provided');
      }

      console.log('🗑️ Deleting service price with ID:', id);
      
      // Construct URL properly
      const url = '/service-prices/' + id;
      console.log('🔗 Delete URL:', url);
      
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete service price');
    }
  },
};