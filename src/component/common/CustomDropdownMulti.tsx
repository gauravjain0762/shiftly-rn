import {
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
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
  /** Optional override for dropdown list max height (used for specific dropdowns) */
  maxDropdownHeight?: number;
  required?: boolean;
  selectedStyle?: any;
  dropdownPosition?: 'top' | 'bottom' | 'auto';
  hideSelectedItems?: boolean;
  labelStyle?: TextStyle;
  searchPlaceholder?: string;
  /** Light theme for dropdown overlay - white bg, dark text (for screens like About Me) */
  lightTheme?: boolean;
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
  maxDropdownHeight,
  required,
  selectedStyle,
  placeholderStyle,
  dropdownPosition,
  hideSelectedItems = false,
  labelStyle,
  searchPlaceholder,
  lightTheme = false,
}: Props) => {
  const dropdownContainerStyle = lightTheme
    ? [styles.containerStyle, styles.containerStyleLight]
    : styles.containerStyle;

  return (
    <>
      <View style={container}>
        {label && (
          <Text style={[styles.label, labelStyle]}>
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
          onChange={items => onChange?.(items)}
          disable={disable}
          dropdownPosition={dropdownPosition ||'bottom'}
          style={[styles.dropdownStyle, dropdownStyle]}
          flatListProps={flatListProps}
          labelField={labelField === undefined ? 'label' : labelField}
          valueField={valueField === undefined ? 'value' : valueField}
          placeholder={placeholder}
          placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
          containerStyle={dropdownContainerStyle}
          selectedTextStyle={styles.inputStyle}
          selectedStyle={[{borderRadius: 20}, selectedStyle]}
          search={isSearch || false}
          searchPlaceholder={searchPlaceholder}
          inputSearchStyle={lightTheme ? styles.searchInputLight : undefined}
          maxHeight={typeof maxDropdownHeight === 'number' ? maxDropdownHeight : 300}
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
            const textColor = lightTheme
              ? (isSelected ? colors._0B3970 : '#333')
              : (isSelected ? '#F4E2B8' : '#DADADA');
            return (
              <View style={styles.item}>
                <Text
                  style={[styles.itemText, {color: textColor}]}>
                  {item?.[labelField || 'label']}
                </Text>
                {isSelected && (
                  <Image
                    source={IMAGES.check_circle}
                    style={[styles.checkIcon, lightTheme && {tintColor: colors._0B3970}]}
                    resizeMode="contain"
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
    width: Dimensions.get('window').width - 48,
    left: 24,
  },
  containerStyleLight: {
    backgroundColor: colors.white,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  searchInputLight: {
    backgroundColor: '#F5F5F5',
    color: '#333',
    borderRadius: 12,
    marginHorizontal: wp(12),
    marginBottom: hp(8),
    marginTop: hp(4),
    paddingVertical: hp(10),
    paddingHorizontal: wp(14),
    fontSize: 16,
    minHeight: 44,
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
    alignItems: 'center',
    paddingVertical: hp(8),
    paddingHorizontal: wp(12),
    marginVertical: hp(4),
  },
  itemText: {
    flex: 1,
    flexShrink: 1,
    marginRight: wp(8),
    paddingRight: wp(4),
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
