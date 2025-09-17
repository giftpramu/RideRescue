import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../styles';
import HomeScreen from '../screens/vehicle-owner/HomeScreen';
import ProfileScreen from '../screens/vehicle-owner/ProfileScreen';
import EditProfileScreen from '../screens/vehicle-owner/EditProfileScreen';
import VehicleDetailsScreen from '../screens/vehicle-owner/VehicleDetailsScreen';
import MapScreen from '../screens/vehicle-owner/MapScreen';

const Stack = createStackNavigator();

const VehicleOwnerSidebar = ({ visible, onClose, navigation }) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 0, title: 'HOME', icon: 'home-outline', screen: 'Home' },
    { id: 1, title: 'PROFILE', icon: 'person-outline', screen: 'Profile' },
    { id: 2, title: 'YOUR VEHICLE', icon: 'car-outline', screen: 'VehicleDetails' },
    { id: 3, title: 'FIND SERVICES', icon: 'location-outline', screen: 'Map' },
  ];

  const handleMenuPress = (screenName) => {
    onClose();
    
    if (navigation && navigation.navigate) {
      navigation.navigate(screenName);
    } else {
      console.error('Navigation object not available');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.8)" />
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackground} onPress={onClose} />
        <View style={styles.sidebarContainer}>
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color={colors.white} />
            </TouchableOpacity>
            
            <View style={styles.profileSection}>
              <View style={styles.avatar}>
                <Icon name="person" size={32} color={colors.white} />
              </View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>
                {user?.name || 'Vehicle Owner'}
              </Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item) => {
              console.log(`Rendering menu item: ${item.title} -> ${item.screen}`);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    console.log(`=== MENU ITEM PRESSED ===`);
                    console.log('TouchableOpacity pressed:', item.title, item.screen);
                    console.log('Item ID:', item.id);
                    console.log('About to call handleMenuPress with:', item.screen);
                    handleMenuPress(item.screen);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <Icon name={item.icon} size={20} color={colors.white} style={styles.menuIcon} />
                    <Text style={styles.menuTitle}>{item.title}</Text>
                  </View>
                  <Icon name="chevron-forward" size={16} color={colors.white} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={signOut} activeOpacity={0.7}>
              <Icon name="log-out-outline" size={20} color={colors.error} style={styles.logoutIcon} />
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.modalBackground} onPress={onClose} />
      </View>
    </Modal>
  );
};

const ScreenWithSidebar = ({ children, title, navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Icon name="menu" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Screen Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Sidebar Modal */}
      <VehicleOwnerSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
      />
    </View>
  );
};

const VehicleOwnerNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home">
        {(props) => (
          <ScreenWithSidebar title="Home" navigation={props.navigation}>
            <HomeScreen {...props} />
          </ScreenWithSidebar>
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Profile">
        {(props) => (
          <ScreenWithSidebar title="Profile" navigation={props.navigation}>
            <ProfileScreen {...props} />
          </ScreenWithSidebar>
        )}
      </Stack.Screen>
      
      <Stack.Screen name="EditProfile">
        {(props) => <EditProfileScreen {...props} />}
      </Stack.Screen>
      
      <Stack.Screen name="VehicleDetails">
        {(props) => (
          <ScreenWithSidebar title="Your Vehicle" navigation={props.navigation}>
            <VehicleDetailsScreen {...props} />
          </ScreenWithSidebar>
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Map">
        {(props) => (
          <ScreenWithSidebar title="Find Services" navigation={props.navigation}>
            <MapScreen {...props} />
          </ScreenWithSidebar>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  rightArea: {
    flex: 1,
  },
  sidebarContainer: {
    width: 280,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    height: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  sidebarHeader: {
    paddingTop: 20,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  welcomeText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  userName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  menuSection: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: spacing.md,
    width: 24,
  },
  menuTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  logoutSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutIcon: {
    marginRight: spacing.md,
  },
  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});

export default VehicleOwnerNavigator;