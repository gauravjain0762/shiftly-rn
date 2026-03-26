import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';

const stepperColors = {
  background: colors._050505,
  activeCircle: colors._0B3970,
  inactiveCircleBorder: colors._0B3970,
  textActive: colors._F7F7F7,
  textInactive: colors._050505,
};

const stepData = [
  { label: 'Education', step: 1 },
  { label: 'Experience', step: 2 },
  { label: 'About Me', step: 3 },
  { label: 'Upload', step: 4 },
];

type StepperProps = {
  activeStep?: number;
  onPress?: (step: number) => void;
  useTabs?: boolean;
};

const Stepper = ({ activeStep = 1, onPress, useTabs = false }: StepperProps) => {
  if (useTabs) {
    return (
      <View style={styles.tabContainer}>
        {stepData.map(({ label, step }) => {
          const isActive = step === activeStep;
          return (
            <TouchableOpacity
              key={step}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onPress?.(step)}
              activeOpacity={0.7}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {stepData.map(({ label, step }) => {
        const isActive = step === activeStep;
        return (
          <TouchableOpacity
            key={step}
            style={styles.stepItem}
            onPress={() => onPress?.(step)}
            activeOpacity={0.7}
          >
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
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const CIRCLE_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: hp(14),
    justifyContent: 'space-around',
    // backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingVertical: hp(14),
    paddingHorizontal: wp(6),
    justifyContent: 'space-between',
    gap: wp(6),
  },
  tabButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: wp(20),
    borderColor: colors._0B3970,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(38),
    paddingHorizontal: wp(6),
  },
  tabButtonActive: {
    backgroundColor: colors._0B3970,
    borderColor: colors._0B3970,
  },
  tabText: {
    ...commonFontStyle(500, 13, colors._0B3970),
    textAlign: 'center',
  },
  tabTextActive: {
    ...commonFontStyle(600, 13, colors.white),
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
    backgroundColor: stepperColors.activeCircle,
  },
  inactiveCircle: {
    borderWidth: 1.5,
    borderColor: stepperColors.inactiveCircleBorder,
    backgroundColor: colors.white,
  },
  activeText: {
    ...commonFontStyle(500, 25, stepperColors.textActive),
  },
  inactiveText: {
    ...commonFontStyle(500, 25, stepperColors.inactiveCircleBorder),
  },
  activeLabel: {
    marginTop: 15,
    ...commonFontStyle(500, 15, stepperColors.textInactive),
  },
  inactiveLabel: {
    marginTop: 15,
    ...commonFontStyle(500, 15, stepperColors.textInactive),
  },
});

export default Stepper;
