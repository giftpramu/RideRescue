import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../styles';

const ProgressBar = ({ currentStep, totalSteps, style = {} }) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index < currentStep ? styles.activeStep : styles.inactiveStep,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  step: {
    flex: 1,
    height: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeStep: {
    backgroundColor: colors.progressActive,
  },
  inactiveStep: {
    backgroundColor: colors.progressBackground,
  },
});

export default ProgressBar;