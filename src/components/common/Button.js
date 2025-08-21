import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../../styles';

const Button = ({ 
  title, 
  onPress, 
  style = {}, 
  textStyle = {}, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  fullWidth = true
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style
  ];

  const buttonTextStyle = [
    styles.buttonText,
    styles['${variant}Text'],
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} size="small" />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: 25, // Rounded button like in Figma
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: colors.white,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.white,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  social: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.button,
  },
  primaryText: {
    color: colors.black,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.text,
  },
  socialText: {
    color: colors.text,
  },
});

export default Button;