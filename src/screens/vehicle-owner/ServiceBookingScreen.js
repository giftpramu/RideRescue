import React, { useState } from 'react';
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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';

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

  // Sample date options - removed
  // Sample time slots - removed

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

  const handleBookService = () => {
    // Validate required fields
    if (currentServices.length === 0) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    const bookingDetails = {
      ...bookingData,
      serviceCenter: serviceCenter,
      selectedServices: currentServices,
      date: selectedDate,
      time: formatTime(selectedTime),
      bookingId: `BK${Date.now()}`,
      status: 'pending'
    };

    Alert.alert(
      'Booking Confirmed',
      `Your service request has been sent to ${serviceCenter?.businessName || serviceCenter?.name}. You will be notified once they accept your request.`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
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
            <Text style={styles.backIcon}>‹</Text>
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
              Give us the details regarding your service
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
            style={styles.continueButton} 
            onPress={handleBookService}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
    marginBottom: 32,
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
  dateScrollView: {
    marginTop: 4,
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
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceBookingScreen;