import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MainNavigator from './MainNavigator'; // This handles both user types
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
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
              gestureEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )
      ) : (
        // MainNavigator handles both user types internally
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;