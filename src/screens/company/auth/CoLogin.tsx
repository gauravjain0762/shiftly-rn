import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import {
  emailCheck,
  errorToast,
  navigateTo,
  resetNavigation,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useCompanyLoginMutation} from '../../../api/authApi';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CoLogin = () => {
  const {t, i18n} = useTranslation();
  const {fcmToken, language} = useSelector((state: RootState) => state.auth);

  const [companyLogin, {isLoading: loginLoading}] = useCompanyLoginMutation();
  const [authData, setAuthData] = React.useState({
    email: __DEV__ ? 'db@company.com' : '',
    password: __DEV__ ? '123456' : '',
  });

  const handleLogin = async () => {
    if (!emailCheck(authData?.email)) {
      errorToast(t('Please enter a valid email'));
    } else if (authData?.password === '') {
      errorToast(t('Please enter password'));
    } else {
      let data = {
        email: authData?.email.trim(),
        password: authData?.password.trim(),
        // language: language,
        // deviceToken: fcmToken ?? 'ddd',
        // deviceType: Platform.OS,
      };
      console.log('🔥🔥 ~ handleLogin ~ data:', data);
      const response = await companyLogin(data).unwrap();
      // console.log(response, 'response----');
    }
  };
  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top', 'bottom']}}
      colors={['#FFF8E6', '#F3E1B7']}>
      <KeyboardAwareScrollView
        style={{flex: 1}}
        enableOnAndroid={true}
        contentContainerStyle={{flexGrow: 1, paddingBottom: hp(30)}}
        showsVerticalScrollIndicator={false}>
        <Image source={IMAGES.newlogo1} style={styles.logo} />
        <View style={styles.logincontainer}>
          <View style={styles.container}>
            <Text style={styles.label}>{t('Company Email')}</Text>
            <CustomTextInput
              inputStyle={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors._7B7878}
              value={authData?.email}
              onChangeText={e => {
                setAuthData({...authData, email: e});
              }}
            />
            <Text style={styles.label}>{t('Password')}</Text>
            <CustomTextInput
              showRightIcon
              inputStyle={styles.passinput}
              containerStyle={styles.inputcontainer}
              placeholderTextColor={colors._7B7878}
              imgStyle={styles.eye}
              placeholder="* * * * * * * * *"
              onChangeText={e => {
                setAuthData({...authData, password: e});
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
              onPress={handleLogin} //() => resetNavigation(SCREENS.CoTabNavigator)}
              style={styles.button}
              title="Login"
            />
            <Text style={styles.accoumt}>{t('Don’t have an account?')}</Text>
            <TouchableOpacity onPress={() => navigateTo(SCREENS.CreateAccount)}>
              <Text style={styles.createAccoumt}>
                {t('Create Business Account')}
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
    marginTop: hp(50),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  container: {
    marginTop: hp(40),
  },
  input: {
    ...commonFontStyle(400, 18, colors._181818),
    borderWidth: 2,
    borderColor: colors._234F86,
    borderRadius: 10,
    flex: 1,
    paddingHorizontal: wp(23),
    paddingVertical: hp(20),
  },
  label: {
    ...commonFontStyle(400, 18, colors._0B3970),
    marginBottom: hp(12),
  },
  inputcontainer: {
    borderWidth: 2,
    borderColor: colors._234F86,
    borderRadius: 10,
    paddingHorizontal: wp(23),
    paddingVertical: hp(16),
    justifyContent: 'space-between',
  },
  passinput: {
    flex: 1,
    paddingRight: wp(10),
    ...commonFontStyle(400, 18, colors._181818),
  },
  eye: {
    tintColor: '#CDB682',
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
    ...commonFontStyle(400, 18, colors._0D468C),
    textAlign: 'center',
    marginBottom: hp(10),
  },
  createAccoumt: {
    ...commonFontStyle(500, 18, colors.black),
    textAlign: 'center',
  },
  button: {
    marginBottom: hp(60),
  },
});
