import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../styles';

const CustomDrawerContent = ({ navigation }) => {
  const { user, signOut } = useAuth();

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.drawerContainer}>
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.closeDrawer()}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.drawerProfileSection}>
          <View style={styles.drawerAvatar}>
            <Text style={styles.drawerAvatarText}>👤</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.drawerMenuSection}>
          <Text style={styles.drawerBackText}>back</Text>
          <Text style={styles.drawerUserName}>{user?.name || 'Gamage'}</Text>

          <TouchableOpacity
            style={styles.drawerMenuItem}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Profile');
            }}
          >
            <View style={styles.drawerMenuItemLeft}>
              <Text style={styles.drawerMenuIcon}>👤</Text>
              <Text style={styles.drawerMenuTitle}>PROFILE</Text>
            </View>
            <Text style={styles.drawerMenuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerMenuItem}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('VehicleDetails');
            }}
          >
            <View style={styles.drawerMenuItemLeft}>
              <Text style={styles.drawerMenuIcon}>🚗</Text>
              <Text style={styles.drawerMenuTitle}>YOUR VEHICLE</Text>
            </View>
            <Text style={styles.drawerMenuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerMenuItem}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('PaymentMethods');
            }}
          >
            <View style={styles.drawerMenuItemLeft}>
              <Text style={styles.drawerMenuIcon}>💳</Text>
              <Text style={styles.drawerMenuTitle}>PAYMENT METHODS</Text>
            </View>
            <Text style={styles.drawerMenuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerMenuItem}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Settings');
            }}
          >
            <View style={styles.drawerMenuItemLeft}>
              <Text style={styles.drawerMenuIcon}>⚙️</Text>
              <Text style={styles.drawerMenuTitle}>SETTINGS</Text>
            </View>
            <Text style={styles.drawerMenuArrow}>→</Text>
          </TouchableOpacity>

          {/* Car Image in Drawer */}
          <View style={styles.drawerCarSection}>
            <Image
              source={require('../../../assets/images/car-background.png')}
              style={styles.drawerCarImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.drawerLogoutButton} onPress={signOut}>
          <Text style={styles.drawerLogoutIcon}>🚪</Text>
          <Text style={styles.drawerLogoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
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
  drawerContainer: {
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
  drawerProfileSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  drawerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerAvatarText: {
    fontSize: 40,
    color: colors.white,
  },
  drawerMenuSection: {
    flex: 1,
  },
  drawerBackText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  drawerUserName: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.xl,
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  drawerMenuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerMenuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 30,
  },
  drawerMenuTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
  drawerMenuArrow: {
    color: colors.white,
    fontSize: 16,
  },
  drawerCarSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  drawerCarImage: {
    width: 200,
    height: 120,
  },
  drawerLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  drawerLogoutIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  drawerLogoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
});

export default CustomDrawerContent;