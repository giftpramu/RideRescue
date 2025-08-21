import axios from 'axios';
import { Platform } from 'react-native';

// Network configuration for different environments
const getBaseURL = () => {
  // For web (Expo web mode or browser testing)
  if (Platform.OS === 'web') {
    return 'http://192.168.8.183:8080'; // ✅ include backend port
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

console.log('🌐 Platform:', Platform.OS);
console.log('🔗 API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      baseURL: error.config?.baseURL,
      url: error.config?.url,
    });

    if (Platform.OS === 'web') {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.error('🌐 CORS or Backend Connection Error');
        console.log('💡 Make sure:');
        console.log('   1. Spring Boot backend is running on port 8080');
        console.log('   2. CORS is properly configured');
        console.log('   3. Backend URL is correct:', BASE_URL);
      }
    }

    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - check if backend is running');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🚫 Connection refused - backend is not running or wrong port');
    }

    return Promise.reject(error);
  }
);

export default api;
