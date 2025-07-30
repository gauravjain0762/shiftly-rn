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
import {passwordStyles} from './ChangePassword';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {errorToast, successToast} from '../../../utils/commonFunction';
import {useAppDispatch} from '../../../redux/hooks';
import {RootState} from '../../../store';
import {useSelector} from 'react-redux';
import {
  useCompanyForgotPasswordMutation,
  useCompanyOTPVerifyMutation,
} from '../../../api/authApi';
import { setForgotPasswordSteps } from '../../../features/authSlice';

const ForgotPassword = () => {
  const {fcmToken, userInfo, forgotPasswordSteps} = useSelector((state: RootState) => state.auth);
  const [OtpVerify, {isLoading: otpVerifyLoading}] =
    useCompanyOTPVerifyMutation();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputRefsOtp = useRef<any>([]);
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [timer, setTimer] = useState(30);
  const [start, setStart] = useState(false);
  const [companyForgotPassword] = useCompanyForgotPasswordMutation({});

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
      const res = await companyForgotPassword({email}).unwrap();
      if (res?.status) {
        successToast(res?.message || 'OTP sent successfully');
        setStart(true);
        setTimer(30);
        nextStep();
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
      company_id: userInfo?._id,
      device_token: fcmToken ?? 'ddd',
      device_type: Platform.OS,
    };
    console.log(data, 'data');

    const response = await OtpVerify(data).unwrap();
    console.log(response, 'response----');
    if (response?.status) {
      successToast(response?.message);
      nextStep();
    } else {
      errorToast(response?.message);
    }
  };

  const nextStep = () => dispatch(setForgotPasswordSteps(forgotPasswordSteps + 1))

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    }
    dispatch(setForgotPasswordSteps(forgotPasswordSteps- 1))
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
              type="Company"
              onPress={handleSendOtpwithEmail}
              title="Submit"
              style={passwordStyles.button}
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
                    ref={el => (inputRefsOtp.current[idx] = el)}
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
                      setTimer(30);
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
              type="Company"
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
              onPress={() => {
                nextStep();
              }}
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
      colors={['#FFF8E6', '#F3E1B7']}>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        // scrollEnabled={false}
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={passwordStyles.scrollcontainer}
        style={passwordStyles.container}>
        <TouchableOpacity
          onPress={() => {
            if (forgotPasswordSteps === 1) {
              navigationRef.goBack();
            }
          }}
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

export default ForgotPassword;

const styles = StyleSheet.create({
  innerConrainer: {
    flex: 1,
    marginTop: hp(16),
    // justifyContent: 'space-between',
  },
  title: {
    paddingTop: hp(10),
    ...commonFontStyle(500, 25, colors._0B3970),
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
    ...commonFontStyle(400, 20, colors._0B3970),
  },
  otpContainer: {
    marginTop: hp(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox1: {
    width: 70,
    height: 50,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: colors._7B7878,
    ...commonFontStyle(700, 30, colors._7B7878),
  },
  secText: {
    ...commonFontStyle(500, 25, colors._0B3970),
    marginVertical: hp(34),
  },
  secText1: {
    ...commonFontStyle(400, 20, colors._0B3970),
  },
  resendText: {
    marginTop: hp(74),
    textAlign: 'center',
    textDecorationLine: 'underline',
    ...commonFontStyle(600, 20, colors._0B3970),
  },
});
