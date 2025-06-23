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

const WelcomeScreen = () => {
  const {t, i18n} = useTranslation();
  return (
    <LinearGradient
      colors={[colors._0D468C, colors._041326]}
      style={styles.gradient}>
      <SafeAreaView style={styles.container1}>
        <StatusBar barStyle="light-content" backgroundColor="#00204A" />
        {/* Logo */}
        <Image source={IMAGES.logog} style={styles.logo} />

        {/* Illustration */}
        <Image
          source={IMAGES.login_bg}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Description */}
        <Text style={styles.subtitle}>
          {t(
            "Find your next role in Dubai's top hotels, beach clubs, &restaurants.Let's get you hired! Start your Shiftly journey",
          )}
        </Text>

        {/* Dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => {
            navigateTo(SCREENS.LoginScreen);
          }}>
          {/* <Icon name="envelope" size={16} color="#000" /> */}
          <Image source={IMAGES.e_icon} style={styles.icon} />
          <Text style={styles.emailText}>{t('Continue with email')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whiteButton}>
          <Image source={IMAGES.a_icon} style={styles.icon} />
          <Text style={styles.whiteText}>{t('Continue with Apple')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whiteButton}>
          <Image source={IMAGES.g_icon} style={styles.icon} />
          <Text style={styles.whiteText}>{t('Continue with Google')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 60,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  illustration: {
    width: '100%',
    height: 220,
  },
  title: {
    marginTop: 20,
    ...commonFontStyle(500, 14, colors.white),
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 31,
    ...commonFontStyle(600, 17, colors._DADADA),
    marginHorizontal: 28,
  },
  dots: {
    flexDirection: 'row',
    marginVertical: 41,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: colors._DADADA,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors._F4E2B8,
  },
  emailButton: {
    backgroundColor: colors._F4E2B8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    width: '90%',
    marginBottom: 15,
    paddingHorizontal: 49,
  },
  emailText: {
    ...commonFontStyle(400, 18, colors.black),
  },
  whiteButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    width: '90%',
    marginBottom: 15,
    paddingHorizontal: 49,
  },
  whiteText: {
    ...commonFontStyle(400, 18, colors.black),
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    position: 'absolute',
    left: 49,
  },
});

export default WelcomeScreen;
