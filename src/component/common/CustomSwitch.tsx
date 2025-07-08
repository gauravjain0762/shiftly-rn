import React, {FC, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';

type Switch = {
  isOn?: boolean;
  setIsOn?: (val: boolean) => void;
  thumbColor?: string;
  activeColor?: string;
  inActiveColor?: string;
  switchStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
};
const CustomSwitch: FC<Switch> = ({
  isOn,
  setIsOn = () => {},
  thumbColor = '',
  activeColor = '',
  inActiveColor = '',
  switchStyle,
  thumbStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.switchContainer,
        {
          backgroundColor: isOn
            ? activeColor || '#fff'
            : inActiveColor || '#ccc',
        },
        switchStyle,
      ]}
      onPress={() => setIsOn(!isOn)}
      activeOpacity={0.8}>
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: thumbColor || '#0A285F',
            alignSelf: isOn ? 'flex-end' : 'flex-start',
          },
          thumbStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 47,
    height: 26,
    borderRadius: 34 / 2,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 13,
  },
});

export default CustomSwitch;
