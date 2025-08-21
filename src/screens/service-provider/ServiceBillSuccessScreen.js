import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, spacing } from '../../styles';

const ServiceBillSuccessScreen = ({ navigation, route }) => {
  const { billData } = route.params || {};

  const handleBackToHome = () => {
    // Navigate back to service provider home
    navigation.navigate('ServiceProviderHome');
  };

  return (
    <View style={styles.container}>
      {/* Success Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.phoneContainer}>
          <View style={styles.phone}>
            <View style={styles.phoneScreen}>
              <View style={styles.checkmarkContainer}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Character illustration */}
        <View style={styles.characterContainer}>
          <View style={styles.character}>
            <View style={styles.characterHead}>
              <Text style={styles.characterFace}>😊</Text>
            </View>
            <View style={styles.characterBody} />
            <View style={styles.characterArm} />
            <View style={styles.characterLeg1} />
            <View style={styles.characterLeg2} />
          </View>
        </View>

        {/* Floating elements */}
        <View style={[styles.floatingElement, styles.element1]} />
        <View style={[styles.floatingElement, styles.element2]} />
        <View style={[styles.floatingElement, styles.element3]} />
      </View>

      {/* Success Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.successTitle}>Service Bill Sent Successfully!</Text>
        <Text style={styles.successMessage}>
          We've sent your service bill to the Vehicle Owner. Please wait until you get a verify notification from the Owner.
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Text style={styles.homeButtonText}>Get back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  phoneContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  phone: {
    width: 120,
    height: 240,
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.white,
    fontSize: 30,
    fontWeight: 'bold',
  },
  characterContainer: {
    position: 'absolute',
    right: 40,
    top: '60%',
  },
  character: {
    alignItems: 'center',
  },
  characterHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4B5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  characterFace: {
    fontSize: 20,
  },
  characterBody: {
    width: 30,
    height: 40,
    backgroundColor: '#4A5568',
    borderRadius: 15,
    marginBottom: 5,
  },
  characterArm: {
    position: 'absolute',
    top: 45,
    right: -15,
    width: 20,
    height: 25,
    backgroundColor: '#FFE4B5',
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  characterLeg1: {
    width: 12,
    height: 25,
    backgroundColor: '#2D3748',
    borderRadius: 6,
    marginRight: 6,
  },
  characterLeg2: {
    width: 12,
    height: 25,
    backgroundColor: '#2D3748',
    borderRadius: 6,
    marginLeft: 6,
  },
  floatingElement: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  element1: {
    top: '20%',
    left: '20%',
  },
  element2: {
    top: '30%',
    right: '15%',
  },
  element3: {
    bottom: '40%',
    left: '10%',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  successTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  successMessage: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: spacing.xl,
  },
  homeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  homeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceBillSuccessScreen;