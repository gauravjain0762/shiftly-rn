import React, {FC, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

type Switch = {
  isOn?: boolean;
  setIsOn?: (val: boolean) => void;
  thumbColor?: string;
  activeColor?: string;
  inActiveColor?: string;
};
const CustomSwitch: FC<Switch> = ({
  isOn,
  setIsOn = () => {},
  thumbColor = '',
  activeColor = '',
  inActiveColor = '',
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
    padding: 4,
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
