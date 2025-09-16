import React, {FC, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageStyle,
  TextProps,
  TextStyle,
  TextInputProps,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {commonFontStyle} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import {useTranslation} from 'react-i18next';

type picker = {
  callingCodeStyle?: TextStyle;
  downIcon?: ImageStyle;
  callingCode?: string;
  phone?: string;
  onPhoneChange?: any;
  phoneStyle?: TextStyle;
  onCallingCodeChange?: any;
  placeholder?: string;
  countryCode?: string | any;
  category?: 'Company' | 'Employee';
} & TextProps &
  TextInputProps;

const PhoneInput: FC<picker> = ({
  callingCodeStyle,
  downIcon,
  callingCode,
  phone,
  onPhoneChange,
  onCallingCodeChange,
  phoneStyle,
  placeholder,
  countryCode,
  category = 'Company',
  ...TextInputProps
}) => {
  const [showModal, setShowModal] = useState(false);
  const [valid, setValid] = useState(true);
  const {t, i18n} = useTranslation();
  const handlePhoneChange = (text: string) => {
    onPhoneChange?.(text);
    setValid(/^[2-9]\d{6,9}$/.test(text.replace(/\s/g, '')));
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneRow}>
        <CountryPicker
          visible={showModal}
          countryCode={countryCode}
          withFilter
          withFlag
          withCallingCode
          flagSize={50}
          onSelect={country => {
            onCallingCodeChange?.(country);
          }}
          onClose={() => {
            setShowModal(false);
          }}
          containerButtonStyle={styles.countryPicker}
        />
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}
          style={{flexDirection: 'row', alignItems: 'center', top: 2}}>
          <Text style={[styles.callingCode, callingCodeStyle]}>
            +{callingCode}
          </Text>
          <Image
            source={IMAGES.ic_down1}
            style={[{width: 12, height: 12, resizeMode: 'contain'}, downIcon]}
          />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, phoneStyle]}
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder={placeholder || '28 364 12'}
          keyboardType="phone-pad"
          {...TextInputProps}
        />
        {valid && phone?.length > 8 && (
          <Image
            source={IMAGES.right}
            style={{width: 22, height: 22, resizeMode: 'contain'}}
          />
        )}
      </View>
      <View style={styles.underline} />
      {!valid && (
        <View style={styles.errorRow}>
          <Image
            source={IMAGES.error_icon}
            style={{width: 31, height: 28, resizeMode: 'contain'}}
          />
          <Text
            style={[
              styles.errorText,
              {color: category === 'Employee' ? colors.white : colors._3D3D3D},
            ]}>
            {t('Please enter a valid phone number')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    // backgroundColor: '#03386E',
    marginTop: 55,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryPicker: {
    marginRight: -4,
  },
  callingCode: {
    ...commonFontStyle(400, 22, colors._F4E2B8),
    marginRight: 8,
  },
  input: {
    ...commonFontStyle(400, 22, colors._FBE7BD),
    flex: 1,
    marginLeft: 24,
  },
  underline: {
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    marginTop: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  errorIcon: {
    fontSize: 16,
    color: 'red',
    marginRight: 6,
  },
  errorText: {
    marginLeft: 6,
    ...commonFontStyle(400, 18, colors._3D3D3D),
  },
});

export default PhoneInput;
