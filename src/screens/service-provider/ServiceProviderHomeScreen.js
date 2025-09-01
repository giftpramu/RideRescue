import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { serviceRequestService } from '../../services/api/ServiceRequestService';
import { colors, spacing } from '../../styles';

const ServiceProviderHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    initializeProvider();
  }, []);

  useEffect(() => {
    if (providerId) {
      loadServiceRequests();
    }
  }, [providerId]);

  const initializeProvider = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const userIdFromStorage = parsedUserData.id || parsedUserData._id || parsedUserData.userId;
        setProviderId(userIdFromStorage);
      }
    } catch (error) {
      console.error('Error getting provider data:', error);
      Alert.alert('Error', 'Failed to load provider information');
    }
  };

  const loadServiceRequests = async () => {
    setLoading(true);
    try {
      // Fetch requests by different statuses
      const [pending, accepted, rejected] = await Promise.all([
        serviceRequestService.getServiceRequestsByServiceProviderAndStatus(providerId, 'PENDING'),
        serviceRequestService.getServiceRequestsByServiceProviderAndStatus(providerId, 'ACCEPTED'),
        serviceRequestService.getServiceRequestsByServiceProviderAndStatus(providerId, 'REJECTED'),
      ]);

      setPendingRequests(pending);
      setAcceptedRequests(accepted);
      setRejectedRequests(rejected);
    } catch (error) {
      console.error('Error loading service requests:', error);
      Alert.alert('Error', 'Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServiceRequests();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return colors.warning;
      case 'ACCEPTED':
        return colors.success;
      case 'IN_PROGRESS':
        return colors.primary;
      case 'COMPLETED':
        return colors.success;
      case 'REJECTED':
        return colors.error;
      case 'CANCELLED':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return 'schedule';
      case 'ACCEPTED':
        return 'check-circle';
      case 'IN_PROGRESS':
        return 'build';
      case 'COMPLETED':
        return 'done-all';
      case 'REJECTED':
        return 'cancel';
      case 'CANCELLED':
        return 'close';
      default:
        return 'help';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const ServiceRequestItem = ({ item, status }) => (
    <TouchableOpacity 
      style={styles.serviceRequestItem}
      onPress={() => navigation.navigate('ServiceRequestPreview', { 
        serviceRequest: item,
        providerId: providerId 
      })}
    >
      <View style={styles.serviceRequestLeft}>
        <View style={[styles.serviceIcon, { backgroundColor: getStatusColor(status) }]}>
          <Icon name={getStatusIcon(status)} size={20} color={colors.white} />
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceType}>
            Service Request
          </Text>
          <Text style={styles.serviceRequestedBy}>
            Request from {item.vehicleOwnerName || 'Customer'}
          </Text>
          <Text style={styles.serviceDetails}>
            {item.vehicleBrandName} {item.vehicleModelName} • {item.vehicleLicensePlate}
          </Text>
          <Text style={styles.serviceDate}>
            {formatDate(item.scheduledDate)} at {formatTime(item.scheduledTime)}
          </Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        {status !== 'PENDING' && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.navigate('ServiceRequestPreview', { 
            serviceRequest: item,
            providerId: providerId 
          })}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EmptySection = ({ title, message }) => (
    <View style={styles.emptySection}>
      <Icon name="inbox" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading service requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Icon name="person" size={24} color={colors.white} />
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{user?.name || user?.businessName || 'Service Provider'}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Pending Service Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{pendingRequests.length}</Text>
            </View>
          </View>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((item) => (
              <ServiceRequestItem key={item.id} item={item} status="PENDING" />
            ))
          ) : (
            <EmptySection 
              title="No Pending Requests" 
              message="You have no pending service requests at the moment."
            />
          )}
        </View>

        {/* Accepted Service Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Accepted Requests</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{acceptedRequests.length}</Text>
            </View>
          </View>
          {acceptedRequests.length > 0 ? (
            acceptedRequests.map((item) => (
              <ServiceRequestItem key={item.id} item={item} status="ACCEPTED" />
            ))
          ) : (
            <EmptySection 
              title="No Accepted Requests" 
              message="You have no accepted service requests."
            />
          )}
        </View>

        {/* Rejected Service Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rejected Requests</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{rejectedRequests.length}</Text>
            </View>
          </View>
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map((item) => (
              <ServiceRequestItem key={item.id} item={item} status="REJECTED" />
            ))
          ) : (
            <EmptySection 
              title="No Rejected Requests" 
              message="You have no rejected service requests."
            />
          )}
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
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  serviceEmoji: {
    fontSize: 20,
  },
  serviceInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  serviceType: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  serviceRequestedBy: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  serviceDetails: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  serviceDate: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  viewButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: spacing.md,
  },
});

export default ServiceProviderHomeScreen;