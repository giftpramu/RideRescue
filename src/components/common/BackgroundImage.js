import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { colors } from '../../styles';

const BackgroundImage = ({ children, style = {} }) => {
  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.png')}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      <div style={styles.overlay} />
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
});

export default BackgroundImage;