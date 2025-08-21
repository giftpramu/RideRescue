import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../../styles';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  style = {},
  keyboardType = 'default',
  autoCapitalize = 'none',
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Eye icon component using simple shapes
  const EyeIcon = ({ visible }) => (
    <View style={styles.eyeIconContainer}>
      {visible ? (
        // Eye open - simple oval with dot
        <View style={styles.eyeOpen}>
          <View style={styles.eyePupil} />
        </View>
      ) : (
        // Eye closed - line with small lines through it
        <View style={styles.eyeClosed}>
          <View style={styles.eyeClosedLine} />
          <View style={styles.eyeClosedSlash} />
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.focused, error && styles.error]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
          >
            <EyeIcon visible={isPasswordVisible} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 0,
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    minHeight: 50,
  },
  focused: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  error: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    ...typography.input,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  eyeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },
  
  // Eye icon styles
  eyeIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Eye open styles
  eyeOpen: {
    width: 20,
    height: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
  },
  
  // Eye closed styles
  eyeClosed: {
    width: 20,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  eyeClosedLine: {
    width: 16,
    height: 1.5,
    backgroundColor: colors.textSecondary,
    borderRadius: 1,
  },
  eyeClosedSlash: {
    position: 'absolute',
    width: 20,
    height: 1.5,
    backgroundColor: colors.textSecondary,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
});

export default Input;