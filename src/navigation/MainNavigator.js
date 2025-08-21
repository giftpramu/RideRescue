import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/vehicle-owner/HomeScreen';
import ProfileScreen from '../screens/vehicle-owner/ProfileScreen';
// import { ServiceHistoryScreen, ServicesScreen } from '../screens/vehicle-owner';
import VehicleDetailsScreen from '../screens/vehicle-owner/VehicleDetailsScreen';
import EditProfileScreen from '../screens/vehicle-owner/EditProfileScreen';
import EmergencyServiceScreen from '../screens/vehicle-owner/EmergencyServiceScreen';

// Import new map-related screens
import MapScreen from '../screens/vehicle-owner/MapScreen';
import ServiceCenterDetailScreen from '../screens/vehicle-owner/ServiceCenterDetailScreen';
import ServiceBookingScreen from '../screens/vehicle-owner/ServiceBookingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Side Menu Modal Screen (replaces Drawer)
const SideMenuScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { 
      id: 1, 
      title: 'PROFILE', 
      icon: '👤', 
      screen: 'Profile' 
    },
    { 
      id: 2, 
      title: 'YOUR VEHICLE', 
      icon: '🚗', 
      screen: 'VehicleDetails' 
    },
    { 
      id: 3, 
      title: 'PAYMENT METHODS', 
      icon: '💳', 
      screen: 'PaymentMethods' 
    },
    { 
      id: 4, 
      title: 'SETTINGS', 
      icon: '⚙️',  
      screen: 'Settings' 
    },
  ];

  const handleMenuPress = (item) => {
    navigation.goBack(); // Close menu first
    if (item.screen === 'Profile') {
      navigation.navigate('Main', { screen: 'Profile' });
    } else {
      navigation.navigate(item.screen);
    }
  };

  const handleLogout = () => {
    navigation.goBack();
    signOut();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/car-background.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.menuContainer}>
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.backText}>back</Text>
          <Text style={styles.userName}>{user?.name || 'Gamage'}</Text>

          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}

          {/* Car Image */}
          <View style={styles.carSection}>
            <Image
              source={require('../../assets/images/car-background.jpeg')}
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Enhanced Home Screen with Menu Button
const EnhancedHomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      {/* Custom Header with Menu Button */}
      <View style={styles.homeHeader}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('SideMenu')}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
      </View>
      
      {/* Original Home Screen Content */}
      <View style={styles.homeContent}>
        <HomeScreen navigation={navigation} />
      </View>
    </View>
  );
};

// Bottom Tab Navigator - Updated with Map
const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = '🏠';
              break;
            case 'Map':
              iconName = '📍';
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
          paddingBottom: 10 + insets.bottom,
          height: 60 + insets.bottom,
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
        component={EnhancedHomeScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="Services" 
        component={ProfileScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="History" 
        component={ProfileScreen}
        options={{ tabBarLabel: '' }}
      />
    </Tab.Navigator>
  );
};

// Placeholder screens for navigation
const PaymentMethodsScreen = ({ navigation }) => (
  <View style={styles.placeholderContainer}>
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.placeholderTitle}>Payment Methods</Text>
    <Text style={styles.placeholderText}>Payment methods management will be implemented here.</Text>
  </View>
);

const SettingsScreen = ({ navigation }) => (
  <View style={styles.placeholderContainer}>
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.placeholderTitle}>Settings</Text>
    <Text style={styles.placeholderText}>App settings will be implemented here.</Text>
  </View>
);

const ServiceRequestScreen = ({ route, navigation }) => {
  const { service } = route.params || {};
  
  return (
    <View style={styles.placeholderContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.placeholderTitle}>Service Request</Text>
      {service && (
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceDetailsTitle}>Selected Service:</Text>
          <Text style={styles.serviceDetailsText}>{service.name}</Text>
        </View>
      )}
      <Text style={styles.placeholderText}>Service request functionality will be implemented here.</Text>
    </View>
  );
};

// Main Stack Navigator
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main app with tabs */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      
      {/* Side menu as modal */}
      <Stack.Screen 
        name="SideMenu" 
        component={SideMenuScreen}
        options={{
          presentation: 'transparentModal',
          cardStyle: { backgroundColor: 'transparent' },
          animationTypeForReplace: 'push',
        }}
      />
      
      {/* Map-related screens */}
      <Stack.Screen name="ServiceCenterDetail" component={ServiceCenterDetailScreen} />
      <Stack.Screen name="ServiceBooking" component={ServiceBookingScreen} />
      
      {/* Other screens */}
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="EmergencyService" component={EmergencyServiceScreen} />
      <Stack.Screen name="ServiceRequest" component={ServiceRequestScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  // Background and overlay
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Menu styles
  menuContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xl,
  },
  closeIcon: {
    color: colors.white,
    fontSize: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: colors.white,
  },
  menuSection: {
    flex: 1,
  },
  backText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  userName: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 30,
  },
  menuTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
  menuArrow: {
    color: colors.white,
    fontSize: 16,
  },
  carSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  carImage: {
    width: 200,
    height: 120,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
  
  // Home screen styles
  homeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  homeHeader: {
    position: 'absolute',
    top: spacing.xxxl,
    left: spacing.lg,
    zIndex: 1,
  },
  menuButton: {
    padding: spacing.sm,
  },
  menuButtonText: {
    color: colors.white,
    fontSize: 24,
  },
  homeContent: {
    flex: 1,
  },
  
  // Tab styles
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 20,
  },
  
  // Placeholder screen styles
  placeholderContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  serviceDetails: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  serviceDetailsTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  serviceDetailsText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MainNavigator;