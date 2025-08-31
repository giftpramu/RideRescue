import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing } from '../../styles';
import { vehicleService } from '../../services/api/VehicleService';
import { servicePrice } from '../../services/api/ServicePrice';
import { brandService } from '../../services/api/brandService';
import { modelService } from '../../services/api/modelService';
import CustomDropdown from '../../components/common/CustomDropdown';

const ServiceInsertionScreen = ({ navigation, route }) => {
  const [services, setServices] = useState([]);
  const [providerServices, setProviderServices] = useState([]); // Services added by this provider
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    brandId: null,
    modelId: null,
    basePrice: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    initializeProvider();
  }, []);

  useEffect(() => {
    if (providerId) {
      loadData();
      loadBrands();
    }
  }, [providerId]);

  const initializeProvider = async () => {
    try {
      // Get stored user data which should contain the actual user ID
      const userData = await AsyncStorage.getItem('userData');
      console.log("userDta",userData);
      
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        // Get the actual user ID from stored user data
        const userId = parsedUserData.id || parsedUserData._id || parsedUserData.userId;
        console.log("userId",userId);
        
        if (userId) {
          setProviderId(userId);
        } else {
          Alert.alert('Error', 'User ID not found in stored data. Please login again.');
          navigation.goBack();
        }
      } else {
        Alert.alert('Error', 'No user data found. Please login again.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error getting provider ID from user data:', error);
      Alert.alert('Error', 'Failed to get user information. Please login again.');
      navigation.goBack();
    }
  };

  // Load models when brand is selected
  useEffect(() => {
    if (formData.brandId) {
      loadModelsByBrand(formData.brandId);
    } else {
      setModels([]);
      // Clear model selection when brand is cleared
      if (formData.modelId) {
        setFormData(prev => ({ ...prev, modelId: null }));
      }
    }
  }, [formData.brandId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all available services
      const servicesData = await vehicleService.getAllVehicleServices();
      setServices(servicesData);

      // Load services that this provider has already added prices for
      const providerPricesData = await servicePrice.getServicePricesByProvider(providerId);
      setProviderServices(providerPricesData.map(price => price.service.id));
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    setLoadingBrands(true);
    try {
      const brandsData = await brandService.getAllBrands();
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading brands:', error);
      Alert.alert('Error', 'Failed to load brands: ' + error.message);
    } finally {
      setLoadingBrands(false);
    }
  };

  const loadModelsByBrand = async (brandId) => {
    setLoadingModels(true);
    try {
      const modelsData = await modelService.getModelsByBrandId(brandId);
      setModels(modelsData);
    } catch (error) {
      console.error('Error loading models:', error);
      Alert.alert('Error', 'Failed to load models: ' + error.message);
      setModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleBrandSelect = (brandId, brandItem) => {
    setFormData(prev => ({ 
      ...prev, 
      brandId,
      modelId: null // Clear model when brand changes
    }));
  };

  const handleModelSelect = (modelId, modelItem) => {
    setFormData(prev => ({ ...prev, modelId }));
  };

  const handleAddPrice = (service) => {
    setSelectedService(service);
    setFormData({
      brandId: null,
      modelId: null,
      basePrice: '',
      description: '',
    });
    setModalVisible(true);
  };

  const handleSavePrice = async () => {
    if (!formData.basePrice) {
      Alert.alert('Error', 'Please enter a base price');
      return;
    }

    if (isNaN(formData.basePrice) || parseFloat(formData.basePrice) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setSubmitting(true);
    try {
      const servicePriceData = {
        service: { id: selectedService.id },
        provider: { id: providerId },
        basePrice: parseFloat(formData.basePrice),
        description: formData.description,
      };

      if (formData.brandId) {
        servicePriceData.brand = { id: formData.brandId };
      }
      if (formData.modelId) {
        servicePriceData.model = { id: formData.modelId };
      }

      await servicePrice.createServicePrice(servicePriceData);
      
      // Add this service to provider services list
      setProviderServices(prev => [...prev, selectedService.id]);
      
      setModalVisible(false);
      Alert.alert('Success', 'Service price added successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to add service price');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedService(null);
    setFormData({
      brandId: null,
      modelId: null,
      basePrice: '',
      description: '',
    });
  };

  const renderServiceItem = ({ item }) => {
    const isAdded = providerServices.includes(item.id);
    
    return (
      <View style={[
        styles.serviceCard,
        isAdded && styles.addedServiceCard
      ]}>
        <View style={styles.serviceContent}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceCategory}>Category: {item.category?.name}</Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              isAdded ? styles.addedButton : styles.addButton
            ]} 
            onPress={() => handleAddPrice(item)}
            disabled={isAdded}
          >
            <Icon 
              name={isAdded ? 'check' : 'add'} 
              size={16} 
              color={colors.white} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredServices = services.filter((service) =>
    service.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading && services.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Service Prices</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderServiceItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No services found</Text>}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Add Price Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add Price for {selectedService?.name}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* Brand Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Brand</Text>
                <CustomDropdown
                  data={brands}
                  value={formData.brandId}
                  onSelect={handleBrandSelect}
                  placeholder="Select a brand (optional)"
                  displayKey="brandName"
                  valueKey="id"
                  loading={loadingBrands}
                  disabled={submitting}
                  searchable={true}
                  emptyText="No brands available"
                />
              </View>

              {/* Model Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Model</Text>
                <CustomDropdown
                  data={models}
                  value={formData.modelId}
                  onSelect={handleModelSelect}
                  placeholder={formData.brandId ? "Select a model (optional)" : "Select a brand first"}
                  displayKey="modelName"
                  valueKey="id"
                  loading={loadingModels}
                  disabled={submitting || !formData.brandId}
                  searchable={true}
                  emptyText={formData.brandId ? "No models available for this brand" : "Please select a brand first"}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Base Price <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter price"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={formData.basePrice}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, basePrice: text }))}
                  editable={!submitting}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter service description"
                  placeholderTextColor={colors.textSecondary}
                  multiline={true}
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  editable={!submitting}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSavePrice}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Price</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: spacing.lg, 
    paddingTop: spacing.xxxl, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border 
  },
  backButton: { marginRight: spacing.md },
  backButtonText: { color: colors.primary, fontSize: 16 },
  title: { color: colors.white, fontSize: 20, fontWeight: 'bold' },
  searchContainer: { padding: spacing.lg },
  searchInput: { 
    backgroundColor: colors.surface, 
    color: colors.white, 
    padding: spacing.md, 
    borderRadius: 8 
  },
  serviceCard: { 
    backgroundColor: colors.surface, 
    padding: spacing.md, 
    borderRadius: 8, 
    marginBottom: spacing.lg 
  },
  addedServiceCard: {
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: `${colors.success}10`, // Very light success color
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  serviceName: { 
    color: colors.white, 
    fontSize: 14, 
    fontWeight: '500', 
    marginBottom: 2 
  },
  serviceCategory: { 
    color: colors.textSecondary, 
    fontSize: 12, 
    marginTop: 2 
  },
  actionButton: { 
    width: 32,
    height: 32,
    borderRadius: 16, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: { backgroundColor: colors.primary },
  addedButton: { backgroundColor: colors.success },
  actionButtonText: { 
    color: colors.white, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 20 },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: spacing.md,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    width: '90%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  required: {
    color: colors.error,
  },
});

export { ServiceInsertionScreen };