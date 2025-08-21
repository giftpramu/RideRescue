import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../styles';
import { useForm, Controller } from 'react-hook-form';

const ServicePriceDetailsScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');

  const services = [
    'Mobile Car Wash',
    'Jump Starting A Dead Battery',
    'Flat Tyre',
    'Mechanical Repairs',
    'Flat Battery',
    'AC Gas Refill',
    'Engine Oil Change'
  ];

  const brands = ['Toyota', 'Honda', 'Nissan', 'BMW', 'Mercedes', 'Audi'];
  const models = ['Camry', 'Civic', 'Altima', 'X5', 'C-Class', 'A4'];
  const availability = ['Yes', 'No'];

  const handleNext = () => {
    navigation.navigate('Verify', { type: 'signup' });
  };

  const DropdownItem = ({ title, selectedValue, onSelect, options, placeholder }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{title}</Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
          {selectedValue || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <ProgressBar currentStep={3} totalSteps={4} />
          <Text style={styles.stepText}>(3/4)</Text>
        </View>

        <Text style={styles.title}>Service and Price Details</Text>

        <View style={styles.formContainer}>
           <Controller
                control={control}
                name="services"
                render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    placeholder="Select Service "
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.address?.message}
                />
                )}
            />
          <Controller
                control={control}
                name="Vrand"
                render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    placeholder="Brand Area"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.address?.message}
                />
                )}
            />

           <Controller
                control={control}
                name="model"
                render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    placeholder="model Area"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.address?.message}
                />
                )}
            />
 <Controller
                control={control}
                name="serviceArea"
                render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    placeholder="Service Area"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.address?.message}
                />
                )}
            />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  title: {
    ...typography.heading1,
    color: colors.white,
    marginBottom: spacing.xl,
  },
  formContainer: {
    flex: 1,
    marginBottom: spacing.xl,
  },
  dropdownContainer: {
    marginBottom: spacing.lg,
  },
  dropdownLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  dropdownText: {
    color: colors.white,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  dropdownArrow: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  buttonContainer: {
    paddingBottom: spacing.xl,
  },
});

export default ServicePriceDetailsScreen;