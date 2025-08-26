import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TestLoginScreen from '../screens/TestLoginScreen';
import MainNavigator from './MainNavigator'; // Vehicle Owner Navigation
import ServiceProviderNavigator from '../components/navigation/ServiceProviderNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user?.userType === 'service-provider' ? (
        <Stack.Screen name="ServiceProvider" component={ServiceProviderNavigator} />
      ) : (
        <Stack.Screen name="VehicleOwner" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;