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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CoSignUp = () => {
  const {t, i18n} = useTranslation();
  const [on, setOn] = useState(false);

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top', 'bottom']}}
      colors={['#FFF8E6', '#F3E1B7']}>
      <KeyboardAwareScrollView>
        <Image source={IMAGES.logo1} style={styles.logo} />
        <View style={styles.logincontainer}>
          <View style={styles.container}>
            <Text style={styles.label}>{t('Full Name')}</Text>
            <CustomTextInput
              inputStyle={styles.input}
              placeholder="Smith Williamson"
              placeholderTextColor={colors._7B7878}
            />
            <Text style={styles.label}>{t('Company Email')}</Text>
            <CustomTextInput
              inputStyle={styles.input}
              placeholder="smith@williamson.com"
              placeholderTextColor={colors._7B7878}
            />
            <Text style={styles.label}>{t('Password')}</Text>
            <CustomTextInput
              showRightIcon
              inputStyle={styles.passinput}
              containerStyle={styles.inputcontainer}
              imgStyle={styles.eye}
              placeholder="* * * * * * * *"
              placeholderTextColor={colors._7B7878}
              isPassword
            />
            <View style={styles.switchComponents}>
              <CustomSwitch
                isOn={on}
                thumbColor={colors.white}
                inActiveColor={colors._2D5486}
                activeColor={'#ccc'}
                setIsOn={setOn}
                switchStyle={styles.switch}
                thumbStyle={styles.thumbStyle}
              />
              <View style={styles.policyText}>
                <Text style={styles.policy}>{t('I agree with the ')}</Text>
                <TouchableOpacity>
                  <Text style={[styles.underLine, styles.policy]}>
                    {t('Terms & Conditions ')}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.policy}>{t('and')}</Text>
                <TouchableOpacity>
                  <Text style={[styles.underLine, styles.policy]}>
                    {t(' Privacy & Policy')}
                  </Text>
                </TouchableOpacity>
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
      </KeyboardAwareScrollView>
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
    ...commonFontStyle(400, 18, colors._4A4A4A),
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
    ...commonFontStyle(400, 24, colors._4A4A4A),
  },
  eye: {
    tintColor: '#CDB682',
  },
  switchComponents: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(16),
    marginVertical: hp(30),
  },
  policyText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  switch: {
    width: wp(53),
    height: hp(34),
    padding: 5,
    borderRadius: 100,
  },
  thumbStyle: {
    width: wp(24),
    height: wp(24),
  },
  underLine: {
    textDecorationLine: 'underline',
  },
});
