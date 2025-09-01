import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles';

// Import Service Provider screens
import ServiceProviderHomeScreen from '../../screens/service-provider/ServiceProviderHomeScreen';
import ServiceRequestDetailScreen from '../../screens/service-provider/ServiceRequestDetailScreen';
import ServiceBillDetailsScreen from '../../screens/service-provider/ServiceBillDetailsScreen';
import ServiceBillPreviewScreen from '../../screens/service-provider/ServiceBillPreviewScreen';
import ServiceBillSuccessScreen from '../../screens/service-provider/ServiceBillSuccessScreen';
import NotificationsScreen from '../../components/common/NotificationsScreen';
import { ServiceInsertionScreen } from '../../screens/service-provider/ServiceInsertiontScreen';
import { ServiceCategoryManagementScreen } from '../../screens/common/ServiceCategoryManagementScreen';
import AddCategoryScreen from '../../screens/common/AddCategoryScreen';
import CreateServiceScreen from '../../screens/service-provider/CreateServiceScreen';
import ServiceRequestPreviewScreen from '../../screens/service-provider/ServiceRequestPreviewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Service Provider Side Menu
const ServiceProviderMenuScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { 
      id: 1, 
      title: 'Profile', 
      icon: '👤', 
      screen: 'ServiceProviderProfile' 
    },
    { 
      id: 2, 
      title: 'Service History', 
      icon: '📋', 
      screen: 'ServiceHistory' 
    },
    { 
      id: 3, 
      title: 'Service Management', 
      icon: '📋', 
      screen: 'ServiceManagement' 
    },
    { 
      id: 4, 
      title: 'Service Category Management', 
      icon: '📋', 
      screen: 'ServiceCategoryManagement' 
    },
  ];

  const handleMenuPress = (item) => {
    navigation.goBack();
    navigation.navigate(item.screen);
  };

  const handleLogout = () => {
    navigation.goBack();
    signOut();
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.png')}
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
            <Text style={styles.avatarText}>🔧</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.backText}>back</Text>
          <Text style={styles.userName}>{user?.name || 'Sterling AfterCare'}</Text>

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

// Enhanced Service Provider Home with Menu
const EnhancedServiceProviderHome = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      {/* Custom Header with Menu Button */}
      <View style={styles.homeHeader}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('ServiceProviderMenu')}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
      </View>
      
      {/* Service Provider Home Content */}
      <View style={styles.homeContent}>
        <ServiceProviderHomeScreen navigation={navigation} />
      </View>
    </View>
  );
};

// Service Provider Profile Screen
const ServiceProviderProfileScreen = ({ navigation }) => (
  <View style={styles.placeholderContainer}>
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.placeholderTitle}>Service Provider Profile</Text>
    <Text style={styles.placeholderText}>Service provider profile management will be implemented here.</Text>
  </View>
);

// Service History Screen
const ServiceHistoryScreen = ({ navigation }) => (
  <View style={styles.placeholderContainer}>
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.placeholderTitle}>Service History</Text>
    <Text style={styles.placeholderText}>Service history and completed jobs will be shown here.</Text>
  </View>
);

// Bottom Tab Navigator for Service Provider
const ServiceProviderTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;

          switch (route.name) {
            case 'Requests':
              iconName = '📋';
              break;
            case 'History':
              iconName = '📚';
              break;
            case 'Profile':
              iconName = '👤';
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
        name="Requests" 
        component={EnhancedServiceProviderHome}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="History" 
        component={ServiceHistoryScreen}
        options={{ tabBarLabel: '' }}
      />
    </Tab.Navigator>
  );
};

// Main Service Provider Navigator
const ServiceProviderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main service provider app with tabs */}
      <Stack.Screen name="Main" component={ServiceProviderTabNavigator} />
      
      {/* Side menu as modal */}
      <Stack.Screen 
        name="ServiceProviderMenu" 
        component={ServiceProviderMenuScreen}
        options={{
          presentation: 'transparentModal',
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      
      {/* Service provider specific screens */}
      <Stack.Screen name="ServiceRequestDetail" component={ServiceRequestDetailScreen} />
      <Stack.Screen name="ServiceBillDetails" component={ServiceBillDetailsScreen} />
      <Stack.Screen name="ServiceBillPreview" component={ServiceBillPreviewScreen} />
      <Stack.Screen name="ServiceBillSuccess" component={ServiceBillSuccessScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      
      {/* Menu screens */}
      <Stack.Screen name="ServiceProviderProfile" component={ServiceProviderProfileScreen} />
      <Stack.Screen name="ServiceHistory" component={ServiceHistoryScreen} />
      <Stack.Screen name="ServiceManagement" component={ServiceInsertionScreen} />
      <Stack.Screen name="ServiceCategoryManagement" component={ServiceCategoryManagementScreen} />
      <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
      <Stack.Screen name="CreateService" component={CreateServiceScreen} />
      <Stack.Screen name="ServiceRequestPreview" component={ServiceRequestPreviewScreen} />
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
    backgroundColor: colors.success || '#28a745',
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
});

export default ServiceProviderNavigator;