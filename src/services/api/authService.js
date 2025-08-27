// src/services/authService.js
import api from './index'; // Uses the fixed API with route-based exclusion
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Login user (removed userType parameter - backend doesn't need it)
  login: async (usernameOrEmail, password) => {
    try {
      console.log('authService.login called with:', { usernameOrEmail });
      
      const response = await api.post('/auth/login', {
        usernameOrEmail,
        password,
        // No userType - backend determines this from stored user data
      });
      
      console.log('Login API response:', response.data);
      
      const { accessToken, user, expirationTime } = response.data;
      
      // Store token and user data
      if (accessToken) {
        await AsyncStorage.setItem('authToken', accessToken);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        
        // Store expiration time if provided
        if (expirationTime) {
          await AsyncStorage.setItem('tokenExpiration', expirationTime.toString());
        }
        
        // Set token in API headers for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        console.log('Token stored successfully for user type:', user?.userType);
      }
      
      return response.data;
    } catch (error) {
      console.error('authService.login error:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message ||
                          'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Register Vehicle Owner
  registerVehicleOwner: async (userData) => {
    try {
      console.log('Registering vehicle owner:', userData);
      
      // Transform data to match backend VehicleOwnerSignupRequest structure
      const backendData = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        contactNumber: userData.contactNumber,
        address: userData.address,
        password: userData.password,
        vehicleBrand: userData.vehicleBrand,
        vehicleModel: userData.vehicleModel,
        vehicleYear: userData.vehicleYear,
        vehicleRegistrationNumber: userData.vehicleRegistrationNumber,
      };
      
      const response = await api.post('/auth/signup/vehicle-owner', backendData);
      console.log('Vehicle owner registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Vehicle owner registration error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Registration failed';
      throw new Error(errorMessage);
    }
  },

  // Register Service Provider
  registerServiceProvider: async (userData) => {
    try {
      console.log('Registering service provider:', userData);
      const response = await api.post('/auth/signup/service-provider', userData);
      return response.data;
    } catch (error) {
      console.error('Service provider registration error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Registration failed';
      throw new Error(errorMessage);
    }
  },

  // Create Admin (if needed for your app)
  createAdmin: async (userData) => {
    try {
      console.log('Creating admin user:', userData);
      const response = await api.post('/auth/create-admin', userData);
      return response.data;
    } catch (error) {
      console.error('Admin creation error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Admin creation failed';
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: async () => {
    try {
      console.log('Logging out user...');
      
      // Your backend doesn't have a logout endpoint, so just clean up locally
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('tokenExpiration');
      delete api.defaults.headers.common['Authorization'];
      
      console.log('Local logout completed');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  },

  // Get current user data from storage
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;
      console.log('Current user from storage:', user?.username, user?.userType);
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Get stored token
  getStoredToken: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Stored token exists:', !!token);
      return token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  // Set token in API headers (for app initialization)
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Auth token set in API headers');
    } else {
      delete api.defaults.headers.common['Authorization'];
      console.log('Auth token removed from API headers');
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const isAuth = !!token;
      console.log('Is authenticated:', isAuth);
      return isAuth;
    } catch (error) {
      console.error('Is authenticated check error:', error);
      return false;
    }
  },

  // Check if token is expired (if your backend provides expiration time)
  isTokenExpired: async () => {
    try {
      const expirationTime = await AsyncStorage.getItem('tokenExpiration');
      if (!expirationTime) return false;
      
      const currentTime = Date.now();
      const expiry = parseInt(expirationTime);
      
      return currentTime >= expiry;
    } catch (error) {
      console.error('Token expiration check error:', error);
      return true; // Assume expired if we can't check
    }
  },

  // Get user role for navigation decisions
  getUserRole: async () => {
    try {
      const user = await this.getCurrentUser();
      return user?.userType || null;
    } catch (error) {
      console.error('Get user role error:', error);
      return null;
    }
  },
};

// Admin Service (separate from auth, for admin operations)
export const adminService = {
  // Get pending service providers
  getPendingServiceProviders: async () => {
    try {
      const response = await api.get('/admin/service-providers/pending');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch pending service providers';
      throw new Error(errorMessage);
    }
  },

  // Get all service providers
  getAllServiceProviders: async () => {
    try {
      const response = await api.get('/admin/service-providers');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch service providers';
      throw new Error(errorMessage);
    }
  },

  // Get service providers by status
  getServiceProvidersByStatus: async (status) => {
    try {
      const response = await api.get(`/admin/service-providers/status/${status}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch service providers';
      throw new Error(errorMessage);
    }
  },

  // Approve service provider
  approveServiceProvider: async (providerId) => {
    try {
      const response = await api.post(`/admin/service-providers/${providerId}/approve`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to approve service provider';
      throw new Error(errorMessage);
    }
  },

  // Reject service provider
  rejectServiceProvider: async (providerId, reason) => {
    try {
      const response = await api.post(`/admin/service-providers/${providerId}/reject`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to reject service provider';
      throw new Error(errorMessage);
    }
  },
};