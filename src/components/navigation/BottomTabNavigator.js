import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../styles';

// Import screens
import HomeScreen from '../../screens/vehicle-owner/HomeScreen';
import ProfileScreen from '../../screens/vehicle-owner/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = '🏠';
              break;
            case 'Profile':
              iconName = '👤';
              break;
            case 'Services':
              iconName = '⚙️';
              break;
            case 'History':
              iconName = '📋';
              break;
            default:
              iconName = '●';
          }

          return (
            <View style={styles.tabIcon}>
              <Text style={[styles.tabEmoji, { fontSize: size, opacity: focused ? 1 : 0.6 }]}>
                {iconName}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 70,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen 
        name="Services" 
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 20,
  },
});

export default BottomTabNavigator;