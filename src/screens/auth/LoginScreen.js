// src/screens/auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../styles';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../validations/authSchemas';

const LoginScreen = ({ navigation, route }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, isLoading, setCurrentAuthScreen  } = useAuth();
  
  // Keep userType for UI display purposes only (not sent to backend)
  const userType = route.params?.userType || 'vehicle-owner';

  // Add this useEffect to set the current screen when component mounts
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

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.jpeg')}
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
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Enter your credentials to access your account
            </Text>
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

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an Account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Signup', { userType })}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* User Type Switcher - For UI/Signup purposes only */}
        <View style={styles.userTypeSwitcher}>
          <Text style={styles.switcherText}>Planning to sign up as a different user type?</Text>
          <TouchableOpacity
            onPress={() => {
              const newUserType = userType === 'vehicle-owner' ? 'service-provider' : 'vehicle-owner';
              navigation.setParams({ userType: newUserType });
            }}
          >
            <Text style={styles.switcherLink}>
              Switch to {userType === 'vehicle-owner' ? 'Service Provider' : 'Vehicle Owner'} signup
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test Credentials for Development */}
        {__DEV__ && (
          <View style={styles.testCredentials}>
            <Text style={styles.testTitle}>Test Credentials:</Text>
            <Text style={styles.testText}>Vehicle Owner: shalby2 / password123shalby2</Text>
            <Text style={styles.testText}>Service Provider: automiraj / password1234automiraj</Text>
            <Text style={styles.testNote}>(Login determines user type automatically)</Text>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

// Styles remain the same
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
    paddingTop: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
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
  },
  switcherLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  testCredentials: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  testTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  testText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  testNote: {
    color: colors.warning,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
});

export default LoginScreen;