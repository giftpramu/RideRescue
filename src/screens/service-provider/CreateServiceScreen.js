// src/screens/CreateServiceScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { colors, spacing } from '../../styles';
import { categoryService } from '../../services/api/CategoryService';
import { vehicleService } from '../../services/api/VehicleService';

const CreateServiceScreen = ({ navigation, route }) => {
  const editingService = route.params?.editingService || null;

  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    fetchCategories();

    if (editingService) {
      setServiceName(editingService.name);
      setServiceCategory(editingService.category?.id);
      setServiceDescription(editingService.description || '');
    }
  }, [editingService]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!serviceName.trim()) newErrors.name = 'Service name is required';
    if (!serviceCategory) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const serviceData = {
        name: serviceName.trim(),
        description: serviceDescription.trim(),
        categoryId: serviceCategory,
      };

      if (editingService) {
        await vehicleService.updateVehicleService(editingService.id, serviceData);
        Alert.alert('Success', 'Service updated successfully');
      } else {
        await vehicleService.createVehicleService(serviceData);
        Alert.alert('Success', 'Service created successfully');
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={[styles.backText, { opacity: loading ? 0.5 : 1 }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {editingService ? 'Edit Service' : 'Create New Service'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveText, { opacity: loading ? 0.5 : 1 }]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={serviceName}
          onChangeText={(text) => {
            setServiceName(text);
            if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
          }}
          placeholder="Enter service name"
          placeholderTextColor={colors.textSecondary}
          editable={!loading}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Category *</Text>
        {loadingCategories ? (
          <Text style={{ color: colors.textSecondary }}>Loading categories...</Text>
        ) : (
          <View style={styles.categoriesWrapper}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  serviceCategory === category.id && styles.selectedCategoryChip,
                ]}
                onPress={() => setServiceCategory(category.id)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    serviceCategory === category.id && styles.selectedCategoryChipText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={serviceDescription}
          onChangeText={setServiceDescription}
          placeholder="Enter service description"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          editable={!loading}
        />
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backText: { color: colors.textSecondary, fontSize: 16 },
  title: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  saveText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  content: { flex: 1, padding: spacing.lg },
  label: { color: colors.white, fontSize: 16, fontWeight: '600', marginTop: spacing.lg },
  input: {
    backgroundColor: colors.surface,
    color: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    fontSize: 16,
    marginTop: spacing.sm,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  inputError: { borderWidth: 1, borderColor: colors.error },
  errorText: { color: colors.error, fontSize: 12, marginTop: spacing.xs },
  categoriesWrapper: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  categoryChip: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedCategoryChip: { backgroundColor: colors.primary },
  categoryChipText: { color: colors.textSecondary },
  selectedCategoryChipText: { color: colors.white, fontWeight: '600' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
});

export default CreateServiceScreen;
