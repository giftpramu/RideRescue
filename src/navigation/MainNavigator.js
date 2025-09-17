import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles';
import VehicleOwnerNavigator from './VehicleOwnerNavigator';
import ServiceProviderNavigator from './ServiceProviderNavigator';

const Stack = createStackNavigator();

// Main Navigator - Just decides which user type navigator to use
const MainNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Check user type - adjust this based on your auth context
  const isServiceProvider = user?.userType === 'service-provider' || 
                           user?.userType === 'SERVICE_PROVIDER' ||
                           user?.role === 'service_provider';

  console.log('User type detected:', isServiceProvider ? 'Service Provider' : 'Vehicle Owner');
  console.log('User object:', user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isServiceProvider ? (
        <Stack.Screen name="ServiceProviderApp" component={ServiceProviderNavigator} />
      ) : (
        <Stack.Screen name="VehicleOwnerApp" component={VehicleOwnerNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
  },
});

export default MainNavigator;