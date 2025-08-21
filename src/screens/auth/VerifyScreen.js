import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../styles';

const VerifyScreen = ({ navigation, route }) => {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  
  const email = route.params?.email || 'oscarissacc@gmail.com';
  const type = route.params?.type || 'signup';

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 5) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (type === 'forgot_password') {
        navigation.navigate('VerifySuccess', { type: 'password_reset' });
      } else {
        navigation.navigate('VerifySuccess', { type: 'signup' });
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    Alert.alert('Success', 'Verification code resent to your email');
    setCode(['', '', '', '', '']);
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Verify</Text>
        <Text style={styles.subtitle}>
          Please enter a received a code. We sent{'\n'}
          code to {email}
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={[
                styles.codeInput,
                digit ? styles.codeInputFilled : styles.codeInputEmpty
              ]}
              value={digit}
              onChangeText={value => handleCodeChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>
            Didn't get a code? <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button
            title="Verify"
            onPress={handleVerify}
            loading={loading}
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
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
    marginBottom: spacing.xxxl,
    lineHeight: 22,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginHorizontal: 5,
  },
  codeInputEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeInputFilled: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
  },
});

export default VerifyScreen;