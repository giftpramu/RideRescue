import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Network configuration for different environments
const getBaseURL = () => {
  // For web (Expo web mode or browser testing)
  if (Platform.OS === 'web') {
    return 'http://192.168.8.183:8080'; // include backend port
  }

  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://192.168.8.183:8080'; // Android emulator
    } else {
      return 'http://localhost:8080'; // iOS simulator
    }
  } else {
    return 'https://your-production-server.com';
  }
};

const BASE_URL = getBaseURL();

console.log('Platform:', Platform.OS);
console.log('API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Routes that don't require authentication (based on your backend)
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/signup/vehicle-owner',
  '/auth/signup/service-provider',
  '/api/documents/upload',
  '/api/documents/service-provider',
  '/auth/create-admin',
  '/service-providers/nearby',
];

// Helper function to check if a URL is a public route
const isPublicRoute = (url) => {
  const isPublic = PUBLIC_ROUTES.some(route => url.includes(route));
  console.log(`Checking if "${url}" is public:`, isPublic, 'Routes:', PUBLIC_ROUTES);
  return isPublic;
};

// Request interceptor to add auth token and logging (FIXED)
api.interceptors.request.use(
  async (config) => {
    try {
      const isPublic = isPublicRoute(config.url);
      console.log(`Checking route "${config.url}" - isPublic: ${isPublic}`);
      
      // Only add token for non-public routes AND ensure we don't have one already
      if (!isPublic) {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        // Explicitly remove any existing Authorization header for public routes
        delete config.headers.Authorization;
      }
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }

    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      isPublicRoute(config.url) ? 'PUBLIC ROUTE' : (config.headers.Authorization ? 'WITH TOKEN' : 'NO TOKEN')
    );
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      baseURL: error.config?.baseURL,
      url: error.config?.url,
    });

    // Handle 401 Unauthorized - token expired or invalid
    // But only for protected routes (not login/signup)
    if (error.response?.status === 401 && !isPublicRoute(error.config?.url)) {
      try {
        // Clear stored auth data
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
        
        // Remove token from headers
        delete api.defaults.headers.common['Authorization'];
        
        console.log('Session expired, user needs to login again');
        
      } catch (refreshError) {
        console.error('Error clearing auth data:', refreshError);
      }
    }

    if (Platform.OS === 'web') {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.error('CORS or Backend Connection Error');
        console.log('Make sure:');
        console.log('   1. Spring Boot backend is running on port 8080');
        console.log('   2. CORS is properly configured');
        console.log('   3. Backend URL is correct:', BASE_URL);
      }
    }

    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - check if backend is running');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - backend is not running or wrong port');
    }

    return Promise.reject(error);
  }
);

export default api;