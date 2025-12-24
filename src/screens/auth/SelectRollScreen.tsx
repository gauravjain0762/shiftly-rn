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
  const {setRole} = useRole();

  return (
    <LinearGradient
      colors={[colors._F7F7F7, colors._F7F7F7]}
      style={styles.gradient}>
      <View style={styles.container}>
        <Image source={IMAGES.newlogo1} style={styles.logo} />

        <View style={styles.cardEmployer}>
          <Image source={IMAGES.Seeker} style={styles.icon} />

          <Text style={styles.titleBlack}>
            {t('Hire Hospitality Talent in Minutes.')}
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
          <Image source={IMAGES.Employer} tintColor={colors.black} style={styles.icon} />
          <Text style={styles.titleWhite}>
            {t('Find Your Next Hospitality Job  Fast & Easy.')}
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
    width: wp(150),
    height: hp(150),
    resizeMode: 'contain',
    marginBottom: hp(40),
  },
  cardEmployer: {
    width: '92%',
    alignItems: 'center',
    marginBottom: hp(35),
    borderRadius: hp(20),
    paddingVertical: hp(21),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 3,
  },
  cardJobSeeker: {
    width: '92%',
    alignItems: 'center',
    borderRadius: hp(20),
    paddingVertical: hp(21),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 3,
  },
  icon: {
    width: wp(41),
    height: hp(41),
    marginBottom: hp(23),
  },
  titleBlack: {
    textAlign: 'center',
    marginBottom: hp(5),
    paddingHorizontal: wp(23),
    ...commonFontStyle(700, 19, colors.black),
  },
  titleWhite: {
    textAlign: 'center',
    marginBottom: hp(5),
    marginHorizontal: hp(23),
    ...commonFontStyle(700, 19, colors.black),
  },
  desc: {
    textAlign: 'center',
    marginBottom: hp(16),
    ...commonFontStyle(400, 18, colors.black),
  },
  descWhite: {
    textAlign: 'center',
    marginBottom: hp(16),
    ...commonFontStyle(400, 18, colors.black),
  },
  button: {
    width: '100%',
    borderTopWidth: 0.3,
    alignItems: 'center',
    borderTopColor: colors._104686,
  },
  buttonText: {
    marginTop: hp(14),
    ...commonFontStyle(500, 18, colors.black),
  },
  buttonTextDark: {
    marginTop: hp(14),
    ...commonFontStyle(500, 19, colors.black),
  },
});

export default SelectRollScreen;
