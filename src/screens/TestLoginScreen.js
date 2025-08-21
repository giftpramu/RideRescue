import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles';
import { useAuth } from '../context/AuthContext';

const TestLoginScreen = () => {
  const { signIn } = useAuth();

  const handleVehicleOwnerLogin = () => {
    signIn('pramudi@email.com', 'password', 'vehicle-owner');
  };

  const handleServiceProviderLogin = () => {
    signIn('sterling@email.com', 'password', 'service-provider');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose User Type</Text>
      <Text style={styles.subtitle}>Select how you want to test the app</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleVehicleOwnerLogin}>
        <Text style={styles.buttonIcon}>🚗</Text>
        <Text style={styles.buttonText}>Vehicle Owner</Text>
        <Text style={styles.buttonSubtext}>Request services, manage vehicle</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.providerButton]} onPress={handleServiceProviderLogin}>
        <Text style={styles.buttonIcon}>🔧</Text>
        <Text style={styles.buttonText}>Service Provider</Text>
        <Text style={styles.buttonSubtext}>Manage service requests, send bills</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderRadius: 16,
    marginBottom: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  providerButton: {
    backgroundColor: '#28a745',
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  buttonSubtext: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default TestLoginScreen;