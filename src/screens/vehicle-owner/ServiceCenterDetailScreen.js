import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { servicePrice } from '../../services/api/ServicePrice';

const ServiceCenterDetailScreen = ({ navigation, route }) => {
  const { serviceCenter } = route.params || {};
  const [searchText, setSearchText] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceCenter?.id) {
      fetchProviderServices();
    }
  }, [serviceCenter?.id]);

  const fetchProviderServices = async () => {
    setLoading(true);
    try {
      console.log('Fetching services for provider:', serviceCenter.id);
      const servicePrices = await servicePrice.getServicePricesByProvider(serviceCenter.id);
      
      // Transform the API response to match the component's expected format
      const services = servicePrices.map(priceItem => ({
        id: priceItem.service.id,
        name: priceItem.service.name,
        description: priceItem.service.description,
        category: priceItem.service.category?.name?.toLowerCase() || 'general',
        basePrice: priceItem.basePrice,
        brand: priceItem.brand,
        model: priceItem.model,
        priceId: priceItem.id // Keep track of the service price ID
      }));
      
      setAvailableServices(services);
    } catch (error) {
      console.error('Error fetching provider services:', error);
      Alert.alert('Error', 'Failed to load services. Please try again.');
      setAvailableServices([]);
    } finally {
      setLoading(false);
    }
  };

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
      Alert.alert('Selection Required', 'Please select at least one service');
      return;
    }

    navigation.navigate('ServiceBooking', {
      serviceCenter,
      selectedServices: selected
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(price || 0).replace('LKR', 'Rs.');
  };

  const ServiceItem = ({ service }) => {
    const isSelected = selectedServices.includes(service.id);
    
    return (
      <TouchableOpacity
        style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
        onPress={() => toggleServiceSelection(service.id)}
        activeOpacity={0.7}
      >
                  <View style={styles.serviceCardContent}>
          {/* Service Info */}
          <View style={styles.serviceInfo}>
            <View style={styles.serviceHeader}>
              <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>
                {service.name} ({formatPrice(service.basePrice)})
              </Text>
              {isSelected && (
                <View style={styles.checkmarkContainer}>
                  <Icon name="checkmark-circle" size={18} color="#FFFFFF" />
                </View>
              )}
            </View>

            {service.brand && service.model && (
              <View style={styles.vehicleTagContainer}>
                <Icon 
                  name="car-outline" 
                  size={12} 
                  color={isSelected ? "#E8F4FF" : "#8E8E93"} 
                  style={styles.vehicleTagIcon}
                />
                <Text style={[styles.vehicleTag, isSelected && styles.vehicleTagSelected]}>
                  {service.brand.brandName} {service.model.modelName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Selection Border */}
        {isSelected && <View style={styles.selectionBorder} />}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Service Centers</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Loading State */}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Centers</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Service Center Info */}
        <View style={styles.centerInfo}>
          <View style={styles.centerHeader}>
            <View style={styles.centerIconContainer}>
              <Icon name="business" size={14} color="#007AFF" />
            </View>
            <View style={styles.centerDetails}>
              <Text style={styles.centerName}>
                {serviceCenter?.businessName || serviceCenter?.name || 'Service Center'}
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        {availableServices.length > 0 && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
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
                  <Icon name="close-circle" size={20} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Services List */}
        <ScrollView 
          style={styles.servicesList} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.servicesListContent}
        >
          {/* Selected Services Header */}
          {selectedServices.length > 0 && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Selected Services ({selectedServices.length})
              </Text>
            </View>
          )}

          {filteredServices.map((service, index) => (
            <ServiceItem key={`${service.priceId}-${index}`} service={service} />
          ))}
          
          {availableServices.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <MaterialIcon name="miscellaneous-services" size={48} color="#48484A" />
              </View>
              <Text style={styles.emptyStateTitle}>No Services Available</Text>
              <Text style={styles.emptyStateText}>
                This service provider hasn't added any services yet.
              </Text>
            </View>
          )}
          
          {filteredServices.length === 0 && searchText.length > 0 && availableServices.length > 0 && (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Icon name="search" size={48} color="#48484A" />
              </View>
              <Text style={styles.emptyStateTitle}>No Results Found</Text>
              <Text style={styles.emptyStateText}>
                No services found for "{searchText}"
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Schedule Button */}
        {availableServices.length > 0 && (
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
              <Icon 
                name="calendar" 
                size={20} 
                color={selectedServices.length === 0 ? "#8E8E93" : "#FFFFFF"} 
                style={styles.scheduleButtonIcon}
              />
              <Text style={[
                styles.scheduleButtonText,
                selectedServices.length === 0 && styles.scheduleButtonTextDisabled
              ]}>
                {selectedServices.length > 0 
                  ? `Schedule ${selectedServices.length} Service${selectedServices.length === 1 ? '' : 's'}` 
                  : 'Select Services to Schedule'
                }
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  centerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  centerIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  centerDetails: {
    flex: 1,
  },
  centerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  serviceCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
  },
  servicesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  servicesListContent: {
    paddingBottom: 120,
    paddingTop: 8,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serviceCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  serviceCardSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    transform: [{ scale: 0.98 }],
  },
  serviceCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceIconSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  serviceNameSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceDescription: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  serviceFooter: {
    justifyContent: 'space-between',
  },
  priceContainer: {
    marginBottom: 8,
  },
  priceLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  priceLabelSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  servicePrice: {
    color: '#30D158',
    fontSize: 18,
    fontWeight: '700',
  },
  servicePriceSelected: {
    color: '#FFFFFF',
  },
  vehicleTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  vehicleTagIcon: {
    marginRight: 4,
  },
  vehicleTag: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '500',
  },
  vehicleTagSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 16,
  },
  emptyStateContainer: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  emptyStateIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  scheduleButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleButtonDisabled: {
    backgroundColor: '#48484A',
  },
  scheduleButtonIcon: {
    marginRight: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleButtonTextDisabled: {
    color: '#8E8E93',
  },
});

export default ServiceCenterDetailScreen;