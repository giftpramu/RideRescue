import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../styles';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../validations/authSchemas';

const LoginScreen = ({ navigation, route }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, isLoading, setCurrentAuthScreen } = useAuth();
  
  // Get userType from route params (passed from RoleSelectionScreen)
  const initialUserType = route.params?.userType || 'vehicle_owner';
  const [userType, setUserType] = useState(initialUserType);

  useEffect(() => {
    setCurrentAuthScreen('Login');
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log('LoginScreen: Attempting login with:', { 
        usernameOrEmail: data.usernameOrEmail,
        uiUserType: userType // For logging only
      });

      // Backend determines user type from stored data - no userType parameter needed
      const response = await signIn(data.usernameOrEmail, data.password);
      
      if (response.success) {
        console.log('LoginScreen: Login successful:', {
          userName: response.user?.username,
          actualUserType: response.userType // This comes from backend
        });

        Alert.alert('Success', `Welcome back, ${response.user?.username || 'User'}!`, [
          {
            text: 'OK',
            onPress: () => {
              // Navigation based on actual user type from backend
              navigateBasedOnUserType(response.userType);
            }
          }
        ]);
      }

    } catch (error) {
      console.error('LoginScreen: Login error:', error);
      
      // Handle specific error messages from backend
      let errorMessage = error.message;
      
      if (errorMessage.includes('Account is disabled')) {
        errorMessage = 'Your account is disabled. Please contact admin for activation.';
      } else if (errorMessage.includes('pending admin approval')) {
        errorMessage = 'Your account is pending admin approval. Please wait for verification.';
      } else if (errorMessage.includes('Invalid credentials')) {
        errorMessage = 'Invalid username/email or password. Please try again.';
      }
      
      Alert.alert('Login Failed', errorMessage);
    }
  };

  // Navigate based on actual user type from backend
  const navigateBasedOnUserType = (actualUserType) => {
    console.log('Navigating based on user type:', actualUserType);
    
    switch (actualUserType?.toLowerCase()) {
      case 'admin':
        navigation.navigate('AdminDashboard');
        break;
      case 'service_provider':
      case 'service-provider':
        navigation.navigate('ServiceProviderDashboard');
        break;
      case 'vehicle_owner':
      case 'vehicle-owner':
      default:
        navigation.navigate('VehicleOwnerDashboard');
        break;
    }
  };

  // Dynamic signup navigation based on selected user type
  const handleSignupNavigation = () => {
    console.log('Navigating to signup for user type:', userType);
    
    if (userType === 'service_provider') {
      navigation.navigate('ServiceProviderSignup');
    } else {
      // Default to vehicle owner signup
      navigation.navigate('VehicleOwnerSignup');
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
        contentContainerStyle={[
          styles.container,
          { flexGrow: 1, justifyContent: 'space-between' }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate('RoleSelection')}
              >
                <Ionicons name="arrow-back" size={20} color={colors.white} />
              </TouchableOpacity>
              <Text style={styles.title}>Login</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="usernameOrEmail"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Username or Email Address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.usernameOrEmail?.message}
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

            <View style={styles.optionsRow}>
              <TouchableOpacity 
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              title={isLoading ? "Signing In..." : "Login"}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              textStyle={{ color: 'black' }}
            />

            {/* Updated signup navigation - now dynamic based on user type */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an Account? </Text>
              <TouchableOpacity onPress={handleSignupNavigation}>
                <Text style={styles.signupLink}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* User Type Switcher */}
        <View style={styles.userTypeSwitcher}>
          <Text style={styles.switcherText}>Want to login as a different user type?</Text>
          <TouchableOpacity
            onPress={() => {
              const newUserType = userType === 'vehicle_owner' ? 'service_provider' : 'vehicle_owner';
              setUserType(newUserType);
              navigation.setParams({ userType: newUserType });
            }}
          >
            <Text style={styles.switcherLink}>
              Switch to {userType === 'vehicle_owner' ? 'Service Provider' : 'Vehicle Owner'}
            </Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl, // Reduced padding to accommodate back button
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.xl
  },
  title: {
    ...typography.heading1,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  form: {
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: colors.white,
  },
  rememberMeText: {
    color: colors.white,
    fontSize: 14,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    marginVertical: spacing.lg,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.md,
    flexWrap: 'wrap',
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  userTypeSwitcher: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  switcherText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  switcherLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
});

export default LoginScreen;