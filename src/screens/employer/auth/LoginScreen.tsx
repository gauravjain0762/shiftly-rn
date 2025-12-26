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
  navigateTo,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useEmployeeLoginMutation} from '../../../api/authApi';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {setAuthData} from '../../../features/employeeSlice';
import {
  clearEmployeeAccount,
} from '../../../features/authSlice';

const LoginScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {fcmToken, language} = useSelector((state: RootState) => state.auth);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>. ~ LoginScreen ~ fcmToken:", fcmToken)
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
        let data = {
          email: email.trim().toLowerCase(),
          password: password.trim(),
          language: language,
          deviceToken: fcmToken ?? 'ddd',
          deviceType: Platform.OS,
        };
        console.log(">>>>>>>>>>>>> ~ handleLogin ~ data:", data)

        const response: any = await employeeLogin(data).unwrap();
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
        />
        <Image source={IMAGES.newlogo1} style={styles.logo} />

        <View style={styles.inputWrapper}>
          <Text style={styles.labelText}>Email</Text>

          <CustomTextInput
            placeholder="Enter your email"
            placeholderTextColor={colors._7B7878}
            value={email}
            inputStyle={{color: colors._0B3970, textTransform: 'lowercase'}}
            onChangeText={e => {
              dispatch(setAuthData({email: e, password}));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.labelText}>Password</Text>
          <CustomTextInput
            placeholder="Enter your password"
            placeholderTextColor={colors._7B7878}
            showRightIcon={true}
            inputStyle={{color: colors._0B3970}}
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
    marginBottom: hp(30),
    borderBottomWidth: 1,
    borderBottomColor: colors._0B3970,
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
});
