import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Button from '../../components/common/Button';
import { colors, spacing } from '../../styles';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Experience the{'\n'}Exceptional Service.
            </Text>
            <Text style={styles.subtitle}>
              Driving a fresh perception of auto care by getting the bar 
              high for all automotive brands in Sri Lanka.
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('RoleSelection')}
            textStyle={{ color: 'black' }}
          />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxl,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.lg,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    paddingBottom: spacing.xl,
  },
});

export default WelcomeScreen;