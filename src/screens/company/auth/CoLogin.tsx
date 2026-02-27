import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  BackHeader,
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import { IMAGES } from '../../../assets/Images';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import {
  emailCheck,
  errorToast,
  navigateTo,
} from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useCompanyLoginMutation } from '../../../api/authApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthData } from '../../../features/companySlice';

const CoLogin = () => {
  const { t } = useTranslation();
  const { fcmToken, } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [companyLogin] = useCompanyLoginMutation();
  const { auth } = useSelector((state: RootState) => state.company);
  const { email, password } = auth;

  const handleLogin = async () => {
    if (!emailCheck(email)) {
      errorToast(t('Please enter a valid email'));
    } else if (!password) {
      errorToast(t('Please enter password'));
    } else {
      const data = {
        email: email.trim(),
        password: password.trim(),
        device_token: fcmToken ?? '',
      };

      try {
        const response = await companyLogin(data).unwrap() as any;

        if (response?.status) {
          console.log('✅ Login success:', response);
          dispatch(setAuthData({ email: '', password: '' }));
        } else {
          errorToast(t(response?.message));
        }
      } catch (err: any) {
        console.log('❌ Login failed:', err);
      }
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{ edges: ['top', 'bottom'] }}
      colors={['#F7F7F7', '#FFFFFF']}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid={true}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(30) }}
        showsVerticalScrollIndicator={false}>
        <BackHeader
          title={''}
          type="company"
          isRight={false}
          containerStyle={styles.header}
        />
        <Image source={IMAGES.newlogo1} style={styles.logo} />
        <View style={styles.logincontainer}>
          <View style={styles.container}>
            <Text style={styles.label}>{t('Company Email')}</Text>
            <CustomTextInput
              inputStyle={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors._7B7878}
              value={email}
              onChangeText={e => {
                dispatch(setAuthData({ email: e, password }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>{t('Password')}</Text>
            <CustomTextInput
              showRightIcon
              value={password}
              inputStyle={styles.passinput}
              containerStyle={styles.inputcontainer}
              placeholderTextColor={colors._7B7878}
              imgStyle={styles.eye}
              placeholder="* * * * * * * * *"
              onChangeText={e => {
                dispatch(setAuthData({ email, password: e }));
              }}
              isPassword
            />
            <Text
              onPress={() => navigateTo(SCREENS.ForgotPassword)}
              style={styles.forgote}>
              {t('Forgot your password?')}
            </Text>
          </View>
          <View>
            <GradientButton
              type="Company"
              onPress={handleLogin}
              style={styles.button}
              title="Login"
            />
            <Text style={styles.accoumt}>{t('New to Shiftly?')}</Text>
            <TouchableOpacity onPress={() => navigateTo(SCREENS.CreateAccount)}>
              <Text style={styles.createAccoumt}>
                {t('Create Your Business Account')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default CoLogin;

const styles = StyleSheet.create({
  logo: {
    marginTop: hp(10),
    alignSelf: 'center',
    resizeMode: 'contain',
    height: hp(140),
    width: wp(140),
  },
  container: {
    marginTop: hp(30),
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
  label: {
    ...commonFontStyle(400, 18, colors._0B3970),
    marginBottom: hp(12),
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
    ...commonFontStyle(400, 18, colors._181818),
  },
  eye: {
    tintColor: colors._0B3970,
  },
  forgote: {
    ...commonFontStyle(400, 18, colors._0D468C),
    textAlign: 'center',
    marginTop: hp(20),
  },
  logincontainer: {
    flex: 1,
    paddingHorizontal: wp(40),
    justifyContent: 'space-around',
  },
  accoumt: {
    ...commonFontStyle(400, 18, colors.black),
    textAlign: 'center',
    marginBottom: hp(10),
  },
  createAccoumt: {
    ...commonFontStyle(500, 18, colors._0D468C),
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  button: {
    marginBottom: hp(60),
  },
  header: {
    paddingTop: hp(10),
    paddingHorizontal: wp(35),
  },
});
