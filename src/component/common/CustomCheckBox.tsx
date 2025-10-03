import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

type CustomCheckBoxProps = {
  checked: boolean;
  onPress: () => void;
  label?: React.ReactNode;
};

const CustomCheckBox = ({checked, onPress, label}: CustomCheckBoxProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: wp(20),
    height: wp(20),
    borderWidth: 1.5,
    borderColor: colors._7B7878,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(8),
    backgroundColor: '#fff',
  },
  boxChecked: {
    backgroundColor: colors._0D468C,
    borderColor: colors._0D468C,
  },
  tick: {
    color: '#fff',
    fontSize: hp(14),
    fontWeight: 'bold',
  },
  label: {
    flex: 1,
    fontSize: hp(13),
    color: colors.black,
    flexWrap: 'wrap',
  },
});

export default CustomCheckBox;
