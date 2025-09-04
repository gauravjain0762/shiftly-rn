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

const LoginScreen = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const {fcmToken, language} = useSelector((state: RootState) => state.auth);
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

        const response = await employeeLogin(data).unwrap();
        if (response?.status) {
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
      colors={['#043379', '#041F50']}
      containerStyle={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[AppStyles.flexGrow, {}]}
        showsVerticalScrollIndicator={false}>
        <BackHeader
          title={''}
          type="employe"
          isRight={false}
          containerStyle={styles.header}
        />
        <Image source={IMAGES.logoText} style={styles.logo} />

        <View style={[styles.inputWrapper, {marginBottom: hp(60)}]}>
          <Text style={styles.labelText}>Enter your email to login</Text>

          <CustomTextInput
            placeholder="Email"
            placeholderTextColor={colors._F4E2B8}
            value={email}
            inputStyle={{color: colors._F4E2B8, textTransform: 'lowercase'}}
            onChangeText={e => {
              dispatch(setAuthData({email: e, password}));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={[styles.inputWrapper, {marginBottom: hp(67)}]}>
          <Text style={styles.labelText}>Enter your password</Text>
          <CustomTextInput
            placeholder="Password"
            placeholderTextColor={colors._F4E2B8}
            showRightIcon={true}
            inputStyle={{color: colors._F4E2B8}}
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

        <View style={{marginHorizontal: 35}}>
          {/* <CustomBtn label={t('Login')} onPress={() => {}} /> */}
          <GradientButton
            title={t('Login')}
            onPress={handleLogin} //() => navigateTo(SCREENS.TabNavigator)}
          />
          <Text style={styles.orText}>Or</Text>
          <GradientButton
            // style={styles.btn}
            title={t('Sign Up')}
            onPress={() => navigateTo(SCREENS.SignUp)}
          />
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
    marginBottom: hp(70),
    marginTop: hp(25),
  },
  inputWrapper: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: colors._F4E2B8,
    marginHorizontal: 35,
  },
  labelText: {
    ...commonFontStyle(400, 22, colors.white),
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
    marginBottom: hp(38),
    ...commonFontStyle(400, 18, '#DCDCDC'),
  },
  primaryButton: {
    backgroundColor: '#FBE7BD',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButtonText: {
    ...commonFontStyle(700, 17, '#000'),
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    ...commonFontStyle(500, 15, '#FFFFFF'),
  },
});
