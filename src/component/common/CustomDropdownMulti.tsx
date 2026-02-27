import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  View,
  Keyboard,
} from 'react-native';
import React from 'react';
import {colors} from '../../theme/colors';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {MultiSelect} from 'react-native-element-dropdown';
import {IMAGES} from '../../assets/Images';

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
  onChange?: (value: any) => void;
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
  placeholderStyle?: any;
  flatListProps?: any;
  required?: boolean;
  selectedStyle?: any;
  dropdownPosition?: 'top' | 'bottom' | 'auto';
  hideSelectedItems?: boolean;
};

const CustomDropdownMulti = ({
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
  flatListProps,
  required,
  selectedStyle,
  placeholderStyle,
  dropdownPosition,
  hideSelectedItems = false,
}: Props) => {
  return (
    <>
      <View style={container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
        )}
        <MultiSelect
          onFocus={() => {
            Keyboard.dismiss();
          }}
          data={data}
          value={value}
          // onChange={item => onChange(item)}
          onChange={items => onChange?.(items)}
          disable={disable}
          dropdownPosition={dropdownPosition ||'bottom'}
          style={[styles.dropdownStyle, dropdownStyle]}
          flatListProps={flatListProps}
          labelField={labelField === undefined ? 'label' : labelField}
          valueField={valueField === undefined ? 'value' : valueField}
          placeholder={placeholder}
          placeholderStyle={[styles.placeholderStyle,placeholderStyle]}
          // itemContainerStyle={styles.containerStyle}
          containerStyle={styles.containerStyle}
          selectedTextStyle={styles.inputStyle}
          selectedStyle={[{borderRadius: 20}, selectedStyle]}
          search={isSearch || false}
          maxHeight={200}
          minHeight={30}
          keyboardAvoiding={true}
          activeColor={'transparent'}
          renderSelectedItem={
            hideSelectedItems
              ? () => <View style={styles.hiddenSelectedItem} />
              : undefined
          }
          renderRightIcon={() => {
            return (
              <Image
                source={IMAGES.down1}
                style={{
                  width: 12,
                  tintColor: '#0B3970',
                  height: 13,
                  resizeMode: 'contain',
                }}
              />
            );
          }}
          renderItem={(item: any) => {
            const isSelected = value?.includes(item?.[valueField || 'value']);
            return (
              <View style={styles.item}>
                <Text
                  style={[
                    styles.itemText,
                    {color: isSelected ? '#F4E2B8' : '#DADADA'},
                  ]}>
                  {item?.[labelField || 'label']}
                </Text>
                {isSelected && (
                  <Image
                    source={
                      IMAGES.check_circle // ✔ filled icon
                    }
                    style={styles.checkIcon}
                  />
                )}
              </View>
            );
          }}
        />
      </View>
    </>
  );
};

export default CustomDropdownMulti;

const styles = StyleSheet.create({
  label: {
    marginTop: 20,
    marginBottom: 12,
    ...commonFontStyle(500, 16, colors._0B3970),
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
    ...commonFontStyle(400, 14, colors._0B3970),
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

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: hp(1.5),
    // marginHorizontal: wp(2),
    // borderBottomWidth: 0.5,
    // borderColor: '#1E5BA1',
    marginHorizontal: wp(16),
    marginVertical: hp(8),
  },
  itemText: {
    ...commonFontStyle(400, 16, '#FFFFFF'),
  },
  checkIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  hiddenSelectedItem: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});
