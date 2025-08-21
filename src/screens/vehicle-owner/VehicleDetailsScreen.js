import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing } from '../../styles';

const VehicleDetailsScreen = ({ navigation }) => {
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    yearMade: '',
    vehicleIdNumber: '',
  });

  const handleInputChange = (field, value) => {
    setVehicleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!vehicleData.brand || !vehicleData.model || !vehicleData.yearMade || !vehicleData.vehicleIdNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would typically save to your backend/storage
    Alert.alert('Success', 'Vehicle information saved successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
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
        <Text style={styles.headerTitle}>Vehicle Information</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Brand"
            placeholderTextColor={colors.textSecondary}
            value={vehicleData.brand}
            onChangeText={(value) => handleInputChange('brand', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Model"
            placeholderTextColor={colors.textSecondary}
            value={vehicleData.model}
            onChangeText={(value) => handleInputChange('model', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Year Made"
            placeholderTextColor={colors.textSecondary}
            value={vehicleData.yearMade}
            onChangeText={(value) => handleInputChange('yearMade', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Vehicle ID Number"
            placeholderTextColor={colors.textSecondary}
            value={vehicleData.vehicleIdNumber}
            onChangeText={(value) => handleInputChange('vehicleIdNumber', value)}
          />
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
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
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    padding: spacing.sm,
  },
  menuIcon: {
    color: colors.white,
    fontSize: 20,
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VehicleDetailsScreen;