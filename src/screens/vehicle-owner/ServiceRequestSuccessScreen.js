import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ServiceRequestSuccessScreen = ({ navigation, route }) => {
  const { serviceCenter } = route.params || {};

  const handleGoHome = () => {
    // Navigate to the main screen and reset the navigation stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2C2C2E" />
      <View style={styles.container}>
        
        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          {/* Phone with checkmark */}
          <View style={styles.phoneContainer}>
            <View style={styles.phone}>
              <View style={styles.phoneScreen}>
                <View style={styles.checkmarkContainer}>
                  <Icon name="check" size={32} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>

          {/* Character illustration (simplified) */}
          <View style={styles.characterContainer}>
            <View style={styles.character}>
              {/* Head */}
              <View style={styles.characterHead} />
              
              {/* Body */}
              <View style={styles.characterBody}>
                {/* Arms */}
                <View style={styles.characterArm} />
                <View style={[styles.characterArm, styles.characterArmRight]} />
              </View>
              
              {/* Legs */}
              <View style={styles.characterLegs}>
                <View style={styles.characterLeg} />
                <View style={[styles.characterLeg, styles.characterLegRight]} />
              </View>
            </View>
          </View>

          {/* Floating dots for decoration */}
          <View style={[styles.floatingDot, styles.dot1]} />
          <View style={[styles.floatingDot, styles.dot2]} />
          <View style={[styles.floatingDot, styles.dot3]} />
          <View style={[styles.floatingDot, styles.dot4]} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Service Request Sent Successfully!</Text>
          
          <Text style={styles.subtitle}>
            We've sent your service request to the Service Provider. 
            Please wait until you get a verify notification from the provider.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={handleGoHome}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>Get back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  
  // Illustration Styles
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 60,
    marginBottom: 60,
    width: '100%',
    height: 300,
  },
  phoneContainer: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 2,
  },
  phone: {
    width: 90,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Character Styles (Better positioned)
  characterContainer: {
    position: 'absolute',
    right: 10,
    top: 0,
    zIndex: 1,
  },
  character: {
    alignItems: 'center',
  },
  characterHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFDBAC',
    marginBottom: 3,
  },
  characterBody: {
    width: 50,
    height: 70,
    backgroundColor: '#6C757D',
    borderRadius: 25,
    position: 'relative',
    marginBottom: 3,
  },
  characterArm: {
    position: 'absolute',
    width: 16,
    height: 40,
    backgroundColor: '#FFDBAC',
    borderRadius: 8,
    top: 10,
    left: -12,
    transform: [{ rotate: '35deg' }],
  },
  characterArmRight: {
    right: -12,
    left: 'auto',
    transform: [{ rotate: '-55deg' }],
    top: 8,
  },
  characterLegs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 32,
  },
  characterLeg: {
    width: 14,
    height: 50,
    backgroundColor: '#495057',
    borderRadius: 7,
  },
  characterLegRight: {
    // No additional styles needed
  },
  
  // Floating dots (better distributed)
  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#8E8E93',
    opacity: 0.3,
  },
  dot1: {
    top: 40,
    left: 120,
    width: 6,
    height: 6,
  },
  dot2: {
    top: 120,
    right: 120,
    width: 4,
    height: 4,
  },
  dot3: {
    bottom: 80,
    left: 60,
    width: 5,
    height: 5,
  },
  dot4: {
    bottom: 120,
    right: 40,
    width: 8,
    height: 8,
  },
  
  // Content Styles
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  
  // Button Styles
  homeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ServiceRequestSuccessScreen;