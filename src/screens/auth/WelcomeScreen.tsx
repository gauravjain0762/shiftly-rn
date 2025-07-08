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
import {commonFontStyle, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {navigateTo, resetNavigation} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import Onboarding from '../../component/common/Onboarding';
import {LinearContainer} from '../../component';
import useRole from '../../hooks/useRole';

const AppOnboardingData = [
  {
    id: '1',
    title: 'Discover Local Services, Fast',
    description: `Find your next role in Dubai's top hotels, beach clubs, & restaurants. Let's get you hired!Start your Shiftly journey`,
  },
  {
    id: '2',
    title: 'Book Appointments Instantly',
    description:
      'Submit a booking request for the service you need, and we will connect you to verified local providers instantly. Once you confirm your requirements, qualified professionals will be notified, and you will receive quick responses to schedule your appointment.',
  },
  {
    id: '3',
    title: 'Chat with Providers, Directly',
    description:
      'Once your booking is accepted, you can chat directly with the service provider via WhatsApp for easy coordination. No extra steps—just simple, direct communication to confirm your appointment details!',
  },
];

const WelcomeScreen = () => {
  const {t, i18n} = useTranslation();
  const {role} = useRole();
  const onLogin = () => {
    if (role === 'company') {
      resetNavigation(SCREENS.CoStack);
    } else {
      resetNavigation(SCREENS.EmployeeStack);
    }
  };
  return (
    <LinearContainer
      containerStyle={styles.gradient}
      colors={['#0D468C', '#041326']}>
      <StatusBar barStyle="light-content" backgroundColor="#00204A" />
      {/* <View> */}
      <Onboarding
        data={AppOnboardingData}
        // onComplete={handleOnboardingComplete}
      />
      {/* </View> */}

      {/* Buttons */}
      <View style={{width: '90%', alignItems: 'center', marginBottom: 20}}>
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => {
            onLogin();
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
      </View>
    </LinearContainer>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    justifyContent: 'flex-start',
    paddingVertical: 16,
    borderRadius: 30,
    width: '90%',
    marginBottom: 30,
    paddingHorizontal: 49,
    gap: wp(14),
  },
  emailText: {
    ...commonFontStyle(400, 18, colors.black),
  },
  whiteButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 16,
    borderRadius: 30,
    width: '90%',
    marginBottom: 30,
    paddingHorizontal: 49,
    gap: wp(14),
  },
  whiteText: {
    ...commonFontStyle(400, 18, colors.black),
  },
  icon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
});

export default WelcomeScreen;
