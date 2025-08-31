import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { vehicle } from '../../services/api/vehicle';
import { serviceRequestService } from '../../services/api/ServiceRequestService';

const ServiceBookingScreen = ({ navigation, route }) => {
  const { serviceCenter, selectedServices } = route.params || {};
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState({
    specialInstructions: '',
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentServices, setCurrentServices] = useState(selectedServices || []);
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserVehicles();
    }
  }, [userId]);

  const initializeUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const userIdFromStorage = parsedUserData.id || parsedUserData._id || parsedUserData.userId;
        setUserId(userIdFromStorage);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  };

  const fetchUserVehicles = async () => {
    setLoadingVehicles(true);
    try {
      // Assuming you have an endpoint to get vehicles by user ID
      const vehicles = await vehicle.getVehiclesByOwnerId(userId);
      setUserVehicles(vehicles);
      
      // Auto-select first vehicle if only one exists
      if (vehicles.length === 1) {
        setSelectedVehicle(vehicles[0]);
      }
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
      Alert.alert('Error', 'Failed to load your vehicles');
      setUserVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

    const VehicleInfoCard = ({ vehicle }) => (
    <View style={styles.vehicleInfoCard}>
      <View style={styles.vehicleIconContainer}>
        <Icon name="directions-car" size={24} color="#007AFF" />
      </View>
      <View style={styles.vehicleCardContent}>
        <Text style={styles.vehicleTitle}>
          {vehicle.brandName} {vehicle.modelName}
        </Text>
        <Text style={styles.vehicleLicense}>
          {vehicle.licensePlate || 'No license plate'}
        </Text>
      </View>
    </View>
  );

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const removeService = (serviceId) => {
    setCurrentServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Select a date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const onDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const onTimeChange = (event, time) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBookService = async () => {
    // Validate required fields
    if (currentServices.length === 0) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    if (userVehicles.length === 0) {
      Alert.alert('Error', 'Please add a vehicle first');
      return;
    }

    setSubmittingRequest(true);

    try {
      // Prepare the service request data for the backend
      const serviceRequestData = {
        vehicleOwnerId: userId,
        serviceProviderId: serviceCenter.id,
        vehicleId: userVehicles[0].id,
        serviceIds: currentServices.map(service => service.id),
        scheduledDate: selectedDate,
        scheduledTime: selectedTime.toTimeString().split(' ')[0], // Format as HH:mm:ss
        specialInstructions: bookingData.specialInstructions || '',
        bookingId: `BK${Date.now()}`,
      };

      console.log('📤 Submitting service request:', serviceRequestData);

      // Create the service request via API
      const createdRequest = await serviceRequestService.createServiceRequest(serviceRequestData);

      navigation.navigate('ServiceRequestSuccess', {
        serviceCenter: serviceCenter,
        requestId: createdRequest.id
      });

    } catch (error) {
      console.error('❌ Error creating service request:', error);
      Alert.alert(
        'Booking Failed', 
        error.message || 'Failed to submit your service request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2C2C2E" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Service Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              Give us the details regarding your service request
            </Text>
          </View>

          {/* Selected Services Preview */}
          <View style={styles.selectedServicesPreview}>
            <Text style={styles.sectionTitle}>Selected Services ({currentServices?.length || 0})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScrollView}>
              {currentServices?.map((service, index) => (
                <View key={service.id} style={styles.selectedServiceChip}>
                  <Text style={styles.selectedServiceText}>{service.name}</Text>
                  <TouchableOpacity 
                    onPress={() => removeService(service.id)}
                    style={styles.removeServiceButton}
                  >
                    <Icon name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Vehicle Information */}
          <View style={styles.vehicleSection}>
            <Text style={styles.sectionTitle}>Your Vehicle</Text>
            {loadingVehicles ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Loading your vehicle...</Text>
              </View>
            ) : userVehicles.length > 0 ? (
              <VehicleInfoCard vehicle={userVehicles[0]} />
            ) : (
              <View style={styles.noVehicleContainer}>
                <View style={styles.noVehicleIcon}>
                  <Icon name="directions-car" size={32} color="#8E8E93" />
                </View>
                <Text style={styles.noVehicleText}>No vehicle found in your account</Text>
                <Text style={styles.noVehicleSubtext}>Add a vehicle to book services</Text>
                <TouchableOpacity
                  style={styles.addVehicleButton}
                  onPress={() => navigation.navigate('AddVehicle')}
                >
                  <Icon name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.addVehicleButtonText}>Add Vehicle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Booking Form */}
          <View style={styles.form}>
            {/* Date Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowCalendar(!showCalendar)}
                activeOpacity={0.7}
              >
                <View style={styles.datePickerContent}>
                  <Icon name="calendar-today" size={20} color="#007AFF" />
                  <Text style={styles.datePickerText}>
                    {formatDate(selectedDate)}
                  </Text>
                  <Icon name={showCalendar ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#8E8E93" />
                </View>
              </TouchableOpacity>
              
              {showCalendar && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={onDateSelect}
                    markedDates={{
                      [selectedDate]: {
                        selected: true,
                        selectedColor: '#007AFF'
                      }
                    }}
                    theme={{
                      backgroundColor: '#48484A',
                      calendarBackground: '#48484A',
                      textSectionTitleColor: '#FFFFFF',
                      dayTextColor: '#FFFFFF',
                      todayTextColor: '#007AFF',
                      selectedDayTextColor: '#FFFFFF',
                      monthTextColor: '#FFFFFF',
                      arrowColor: '#007AFF',
                      textDisabledColor: '#8E8E93',
                      textDayFontWeight: '500',
                      textMonthFontWeight: '600',
                      textDayHeaderFontWeight: '500',
                    }}
                    minDate={new Date().toISOString().split('T')[0]}
                    style={styles.calendar}
                  />
                </View>
              )}
            </View>

            {/* Time Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Preferred Time</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles.timePickerContent}>
                  <Icon name="access-time" size={20} color="#007AFF" />
                  <Text style={styles.timePickerText}>
                    {formatTime(selectedTime)}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={20} color="#8E8E93" />
                </View>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                  style={styles.timePicker}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Special Instructions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bookingData.specialInstructions}
                onChangeText={(value) => handleInputChange('specialInstructions', value)}
                placeholder="Any special instructions for the service provider..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              (!selectedVehicle || currentServices.length === 0 || !selectedDate) && styles.continueButtonDisabled
            ]} 
            onPress={handleBookService}
            disabled={!selectedVehicle || currentServices.length === 0 || !selectedDate}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              (!selectedVehicle || currentServices.length === 0 || !selectedDate) && styles.continueButtonTextDisabled
            ]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#007AFF',
    fontSize: 28,
    fontWeight: '300',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  descriptionText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  selectedServicesPreview: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  servicesScrollView: {
    marginTop: 4,
  },
  selectedServiceChip: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedServiceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  removeServiceButton: {
    padding: 2,
  },
  
  // Vehicle Selection Styles
  vehicleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  vehiclesScrollView: {
    marginTop: 4,
  },
  vehicleInfoCard: {
    backgroundColor: '#48484A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  vehicleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleCardContent: {
    flex: 1,
  },
  vehicleTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleLicense: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  vehicleYear: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '400',
  },
  vehicleStatusIndicator: {
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 14,
    marginLeft: 8,
  },
  noVehicleContainer: {
    backgroundColor: '#48484A',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(142, 142, 147, 0.3)',
    borderStyle: 'dashed',
  },
  noVehicleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(142, 142, 147, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  noVehicleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  noVehicleSubtext: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  addVehicleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addVehicleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#48484A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    backgroundColor: '#48484A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
  calendarContainer: {
    backgroundColor: '#48484A',
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
  },
  calendar: {
    borderRadius: 12,
  },
  timePickerButton: {
    backgroundColor: '#48484A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
  timePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
  timePicker: {
    backgroundColor: '#48484A',
    marginTop: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    backgroundColor: '#2C2C2E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#48484A',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#8E8E93',
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingButtonText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ServiceBookingScreen;