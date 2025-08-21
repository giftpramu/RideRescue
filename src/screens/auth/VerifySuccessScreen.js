import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { colors, typography, spacing } from '../../styles';

const VerifySuccessScreen = ({ navigation, route }) => {
  const type = route.params?.type || 'signup';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (type === 'password_reset') {
        navigation.navigate('Login');
      } else {
        navigation.navigate('Login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, type]);

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.checkmarkContainer}>
            <View style={styles.checkmarkOuter}>
              <View style={styles.checkmarkInner}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.title}>Congratulations !</Text>
          <Text style={styles.subtitle}>
            {type === 'password_reset' 
              ? 'Password Reset successful\nYou\'ll be redirected to the\nlogin screen now'
              : 'Account created successfully\nYou\'ll be redirected to the\nlogin screen now'
            }
          </Text>
        </View>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
  },
  title: {
    ...typography.heading1,
    color: colors.white,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  checkmarkContainer: {
    marginBottom: spacing.xl,
  },
  checkmarkOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkmarkInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 30,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default VerifySuccessScreen;