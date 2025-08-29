import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TestLoginScreen from '../screens/TestLoginScreen';
import MainNavigator from './MainNavigator'; // Vehicle Owner Navigation
import ServiceProviderNavigator from '../components/navigation/ServiceProviderNavigator';
import AuthNavigator from './AuthNavigator';
import UploadDocumentsScreen from '../screens/auth/UploadDocumentsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { 
    isLoading, 
    isAuthenticated, 
    user, 
    registrationState, 
    pendingServiceProviderId, 
    pendingUserEmail 
  } = useAuth();

  console.log('AppNavigator state:', {
    isLoading,
    isAuthenticated,
    userType: user?.userType,
    registrationState,
    pendingServiceProviderId
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Check if user is in the middle of service provider registration
        registrationState === 'pending_documents' && pendingServiceProviderId ? (
          <Stack.Screen 
            name="DocumentUpload" 
            component={UploadDocumentsScreen}
            initialParams={{
              serviceProviderId: pendingServiceProviderId,
              email: pendingUserEmail,
              fromSignup: true
            }}
            options={{
              // Prevent going back to signup during document upload
              gestureEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )
      ) : user?.userType === 'service-provider' || user?.userType === 'SERVICE_PROVIDER' ? (
        <Stack.Screen name="ServiceProvider" component={ServiceProviderNavigator} />
      ) : (
        <Stack.Screen name="VehicleOwner" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;