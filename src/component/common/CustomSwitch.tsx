import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

const CustomSwitch = ({isOn, setIsOn}) => {
  return (
    <TouchableOpacity
      style={[
        styles.switchContainer,
        {backgroundColor: '#fff'},
      ]}
      onPress={() => setIsOn(!isOn)}
      activeOpacity={0.8}>
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: '#0A285F',
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
