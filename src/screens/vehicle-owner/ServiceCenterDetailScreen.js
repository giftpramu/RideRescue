import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors, spacing } from '../../styles';

const ServiceCenterDetailScreen = ({ navigation, route }) => {
  const { serviceCenter } = route.params || {};
  const [searchText, setSearchText] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  // Available services for the service center
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
      >
        <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>
          {service.name}
        </Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Service Centers</Text>
      </View>

      {/* Service Center Info */}
      <View style={styles.centerInfo}>
        <Text style={styles.centerName}>{serviceCenter?.name || 'Sterling AfterCare'}</Text>
        <Text style={styles.subtitle}>Select Preferred Service/s</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Services List */}
      <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
        {filteredServices.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
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
        >
          <Text style={[
            styles.scheduleButtonText,
            selectedServices.length === 0 && styles.scheduleButtonTextDisabled
          ]}>
            Schedule {selectedServices.length > 0 && '(${selectedServices.length})'}
          </Text>
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
  centerInfo: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  centerName: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.white,
    fontSize: 16,
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
    color: colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.background,
    paddingVertical: spacing.xs,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textSecondary,
    padding: spacing.xs,
  },
  servicesList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  serviceItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  serviceName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  serviceNameSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.background,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  scheduleButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  scheduleButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleButtonTextDisabled: {
    color: colors.textSecondary,
  },
});

export default ServiceCenterDetailScreen;