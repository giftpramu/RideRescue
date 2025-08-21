import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../styles';

const EmergencyServiceScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Emergency Service</Text>
      <View style={styles.emergencyContent}>
        <Text style={styles.emergencyIcon}>🚨</Text>
        <Text style={styles.emergencyTitle}>Emergency Service</Text>
        <Text style={styles.emergencySubtitle}>
          Need immediate assistance?{'\n'}
          We'll connect you with the nearest service provider.
        </Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyButtonText}>Request Emergency Help</Text>
        </TouchableOpacity>
        
        {/* Emergency Contact Options */}
        <View style={styles.emergencyOptions}>
          <TouchableOpacity style={styles.emergencyOption}>
            <Text style={styles.emergencyOptionIcon}>📞</Text>
            <Text style={styles.emergencyOptionText}>Call Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.emergencyOption}>
            <Text style={styles.emergencyOptionIcon}>📍</Text>
            <Text style={styles.emergencyOptionText}>Share Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emergencyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emergencyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emergencyTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emergencySubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  emergencyButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  emergencyButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencyOptions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  emergencyOption: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  emergencyOptionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  emergencyOptionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  screenTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: spacing.xxxl,
    marginBottom: spacing.lg,
  },
});

export default EmergencyServiceScreen;