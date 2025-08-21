import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../styles';

const   ServiceRequestScreen = ({ route, navigation }) => {
  const { service } = route.params || {};
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Service Request</Text>
      {service && (
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceDetailsTitle}>Selected Service:</Text>
          <Text style={styles.serviceDetailsText}>{service.name}</Text>
        </View>
      )}
      <Text style={styles.description}>Service request functionality will be implemented here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  serviceDetails: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  serviceDetailsTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  serviceDetailsText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export { ServiceRequestScreen };