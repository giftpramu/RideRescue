// Complete AuthContext.js replacement with registration state management

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api/authService';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  token: null,
  isInitialized: false,
  currentAuthScreen: 'Welcome',
  // Registration state management
  registrationState: null, // null, 'pending_documents', 'completed'
  pendingServiceProviderId: null,
  pendingUserEmail: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: true, isLoading: false };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isInitialized: true,
        // Clear registration state on successful login
        registrationState: null,
        pendingServiceProviderId: null,
        pendingUserEmail: null,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        isInitialized: true,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        isInitialized: true,
        // Clear registration state on logout
        registrationState: null,
        pendingServiceProviderId: null,
        pendingUserEmail: null,
      };

    case 'SET_AUTH_SCREEN':
      return {
        ...state,
        currentAuthScreen: action.payload,
      };
    
    case 'RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isInitialized: true,
      };
    
    // Registration state management
    case 'SET_REGISTRATION_STATE':
      return {
        ...state,
        registrationState: action.payload.state,
        pendingServiceProviderId: action.payload.serviceProviderId || state.pendingServiceProviderId,
        pendingUserEmail: action.payload.email || state.pendingUserEmail,
      };
    
    case 'CLEAR_REGISTRATION_STATE':
      return {
        ...state,
        registrationState: null,
        pendingServiceProviderId: null,
        pendingUserEmail: null,
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('Initializing auth state...');
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = await authService.getStoredToken();
      const user = await authService.getCurrentUser();
      
      if (token && user) {
        // Check if token is expired (if your backend provides expiration time)
        const isExpired = await authService.isTokenExpired();
        
        if (!isExpired) {
          // Set token in API headers
          authService.setAuthToken(token);
          
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user, token }
          });
          
          console.log('Session restored for user:', user.username, 'Type:', user.userType);
        } else {
          console.log('Token expired, clearing session');
          await authService.logout();
          dispatch({ type: 'SET_INITIALIZED' });
        }
      } else {
        console.log('No existing session found');
        dispatch({ type: 'SET_INITIALIZED' });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({ type: 'SET_INITIALIZED' });
    }
  };

  const setCurrentAuthScreen = (screenName) => {
    dispatch({ type: 'SET_AUTH_SCREEN', payload: screenName });
  };

  const setRegistrationState = (state, serviceProviderId = null, email = null) => {
    console.log('Setting registration state:', state, 'ID:', serviceProviderId);
    dispatch({ 
      type: 'SET_REGISTRATION_STATE', 
      payload: { state, serviceProviderId, email } 
    });
  };

  const clearRegistrationState = () => {
    console.log('Clearing registration state');
    dispatch({ type: 'CLEAR_REGISTRATION_STATE' });
  };

  // Updated signIn method - removed userType parameter
  const signIn = async (usernameOrEmail, password) => {
    console.log('AuthContext.signIn called for user:', usernameOrEmail);
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Use authService for login (backend determines user type)
      const response = await authService.login(usernameOrEmail, password);
      
      // Transform backend role to frontend userType format
      const userWithUserType = {
        ...response.user,
        userType: response.user.role // Map backend 'role' field to 'userType'
      };
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: userWithUserType,
          token: response.accessToken
        }
      });
      
      console.log('AuthContext: Login successful for user:', userWithUserType?.username, 'Type:', userWithUserType?.userType);
      
      return {
        success: true,
        user: userWithUserType,
        userType: userWithUserType?.userType // Use the mapped userType
      };
    } catch (error) {
      console.error('AuthContext.signIn error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const signUp = async (userData, userType) => {
    console.log('AuthContext.signUp called with userType:', userType);
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      let response;
      
      if (userType === 'service-provider') {
        response = await authService.registerServiceProvider(userData);
        
        // Set registration state for service providers to trigger document upload flow
        if (response?.id) {
          console.log('Service provider registered, setting pending_documents state');
          setRegistrationState('pending_documents', response.id, userData.email);
        }
      } else if (userType === 'admin') {
        response = await authService.createAdmin(userData);
      } else {
        response = await authService.registerVehicleOwner(userData);
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
      console.log('AuthContext: Registration successful');
      return response;
    } catch (error) {
      console.error('AuthContext.signUp error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const signOut = async () => {
    console.log('AuthContext.signOut called');
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      console.log('AuthContext: Logout successful');
    } catch (error) {
      console.error('AuthContext.signOut error:', error);
      // Still logout locally even if server request fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Helper method to check user role
  const hasRole = (role) => {
    return state.user?.userType === role;
  };

  // Helper method to check if user is admin
  const isAdmin = () => {
    return hasRole('ADMIN') || hasRole('admin');
  };

  // Helper method to check if user is service provider
  const isServiceProvider = () => {
    return hasRole('SERVICE_PROVIDER') || hasRole('service-provider');
  };

  // Helper method to check if user is vehicle owner
  const isVehicleOwner = () => {
    return hasRole('VEHICLE_OWNER') || hasRole('vehicle-owner');
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    setCurrentAuthScreen,
    setRegistrationState,
    clearRegistrationState,
    hasRole,
    isAdmin,
    isServiceProvider,
    isVehicleOwner,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 