import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ImageBackground } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import { colors, typography, spacing } from '../../styles';

// Schema for Vehicle Owner
const vehicleOwnerSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().min(10, 'Invalid mobile number').required('Mobile number is required'),
  address: yup.string().required('Address is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  brand: yup.string().required('Brand is required'),
  model: yup.string().required('Model is required'),
  year: yup.string().required('Year is required'),
  registrationNumber: yup.string().required('Registration number is required'),
});

// Schema for Service Provider
const serviceProviderSchema = yup.object({
  businessName: yup.string().required('Business name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().min(10, 'Invalid mobile number').required('Mobile number is required'),
  address: yup.string().required('Address is required'),
  businessRegistrationNo: yup.string().required('Business registration number is required'),
  experienceYears: yup.string().required('Experience years is required'),
  serviceArea: yup.string().required('Service area is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignupScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const userType = route.params?.userType || 'vehicle_owner';

  const schema = userType === 'vehicle_owner' ? vehicleOwnerSchema : serviceProviderSchema;

  const getDefaultValues = () => {
    if (userType === 'vehicle_owner') {
      return {
        fullName: '',
        email: '',
        mobile: '',
        address: '',
        password: '',
        brand: '',
        model: '',
        year: '',
        registrationNumber: '',
      };
    } else {
      return {
        businessName: '',
        email: '',
        mobile: '',
        address: '',
        businessRegistrationNo: '',
        experienceYears: '',
        serviceArea: '',
        password: '',
      };
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log('Signup data:', data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (userType === 'service_provider') {
        navigation.navigate('UploadDocuments');
      } else {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login', { userType }) }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const renderVehicleOwnerFields = () => (
    <>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Your Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.fullName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Your Email Address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="mobile"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Mobile"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="phone-pad"
            error={errors.mobile?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Vehicle Information</Text>
      
      <Controller
        control={control}
        name="brand"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Brand"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.brand?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="model"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Model"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.model?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="year"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Year"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="number-pad"
            error={errors.year?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="registrationNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Vehicle Identification Number"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.registrationNumber?.message}
          />
        )}
      />
    </>
  );

  const renderServiceProviderFields = () => (
    <>
      <Text style={styles.sectionTitle}>Business Details</Text>
      
      <Controller
        control={control}
        name="businessName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Business Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.businessName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Your Email Address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="mobile"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Mobile"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="phone-pad"
            error={errors.mobile?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="businessRegistrationNo"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Business Registration No"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.businessRegistrationNo?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="experienceYears"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Experience Years"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="number-pad"
            error={errors.experienceYears?.message}
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

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />
    </>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {userType === 'service_provider' && (
            <View style={styles.progressContainer}>
              <ProgressBar currentStep={1} totalSteps={4} />
              <Text style={styles.stepText}>(1/4)</Text>
            </View>
          )}
          <Text style={styles.title}>
            Sign Up as {userType === 'vehicle_owner' ? 'Vehicle Owner' : 'Service Provider'}
          </Text>
        </View>

        <View style={styles.form}>
          {userType === 'vehicle_owner' ? renderVehicleOwnerFields() : renderServiceProviderFields()}

          <Button
            title={userType === 'service_provider' ? 'Next' : 'Sign Up'}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an Account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login', { userType })}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          {userType === 'vehicle_owner' && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="🌐 Continue with Google"
                variant="social"
                style={styles.socialButton}
              />

              <Button
                title="📘 Continue with Facebook"
                variant="social"
                style={styles.socialButton}
              />
            </>
          )}
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
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  title: {
    ...typography.heading2,
    color: colors.white,
  },
  form: {
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.white,
    marginVertical: spacing.lg,
    marginTop: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
  },
  socialButton: {
    marginVertical: spacing.sm,
  },
  dropdownContainer: {
    marginVertical: spacing.sm,
  },
  dropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },
});

export default SignupScreen;