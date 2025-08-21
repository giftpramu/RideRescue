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

const ServiceBillDetailsScreen = ({ navigation, route }) => {
  const { serviceRequest } = route.params || {};
  
  const [billData, setBillData] = useState({
    carOwner: serviceRequest?.carOwner || 'Pramudi Gamage',
    serviceType: serviceRequest?.serviceType || 'Flat Tyre Service',
    vehicleType: serviceRequest?.vehicleType || 'Toyota - Corolla E210',
    pickupAddress: serviceRequest?.address || '27/12, 1 st lane , Galle Road , Mount Lavinia',
    date: serviceRequest?.date || '21.01.2025',
    timeSlot: serviceRequest?.timeSlot || '9:00 - 9:30 am',
    cost: '2,500.00',
  });

  const handleInputChange = (field, value) => {
    setBillData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreview = () => {
    // Validate required fields
    if (!billData.cost) {
      Alert.alert('Error', 'Please enter the service cost');
      return;
    }

    const previewData = {
      refNumber: '000085752257',
      carOwner: billData.carOwner,
      service: billData.serviceType,
      address: billData.pickupAddress,
      dateTime: '${billData.date}, ${billData.timeSlot.split(' - ')[0]}',
      senderName: 'Sterling AfterCare',
      amount: 'LKR ${billData.cost}'
    };

    navigation.navigate('ServiceBillPreview', { billData: previewData });
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
        <Text style={styles.headerTitle}>Bill Details for the Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Car Owner */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Car Owner</Text>
          <TextInput
            style={styles.input}
            value={billData.carOwner}
            onChangeText={(value) => handleInputChange('carOwner', value)}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Service Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Type</Text>
          <TextInput
            style={styles.input}
            value={billData.serviceType}
            onChangeText={(value) => handleInputChange('serviceType', value)}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Pick-up Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pick-up Address</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            value={billData.pickupAddress}
            onChangeText={(value) => handleInputChange('pickupAddress', value)}
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={billData.date}
            onChangeText={(value) => handleInputChange('date', value)}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Time Slot */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time Slot</Text>
          <TextInput
            style={styles.input}
            value={billData.timeSlot}
            onChangeText={(value) => handleInputChange('timeSlot', value)}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Cost for the Service */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cost for the Service</Text>
          <TextInput
            style={styles.input}
            value={billData.cost}
            onChangeText={(value) => handleInputChange('cost', value)}
            placeholder="Enter amount"
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
          />
        </View>
      </ScrollView>

      {/* Preview Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
          <Text style={styles.previewButtonText}>Preview</Text>
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
  form: {
    flex: 1,
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
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  previewButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  previewButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceBillDetailsScreen;