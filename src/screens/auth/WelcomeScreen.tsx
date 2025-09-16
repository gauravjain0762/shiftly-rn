import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {useTranslation} from 'react-i18next';
import {
  errorToast,
  navigateTo,
  resetNavigation,
} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import Onboarding from '../../component/common/Onboarding';
import {BackHeader, LinearContainer} from '../../component';
import useRole from '../../hooks/useRole';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  useEmployeeAppleSignInMutation,
  useEmployeeGoogleSignInMutation,
} from '../../api/authApi';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {jwtDecode} from 'jwt-decode';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {setCreateEmployeeAccount, setUserInfo} from '../../features/authSlice';
import {RootState} from '../../store';

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
  const {role} = useRole();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {fcmToken} = useSelector((state: RootState) => state.auth);
  const [employeeGoogleSignIn] = useEmployeeGoogleSignInMutation({});
  const [employeeAppleSignIn] = useEmployeeAppleSignInMutation({});

  const updateSignupData = (
    updates: Partial<{
      step: number;
      name: string;
      email: string;
      pin: string;
      timer: number;
      showModal: boolean;
      imageModal: boolean;
      selected: string;
      selected1: string;
      selected2: string;
      selected3: string;
      dob: string;
      isPickerVisible: boolean;
      open: boolean;
      full_password: string | undefined;
      otp: string[] | undefined;
      phone: string;
      phone_code: string;
      describe: string;
      picture: string;
      countryCode: any | string;
      googleId: string;
      appleId: string;
    }>,
  ) => {
    dispatch(setCreateEmployeeAccount(updates));
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user: any) => {
      if (user) {
        resetNavigation(
          role === 'company' ? SCREENS.CoStack : SCREENS.EmployeeStack,
          role === 'company' ? SCREENS.CoTabNavigator : SCREENS.TabNavigator,
        );
      }
    });

    return unsubscribe;
  }, []);

  const onLogin = () => {
    if (role === 'company') {
      navigateTo(SCREENS.CoStack);
    } else {
      navigateTo(SCREENS.EmployeeStack);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {data}: any = userInfo;
      const {idToken} = data;
      if (idToken) {
        let socialObj: any = {
          name: data.user.name,
          email: data.user.email,
          device_type: Platform.OS,
          googleId: idToken,
          device_token: fcmToken ?? 'ddd',
        };

        updateSignupData({
          step: 4,
          ...socialObj,
        });

        const response = await employeeGoogleSignIn(socialObj).unwrap();
        console.log('🔥🔥 ~ handleFinishSetup ~ Google res:', response?.data);

        if (response?.data?.user?.phone_verified_at !== null) {
          resetNavigation(SCREENS.EmployeeStack, SCREENS.TabNavigator);
        } else {
          resetNavigation(SCREENS.EmployeeStack, SCREENS.SignUp, {
            isGoogleAuth: true,
          });
        }
        dispatch(setUserInfo(response?.data?.user));
      }
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the sign-in flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        errorToast('Google Sign-In failed. Please try again.');
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }
      const {identityToken, fullName, email} = appleAuthRequestResponse;

      if (identityToken) {
        const decoded: any = jwtDecode(identityToken);

        var str = decoded?.email || '';
        str = str.split('@');
        let socialObj = {
          name: fullName?.givenName || str[0],
          email: email || decoded?.email,
          appleId: appleAuthRequestResponse.user,
          device_type: Platform.OS,
          devce_token: fcmToken ?? 'ddd',
        };

        updateSignupData({
          step: 4,
          ...socialObj,
        });

        const response = await employeeAppleSignIn(socialObj).unwrap();
        console.log("🔥🔥 ~ handleAppleSignIn ~ response:", response)
        if (response?.data?.user?.phone_verified_at !== null) {
          resetNavigation(SCREENS.EmployeeStack, SCREENS.TabNavigator);
        } else {
          resetNavigation(SCREENS.EmployeeStack, SCREENS.SignUp, {
            isAppleAuth: true,
          });
        }
        dispatch(setUserInfo(response?.data?.user));
      }
    } catch (error: any) {
      console.log('onAppleButtonPress => error => ', error);
      errorToast(
        error?.message || error?.data?.message || 'Apple Sign-In failed',
      );
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#00204A" />
      <LinearContainer
        containerStyle={styles.gradient}
        colors={['#0D468C', '#041326']}>
        <BackHeader
          title={t('')}
          type="employe"
          isRight={false}
          containerStyle={styles.backHeaderContainer}
        />

        <ScrollView
          style={styles.scrollView}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Onboarding data={AppOnboardingData} role={role ?? undefined} />

          <View
            style={[
              styles.buttonWrapper,
              {bottom: role === 'company' ? '15%' : '3%'},
            ]}>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => {
                onLogin();
              }}>
              <Image source={IMAGES.e_icon} style={styles.icon} />
              <Text style={styles.emailText}>{t('Continue with email')}</Text>
            </TouchableOpacity>

            <>
              {role === 'employee' && Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={handleAppleSignIn}
                  style={styles.whiteButton}>
                  <Image source={IMAGES.a_icon} style={styles.icon} />
                  <Text style={styles.whiteText}>
                    {t('Continue with Apple')}
                  </Text>
                </TouchableOpacity>
              )}

              {role === 'employee' && (
                <TouchableOpacity
                  onPress={handleGoogleSignIn}
                  style={styles.whiteButton}>
                  <Image source={IMAGES.g_icon} style={styles.icon} />
                  <Text style={styles.whiteText}>
                    {t('Continue with Google')}
                  </Text>
                </TouchableOpacity>
              )}
            </>
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
    paddingTop: hp(24),
    alignSelf: 'flex-start',
    paddingHorizontal: wp(35),
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
    backgroundColor: colors._F4E2B8,
  },
  emailButton: {
    backgroundColor: colors._F4E2B8,
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
    ...commonFontStyle(400, 18, colors.black),
  },
  whiteButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: hp(16),
    borderRadius: hp(30),
    width: '90%',
    marginBottom: hp(15),
    paddingHorizontal: wp(49),
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
