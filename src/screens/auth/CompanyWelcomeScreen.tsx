import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { IMAGES } from '../../assets/Images';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { useTranslation } from 'react-i18next';
import {
  navigateTo,
  resetNavigation,
} from '../../utils/commonFunction';
import { SCREENS } from '../../navigation/screenNames';
import CompanyOnboarding from '../../component/common/CompanyOnboarding';
import { BackHeader, LinearContainer } from '../../component';
import auth from '@react-native-firebase/auth';
import CustomImage from '../../component/common/CustomImage';
import { useGetAppDataQuery } from '../../api/dashboardApi';

const CompanyOnboardingData = [
  {
    id: '1',
    image: IMAGES.illustration1,
    title: 'Smart matching. Hires.',
    description: `Automatically match the right profiles based on real job requirements, not just CVs.`,
  },
  {
    id: '2',
    image: IMAGES.illustration2,
    title: 'Interview smarter & faster.',
    description:
      'AI video interview remove scheduling constraints and reduce hiring time',
  },
  {
    id: '3',
    image: IMAGES.illustration3,
    title: 'Advanced assessment technology',
    description:
      'evaluates skills,behavior & cultural fit helping teams hire for long-term success.',
  },
  {
    id: '4',
    image: IMAGES.illustration4,
    title: 'Identify motivated interns and juniors talent',
    description:
      'through behavior, attitude, and soft skills even with limited experience.',
  },
];

const CompanyWelcomeScreen = () => {
  const { t } = useTranslation();
  useGetAppDataQuery({});

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user: any) => {
      if (user) {
        resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
      }
    });

    return unsubscribe;
  }, []);

  const onLogin = () => {
    navigateTo(SCREENS.CoStack);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors._0B3970} />
      <LinearContainer
        containerStyle={styles.gradient}
        colors={[colors._F7F7F7, colors._F7F7F7]}>
        <BackHeader
          title={t('')}
          type="employe"
          isRight={false}
          containerStyle={styles.backHeaderContainer}
        />

        <ScrollView
          bounces={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <CustomImage
            size={110}
            source={IMAGES.newlogo1}
          />
          <CompanyOnboarding data={CompanyOnboardingData} />

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => {
                onLogin();
              }}>
              <Image source={IMAGES.e_icon} style={styles.icon} tintColor={colors.white} />
              <Text style={styles.emailText}>{t('Continue with email')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearContainer>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHeaderContainer: {
    paddingTop: hp(12),
    alignSelf: 'flex-start',
    paddingHorizontal: wp(35),
    tintColor: colors._0B3970,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '90%',
    alignItems: 'center',
    bottom: '15%',
  },
  title: {
    marginTop: 20,
    ...commonFontStyle(500, 14, colors.white),
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 30,
    marginTop: hp(31),
    ...commonFontStyle(600, 17, colors._DADADA),
    marginHorizontal: hp(28),
  },
  dots: {
    flexDirection: 'row',
    marginVertical: hp(35),
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: colors._DADADA,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.coPrimary,
  },
  emailButton: {
    backgroundColor: colors._0B3970,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: hp(16),
    borderRadius: hp(30),
    width: '90%',
    marginBottom: hp(15),
    paddingHorizontal: hp(49),
    gap: wp(14),
  },
  emailText: {
    ...commonFontStyle(400, 18, colors.white),
  },
  icon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
});

export default CompanyWelcomeScreen;

