// src/screens/auth/VehicleOwnerSignupScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ImageBackground } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../styles';
import { useAuth } from '../../context/AuthContext';
import { vehicleOwnerSignupSchema } from '../../validations/authSchemas';

const VehicleOwnerSignupScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(vehicleOwnerSignupSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      contactNumber: '',
      address: '',
      password: '',
      brand: '',
      model: '',
      year: '',
      registrationNumber: '',
    },
  });

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    
    setIsLoading(true);
    try {
      console.log('Vehicle Owner Signup data:', data);

      // Transform data to match backend expected format exactly
      const signupData = {
        name: data.name,                        // Use the separate name field
        username: data.username,                // Use the separate username field
        email: data.email,
        password: data.password,
        contactNumber: data.contactNumber,
        address: data.address,
        vehicleBrand: data.brand,
        vehicleModel: data.model,
        vehicleYear: parseInt(data.year),
        vehicleRegistrationNumber: data.registrationNumber.toUpperCase(),
      };

      console.log('Transformed signup data:', signupData);
      
      // Call AuthContext signUp method
      const response = await signUp(signupData, 'vehicle-owner');
      
      console.log('Vehicle Owner Registration successful:', response);
      
      // Only navigate to login on successful signup
      Alert.alert(
        'Success', 
        'Account created successfully! You can now login with your credentials.',
        [
          { 
            text: 'Go to Login', 
            onPress: () => navigation.navigate('Login') 
          }
        ]
      );
      
    } catch (error) {
      console.error('Vehicle Owner Registration error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Handle specific error messages
      let errorMessage = error.message;
      
      if (errorMessage.includes('Email already exists')) {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (errorMessage.includes('Mobile already exists')) {
        errorMessage = 'This mobile number is already registered. Please use a different number.';
      } else if (errorMessage.includes('Registration number already exists')) {
        errorMessage = 'This vehicle registration number is already registered.';
      } else if (errorMessage.includes('Network Error') || errorMessage.includes('ERR_NETWORK')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('Access denied')) {
        errorMessage = 'Server configuration error. Please contact support or try again later.';
      } else if (errorMessage === 'Registration failed') {
        errorMessage = 'Registration failed. Please check your details and try again.';
      }
      
      // Show error alert - user stays on signup screen
      Alert.alert('Registration Failed', errorMessage);
      
      // Do NOT navigate anywhere - keep user on signup screen to retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.png')}
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
          <Text style={styles.title}>Sign Up as Vehicle Owner</Text>
        </View>

        <View style={styles.form}>
          {/* Personal Information Section */}
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
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
            name="contactNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Mobile Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                error={errors.contactNumber?.message}
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
                multiline
                numberOfLines={3}
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

          {/* Vehicle Information Section */}
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          
          <Controller
            control={control}
            name="brand"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Vehicle Brand (e.g., Toyota, Honda)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.brand?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="model"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Vehicle Model (e.g., Camry, Civic)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.model?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="year"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Manufacturing Year (e.g., 2020)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={4}
                error={errors.year?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="registrationNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Registration Number (e.g., ABC-1234)"
                value={value}
                onChangeText={(text) => onChange(text.toUpperCase())}
                onBlur={onBlur}
                autoCapitalize="characters"
                error={errors.registrationNumber?.message}
              />
            )}
          />

          <Button
            title={isLoading ? "Creating Account..." : "Sign Up"}
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

          {/* Social Login Options */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Continue with Google"
            variant="social"
            style={styles.socialButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'Google signup will be available soon!');
            }}
          />

          <Button
            title="Continue with Facebook"
            variant="social"
            style={[styles.socialButton, { marginBottom: spacing.xl }]}
            onPress={() => {
              Alert.alert('Coming Soon', 'Facebook signup will be available soon!');
            }}
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
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
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

export default VehicleOwnerSignupScreen;