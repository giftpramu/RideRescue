import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing } from '../../styles';

const ServiceRequestDetailScreen = ({ navigation, route }) => {
  const { serviceRequest } = route.params || {
    serviceRequest: {
      id: 1,
      carOwner: 'Pramudi Gamage',
      serviceType: 'Flat Tyre',
      vehicleType: 'Toyota - Corolla E210',
      address: '27/12, 1 st lane , Galle Road , Dehiwala',
      date: '21.01.2025',
      timeSlot: '9:00 - 9:30 am',
      requestedBy: 'Gamage'
    }
  };

  const handleAccept = () => {
    Alert.alert(
      'Accept Service Request',
      'Are you sure you want to accept this service request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => {
            // Navigate to bill details screen
            navigation.navigate('ServiceBillDetails', { serviceRequest });
          }
        },
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline Service Request',
      'Are you sure you want to decline this service request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          style: 'destructive',
          onPress: () => {
            // Handle decline logic here
            navigation.goBack();
          }
        },
      ]
    );
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <TextInput
        style={[styles.detailInput, label === 'Pick-up Address' && styles.addressInput]}
        value={value}
        editable={false}
        multiline={label === 'Pick-up Address'}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flat Tyre Service Request</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Details Form */}
        <View style={styles.form}>
          <DetailRow label="Car Owner" value={serviceRequest.carOwner} />
          <DetailRow label="Service Type" value={serviceRequest.serviceType} />
          <DetailRow label="Vehicle Type" value={serviceRequest.vehicleType} />
          <DetailRow label="Pick-up Address" value={serviceRequest.address} />
          <DetailRow label="Date" value={serviceRequest.date} />
          <DetailRow label="Time Slot" value={serviceRequest.timeSlot} />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  backIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  form: {
    paddingTop: spacing.lg,
  },
  detailRow: {
    marginBottom: spacing.lg,
  },
  detailLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  detailInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    color: colors.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  addressInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  declineButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  declineButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceRequestDetailScreen;