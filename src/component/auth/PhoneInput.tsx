import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet, Image} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {commonFontStyle, hp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import { useTranslation } from 'react-i18next';

const PhoneInput = () => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('AE');
  const [callingCode, setCallingCode] = useState('971');
  const [valid, setValid] = useState(true);
  const {t, i18n} = useTranslation();
  const handlePhoneChange = (text: string) => {
    setPhone(text);
    setValid(/^[2-9]\d{6,9}$/.test(text.replace(/\s/g, ''))); // basic validation
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneRow}>
        <CountryPicker
          countryCode={countryCode}
          withFilter
          withFlag
          flagSize={50}
          onSelect={country => {
            setCountryCode(country.cca2);
            setCallingCode(country.callingCode[0]);
          }}
          containerButtonStyle={styles.countryPicker}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.callingCode}>+{callingCode}</Text>
          <Image
            source={IMAGES.ic_down1}
            style={{width: 12, height: 12, resizeMode: 'contain'}}
          />
        </View>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder="28 364 12"
          keyboardType="phone-pad"
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
          <Text style={styles.errorText}>
            {t("Please enter a valid phone number")}
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
    ...commonFontStyle(400, 22, colors._F4E2B8),
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
    ...commonFontStyle(400, 18, colors.white),
  },
});

export default PhoneInput;
