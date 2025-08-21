import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../styles';

const ServiceProviderHomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  const newServiceRequests = [
    {
      id: 1,
      serviceType: 'Flat Tire Service',
      requestedBy: 'Gamage',
      status: 'pending',
      carOwner: 'Pramudi Gamage',
      vehicleType: 'Toyota - Corolla E210',
      address: '27/12, 1 st lane , Galle Road , Dehiwala',
      date: '21.01.2025',
      timeSlot: '9:00 - 9:30 am',
    },
    {
      id: 2,
      serviceType: 'Car Full Service',
      requestedBy: 'Kumara',
      status: 'pending',
      carOwner: 'Kumara Silva',
      vehicleType: 'Honda - Civic',
      address: '15, Kandy Road, Colombo 07',
      date: '22.01.2025',
      timeSlot: '10:00 - 11:00 am',
    },
    {
      id: 3,
      serviceType: 'Towing Service',
      requestedBy: 'John',
      status: 'pending',
      carOwner: 'John Fernando',
      vehicleType: 'Nissan - March',
      address: '45, Galle Face, Colombo 03',
      date: '23.01.2025',
      timeSlot: '2:00 - 3:00 pm',
    },
    {
      id: 4,
      serviceType: 'Towing Service',
      requestedBy: 'John',
      status: 'pending',
      carOwner: 'John Fernando',
      vehicleType: 'Nissan - March',
      address: '45, Galle Face, Colombo 03',
      date: '23.01.2025',
      timeSlot: '2:00 - 3:00 pm',
    },
  ];

  const oldServiceRequests = [
    {
      id: 5,
      serviceType: 'Towing Service',
      requestedBy: 'John',
      status: 'completed',
      carOwner: 'John Fernando',
      vehicleType: 'Nissan - March',
      address: '45, Galle Face, Colombo 03',
      date: '20.01.2025',
      timeSlot: '2:00 - 3:00 pm',
    },
    {
      id: 6,
      serviceType: 'Towing Service',
      requestedBy: 'John',
      status: 'completed',
      carOwner: 'John Fernando',
      vehicleType: 'Nissan - March',
      address: '45, Galle Face, Colombo 03',
      date: '19.01.2025',
      timeSlot: '2:00 - 3:00 pm',
    },
  ];

  const ServiceRequestItem = ({ item, isOld = false }) => (
    <TouchableOpacity 
      style={styles.serviceRequestItem}
      onPress={() => navigation.navigate('ServiceRequestDetail', { serviceRequest: item })}
    >
      <View style={styles.serviceRequestLeft}>
        <View style={styles.serviceIcon}>
          <Text style={styles.serviceEmoji}>🚗</Text>
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceType}>{item.serviceType}</Text>
          <Text style={styles.serviceRequestedBy}>
            The service request from {item.requestedBy}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{user?.name || 'Sterling Aftercare Centre'}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* New Service Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Service Requests</Text>
          {newServiceRequests.map((item) => (
            <ServiceRequestItem key={item.id} item={item} />
          ))}
        </View>

        {/* Old Service Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Old Service Requests</Text>
          {oldServiceRequests.map((item) => (
            <ServiceRequestItem key={item.id} item={item} isOld={true} />
          ))}
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
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
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
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  serviceRequestItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceRequestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  serviceEmoji: {
    fontSize: 20,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceType: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  serviceRequestedBy: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  viewButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ServiceProviderHomeScreen;