import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ImageBackground } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import { colors, typography, spacing } from '../../styles';
import { useAuth } from '../../context/AuthContext';
import { serviceProviderSignupSchema } from '../../validations/authSchemas';

const ServiceProviderSignupScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(serviceProviderSignupSchema),
    defaultValues: {
      businessName: '',
      email: '',
      mobile: '',
      address: '',
      businessRegistrationNo: '',
      experienceYears: '',
      serviceArea: '',
      password: '',
    },
  });

const onSubmit = async (data) => {
    console.log('Service Provider Form submitted with data:', data);
    console.log('Form errors:', errors);
    
    setIsLoading(true);
    try {
      console.log('Service Provider Signup data:', data);

      // Transform data to match backend expected format
      const signupData = {
        businessName: data.businessName,
        username: data.username,
        email: data.email,
        password: data.password,
        contactNumber: data.mobile,
        address: data.address,
        businessRegistrationNumber: data.businessRegistrationNo,
        experienceYears: parseInt(data.experienceYears),
        serviceArea: data.serviceArea,
      };

      console.log('Transformed service provider signup data:', signupData);
      
      const response = await signUp(signupData, 'service-provider');
      console.log('Service Provider Registration successful:', response);

      // Check if we have the service provider ID
      if (response?.id) {
        console.log('Service provider registered with ID:', response.id);
        console.log('AuthContext will now handle navigation to document upload');
        
        // The AuthContext has already set the registration state in signUp method
        // The AppNavigator will automatically show the UploadDocuments screen
        // No manual navigation needed here
        
      } else {
        // If no ID received, show error
        console.error('No service provider ID received from backend:', response);
        Alert.alert('Error', 'Registration successful but ID not received. Please try logging in.');
        navigation.navigate('Login');
      }
      
    } catch (error) {
      console.error('Service Provider Registration error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Handle specific error messages
      let errorMessage = error.message;
      
      if (errorMessage.includes('Email already exists')) {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (errorMessage.includes('Mobile already exists')) {
        errorMessage = 'This mobile number is already registered. Please use a different number.';
      } else if (errorMessage.includes('Business registration number already exists')) {
        errorMessage = 'This business registration number is already registered.';
      } else if (errorMessage.includes('Network Error') || errorMessage.includes('ERR_NETWORK')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('Access denied')) {
        errorMessage = 'Server configuration error. Please contact support or try again later.';
      } else if (errorMessage === 'Registration failed') {
        errorMessage = 'Registration failed. Please check your details and try again.';
      }
      
      // Show error alert - user stays on signup screen
      Alert.alert('Registration Failed', errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <ProgressBar currentStep={1} totalSteps={2} />
          </View>
          <Text style={styles.title}>Sign Up as Service Provider</Text>
          <Text style={styles.subtitle}>
            Register your business and provide vehicle repair services
          </Text>
        </View>

        <View style={styles.form}>
          {/* Business Information Section */}
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
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Email Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="mobile"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Mobile Number"
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
                placeholder="Business Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={3}
                error={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="businessRegistrationNo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Business Registration Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.businessRegistrationNo?.message}
                autoCapitalize="characters"
              />
            )}
          />

          {/* Service Information Section */}
          <Text style={styles.sectionTitle}>Service Information</Text>

          <Controller
            control={control}
            name="experienceYears"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Years of Experience"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={2}
                error={errors.experienceYears?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="serviceArea"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Service Area (e.g., Colombo, Gampaha)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.serviceArea?.message}
                autoCapitalize="words"
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

          <Button
            title={isLoading ? "Creating Account..." : "Continue to Upload Documents"}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            textStyle={{ color: 'black' }}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an Account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.white,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
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
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    ...typography.heading4,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  // Debug styles - remove in production
  debugButton: {
    backgroundColor: 'orange',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  debugText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ServiceProviderSignupScreen;