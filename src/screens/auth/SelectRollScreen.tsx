import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {navigateTo} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import useRole from '../../hooks/useRole';

const SelectRollScreen = () => {
  const {t, i18n} = useTranslation();
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
            style={[styles.button, {borderColor: '#000', borderTopWidth: 0.5}]}>
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
    marginHorizontal: 20,
  },
  logo: {
    width: 121,
    height: 122,
    resizeMode: 'contain',
    marginBottom: 23,
  },
  cardEmployer: {
    backgroundColor: colors._FBE7BD,
    borderRadius: 20,
    paddingVertical: 21,
    width: '92%',
    alignItems: 'center',
    marginBottom: 60,
  },
  cardJobSeeker: {
    backgroundColor: colors._0B3970,
    borderRadius: 20,
    paddingVertical: 21,
    width: '94%',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 23,
    width: 41,
    height: 41,
  },
  titleBlack: {
    ...commonFontStyle(700, 19, colors.black),
    textAlign: 'center',
    marginBottom: 10,
  },
  titleWhite: {
    ...commonFontStyle(700, 19, colors.white),
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 68,
  },
  desc: {
    ...commonFontStyle(400, 18, colors.black),
    textAlign: 'center',
    marginBottom: 20,
  },
  descWhite: {
    ...commonFontStyle(400, 18, colors.white),
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    borderTopWidth: 1,
    borderTopColor: colors._104686,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 17,
    ...commonFontStyle(500, 18, colors.white),
  },
  buttonTextDark: {
    marginTop: 17,
    ...commonFontStyle(500, 19, colors.black),
  },
});

export default SelectRollScreen;
