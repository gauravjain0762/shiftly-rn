import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {navigateTo} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import useRole from '../../hooks/useRole';

const SelectRollScreen = () => {
  const {t} = useTranslation();
  const {role, setRole} = useRole();

  return (
    <LinearGradient
      colors={[colors._0D468C, colors._041326]}
      style={styles.gradient}>
      <View style={styles.container}>
        <Image source={IMAGES.logoText} style={styles.logo} />

        <View style={styles.cardEmployer}>
          <Image source={IMAGES.Seeker} style={styles.icon} />

          <Text style={styles.titleBlack}>
            {t('Looking for top hospitality talent?')}
          </Text>
          <Text style={styles.desc}>
            {t('Post your shifts and hire faster.')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setRole('company');
              navigateTo(SCREENS.WelcomeScreen);
            }}
            style={[
              styles.button,
              {borderColor: '#000', borderTopWidth: hp(0.2)},
            ]}>
            <Text style={styles.buttonTextDark}>
              {t('Continue as Employer')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardJobSeeker}>
          <Image source={IMAGES.Employer} style={styles.icon} />
          <Text style={styles.titleWhite}>
            {t('Ready to land your next hospitality role?')}
          </Text>
          <Text style={styles.descWhite}>{t('Let’s get started.')}</Text>
          <TouchableOpacity
            onPress={() => {
              setRole('employee');
              navigateTo(SCREENS.WelcomeScreen);
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>{t('Continue as Job Seeker')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(20),
  },
  logo: {
    width: wp(122),
    height: hp(122),
    resizeMode: 'contain',
    marginBottom: hp(23),
  },
  cardEmployer: {
    width: '92%',
    alignItems: 'center',
    marginBottom: hp(60),
    borderRadius: hp(20),
    paddingVertical: hp(21),
    backgroundColor: colors._FBE7BD,
  },
  cardJobSeeker: {
    width: '94%',
    alignItems: 'center',
    borderRadius: hp(20),
    borderWidth: hp(1.5),
    paddingVertical: hp(21),
    borderColor: colors._104686,
    backgroundColor: colors._0B3970,
  },
  icon: {
    width: wp(41),
    height: hp(41),
    marginBottom: hp(23),
  },
  titleBlack: {
    textAlign: 'center',
    marginBottom: hp(8),
    paddingHorizontal: wp(23),
    ...commonFontStyle(700, 19, colors.black),
  },
  titleWhite: {
    textAlign: 'center',
    marginBottom: hp(8),
    marginHorizontal: hp(23),
    ...commonFontStyle(700, 19, colors.white),
  },
  desc: {
    textAlign: 'center',
    marginBottom: hp(22),
    ...commonFontStyle(400, 18, colors.black),
  },
  descWhite: {
    textAlign: 'center',
    marginBottom: hp(20),
    ...commonFontStyle(400, 18, colors.white),
  },
  button: {
    width: '100%',
    borderTopWidth: 1,
    alignItems: 'center',
    borderTopColor: colors._104686,
  },
  buttonText: {
    marginTop: hp(17),
    ...commonFontStyle(500, 18, colors.white),
  },
  buttonTextDark: {
    marginTop: hp(17),
    ...commonFontStyle(500, 19, colors.black),
  },
});

export default SelectRollScreen;
