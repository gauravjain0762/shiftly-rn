import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import {navigationRef} from '../../../navigation/RootContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {
  errorToast,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {useAppDispatch} from '../../../redux/hooks';
import {RootState} from '../../../store';
import {useSelector} from 'react-redux';
import {
  useCompanyChangePasswordMutation,
  useCompanyForgotPasswordMutation,
  useCompanyOTPVerifyMutation,
  useCompanyResendOTPMutation,
  useEmployeeForgotPasswordMutation,
  useEmployeeOTPVerifyMutation,
} from '../../../api/authApi';
import {setForgotPasswordSteps, setUserInfo} from '../../../features/authSlice';
import {SCREENS} from '../../../navigation/screenNames';
import {passwordStyles} from './EmpChangePassword';

const EmpForgotPassword = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {fcmToken, userInfo, forgotPasswordSteps} = useSelector(
    (state: RootState) => state.auth,
  );
  const [OtpVerify] = useEmployeeOTPVerifyMutation();
  const [companyChangePassword] = useCompanyChangePasswordMutation();
  const [email, setEmail] = useState(__DEV__ ? 'bilal@devicebee.com' : '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputRefsOtp = useRef<any>([]);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(__DEV__ ? 5 : 30);
  const [start, setStart] = useState(false);
  const [employeeForgotPassword] = useEmployeeForgotPasswordMutation({});
  const [companyResendOTP] = useCompanyResendOTPMutation({});

  useEffect(() => {
    if (timer == 0) return;
    console.log('startttttt', start);
    if (start) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, start]);

  useEffect(() => {
    if (forgotPasswordSteps == 2) {
      setStart(true);
    }
  }, [forgotPasswordSteps]);

  const handleChangeOtp = (text: any, index: any) => {
    const newPass = [...otp];
    newPass[index] = text;
    setOtp(newPass);

    if (text && index < 7) {
      inputRefsOtp.current[index + 1]?.focus();
    }
  };

  const handleKeyPressOtp = (e: any, index: any) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      const newPass = [...otp];
      newPass[index - 1] = '';
      setOtp(newPass);
      inputRefsOtp.current[index - 1]?.focus();
    }
  };

  const handleSendOtpwithEmail = async () => {
    if (!email.trim()) {
      errorToast('Please enter a valid email');
      return;
    }
    try {
      const res = await employeeForgotPassword({email}).unwrap();
      if (res?.status) {
        successToast(res?.message || 'OTP sent successfully');
        dispatch(setUserInfo(res.data?.user));
        setTimer(30);
        if (forgotPasswordSteps === 1) {
          nextStep();
        }
      } else {
        errorToast(res?.message || 'Something went wrong');
      }
    } catch (error: any) {
      errorToast(error?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOTP = async () => {
    let data = {
      otp: otp.join(''),
      user_id: userInfo?._id,
      device_token: fcmToken ?? 'ddd',
      device_type: Platform.OS,
    };
    console.log(data, 'verifyOTP data');

    const response = await OtpVerify(data).unwrap();
    console.log(response, 'response----');
    if (response?.status) {
      successToast(response?.message);
      nextStep();
    } else {
      errorToast(response?.message);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      errorToast('Please enter new password and confirm password');
      return;
    }

    let data = {
      user_id: userInfo?._id,
      otp: otp.join('') || '1234',
      password: newPassword,
      confirm_password: confirmPassword,
    };
    console.log(data, 'handleChangePassword data');

    const response = await companyChangePassword(data).unwrap();
    console.log(response, 'companyChangePassword response----');
    if (response?.status) {
      successToast(response?.message);
      dispatch(setUserInfo(response.data?.user));
      resetNavigation(SCREENS.CoTabNavigator);
    } else {
      errorToast("New password and confirm password doesn't match");
    }
  };

  const nextStep = () =>
    dispatch(setForgotPasswordSteps(forgotPasswordSteps + 1));

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    } else if (num == 3) {
      resetNavigation(SCREENS.CoLogin);
      dispatch(setForgotPasswordSteps(1));
    } else {
      dispatch(setForgotPasswordSteps(forgotPasswordSteps - 1));
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await companyResendOTP({user_id: userInfo?._id}).unwrap();
      if (res?.status) {
        successToast(res?.message || 'OTP sent successfully');
        setTimer(30);
      } else {
        errorToast(res?.message || 'Something went wrong');
      }
    } catch (error: any) {
      errorToast(error?.data?.message || 'Failed to send OTP');
    }
  };

  const renderStepUI = () => {
    switch (forgotPasswordSteps) {
      case 1:
        return (
          <>
            <Text style={passwordStyles.description}>
              {t(
                'Enter the email associated with your account and we’ll send an email instructions to forgot your password.',
              )}
            </Text>
            <View style={passwordStyles.inputView}>
              <Text style={passwordStyles.label}>{t('Your Email')}</Text>
              <CustomTextInput
                value={email}
                style={passwordStyles.emailText}
                placeholder="Enter your email"
                placeholderTextColor={colors._7B7878}
                containerStyle={passwordStyles.inputcontainer}
                onChangeText={setEmail}
              />
            </View>
            <GradientButton
              type="Employee"
              title="Submit"
              style={passwordStyles.button}
              onPress={handleSendOtpwithEmail}
            />
          </>
        );
      case 2:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('Verify OTP Code')}</Text>
              {timer !== 0 && (
                <View style={[styles.info_row, {marginTop: hp(19)}]}>
                  <Text style={styles.infotext}>
                    {t('You will receive OTP by email')}
                  </Text>
                </View>
              )}
              <View style={styles.otpContainer}>
                {otp?.map((val, idx) => (
                  <TextInput
                    key={idx}
                    ref={(el: any) => (inputRefsOtp.current[idx] = el)}
                    value={val ? '*' : ''}
                    onChangeText={text => handleChangeOtp(text, idx)}
                    onKeyPress={e => handleKeyPressOtp(e, idx)}
                    maxLength={1}
                    style={styles.otpBox1}
                    keyboardType="decimal-pad"
                    autoFocus={idx === 0}
                  />
                ))}
              </View>
              <>
                {timer == 0 ? (
                  <Text
                    onPress={() => {
                      handleResendOTP();
                    }}
                    style={styles.resendText}>
                    {t('Resend')}
                  </Text>
                ) : (
                  <View style={[{marginTop: hp(31), alignItems: 'center'}]}>
                    <Text style={styles.secText}>{`00:${
                      timer < 10 ? `0${timer}` : timer
                    }`}</Text>
                    <Text style={styles.secText1}>
                      {t("Didn't receive the code? Resend in")} {timer}
                      {'s'}
                    </Text>
                  </View>
                )}
              </>
            </View>
            <GradientButton
              type="Employee"
              style={styles.btn}
              title={t('Verify')}
              onPress={() => verifyOTP()}
            />
          </View>
        );
      case 3:
        return (
          <View style={passwordStyles.inputView}>
            <Text style={passwordStyles.label}>{t('New Password')}</Text>
            <CustomTextInput
              value={newPassword}
              style={passwordStyles.emailText}
              placeholder="Enter new password"
              placeholderTextColor={colors._7B7878}
              containerStyle={passwordStyles.inputcontainer}
              secureTextEntry
              onChangeText={setNewPassword}
            />
            <Text style={passwordStyles.label}>{t('Confirm Password')}</Text>
            <CustomTextInput
              value={confirmPassword}
              style={passwordStyles.emailText}
              placeholder="Confirm new password"
              placeholderTextColor={colors._7B7878}
              containerStyle={passwordStyles.inputcontainer}
              secureTextEntry
              onChangeText={setConfirmPassword}
            />
            <GradientButton
              type="Company"
              onPress={handleChangePassword}
              title="Submit"
              style={passwordStyles.button}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top', 'bottom']}}
      colors={['#043379', '#041F50']}>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        // scrollEnabled={false}
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={passwordStyles.scrollcontainer}
        style={passwordStyles.container}>
        <TouchableOpacity
          onPress={() => prevStep(forgotPasswordSteps)}
          hitSlop={8}
          style={[passwordStyles.backBtn]}>
          <Image
            resizeMode="contain"
            source={IMAGES.leftSide}
            style={passwordStyles.back}
          />
        </TouchableOpacity>
        {forgotPasswordSteps !== 2 && (
          <Text style={passwordStyles.title}>{t('Forgot Password')}</Text>
        )}
        {renderStepUI()}
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default EmpForgotPassword;

const styles = StyleSheet.create({
  innerConrainer: {
    flex: 1,
    marginTop: hp(16),
    // justifyContent: 'space-between',
  },
  title: {
    paddingTop: hp(10),
    ...commonFontStyle(500, 25, colors._FBE7BD),
  },
  btn: {
    marginVertical: wp(30),
  },
  info_row: {
    gap: wp(10),
    marginTop: hp(15),
    flexDirection: 'row',
  },
  infotext: {
    top: -8,
    lineHeight: hp(28),
    ...commonFontStyle(400, 20, colors._FBE7BD),
  },
  otpContainer: {
    marginTop: hp(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox1: {
    width: wp(40),
    height: 50,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: colors._FBE7BD,
    ...commonFontStyle(700, 30, colors._FBE7BD),
  },
  secText: {
    ...commonFontStyle(500, 25, colors._FBE7BD),
    marginVertical: hp(34),
  },
  secText1: {
    ...commonFontStyle(400, 20, colors._FBE7BD),
  },
  resendText: {
    marginTop: hp(74),
    textAlign: 'center',
    textDecorationLine: 'underline',
    ...commonFontStyle(600, 20, colors._FBE7BD),
  },
});
