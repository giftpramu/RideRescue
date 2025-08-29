import api from './index';

export const modelService = {
  // Get all models
  getAllModels: async () => {
    try {
      const response = await api.get('/models');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch models');
    }
  },

  // Get model by ID
  getModelById: async (id) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid model ID provided');
      }

      console.log('🔍 Fetching model with ID:', id);
      const url = '/models/' + id;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch model');
    }
  },

  // Get model by name
  getModelByName: async (modelName) => {
    try {
      if (!modelName) {
        throw new Error('Model name is required');
      }

      console.log('🔍 Fetching model with name:', modelName);
      const url = '/models/name/' + encodeURIComponent(modelName);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch model');
    }
  },

  // Get models by brand ID
  getModelsByBrandId: async (brandId) => {
    try {
      if (!brandId || brandId === 'undefined' || brandId === '${brandId}') {
        throw new Error('Invalid brand ID provided');
      }

      console.log('🔍 Fetching models for brand ID:', brandId);
      const url = '/models/brand/' + brandId;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch models for brand');
    }
  },

  // Create new model
  createModel: async (modelData) => {
    try {
      console.log('📝 Creating model:', modelData);
      const response = await api.post('/models', modelData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Model already exists');
      }
      if (error.response?.status === 400) {
        throw new Error('Invalid brand specified');
      }
      throw new Error(error.response?.data?.message || 'Failed to create model');
    }
  },

  // Update model
  updateModel: async (id, modelData) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid model ID provided');
      }

      console.log('📝 Updating model with ID:', id, 'Data:', modelData);
      const url = '/models/' + id;
      const response = await api.put(url, modelData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Invalid brand specified');
      }
      throw new Error(error.response?.data?.message || 'Failed to update model');
    }
  },

  // Delete model
  deleteModel: async (id) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid model ID provided');
      }

      console.log('🗑️ Deleting model with ID:', id);
      const url = '/models/' + id;
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete model');
    }
  },
};