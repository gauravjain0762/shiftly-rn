// LoginScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppStyles} from '../../../theme/appStyles';
import {
  BackHeader,
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import {
  emailCheck,
  errorToast,
  goBack,
  navigateTo,
  resetNavigation,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useEmployeeLoginMutation} from '../../../api/authApi';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {setAuthData} from '../../../features/employeeSlice';
import {
  clearEmployeeAccount,
  setForcedLogoutBy401,
} from '../../../features/authSlice';
import {ensureFcmToken} from '../../../hooks/notificationHandler';

const LoginScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {fcmToken, language, forcedLogoutBy401} = useSelector(
    (state: RootState) => state.auth,
  );
  console.log('>>>>>>>>>>>>>>>>>>>>>>>. ~ LoginScreen ~ fcmToken:', fcmToken);
  const [employeeLogin] = useEmployeeLoginMutation({});

  const {auth} = useSelector((state: RootState) => state.employee);
  const {email, password} = auth;

  const handleLogin = async () => {
    try {
      if (!emailCheck(email)) {
        errorToast(t('Please enter a valid email'));
      } else if (password === '') {
        errorToast(t('Please enter password'));
      } else {
        const token = await ensureFcmToken(dispatch, fcmToken);
        let data = {
          email: email.trim().toLowerCase(),
          password: password.trim(),
          language: language,
          deviceToken: token,
          deviceType: Platform.OS,
        };
        console.log('🔥 ~ handleLogin ~ data:', data);
        const response: any = await employeeLogin(data).unwrap();
        console.log('🔥 ~ handleLogin ~ response:', response);
        if (response && response.status) {
          dispatch(setAuthData({email: '', password: ''}));
          console.log(response, 'response----');
        }
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <LinearContainer
      colors={[colors._F7F7F7, colors._F7F7F7]}
      containerStyle={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[AppStyles.flexGrow, {}]}
        showsVerticalScrollIndicator={false}>
        <BackHeader
          title={''}
          type="company"
          isRight={false}
          containerStyle={styles.header}
          onBackPress={() => {
            if (forcedLogoutBy401) {
              dispatch(setForcedLogoutBy401(false));
              resetNavigation(SCREENS.SelectRollScreen);
              return;
            }
            goBack();
          }}
        />
        <Image source={IMAGES.newlogo1} style={styles.logo} />

        <View style={styles.inputWrapper}>
          <Text style={styles.labelText}>Email</Text>
          <CustomTextInput
            inputStyle={[
              styles.input,
              {color: colors._0B3970, textTransform: 'lowercase'},
            ]}
            placeholder="Enter your email"
            placeholderTextColor={colors._7B7878}
            value={email}
            onChangeText={e => {
              dispatch(setAuthData({email: e, password}));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.labelText}>Password</Text>
          <CustomTextInput
            placeholder="Enter your password"
            placeholderTextColor={colors._7B7878}
            showRightIcon={true}
            inputStyle={styles.passinput}
            containerStyle={styles.inputcontainer}
            value={password}
            onChangeText={e => {
              dispatch(setAuthData({password: e, email}));
            }}
            isPassword
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigateTo(SCREENS.EmpForgotPassword)}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {/* Primary Login Button */}
          <GradientButton
            title={t('Login')}
            onPress={handleLogin}
            type="Company"
            style={styles.primaryButton}
          />
          <Text style={styles.orText}>Or</Text>
          {/* Secondary Sign Up Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => {
              dispatch(clearEmployeeAccount());
              navigateTo(SCREENS.SignUp);
            }}>
            <Text style={styles.secondaryButtonText}>{t('Sign Up')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(24),
    paddingHorizontal: wp(35),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    height: hp(110),
    width: wp(110),
    resizeMode: 'contain',
    marginBottom: hp(40),
    marginTop: hp(15),
  },
  inputWrapper: {
    marginBottom: hp(20),
    marginHorizontal: 35,
  },
  labelText: {
    ...commonFontStyle(400, 22, colors._0B3970),
    marginBottom: 11,
  },
  inputLabel: {
    ...commonFontStyle(700, 16, '#FBE7BD'),
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors._F4E2B8,
  },
  forgotText: {
    textAlign: 'center',
    marginBottom: hp(25),
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  buttonContainer: {
    marginHorizontal: 35,
    marginTop: hp(10),
  },
  primaryButton: {
    marginBottom: hp(12),
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors._0B3970,
    borderRadius: 100,
    paddingVertical: hp(14),
    paddingHorizontal: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    ...commonFontStyle(400, 22, colors._0B3970),
  },
  orText: {
    textAlign: 'center',
    marginVertical: hp(12),
    ...commonFontStyle(500, 15, colors._0B3970),
  },
  input: {
    ...commonFontStyle(400, 18, colors._181818),
    borderWidth: 2,
    borderColor: colors._234F86,
    borderRadius: 10,
    flex: 1,
    paddingHorizontal: wp(23),
    paddingVertical: hp(18),
    textTransform: 'lowercase',
  },
  inputcontainer: {
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
    paddingHorizontal: wp(23),
    borderColor: colors._234F86,
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? hp(16) : hp(8),
  },
  passinput: {
    flex: 1,
    paddingRight: wp(10),
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  eye: {
    tintColor: colors._0B3970,
  },
});
