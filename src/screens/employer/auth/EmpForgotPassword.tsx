import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
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
import { IMAGES } from '../../../assets/Images';
import { colors } from '../../../theme/colors';
import { navigationRef } from '../../../navigation/RootContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import {
  errorToast,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import { useAppDispatch } from '../../../redux/hooks';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import {
  useEmployeeForgotPasswordMutation,
  useEmployeeOTPVerifyMutation,
  useEmployeeResendOTPMutation,
  useEmployeeResetPasswordMutation,
} from '../../../api/authApi';
import { setForgotPasswordSteps, setUserInfo } from '../../../features/authSlice';
import { SCREENS } from '../../../navigation/screenNames';
import { passwordStyles } from './EmpChangePassword';

const EmpForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { fcmToken, userInfo, forgotPasswordSteps } = useSelector(
    (state: RootState) => state.auth,
  );
  console.log('🔥🔥🔥 ~ EmpForgotPassword ~ userInfo:', userInfo);
  const [email, setEmail] = useState(__DEV__ ? 'bilal@devicebee.com' : '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputRefsOtp = useRef<any>([]);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(__DEV__ ? 30 : 30);
  const [start, setStart] = useState(false);
  const [OtpVerify] = useEmployeeOTPVerifyMutation();
  const [employeeForgotPassword] = useEmployeeForgotPasswordMutation({});
  const [employeeResendOTP] = useEmployeeResendOTPMutation({});
  const [employeeResetPassword] = useEmployeeResetPasswordMutation();

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
      Keyboard.dismiss();
      errorToast('Please enter a valid email');
      return;
    }
    try {
      const res = await employeeForgotPassword({ email }).unwrap() as any;
      if (res?.status) {
        Keyboard.dismiss();
        successToast(res?.message);
        dispatch(setUserInfo(res.data?.user));
        setTimer(30);
        if (forgotPasswordSteps === 1) {
          nextStep();
        }
      } else {
        Keyboard.dismiss();
        errorToast(res?.message || 'Something went wrong');
      }
    } catch (error: any) {
      Keyboard.dismiss();
      errorToast(error?.data?.message || 'Failed to send OTP');
    }
  };

  // Update the verifyOTP function:
  const verifyOTP = async () => {
    let data = {
      otp: otp.join(''),
      user_id: userInfo?._id,
      device_token: fcmToken ?? 'ddd',
      device_type: Platform.OS,
    };
    console.log(data, 'verifyOTP data');

    try {
      const response = await OtpVerify(data).unwrap() as any;
      console.log(response, 'response----');
      if (response?.status) {
        Keyboard.dismiss();
        dispatch(setUserInfo(response.data?.user));
        successToast(response?.message);
        nextStep();
      } else {
        Keyboard.dismiss();
        errorToast(response?.message);
      }
    } catch (error: any) {
      Keyboard.dismiss();
      errorToast(error?.data?.message || 'OTP verification failed');
    }
  };

  // Update the handleChangePassword function:
  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Keyboard.dismiss();
      errorToast('Please enter new password and confirm password');
      return;
    }

    let data = {
      user_id: userInfo?._id,
      otp: otp.join('') || '1234',
      password: newPassword,
      confirm_password: confirmPassword,
    };
    console.log(data, 'handle ResetPassword data');

    try {
      const response = await employeeResetPassword(data).unwrap() as any;
      console.log(response, 'companyChangePassword response----');
      if (response?.status) {
        Keyboard.dismiss();
        successToast(response?.message);
        dispatch(setUserInfo(response.data?.user));
        resetNavigation(SCREENS.EmployeeStack, SCREENS.LoginScreen);
        dispatch(setForgotPasswordSteps(1));
      } else {
        Keyboard.dismiss();
        errorToast("New password and confirm password doesn't match");
      }
    } catch (error: any) {
      Keyboard.dismiss();
      errorToast(error?.data?.message || 'Failed to reset password');
    }
  };

  // Update the handleResendOTP function:
  const handleResendOTP = async () => {
    try {
      const res = await employeeResendOTP({ user_id: userInfo?._id }).unwrap() as any;
      if (res?.status) {
        Keyboard.dismiss();
        successToast(res?.message || 'OTP sent successfully');
        setTimer(30);
        setStart(true);
      } else {
        Keyboard.dismiss();
        errorToast(res?.message || 'Something went wrong');
      }
    } catch (error: any) {
      Keyboard.dismiss();
      errorToast(error?.data?.message || 'Failed to send OTP');
    }
  };

  const nextStep = () =>
    dispatch(setForgotPasswordSteps(forgotPasswordSteps + 1));

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    } else if (num == 3) {
      resetNavigation(SCREENS.EmployeeStack, SCREENS.LoginScreen);
      dispatch(setForgotPasswordSteps(1));
    } else {
      dispatch(setForgotPasswordSteps(forgotPasswordSteps - 1));
    }
  };

  const renderStepUI = () => {
    switch (forgotPasswordSteps) {
      case 1:
        return (
          <>
            <Text style={[passwordStyles.description, { marginTop: hp(40) }]}>
              {t(
                `Enter the email associated with your account and we'll send an email instructions to forgot your password.`,
              )}
            </Text>
            <View style={passwordStyles.inputView}>
              <Text style={passwordStyles.label}>{t('Your Email')}</Text>
              <CustomTextInput
                value={email}
                inputStyle={passwordStyles.emailText}
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
              {/* Removed duplicate title - it's now in the header */}
              {timer !== 0 && (
                <View style={[styles.info_row, { marginTop: hp(19) }]}>
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
                  <View style={[{ marginTop: hp(31), alignItems: 'center' }]}>
                    <Text style={styles.secText}>{`00:${timer < 10 ? `0${timer}` : timer
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
              showRightIcon
              value={newPassword}
              inputStyle={passwordStyles.emailText}
              placeholder="Enter new password"
              placeholderTextColor={colors._7B7878}
              containerStyle={passwordStyles.inputcontainer}
              onChangeText={setNewPassword}
              isPassword
            />
            <Text style={passwordStyles.label}>{t('Confirm Password')}</Text>
            <CustomTextInput
              showRightIcon
              value={confirmPassword}
              inputStyle={passwordStyles.emailText}
              placeholder="Confirm new password"
              placeholderTextColor={colors._7B7878}
              containerStyle={passwordStyles.inputcontainer}
              isPassword
              onChangeText={setConfirmPassword}
            />
            <GradientButton
              type="Employee"
              title="Submit"
              style={passwordStyles.button}
              onPress={handleChangePassword}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{ edges: ['top', 'bottom'] }}
      colors={[colors._F7F7F7, colors.white]}>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[passwordStyles.scrollcontainer, { paddingBottom: hp(20), paddingTop: hp(20) }]}
        style={passwordStyles.container}>

        {/* Header with centered title */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            hitSlop={8}
            onPress={() => prevStep(forgotPasswordSteps)}
            style={styles.backButton}>
            <Image
              resizeMode="contain"
              source={IMAGES.leftSide}
              style={passwordStyles.back}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {forgotPasswordSteps === 1 && t('Forgot Password')}
            {forgotPasswordSteps === 2 && t('Verify OTP Code')}
            {forgotPasswordSteps === 3 && t('Reset Password')}
          </Text>

          <View style={styles.placeholder} />
        </View>

        {renderStepUI()}
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default EmpForgotPassword;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(20),
  },
  backButton: {
    width: wp(40),
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...commonFontStyle(600, 22, colors._0B3970),
  },
  placeholder: {
    width: wp(40),
  },
  // ... rest of existing styles
  innerConrainer: {
    flex: 1,
    marginTop: hp(16),
  },
  title: {
    paddingTop: hp(10),
    ...commonFontStyle(500, 25, colors._2F2F2F),
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
    ...commonFontStyle(400, 20, colors._2F2F2F),
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
    borderColor: colors._D9D9D9,
    ...commonFontStyle(700, 30, colors._0B3970),
  },
  secText: {
    ...commonFontStyle(500, 25, colors._2F2F2F),
    marginVertical: hp(34),
  },
  secText1: {
    ...commonFontStyle(400, 20, colors._2F2F2F),
  },
  resendText: {
    marginTop: hp(74),
    textAlign: 'center',
    textDecorationLine: 'underline',
    ...commonFontStyle(600, 20, colors._0B3970),
  },
});
