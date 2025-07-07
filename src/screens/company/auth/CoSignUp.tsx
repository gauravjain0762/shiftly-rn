import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import CustomSwitch from '../../../component/common/CustomSwitch';
import {navigationRef} from '../../../navigation/RootContainer';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';

const CoSignUp = () => {
  const {t, i18n} = useTranslation();
  const [on, setOn] = useState(false);

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top', 'bottom']}}
      colors={['#FFF8E6', '#F3E1B7']}>
      <Image source={IMAGES.logo1} style={styles.logo} />
      <View style={styles.logincontainer}>
        <View style={styles.container}>
          <Text style={styles.label}>{t('Full Name')}</Text>
          <CustomTextInput
            style={styles.input}
            placeholder="Smith Williamson"
          />
          <Text style={styles.label}>{t('Company Email')}</Text>
          <CustomTextInput
            style={styles.input}
            placeholder="smith@williamson.com"
          />
          <Text style={styles.label}>{t('Password')}</Text>
          <CustomTextInput
            showRightIcon
            style={styles.passinput}
            containerStyle={styles.inputcontainer}
            imgStyle={styles.eye}
            placeholder="* * * * * * * * *"
          />
          <View style={styles.switchComponents}>
            <CustomSwitch isOn={on} setIsOn={setOn} />
            <View style={styles.policyText}>
              <Text style={styles.policy}>
                {'I agree with the Terms & Conditions and Privacy & Policy'}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <GradientButton
            type="Company"
            onPress={() => navigateTo(SCREENS.CreateAccount)}
            style={styles.button}
            title={'Create my account'}
          />
          <TouchableOpacity
            onPress={() => navigationRef.goBack()}
            style={styles.login}>
            <Text style={styles.already}>{'A already have an account'}</Text>
            <Image source={IMAGES.rightArrow} style={styles.rightArrow} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearContainer>
  );
};

export default CoSignUp;

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    height: hp(60),
    width: 'auto',
    marginTop: hp(100),
  },
  logincontainer: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: wp(40),
  },
  container: {
    marginTop: hp(50),
  },
  input: {
    ...commonFontStyle(400, 18, colors._7B7878),
    borderWidth: 2,
    borderColor: colors._234F86,
    borderRadius: 10,
    flex: 1,
    paddingHorizontal: wp(23),
    paddingVertical: hp(16),
  },
  label: {
    ...commonFontStyle(400, 18, colors._0B3970),
    marginBottom: hp(12),
  },
  inputcontainer: {
    borderWidth: 2,
    borderColor: colors._234F86,
    borderRadius: 10,
    paddingHorizontal: wp(23),
    paddingVertical: hp(16),
    justifyContent: 'space-between',
  },
  passinput: {
    ...commonFontStyle(400, 18, colors._7B7878),
  },
  eye: {
    tintColor: '#CDB682',
  },
  switchComponents: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(16),
    marginTop: hp(30),
  },
  policyText: {
    flex: 1,
  },
  policy: {
    ...commonFontStyle(400, 14, colors._0B3970),
  },
  button: {},
  rightArrow: {
    width: wp(14),
    height: wp(14),
    resizeMode: 'contain',
  },
  login: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(14),
    alignSelf: 'center',
    marginTop: hp(33),
  },
  already: {
    ...commonFontStyle(600, 18, colors._0B3970),
  },
});
