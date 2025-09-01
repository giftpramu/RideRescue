import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  ImageBackground 
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, typography, spacing } from '../../styles';

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const services = [
    { id: 1, name: 'Flat Tyre', icon: '🔧', category: 'emergency' },
    { id: 2, name: 'Basic Service', icon: '⚙️', category: 'maintenance' },
    { id: 3, name: 'Full Service', icon: '🔧', category: 'maintenance' },
    { id: 4, name: 'Mechanical Repairs', icon: '🔨', category: 'repair' },
    { id: 5, name: 'Roadside Assistance', icon: '🚗', category: 'emergency' },
    { id: 6, name: 'Towing Service', icon: '🚛', category: 'emergency' },
  ];

  const handleServiceSelect = (service) => {
    navigation.navigate('ServiceRequest', { service });
  };

  const ServiceItem = ({ service }) => (
    <TouchableOpacity 
      style={styles.serviceItem}
      onPress={() => handleServiceSelect(service)}
    >
      <View style={styles.serviceIcon}>
        <Text style={styles.serviceEmoji}>{service.icon}</Text>
      </View>
      <Text style={styles.serviceName}>{service.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <View style={styles.welcomeSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{user?.name || 'Gamage'}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Car Image Section */}
        <View style={styles.carSection}>
          <Image
            source={require('../../../assets/images/car.jpeg')}
            style={styles.carImage}
            resizeMode="contain"
          />
          <View style={styles.carControls}>
            <TouchableOpacity style={styles.carControlButton}>
              <Text style={styles.carControlIcon}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.carControlButton}>
              <Text style={styles.carControlIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Selection */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>What Service would you like?</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceItem key={service.id} service={service} />
            ))}
          </View>
        </View>

        {/* Emergency Button */}
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => navigation.navigate('EmergencyService')}
        >
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.emergencyText}>Emergency Service</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// src/screens/vehicle-owner/ProfileScreen.js
const ProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 1, title: 'PROFILE', icon: '👤', screen: 'EditProfile' },
    { id: 2, title: 'YOUR VEHICLE', icon: '🚗', screen: 'VehicleDetails' },
    { id: 3, title: 'PAYMENT METHODS', icon: '💳', screen: 'PaymentMethods' },
    { id: 4, title: 'SETTINGS', icon: '⚙️', screen: 'Settings' },
  ];

  const handleMenuPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.profileContainer}>
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>👤</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.backText}>back</Text>
          <Text style={styles.userNameText}>{user?.name || 'User'}</Text>

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

          {/* Car Image in Profile */}
          <View style={styles.profileCarSection}>
            <Image
              source={require('../../../assets/images/car-background.png')}
              style={styles.profileCarImage}
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

// src/screens/vehicle-owner/ServiceHistoryScreen.js
const ServiceHistoryScreen = () => {
  const mockHistory = [
    {
      id: 1,
      service: 'Flat Tyre Service',
      provider: 'AutoCare Pro',
      date: '2024-01-15',
      status: 'Completed',
      amount: 'LKR 2,500.00'
    },
    {
      id: 2,
      service: 'Basic Service',
      provider: 'Quick Fix',
      date: '2024-01-10',
      status: 'Completed',
      amount: 'LKR 4,500.00'
    },
  ];

  const HistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyService}>{item.service}</Text>
        <Text style={styles.historyAmount}>{item.amount}</Text>
      </View>
      <Text style={styles.historyProvider}>Provider: {item.provider}</Text>
      <View style={styles.historyFooter}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={[styles.historyStatus, { color: colors.success }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Service History</Text>
      <ScrollView style={styles.historyContainer}>
        {mockHistory.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

// src/screens/vehicle-owner/ServicesScreen.js
const ServicesScreen = ({ navigation }) => {
  const services = [
    { 
      id: 1, 
      name: 'Emergency Services', 
      description: 'Roadside assistance, towing, jump start',
      icon: '🚨',
      color: colors.error 
    },
    { 
      id: 2, 
      name: 'Maintenance', 
      description: 'Regular service, oil change, inspection',
      icon: '⚙️',
      color: colors.primary 
    },
    { 
      id: 3, 
      name: 'Repairs', 
      description: 'Mechanical repairs, parts replacement',
      icon: '🔧',
      color: colors.warning 
    },
  ];

  const ServiceCategory = ({ service }) => (
    <TouchableOpacity 
      style={[styles.serviceCategory, { borderLeftColor: service.color }]}
      onPress={() => navigation.navigate('ServiceRequest', { category: service })}
    >
      <View style={styles.serviceCategoryIcon}>
        <Text style={styles.serviceCategoryEmoji}>{service.icon}</Text>
      </View>
      <View style={styles.serviceCategoryInfo}>
        <Text style={styles.serviceCategoryName}>{service.name}</Text>
        <Text style={styles.serviceCategoryDesc}>{service.description}</Text>
      </View>
      <Text style={styles.serviceCategoryArrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Our Services</Text>
      <ScrollView style={styles.servicesContainer}>
        {services.map((service) => (
          <ServiceCategory key={service.id} service={service} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Home Screen Styles
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  menuButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  menuIcon: {
    color: colors.white,
    fontSize: 24,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
    color: colors.white,
  },
  welcomeText: {
    color: colors.white,
    fontSize: 16,
    opacity: 0.8,
  },
  userName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  carSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    position: 'relative',
  },
  carImage: {
    width: 300,
    height: 150,
  },
  carControls: {
    position: 'absolute',
    bottom: spacing.lg,
    flexDirection: 'row',
    gap: spacing.lg,
  },
  carControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carControlIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  servicesSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceEmoji: {
    fontSize: 24,
  },
  serviceName: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  emergencyButton: {
    margin: spacing.lg,
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  emergencyText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Profile Screen Styles
  profileContainer: {
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
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
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
  userNameText: {
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
  profileCarSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  profileCarImage: {
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

  // History Screen Styles
  screenTitle: {
    ...typography.heading2,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.xxxl,
    marginBottom: spacing.lg,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  historyItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  historyService: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  historyAmount: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyProvider: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDate: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Services Screen Styles
  servicesContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  serviceCategory: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  serviceCategoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  serviceCategoryEmoji: {
    fontSize: 24,
  },
  serviceCategoryInfo: {
    flex: 1,
  },
  serviceCategoryName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  serviceCategoryDesc: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  serviceCategoryArrow: {
    color: colors.white,
    fontSize: 18,
  },
});

export { HomeScreen, ProfileScreen, ServiceHistoryScreen, ServicesScreen };
export default HomeScreen;