import React, { useEffect } from 'react';
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
import { IMAGES } from '../../assets/Images';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { useTranslation } from 'react-i18next';
import {
  errorToast,
  navigateTo,
  resetNavigation,
} from '../../utils/commonFunction';
import { SCREENS } from '../../navigation/screenNames';
import EmployeeOnboarding from '../../component/common/EmployeeOnboarding';
import { BackHeader, LinearContainer } from '../../component';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  useEmployeeAppleSignInMutation,
  useEmployeeGoogleSignInMutation,
} from '../../api/authApi';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { jwtDecode } from 'jwt-decode';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateEmployeeAccount, setUserInfo } from '../../features/authSlice';
import { RootState } from '../../store';
import CustomImage from '../../component/common/CustomImage';
import { SafeAreaView } from 'react-native-safe-area-context';

const EmployeeOnboardingData = [
  {
    id: '1',
    image: IMAGES.illustration5,
    title: 'Get hired for who you are.',
    description: `Get hired based on who you are and how you work, not just what’s on your resume.`,
  },
  {
    id: '2',
    image: IMAGES.illustration6,
    title: 'Interview anytime, anywhere.',
    description:
      'Complete your interview on your own time with AI no scheduling, no pressure.',
  },
  {
    id: '3',
    image: IMAGES.illustration7,
    title: 'Advanced assessment technology',
    description:
      'evaluates skills,behavior & cultural fit helping teams hire for long-term success.',
  },
  {
    id: '4',
    image: IMAGES.illustration8,
    title: 'Your first job starts here.',
    description:
      'Whether you’re a student, intern, or recent graduate, get hired based on your po',
  },
];

const EmployeeWelcomeScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { fcmToken } = useSelector((state: RootState) => state.auth);
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
        resetNavigation(SCREENS.EmployeeStack, SCREENS.TabNavigator);
      }
    });

    return unsubscribe;
  }, []);

  const onLogin = () => {
    navigateTo(SCREENS.EmployeeStack);
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { data }: any = userInfo;
      const { idToken } = data;
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

        const response = await employeeGoogleSignIn(socialObj).unwrap() as any;

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
      const { identityToken, fullName, email } = appleAuthRequestResponse;

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

        const response = await employeeAppleSignIn(socialObj).unwrap() as any;
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
      <StatusBar barStyle="light-content" backgroundColor={colors._0B3970} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
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
              size={100}
              source={IMAGES.newlogo1}
            />
            <EmployeeOnboarding data={EmployeeOnboardingData} />

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={styles.emailButton}
                onPress={() => {
                  onLogin();
                }}>
                <Image source={IMAGES.e_icon} style={styles.icon} tintColor={colors.white} />
                <Text style={styles.emailText}>{t('Continue with email')}</Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={handleAppleSignIn}
                  style={styles.whiteButton}>
                  <Image source={IMAGES.a_icon} style={styles.icon} tintColor={colors.white} />
                  <Text style={styles.whiteText}>
                    {t('Continue with Apple')}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleGoogleSignIn}
                style={styles.whiteButton}>
                <Image source={IMAGES.g_icon} style={styles.icon} />
                <Text style={styles.whiteText}>
                  {t('Continue with Google')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearContainer>
      </SafeAreaView>
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
    marginTop: hp(20),
    marginBottom: hp(20),
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
  whiteButton: {
    backgroundColor: colors._0B3970,
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
    ...commonFontStyle(400, 18, colors.white),
  },
  icon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
});

export default EmployeeWelcomeScreen;

