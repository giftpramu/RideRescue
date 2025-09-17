import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../styles';

const ProfileScreen = ({ navigation }) => {
  console.log('👤 ProfileScreen COMPONENT RENDERED');
  const { user, signOut } = useAuth();

  const profileOptions = [
    {
      id: 1,
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => {
        navigation.navigate('EditProfile');
      },
    },
    {
      id: 2,
      title: 'Vehicle Details',
      icon: 'car-outline',
      onPress: () => {
        navigation.navigate('VehicleDetails');
      },
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="person" size={40} color={colors.white} />
            </View>
            <View style={styles.editIconContainer}>
              <Icon name="pencil" size={16} color={colors.white} />
            </View>
          </View>
          
          <Text style={styles.userName}>
            {user?.name || 'Pramudi Gamage'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'gamage434@gmail.com'}
          </Text>
        </View>

        {/* Profile Options Card */}
        <View style={styles.optionsCard}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index === profileOptions.length - 1 && styles.lastOptionItem
              ]}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconContainer}>
                  <Icon name={option.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
          
          {/* Logout Option */}
          <TouchableOpacity
            style={styles.logoutItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.logoutIconContainer}>
                <Icon name="log-out-outline" size={20} color={colors.error} />
              </View>
              <Text style={styles.logoutTitle}>Log out</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  lastOptionItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
  },
});

export default ProfileScreen;