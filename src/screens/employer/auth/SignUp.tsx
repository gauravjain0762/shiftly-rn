import {
  Dimensions,
  Image,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import * as Progress from 'react-native-progress';
import {SCREEN_WIDTH, commonFontStyle, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {hp} from '../../../theme/fonts';
import CustomBtn from '../../../component/common/CustomBtn';
import {useTranslation} from 'react-i18next';
import {navigationRef} from '../../../navigation/RootContainer';
import PhoneInput from '../../../component/auth/PhoneInput';
import WelcomeModal from '../../../component/auth/WelcomeModal';
import moment from 'moment';
import {
  errorToast,
  navigateTo,
  successToast,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearEmployeeAccount,
  setCreateEmployeeAccount,
  setUserInfo,
} from '../../../features/authSlice';
import {
  useEmployeeOTPVerifyMutation,
  useEmployeeResendOTPMutation,
  useEmployeeSignUpMutation,
  useEmpUpdateProfileMutation,
  useUpdateProfileMutation,
} from '../../../api/authApi';
import {RootState} from '../../../store';
const {width} = Dimensions.get('window');

const SignUp = () => {
  const dispatch = useDispatch<any>();
  const {t} = useTranslation<any>();
  const {fcmToken, userInfo} = useSelector((state: RootState) => state.auth);
  const signupData = useSelector(
    (state: any) => state.auth.createEmployeeAccount,
  );

  const {
    step,
    name,
    email,
    timer,
    showModal,
    imageModal,
    selected,
    selected1,
    selected2,
    selected3,
    dob,
    open,
    full_password,
    phone,
    phone_code,
    describe,
    picture,
  } = signupData;

  const [password, setPassword] = useState(new Array(8).fill(''));
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef<any>([]);
  const inputRefsOtp = useRef<any>([]);
  const [empSignUp] = useEmployeeSignUpMutation({});
  const [empOTPVerify] = useEmployeeOTPVerifyMutation({});
  const [employeeResendOTP] = useEmployeeResendOTPMutation({});
  const [empUpdateProfile] = useEmpUpdateProfileMutation({});

  const options = [
    "I'm currently working in hospitality",
    "I'm a hospitality student",
    "I'm a job seeker",
  ];
  const options1 = ['Male', 'Female'];
  const options2 = [
    'United State America',
    'United Arab Emirates',
    'United Kindom',
  ];

  // Update Redux state helper
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
      full_otp: string | undefined;
      phone: string;
      phone_code: string;
      describe: string;
      picture: string;
    }>,
  ) => {
    dispatch(setCreateEmployeeAccount(updates));
  };

  useEffect(() => {
    if (signupData.step === undefined) {
      updateSignupData({step: 1});
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      updateSignupData({timer: timer - 1});
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleRegister = async () => {
    try {
      const response = await empSignUp({
        name: name,
        email: email,
        password: full_password,
        phone_code: phone_code,
        phone: phone,
      }).unwrap();
      // console.log('🔥 ~ handleRegister ~ response?.data:', response?.data);

      if (response?.status) {
        successToast(response?.message);
        dispatch(setUserInfo(response?.data?.user));
        nextStep();
      } else {
        errorToast(response?.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleOTPVerify = async () => {
    const verifyData = {
      otp: otp.join(''),
      user_id: userInfo?._id,
      device_token: fcmToken ?? 'ddd',
      device_type: Platform.OS,
    };
    console.log(' ~ handleOTPVerify ~ verifyData:', verifyData);
    try {
      const response = await empOTPVerify(verifyData).unwrap();
      console.log('🔥 ~ handleOTPVerify ~ response?.data:', response?.data);
      if (response?.status) {
        successToast(response?.message);
        dispatch(setUserInfo(response?.data?.user));
        dispatch(clearEmployeeAccount());
        nextStep();
        updateSignupData({showModal: true});
      } else {
        errorToast(response?.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await employeeResendOTP({
        user_id: userInfo?._id,
      }).unwrap();

      if (response?.status) {
        successToast(response?.message);
        dispatch(setUserInfo(response?.data?.user));
        updateSignupData({timer: 30});
        dispatch(clearEmployeeAccount());
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error handleResendOTP user:', error);
    }
  };

  // console.log('🔥🔥🔥 ~ handleFinishSetup ~ updateData:', updateData);
  const handleFinishSetup = async () => {
    const updateData = {
      about: 'describe',
      dob: '09-10-2025',
      gender: 'selected1',
      nationality: 'selected2',
      country: 'selected3',
    };
    try {
      // const res = await empUpdateProfile(updateData).unwrap();
      // console.log('🔥🔥 ~ handleFinishSetup ~ res:', res?.data);
      // if (res?.status) {
      //   successToast(res?.message);
      //   dispatch(setUserInfo(res?.data?.user));
        nextStep();
      // } else {
      //   errorToast(res?.message);
      // }
    } catch (error) {
      console.error('Error handleFinishSetup user:', error);
    }
  };

  const nextStep = () => {
    dispatch(
      setCreateEmployeeAccount({
        step: signupData.step + 1,
      }),
    );
  };
  const prevStep = (num: number) => {
    if (num == 1) {
      navigationRef.goBack();
    } else {
      updateSignupData({step: step - 1});
    }
  };

  const handleChange = (text: string, index: number) => {
    const newPass = [...password];
    newPass[index] = text;
    setPassword(newPass);

    if (newPass.every(val => val !== '')) {
      dispatch(
        setCreateEmployeeAccount({
          full_password: newPass.join(''),
        }),
      );
    }

    if (text && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      password[index] === '' &&
      index > 0
    ) {
      const newPass = [...password];
      newPass[index - 1] = '';
      setPassword(newPass);

      dispatch(
        setCreateEmployeeAccount({
          full_password: newPass.join(''),
        }),
      );

      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChangeOtp = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // updateSignupData({otp: newOtp});

    if (text && index < 7) {
      inputRefsOtp.current[index + 1]?.focus();
    }
  };

  const handleKeyPressOtp = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      // updateSignupData({otp: newOtp});
      inputRefsOtp.current[index - 1]?.focus();
    }
  };

  const renderStep = () => {
    switch (step || 1) {
      case 1:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t(`What's your full name?`)}</Text>
              <CustomTextInput
                placeholder={t('Type your name here...')}
                placeholderTextColor={colors._F4E2B8}
                onChangeText={text => updateSignupData({name: text})}
                value={name}
                style={styles.input}
              />
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={nextStep}
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('What is your email address?')}
              </Text>
              <CustomTextInput
                placeholder={t('Type your email here...')}
                placeholderTextColor={colors._F4E2B8}
                onChangeText={text => updateSignupData({email: text})}
                value={email}
                style={styles.input}
              />
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={nextStep}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('Set a secure password')}</Text>
              <View style={styles.info_row}>
                <Text style={styles.infotext}>
                  {
                    'Password must include at least 8 characters, one uppercase letter, one number, and one symbol.'
                  }
                </Text>
              </View>
              <View style={styles.otpContainer}>
                {password.map((val, idx) => (
                  <TextInput
                    key={idx}
                    ref={(el: any) => (inputRefs.current[idx] = el)}
                    value={val ? '*' : ''}
                    onChangeText={text => handleChange(text, idx)}
                    onKeyPress={e => handleKeyPress(e, idx)}
                    maxLength={1}
                    style={styles.otpBox}
                    keyboardType="decimal-pad"
                    autoFocus={idx === 0}
                  />
                ))}
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={nextStep}
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('What is your phone number?')}
              </Text>
              <PhoneInput
                phone={phone}
                callingCode={phone_code}
                onPhoneChange={(e: any) => updateSignupData({phone: e})}
                onCallingCodeChange={(e: any) =>
                  updateSignupData({phone_code: e})
                }
              />
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={() => {
                handleRegister();
              }}
            />
          </View>
        );

      case 5:
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
                {otp.map(
                  (val: any, idx: React.Key | null | undefined | any) => (
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
                  ),
                )}
              </View>
              <>
                {timer == 0 ? (
                  <Text
                    onPress={() => handleResendOTP()}
                    style={styles.resendText}>
                    {t('Resend')}
                  </Text>
                ) : (
                  <View style={[{marginTop: hp(31), alignItems: 'center'}]}>
                    <Text style={styles.secText}>
                      {timer} {t('Sec')}
                    </Text>
                    <Text style={styles.secText1}>
                      {t("Didn't receive the code? Resend in")} {timer}
                      {'s'}
                    </Text>
                  </View>
                )}
              </>
            </View>
            <GradientButton
              style={styles.btn}
              title={t('Next')}
              onPress={() => {
                handleOTPVerify();
              }}
            />
          </View>
        );

      case 6:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('Which best describes you?')}</Text>
              <CustomTextInput
                placeholder={t(`I'm a job seeker`)}
                placeholderTextColor={colors._F4E2B8}
                onChangeText={text => updateSignupData({describe: text})}
                value={describe}
                style={styles.input1}
              />
              {options.map((option, index) => {
                const isSelected = option === selected;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionContainer]}
                    onPress={() => {
                      updateSignupData({describe: option});
                      updateSignupData({selected: option});
                    }}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedText,
                      ]}>
                      {option}
                    </Text>
                    {isSelected && (
                      <Image
                        source={IMAGES.mark}
                        style={{width: 25, height: 22, resizeMode: 'contain'}}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={nextStep}
            />
          </View>
        );

      case 7:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('What is your date of birth?')}
              </Text>
              <Pressable
                style={styles.dateRow}
                onPress={() => updateSignupData({open: true})}>
                <Image
                  source={IMAGES.cake}
                  style={{width: 24, height: 24, resizeMode: 'contain'}}
                />
                <Text style={styles.dateText}>
                  {dob
                    ? moment(dob).format('YYYY-MM-DD')
                    : moment().format('YYYY-MM-DD')}
                </Text>
              </Pressable>

              <DateTimePicker
                value={dob ? new Date(dob) : new Date()}
                display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                isVisible={open}
                maximumDate={new Date()}
                onConfirm={dates => {
                  updateSignupData({
                    open: false,
                    dob: moment(dates).format('YYYY-MM-DD'),
                  });
                }}
                onCancel={() => updateSignupData({open: false})}
              />

              <View style={styles.underline} />
              <Text style={[styles.title, {marginTop: 40}]}>
                {t('What is your gender?')}
              </Text>
              <Pressable style={styles.dateRow} onPress={() => {}}>
                <Text style={styles.dateText}>{selected1}</Text>
              </Pressable>
              <View style={styles.underline} />
              {options1.map((option, index) => {
                const isSelected = option === selected1;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionContainer]}
                    onPress={() => updateSignupData({selected1: option})}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedText,
                      ]}>
                      {option}
                    </Text>
                    {isSelected && (
                      <Image
                        source={IMAGES.mark}
                        style={{width: 25, height: 22, resizeMode: 'contain'}}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={nextStep}
            />
          </View>
        );

      case 8:
        return (
          <View style={[styles.innerConrainer, {}]}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{t('Select your nationality ')}</Text>
              <Pressable
                style={[styles.dateRow, {alignItems: 'center'}]}
                onPress={() => {}}>
                <Image
                  source={IMAGES.close}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: '#F4E2B8',
                  }}
                />
                <Text style={styles.dateText}>{selected2}</Text>
              </Pressable>

              <View style={styles.underline} />
              {options2.map((option, index) => {
                const isSelected = option === selected2;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionContainer]}
                    onPress={() => updateSignupData({selected2: option})}>
                    <Image
                      source={IMAGES.flag}
                      style={{
                        width: 38,
                        height: 22,
                        resizeMode: 'contain',
                        marginRight: 17,
                      }}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedText,
                      ]}>
                      {option}
                    </Text>
                    {isSelected && (
                      <Image
                        source={IMAGES.mark}
                        style={{width: 25, height: 22, resizeMode: 'contain'}}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
              <Text style={[styles.title, {marginTop: 27}]}>
                {t('Where are you currently residing?')}
              </Text>
              <Pressable
                style={[styles.dateRow, {alignItems: 'center', marginTop: 27}]}
                onPress={() => {}}>
                <Image
                  source={IMAGES.close}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: '#F4E2B8',
                  }}
                />
                <Text style={styles.dateText}>{selected3}</Text>
              </Pressable>

              <View style={styles.underline} />
              {options2.map((option, index) => {
                const isSelected = option === selected3;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionContainer]}
                    onPress={() => updateSignupData({selected3: option})}>
                    <Image
                      source={IMAGES.flag}
                      style={{
                        width: 38,
                        height: 22,
                        resizeMode: 'contain',
                        marginRight: 17,
                      }}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedText,
                      ]}>
                      {option}
                    </Text>
                    {isSelected && (
                      <Image
                        source={IMAGES.mark}
                        style={{width: 25, height: 22, resizeMode: 'contain'}}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={{marginBottom: 30}} />
            <GradientButton
              style={[styles.btn]}
              title={'Next'}
              onPress={nextStep}
            />
          </View>
        );

      case 9:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('How about adding your photo?')}
              </Text>
              <Text style={styles.infotext1}>
                {t(
                  'Let employers see who you are first impressions make all the difference!',
                )}
              </Text>

              <TouchableOpacity
                onPress={() => updateSignupData({imageModal: true})}
                style={styles.uploadBox}>
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={picture ? {uri: picture?.path} : IMAGES.user}
                    style={{
                      width: wp(120),
                      height: hp(120),
                      resizeMode: 'contain',
                      borderRadius: hp(100),
                    }}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.uploadText}>
                  Upload Profile Image (optional)
                </Text>
              </TouchableOpacity>
            </View>
            <GradientButton
              style={styles.btn}
              title={t('Finish Setup')}
              onPress={handleFinishSetup}
            />
          </View>
        );

      case 10:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('Completion Acknowledgment')}</Text>
              <Text style={styles.infotext1}>
                {t(
                  "You're almost there! Your profile is 70% complete. Add your experience & skills to start applying for the best opportunities.",
                )}
              </Text>
            </View>
            <View>
              <CustomBtn
                label={t('Complete My Profile')}
                onPress={() => navigateTo(SCREENS.CreateProfileScreen)}
                outline={true}
                btnStyle={styles.btn1}
              />
              <GradientButton
                style={styles.btn}
                title={t('Explore Jobs')}
                onPress={() => navigateTo(SCREENS.TabNavigator)}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };
  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <Progress.Bar
        progress={(step * 11) / 100}
        width={SCREEN_WIDTH}
        borderRadius={0}
        animated
        height={13}
        borderWidth={0}
        color={colors._F3E1B7}
      />
      <KeyboardAwareScrollView
        enableAutomaticScroll
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollcontainer}
        style={styles.container}>
        <View style={styles.rowView}>
          <TouchableOpacity
            onPress={() => prevStep(step)}
            hitSlop={8}
            style={[styles.backBtn, {flex: 1}]}>
            <Image
              resizeMode="contain"
              source={IMAGES.leftSide}
              style={styles.back}
            />
          </TouchableOpacity>
          {step == 9 && (
            <TouchableOpacity onPress={nextStep} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
        {renderStep()}
      </KeyboardAwareScrollView>
      <WelcomeModal
        visible={showModal}
        onClose={() => {
          updateSignupData({showModal: false});
        }}
      />
      <ImagePickerModal
        actionSheet={imageModal}
        setActionSheet={() => updateSignupData({imageModal: false})}
        onUpdate={(image: any) => updateSignupData({picture: image})}
      />
    </LinearContainer>
  );
};
export default SignUp;

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipBtn: {
    backgroundColor: '#FDE9B6',
    borderRadius: 20,
    width: 65,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
  },
  skipText: {
    ...commonFontStyle(500, 14, colors.black),
  },
  back: {
    width: wp(21),
    height: wp(21),
  },
  container: {
    paddingHorizontal: wp(35),
    paddingVertical: hp(35),
    paddingTop: hp(40),
  },
  scrollcontainer: {
    flex: 1,
    // justifyContent: 'space-between',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  title: {
    ...commonFontStyle(500, 25, colors.white),
    paddingTop: hp(30),
  },
  infotext1: {
    ...commonFontStyle(400, 20, colors.white),
    paddingTop: hp(18),
    lineHeight: 28,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    ...commonFontStyle(400, 22, colors._F4E2B8),
    flex: 1,
    paddingBottom: hp(15),
    marginTop: hp(65),
  },
  input1: {
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    ...commonFontStyle(700, 27, colors._F4E2B8),
    flex: 1,
    paddingBottom: hp(15),
    marginTop: hp(65),
  },
  btn: {
    marginHorizontal: wp(13),
  },
  btn1: {
    marginBottom: hp(38),
  },
  innerConrainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  info: {
    width: wp(22),
    height: wp(22),
    resizeMode: 'contain',
  },
  infotext: {
    ...commonFontStyle(400, 16, colors.white),
    lineHeight: hp(28),
    top: -8,
  },
  secText: {
    ...commonFontStyle(500, 25, colors.white),
    marginVertical: hp(34),
  },
  secText1: {
    ...commonFontStyle(400, 18, colors.white),
  },
  resendText: {
    ...commonFontStyle(600, 20, colors._F4E2B8),
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: hp(74),
  },
  info_row: {
    flexDirection: 'row',
    gap: wp(10),
    marginTop: hp(15),
  },
  cellStyle: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    // marginLeft: 6,
    // marginRight: 6,
  },
  cellStyle1: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    marginLeft: 6,
    marginRight: 6,
  },
  cellStyleFocused: {
    // borderWidth: 0,
  },
  textStyle: {
    ...commonFontStyle(300, 30, colors._F4E2B8),
    // bottom: 9,
  },
  textStyle1: {
    ...commonFontStyle(300, 30, colors._F4E2B8),
    bottom: -2,
    // paddingBottom: hp(-10),
  },
  foc_textStyle: {
    ...commonFontStyle(300, 60, colors._F4E2B8),
  },
  pinconatiner: {
    marginTop: hp(40),
    alignSelf: 'center',
  },
  pinconatiner1: {
    marginTop: hp(40),
    alignSelf: 'center',
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  errorIcon: {
    fontSize: 16,
    color: 'red',
    marginRight: 6,
  },
  errorText: {
    marginLeft: 13,
    ...commonFontStyle(400, 18, colors.white),
  },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  selectedOptionContainer: {
    borderBottomColor: colors._F4E2B8,
  },
  optionText: {
    ...commonFontStyle(400, 21, colors._F4E2B8),
    flex: 1,
  },
  selectedText: {
    ...commonFontStyle(500, 21, colors._F4E2B8),
  },
  checkIcon: {
    marginLeft: 10,
  },

  dateRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 10,
    marginTop: 67,
  },
  dateText: {
    ...commonFontStyle(700, 22, colors._F4E2B8),
    marginLeft: 10,
  },
  underline: {
    height: 2,
    backgroundColor: colors._F4E2B8,
    marginBottom: 20,
  },
  otpBox1: {
    width: wp(40),
    height: hp(50),
    borderBottomWidth: 2,
    borderColor: '#ffeecf',
    textAlign: 'center',
    ...commonFontStyle(700, 30, '#F4E2B8'),
  },
  otpBox: {
    width: (width - 48 - 14 * 7) / 8,
    height: 50,
    borderBottomWidth: 2,
    borderColor: '#ffeecf',
    textAlign: 'center',
    ...commonFontStyle(700, 30, '#F4E2B8'),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(40),
  },
  uploadBox: {
    borderColor: '#12519C',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: 40,
    alignItems: 'center',
    // width: '92%',
    backgroundColor: '#0B3970',
  },
  imagePlaceholder: {
    // backgroundColor: '#FDE9B6',
    borderRadius: 114,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FDE9B6',
    width: 114,
    height: 114,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadText: {
    ...commonFontStyle(400, 18, colors.white),
    marginTop: 12,
  },
});
