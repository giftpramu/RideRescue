import api from './index';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get('/categories/${id}');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
              // Ensure ID is properly defined and not undefined
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid category ID provided');
      }
      
      console.log('📝 Updating category with ID:', id, 'Data:', categoryData);
      
      // Construct URL properly
      const url = '/categories/'+id;
      console.log('🔗 Update URL:', url);
      
      const response = await api.put(url, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
          // Ensure ID is properly defined
      if (!id || id === 'undefined' || id === '${id}') {
        throw new Error('Invalid category ID provided');
      }
      
      console.log('🗑️ Deleting category with ID:', id);
      
      // Construct URL properly
      const url = '/categories/'+id;
      console.log('🔗 Update URL:', url);
      
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  },
};