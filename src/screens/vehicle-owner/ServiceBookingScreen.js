import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, spacing } from '../../styles';
import { useAuth } from '../../context/AuthContext';

const ServiceBookingScreen = ({ navigation, route }) => {
  const { serviceCenter, selectedServices } = route.params || {};
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState({
    carOwner: user?.name || 'Pramudi Gamage',
    vehicleType: 'Toyota - Corolla E210',
    pickupAddress: user?.address || '27/12, 1 st lane, Galle Road, Dehiwala',
    date: '21.01.2025',
    timeSlot: '9:00 - 9:30 am',
    phoneNumber: user?.phone || '077 256 2589',
    specialInstructions: '',
  });

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookService = () => {
    // Validate required fields
    if (!bookingData.carOwner || !bookingData.vehicleType || !bookingData.pickupAddress) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const bookingDetails = {
      ...bookingData,
      serviceCenter: serviceCenter,
      selectedServices: selectedServices,
      bookingId: 'BK${Date.now()}',
      status: 'pending'
    };

    Alert.alert(
      'Booking Confirmed',
      'Your service request has been sent to ${serviceCenter?.name}. You will be notified once they accept your request.',
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
  };

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
        <Text style={styles.headerTitle}>Book Service</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Center Info */}
        <View style={styles.serviceCenterInfo}>
          <Text style={styles.serviceCenterName}>
            {serviceCenter?.name || 'Sterling AfterCare'}
          </Text>
          <Text style={styles.serviceCenterAddress}>
            {serviceCenter?.address || 'Campbell Pl, Colombo 00600'}
          </Text>
        </View>

        {/* Selected Services */}
        <View style={styles.selectedServicesSection}>
          <Text style={styles.sectionTitle}>Selected Services</Text>
          {selectedServices?.map((service, index) => (
            <View key={service.id} style={styles.selectedServiceItem}>
              <Text style={styles.selectedServiceText}>{service.name}</Text>
            </View>
          ))}
        </View>

        {/* Booking Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Car Owner *</Text>
            <TextInput
              style={styles.input}
              value={bookingData.carOwner}
              onChangeText={(value) => handleInputChange('carOwner', value)}
              placeholder="Enter car owner name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type *</Text>
            <TextInput
              style={styles.input}
              value={bookingData.vehicleType}
              onChangeText={(value) => handleInputChange('vehicleType', value)}
              placeholder="Enter vehicle type"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pickup Address *</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={bookingData.pickupAddress}
              onChangeText={(value) => handleInputChange('pickupAddress', value)}
              placeholder="Enter pickup address"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={bookingData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Date *</Text>
            <TouchableOpacity style={styles.datePickerButton}>
              <TextInput
                style={styles.input}
                value={bookingData.date}
                onChangeText={(value) => handleInputChange('date', value)}
                placeholder="Select date"
                placeholderTextColor={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Time Slot *</Text>
            <TouchableOpacity style={styles.timePickerButton}>
              <TextInput
                style={styles.input}
                value={bookingData.timeSlot}
                onChangeText={(value) => handleInputChange('timeSlot', value)}
                placeholder="Select time slot"
                placeholderTextColor={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bookingData.specialInstructions}
              onChangeText={(value) => handleInputChange('specialInstructions', value)}
              placeholder="Any special instructions for the service provider..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Booking Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service Center:</Text>
            <Text style={styles.summaryValue}>{serviceCenter?.name || 'Sterling AfterCare'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Services Count:</Text>
            <Text style={styles.summaryValue}>{selectedServices?.length || 0} service(s)</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date & Time:</Text>
            <Text style={styles.summaryValue}>{bookingData.date}, {bookingData.timeSlot}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Service Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookService}>
          <Text style={styles.bookButtonText}>Book Service</Text>
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
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  backIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  serviceCenterInfo: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  serviceCenterName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  serviceCenterAddress: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  selectedServicesSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  selectedServiceItem: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  selectedServiceText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  input: {
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    position: 'relative',
  },
  timePickerButton: {
    position: 'relative',
  },
  summarySection: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: colors.background,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceBookingScreen;