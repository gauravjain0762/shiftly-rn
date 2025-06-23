import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
  View,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../theme/colors';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {Dropdown as DropdownElement} from 'react-native-element-dropdown';
import { IMAGES } from '../../assets/Images';

type Props = {
  title?: string;
  extraStyle?: ViewStyle;
  onPress?: () => void;
  titleColor?: any;
  type?: 'blue' | 'gray';
  disable?: boolean;
  leftIcon?: any;
  data?: any;
  label?: any;
  value?: any;
  onChange?: (text: string) => void;
  isSearch?: any;
  inputContainer?: any;
  container?: any;
  placeholder?: any;
  dropdownStyle?: any;
  mendate?: boolean;
  subStyle?: boolean;
  labelField?: string;
  valueField?: string;
  minimumDate?: string;
  dropIcon?: string;
  dateMode?: string;
};

const CustomDropdown = ({
  data,
  value,
  onChange,
  label,
  isSearch,
  inputContainer,
  container,
  placeholder = '',
  dropdownStyle,
  disable,
  disabled,
  title,
  titleColor,
  mendate,
  onPress,
  datePicker,
  icon,
  subStyle,
  labelField,
  valueField,
  minimumDate,
  dropIcon,
  dateMode,
  renderEmptyComponent,
  flatListProps,
  required
}: Props) => {

  return (
    <>
      <View style={container}>
        <Text style={styles.label}>
               {label}
               {required && <Text style={styles.required}>*</Text>}
             </Text>
        <DropdownElement
          onFocus={() => {
            Keyboard.dismiss();
          }}
          data={data}
          value={value}
          onChange={item => onChange(item)}
          disable={disable}
          dropdownPosition={'bottom'}
          style={[styles.dropdownStyle, dropdownStyle]}
          flatListProps={flatListProps}
          labelField={labelField === undefined ? 'label' : labelField}
          valueField={valueField === undefined ? 'value' : valueField}
          placeholder={placeholder}
          placeholderStyle={styles.placeholderStyle}
          // itemContainerStyle={{backgroundColor: colors.modalBg}}
          selectedTextStyle={styles.inputStyle}
          search={isSearch || false}
          autoScroll={false}
          maxHeight={200}
          minHeight={30}
          keyboardAvoiding={true}
          activeColor={colors.mainColor}
          renderRightIcon={() => {
            return (
              <Image
                source={IMAGES.ic_down}
                style={{
                  width: 10,
                  height: 5,
                  // bottom: 7,
                  // right: -9,
                  tintColor: '#3B4256',
                  // opacity: disable ? 0.6 : 1,
                  resizeMode: 'contain',
                }}
              />
            );
          }}
          renderItem={res => {
            return (
              <View style={styles.rowStyle}>
                <Text style={styles.inputStyle}>{res?.label}</Text>
              </View>
            );
          }}
        />
      </View>
    </>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    ...commonFontStyle(500, 16, colors.black),
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
  inputContainer: {
    borderWidth: 0.5,
    // height: hp(5.8),
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.3),
    borderColor: "#ccc",
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
    ...commonFontStyle(400, 17, colors.black),
  },
  placeholderStyle: {
    flex: 1,
    margin: 0,
    padding: 0,
    marginHorizontal: wp(3),
    ...commonFontStyle(400, 17, '#969595'),
  },

  selectedTextStyle: {
    ...commonFontStyle(600, 25, colors.black),
  },
  dropdownStyle: {
    paddingHorizontal: wp(16),
    borderRadius: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
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
