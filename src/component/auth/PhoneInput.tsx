import React, { FC, useState, useEffect } from 'react';
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
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import CountryPicker from 'react-native-country-picker-modal';
import { commonFontStyle, hp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import { useTranslation } from 'react-i18next';
import { callingCodeToCountryCode } from '../../utils/countryFlags';

// Reverse mapping: countryCode to callingCode
const countryCodeToCallingCode: { [key: string]: string } = Object.entries(
  callingCodeToCountryCode
).reduce((acc, [code, country]) => {
  acc[country] = code;
  return acc;
}, {} as { [key: string]: string });

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
  const [detectedCountry, setDetectedCountry] = useState<string>('AE');
  const [detectedCallingCode, setDetectedCallingCode] = useState<string>('971');
  const { t } = useTranslation();

  // Auto-detect country on component mount - REMOVED
  // useEffect(() => {
  //   detectUserCountry();
  // }, []);

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length > 13) {
      ReactNativeHapticFeedback.trigger('impactMedium', { enableVibrateFallback: true });
    }
    const formatted = formatPhoneNumber(text, 13);
    onPhoneChange?.(formatted);

    // Check if we have the expected number of digits
    const formattedDigits = formatted.replace(/\D/g, '');
    const isValidLength = formattedDigits.length >= 5 && formattedDigits.length <= 13;
    setValid(isValidLength && new RegExp(`^\\d{5,13}$`).test(formattedDigits));
  };

  const formatPhoneNumber = (value: string, maxDigits: number = 13) => {
    const digits = value.replace(/\D/g, '').slice(0, maxDigits);

    if (currentCallingCode === '971') {
      // UAE format: XX XXX XXXX (9 digits)
      if (digits.length <= 2) {
        return digits;
      }
      if (digits.length <= 5) {
        return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      }
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    } else {
      // Generic format: XX XXX XXXXX or just space every 3-4? 
      // Keeping it simple for variable length
      if (digits.length <= 2) {
        return digits;
      }
      if (digits.length <= 5) {
        return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      }
      if (digits.length <= 9) {
        return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      }
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)} ${digits.slice(9)}`;
    }
  };


  const currentCountryCode = countryCode || detectedCountry;
  const currentCallingCode = callingCode || detectedCallingCode;
  // const expectedDigits = currentCallingCode === '971' ? 9 : 10;
  const maxInputLength = 18; // Allow enough space for 13 digits + spaces

  return (
    <View style={styles.container}>
      <View style={styles.phoneRow}>
        <CountryPicker
          visible={showModal}
          countryCode={currentCountryCode}
          withFilter
          withFlag
          withCallingCode
          flagSize={50}
          modalProps={{
            animationType: 'slide',
            transparent: true,
            presentationStyle: 'overFullScreen',
          }}
          onSelect={country => {
            const selectedCallingCode = country.callingCode?.[0] || '971';

            setDetectedCountry(country.cca2);
            setDetectedCallingCode(selectedCallingCode);

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
          style={{ flexDirection: 'row', alignItems: 'center', top: 2 }}>
          <Text style={[styles.callingCode, callingCodeStyle]}>
            +{currentCallingCode}
          </Text>
          <Image
            source={IMAGES.ic_down1}
            tintColor={colors._0B3970}
            style={[{ width: 12, height: 12, resizeMode: 'contain' }, downIcon]}
          />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, phoneStyle]}
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder={currentCallingCode === '971' ? '50 123 4567' : '52 519 53665'}
          keyboardType="phone-pad"
          maxLength={maxInputLength}
          {...TextInputProps}
        />
        {valid && phone && phone.replace(/\D/g, '').length >= 5 && phone.replace(/\D/g, '').length <= 13 && (
          <Image
            source={IMAGES.right}
            tintColor={colors.green}
            style={{ width: 22, height: 22, resizeMode: 'contain' }}
          />
        )}
      </View>
      <View style={styles.underline} />
      {!valid && (
        <View style={styles.errorRow}>
          <Image
            source={IMAGES.error_icon}
            style={{ width: 31, height: 28, resizeMode: 'contain' }}
          />
          <Text
            style={[
              styles.errorText,
              { color: category === 'Employee' ? colors._3D3D3D : colors._3D3D3D },
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
    marginTop: hp(0),
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryPicker: {
    marginRight: -4,
  },
  callingCode: {
    marginRight: 8,
    ...commonFontStyle(400, 22, colors._050505),
  },
  input: {
    ...commonFontStyle(400, 22, colors._050505),
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