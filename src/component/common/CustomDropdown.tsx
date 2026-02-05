import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
  View,
  Platform,
  Keyboard,
  ImageURISource,
  ImageStyle,
} from 'react-native';
import React, { ReactNode, useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { colors } from '../../theme/colors';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { Dropdown as DropdownElement } from 'react-native-element-dropdown';
import { IMAGES } from '../../assets/Images';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';

interface Props extends DropdownProps<any> {
  title?: string;
  extraStyle?: ViewStyle;
  onPress?: () => void;
  titleColor?: any;
  type?: 'blue' | 'gray';
  disable?: boolean;
  disabled?: boolean;
  leftIcon?: any;
  data?: any;
  label?: any;
  value?: any;
  onChange?: (item: any) => void;
  isSearch?: any;
  inputContainer?: any;
  container?: ViewStyle;
  placeholder?: any;
  dropdownStyle?: any;
  mendate?: boolean;
  subStyle?: boolean;
  labelField?: string;
  valueField?: string;
  minimumDate?: string;
  dropIcon?: string;
  dateMode?: string;
  renderRightIcon?: ImageURISource;
  RightIconStyle?: ImageStyle;
  onDropdownOpen?: () => void;
  onDropdownClose?: () => void;
  dropdownPosition?: 'top' | 'bottom' | "auto";
  forceClose?: boolean;
  required?: boolean;
  datePicker?: any;
  icon?: any;
  renderEmptyComponent?: any;
  itemTextStyle?: any;
}

export interface CustomDropdownRef {
  close: () => void;
}

const CustomDropdown = forwardRef<CustomDropdownRef, Props>(({
  data,
  value,
  onChange = () => { },
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
  required,
  renderRightIcon,
  RightIconStyle,
  onDropdownOpen,
  onDropdownClose,
  dropdownPosition,
  forceClose,
  ...props
}, ref) => {
  const dropdownRef = useRef<any>(null);
  // Use ref to track value without causing rerenders of renderItem
  const valueRef = useRef(value);
  valueRef.current = value;

  useImperativeHandle(ref, () => ({
    close: () => {
      dropdownRef.current?.close?.();
    },
  }));

  const handleChange = (item: any) => {
    onChange(item);
    onDropdownClose?.();
  };

  // Memoize renderItem to prevent re-renders from causing dropdown to open
  const memoizedRenderItem = useCallback((res: any) => {
    const isSelected = String(res?.value) === String(valueRef.current);
    return (
      <View style={styles.rowStyle}>
        <Text
          style={[
            styles.itemTextStyle,
            props.itemTextStyle,
            { color: isSelected ? '#C9B68B' : '#DADADA' },
          ]}>
          {res?.label}
        </Text>
      </View>
    );
  }, [props.itemTextStyle]);

  return (
    <>
      <View style={container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
        )}
        <DropdownElement
          ref={dropdownRef}
          onFocus={() => {
            Keyboard.dismiss();
            onDropdownOpen?.();
          }}
          data={data}
          value={String(value)}
          onChange={handleChange}
          disable={disable}
          dropdownPosition={dropdownPosition || 'bottom'}
          style={[styles.dropdownStyle, dropdownStyle]}
          flatListProps={flatListProps}
          labelField={labelField === undefined ? 'label' : labelField}
          valueField={valueField === undefined ? 'value' : valueField}
          placeholder={placeholder}
          placeholderStyle={styles.placeholderStyle}
          containerStyle={styles.containerStyle}
          selectedTextStyle={styles.inputStyle}
          search={isSearch || false}
          autoScroll={false}
          maxHeight={200}
          minHeight={30}
          activeColor={'transparent'}
          renderRightIcon={() => {
            return (
              <Image
                source={renderRightIcon || IMAGES.down1}
                style={[
                  {
                    width: 12,
                    height: 13,
                    resizeMode: 'contain',
                    tintColor: '#0B3970',
                  },
                  RightIconStyle,
                ]}
              />
            );
          }}
          renderItem={memoizedRenderItem}
          {...props}
        />
      </View>
    </>
  );
});

export default CustomDropdown;

const styles = StyleSheet.create({
  label: {
    marginTop: 20,
    marginBottom: 12,
    ...commonFontStyle(400, 18, '#050505'),
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
    ...commonFontStyle(400, 16, colors._050505),
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
    // height: hp(30),
    marginHorizontal: wp(16),
    marginVertical: hp(8),
  },
  imageStyle1: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 6,
  },
  itemTextStyle: {
    ...commonFontStyle(400, 16, colors._050505),
  },
});
