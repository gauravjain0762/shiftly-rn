import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import {navigateTo, resetNavigation} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';

const CoLogin = () => {
  const {t, i18n} = useTranslation();

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top', 'bottom']}}
      colors={['#FFF8E6', '#F3E1B7']}>
      <Image source={IMAGES.logo1} style={styles.logo} />
      <View style={styles.logincontainer}>
        <View style={styles.container}>
          <Text style={styles.label}>{t('Company Email')}</Text>
          <CustomTextInput
            style={styles.input}
            placeholder="smith@williamson.com"
            placeholderTextColor={colors._7B7878}
          />
          <Text style={styles.label}>{t('Password')}</Text>
          <CustomTextInput
            showRightIcon
            style={styles.passinput}
            containerStyle={styles.inputcontainer}
            placeholderTextColor={colors._7B7878}
            imgStyle={styles.eye}
            placeholder="* * * * * * * * *"
          />
          <Text style={styles.forgote}>{t('Forgot your password?')}</Text>
        </View>
        <View>
          <GradientButton
            type="Company"
            onPress={() => resetNavigation(SCREENS.CoTabNavigator)}
            style={styles.button}
            title="Login"
          />
          <Text style={styles.accoumt}>{t('Don’t have an account?')}</Text>
          <TouchableOpacity onPress={() => navigateTo(SCREENS.CoSignUp)}>
            <Text style={styles.createAccoumt}>
              {t('Create Business Account')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearContainer>
  );
};

export default CoLogin;

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    height: hp(60),
    width: 'auto',
    marginTop: hp(100),
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
    paddingVertical: hp(20),
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
    ...commonFontStyle(400, 18, colors._4A4A4A),
  },
  eye: {
    tintColor: '#CDB682',
  },
  forgote: {
    ...commonFontStyle(400, 18, colors._0D468C),
    textAlign: 'center',
    marginTop: hp(20),
  },
  logincontainer: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: wp(40),
  },
  accoumt: {
    ...commonFontStyle(400, 18, colors._0D468C),
    textAlign: 'center',
    marginBottom: hp(10),
  },
  createAccoumt: {
    ...commonFontStyle(500, 18, colors.black),
    textAlign: 'center',
  },
  button: {
    marginBottom: hp(60),
  },
});
