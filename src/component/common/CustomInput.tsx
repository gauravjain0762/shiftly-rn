import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import React from 'react';
import { colors } from '../../theme/colors';
import { commonFontStyle, hp, wp } from '../../theme/fonts';

const CustomInput = ({
  label,
  value,
  onChange,
  onPress,
  placeholder,
  inputStyle,
  ...props
}: any) => {
  return (
    <View style={{ flex: 1 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        style={[styles.dropdown, inputStyle]}
        placeholderTextColor={'#969595'}
        onChangeText={onChange}
        {...props}
      />
      {/* <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.dropdown}
        activeOpacity={0.8}>
        <Text style={value ? styles.inputStyle : styles.placeholderStyle}>
          {value ? value : `${label}`}
        </Text>
        
      </TouchableOpacity> */}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: wp(16),
    borderRadius: 20,
    height: 59,
    borderWidth: 1.5,
    borderColor: '#225797',
    flexDirection: 'row',
    // alignItems: 'center',
    ...commonFontStyle(400, 18, colors._050505),
  },
  label: {
    marginTop: 20,
    marginBottom: 12,
    ...commonFontStyle(600, 18, colors._050505),
  },
  required: {
    color: 'red',
  },
  labelTextStyle: {
    ...commonFontStyle(600, 25, colors.black),
  },
  titleTextStyle: {
    ...commonFontStyle(700, 17, colors.black),
  },
  container: {
    marginTop: hp(1.5),
    marginBottom: hp(0.7),
    paddingHorizontal: wp(4),
  },
  containerStyle: {
    borderRadius: 20,
    top: 2,
    backgroundColor: '#0D468C',
    borderColor: '#225797',
    borderWidth: 1.5,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    zIndex: 1,
  },
  inputContainer: {
    borderWidth: 0.5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.3),
    borderColor: '#ccc',
    // backgroundColor: colors.white,
    // shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputStyle: {
    ...commonFontStyle(400, 18, colors._050505),
    flex: 1,
  },
  placeholderStyle: {
    flex: 1,
    margin: 0,
    padding: 0,
    marginHorizontal: wp(3),
    ...commonFontStyle(400, 18, '#969595'),
  },

  selectedTextStyle: {
    ...commonFontStyle(600, 25, colors.black),
  },
  dropdownStyle: {
    paddingHorizontal: wp(16),
    borderRadius: 20,
    height: 59,
    borderWidth: 1.5,
    borderColor: '#225797',
    // height: 55,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(30),
    marginHorizontal: wp(16),
    marginVertical: hp(8),
  },
  imageStyle1: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 6,
  },
});
