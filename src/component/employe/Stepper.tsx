import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {commonFontStyle} from '../../theme/fonts';

const colors = {
  background: '#002147',
  activeCircle: '#fdf1cc',
  inactiveCircleBorder: '#274c7d',
  textActive: '#fdf1cc',
  textInactive: '#8da3c1',
};

const stepData = [
  {label: 'Education', step: 1},
  {label: 'Experience', step: 2},
  {label: 'About Me', step: 3},
];

const Stepper = ({activeStep = 1,setActiveStep}) => {
  return (
    <View style={styles.container}>
      {stepData.map(({label, step}) => {
        const isActive = step === activeStep;
        return (
          <View key={step} style={styles.stepItem}>
            <View
              style={[
                styles.circle,
                isActive ? styles.activeCircle : styles.inactiveCircle,
              ]}>
              <Text style={isActive ? styles.activeText : styles.inactiveText}>
                {step}
              </Text>
            </View>
            <Text style={isActive ? styles.activeLabel : styles.inactiveLabel}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const CIRCLE_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: colors.background,
    // paddingVertical: 20,
  },
  stepItem: {
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: colors.activeCircle,
  },
  inactiveCircle: {
    borderWidth: 1.5,
    borderColor: '#104686',
    backgroundColor: '#0B3970',
  },
  activeText: {
    ...commonFontStyle(500, 25, colors.background),
  },
  inactiveText: {
    ...commonFontStyle(500, 25, colors.inactiveCircleBorder),
  },
  activeLabel: {
    marginTop: 15,
    ...commonFontStyle(500, 15, colors.textActive),
  },
  inactiveLabel: {
    marginTop: 15,
    ...commonFontStyle(500, 15, colors.textInactive),
  },
});

export default Stepper;
