import api from './index';

export const brandService = {
  // Get all brands
  getAllBrands: async () => {
    try {
      const response = await api.get('/brands');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brands');
    }
  },

  // Get brand by ID
  getBrandById: async (id) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid brand ID provided');
      }

      console.log('🔍 Fetching brand with ID:', id);
      const url = '/brands/' + id;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brand');
    }
  },

  // Get brand by name
  getBrandByName: async (brandName) => {
    try {
      if (!brandName) {
        throw new Error('Brand name is required');
      }

      console.log('🔍 Fetching brand with name:', brandName);
      const url = '/brands/name/' + encodeURIComponent(brandName);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brand');
    }
  },

  // Create new brand
  createBrand: async (brandData) => {
    try {
      console.log('📝 Creating brand:', brandData);
      const response = await api.post('/brands', brandData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Brand already exists');
      }
      throw new Error(error.response?.data?.message || 'Failed to create brand');
    }
  },

  // Update brand
  updateBrand: async (id, brandData) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid brand ID provided');
      }

      console.log('📝 Updating brand with ID:', id, 'Data:', brandData);
      const url = '/brands/' + id;
      const response = await api.put(url, brandData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update brand');
    }
  },

  // Delete brand
  deleteBrand: async (id) => {
    try {
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid brand ID provided');
      }

      console.log('🗑️ Deleting brand with ID:', id);
      const url = '/brands/' + id;
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete brand');
    }
  },
};