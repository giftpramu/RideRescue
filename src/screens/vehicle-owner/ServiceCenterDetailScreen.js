import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const ServiceCenterDetailScreen = ({ navigation, route }) => {
  const { serviceCenter } = route.params || {};
  const [searchText, setSearchText] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  // Available services for the service center - this would come from API
  const availableServices = [
    { id: 1, name: 'Mobile Car Wash', category: 'cleaning' },
    { id: 2, name: 'Jump-Starting A Dead Battery', category: 'electrical' },
    { id: 3, name: 'Flat Tyre', category: 'mechanical' },
    { id: 4, name: 'Mechanical Repairs', category: 'mechanical' },
    { id: 5, name: 'Flat Battery', category: 'electrical' },
    { id: 6, name: 'AC Gas Refill', category: 'electrical' },
    { id: 7, name: 'Engine Oil Change', category: 'maintenance' },
  ];

  const filteredServices = availableServices.filter(service =>
    service.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleServiceSelection = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSchedule = () => {
    const selected = availableServices.filter(service => 
      selectedServices.includes(service.id)
    );
    
    if (selected.length === 0) {
      alert('Please select at least one service');
      return;
    }

    navigation.navigate('ServiceBooking', {
      serviceCenter,
      selectedServices: selected
    });
  };

  const ServiceItem = ({ service }) => {
    const isSelected = selectedServices.includes(service.id);
    
    return (
      <TouchableOpacity
        style={[styles.serviceItem, isSelected && styles.serviceItemSelected]}
        onPress={() => toggleServiceSelection(service.id)}
        activeOpacity={0.7}
      >
        <View style={styles.serviceContent}>
          <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>
            {service.name}
          </Text>
          {isSelected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Service Centers</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Service Center Info */}
        <View style={styles.centerInfo}>
          <Text style={styles.centerName}>
            {serviceCenter?.businessName || serviceCenter?.name || 'Sterling AfterCare'}
          </Text>
          <Text style={styles.subtitle}>Select Preferred Service/s</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor="#8E8E93"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchText('')}
                style={styles.clearButton}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Services List */}
        <ScrollView 
          style={styles.servicesList} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.servicesListContent}
        >
          {filteredServices.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
          {filteredServices.length === 0 && searchText.length > 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No services found for "{searchText}"</Text>
            </View>
          )}
        </ScrollView>

        {/* Schedule Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.scheduleButton,
              selectedServices.length === 0 && styles.scheduleButtonDisabled
            ]} 
            onPress={handleSchedule}
            disabled={selectedServices.length === 0}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.scheduleButtonText,
              selectedServices.length === 0 && styles.scheduleButtonTextDisabled
            ]}>
              {selectedServices.length > 0 
                ? `Schedule (${selectedServices.length})` 
                : 'Schedule'
              }
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
  centerInfo: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  centerName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '400',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  servicesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  servicesListContent: {
    paddingBottom: 100,
  },
  serviceItem: {
    backgroundColor: '#48484A',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  serviceItemSelected: {
    backgroundColor: '#007AFF',
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  serviceNameSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '700',
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
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
  scheduleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  scheduleButtonDisabled: {
    backgroundColor: '#48484A',
  },
  scheduleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleButtonTextDisabled: {
    color: '#8E8E93',
  },
});

export default ServiceCenterDetailScreen;