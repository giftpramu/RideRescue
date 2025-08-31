// services/api/ServiceRequestService.js
import api from './index';

export const serviceRequestService = {
  // Create new service request
  createServiceRequest: async (requestData) => {
    try {
      console.log('📝 Creating service request:', requestData);
      const response = await api.post('/service-requests', requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create service request');
    }
  },

  // Get service requests by vehicle owner
  getServiceRequestsByVehicleOwner: async (ownerId) => {
    try {
      const response = await api.get(`/service-requests/vehicle-owner/${ownerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service requests');
    }
  },

  // Get service requests by service provider
  getServiceRequestsByServiceProvider: async (providerId) => {
    try {
      const response = await api.get(`/service-requests/service-provider/${providerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service requests');
    }
  },

  // Get service request by ID
  getServiceRequestById: async (id) => {
    try {
      const response = await api.get(`/service-requests/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service request');
    }
  },

  // Update service request status
  updateServiceRequestStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/service-requests/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update service request');
    }
  },

  // Accept service request (for providers)
  acceptServiceRequest: async (id, providerNotes) => {
    try {
      const response = await api.put(`/service-requests/${id}/accept`, { 
        providerNotes: providerNotes 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to accept service request');
    }
  },

  // Reject service request (for providers)
  rejectServiceRequest: async (id, providerNotes) => {
    try {
      const response = await api.put(`/service-requests/${id}/reject`, { 
        providerNotes: providerNotes 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject service request');
    }
  },

  // Cancel service request (for vehicle owners)
  cancelServiceRequest: async (id) => {
    try {
      const response = await api.put(`/service-requests/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel service request');
    }
  },
};