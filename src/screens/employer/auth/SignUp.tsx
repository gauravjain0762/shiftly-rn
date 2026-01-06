/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
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
import React, { useEffect, useRef, useState } from 'react';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import * as Progress from 'react-native-progress';
import { SCREEN_WIDTH, commonFontStyle, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { hp } from '../../../theme/fonts';
import { useTranslation } from 'react-i18next';
import { navigationRef } from '../../../navigation/RootContainer';
import PhoneInput from '../../../component/auth/PhoneInput';
import WelcomeModal from '../../../component/auth/WelcomeModal';
import moment from 'moment';
import {
  emailRegex,
  errorToast,
  navigateTo,
  passwordRules,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCreateEmployeeAccount,
  setUserInfo,
} from '../../../features/authSlice';
import {
  useEmployeeOTPVerifyMutation,
  useEmployeeResendOTPMutation,
  useEmployeeSendOTPMutation,
  useEmployeeSignUpMutation,
} from '../../../api/authApi';
import { RootState } from '../../../store';
import CustomImage from '../../../component/common/CustomImage';
import CountryPicker, { Country, Flag } from 'react-native-country-picker-modal';
import CharLength from '../../../component/common/CharLength';
import { useEmpUpdateProfileMutation, useLazyGetEmployeeProfileQuery } from '../../../api/dashboardApi';
import { useRoute } from '@react-navigation/native';
import Tooltip from '../../../component/common/Tooltip';
import { setProfileCompletion } from '../../../features/employeeSlice';

const { width } = Dimensions.get('window');

const SignUp = () => {
  const dispatch = useDispatch<any>();
  const { t } = useTranslation<any>();
  const { params } = useRoute();
  const { isGoogleAuth, isAppleAuth } =
    (params as { isGoogleAuth: boolean; isAppleAuth: boolean }) ?? {};
  const { fcmToken, userInfo } = useSelector((state: RootState) => state.auth);
  const signupData = useSelector(
    (state: any) => state.auth.createEmployeeAccount,
  );
  const [empSendOTP] = useEmployeeSendOTPMutation({});
  const [getProfile] = useLazyGetEmployeeProfileQuery();
  const profile_completion = useSelector((state: RootState) => state.employee.profile_completion);

  const {
    step,
    name,
    email,
    showModal,
    imageModal,
    selected,
    selected1,
    selected2,
    selected3,
    selected2Code,
    selected3Code,
    dob,
    open,
    full_password,
    otp,
    phone,
    phone_code,
    describe,
    picture,
    countryCode,
  } = signupData;

  const [password, setPassword] = useState('');
  const inputRefsOtp = useRef<any>([]);
  const [empSignUp] = useEmployeeSignUpMutation({});
  const [empOTPVerify] = useEmployeeOTPVerifyMutation({});
  const [employeeResendOTP] = useEmployeeResendOTPMutation({});
  const [empUpdateProfile] = useEmpUpdateProfileMutation({});
  const [timer, setTimer] = useState(30);

  const [isVisible, setIsVisible] = useState<null | string>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const options = [
    "I'm currently working in hospitality",
    "I'm a hospitality student",
    "I'm a job seeker",
  ];
  const options1 = ['Male', 'Female', 'prefer not to disclose'];

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
      selected2Code: string;
      selected3Code: string;
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
    }>,
  ) => {
    dispatch(setCreateEmployeeAccount(updates));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleRegister = async (isCheck?: boolean) => {
    try {
      let obj = {
        name: name,
        email: email || email.trim().toLowerCase(),
        password: full_password,
        phone_code: phone_code,
        phone: phone,
        validate_email: Boolean(isCheck),
        // validate_phone: Boolean(!isCheck),
      };
      if (isCheck) {
        delete obj.password;
        delete obj.phone_code;
        delete obj.phone;
      }
      let response;

      let socialObj: any = {
        user_id: userInfo?._id,
        phone_code: phone_code,
        phone: phone,
      };

      if (isGoogleAuth || isAppleAuth) {
        response = await empSendOTP(socialObj).unwrap() as any;
      } else {
        response = await empSignUp(obj).unwrap() as any;
      }

      if (response?.status) {
        if (!isCheck) {
          successToast(response?.message);
          dispatch(
            setUserInfo(
              isGoogleAuth || isAppleAuth
                ? response?.data
                : response?.data?.user,
            ),
          );
        }
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
      otp: otp.join('') || '123456',
      user_id: userInfo?._id,
      device_token: fcmToken ?? 'ddd',
      device_type: Platform.OS,
    };
    console.log(' ~ handleOTPVerify ~ verifyData:', verifyData);
    try {
      const response = await empOTPVerify(verifyData).unwrap() as any;
      if (response?.status) {
        successToast(response?.message);
        dispatch(setUserInfo(response?.data?.user));
        // dispatch(clearEmployeeAccount());
        setTimeout(() => {
          updateSignupData({ showModal: true, timer: 0 });
        }, 200);
      } else {
        errorToast(response?.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleResendOTP = async () => {
    console.log('userInfo?._id: >>>>', userInfo?._id);
    try {
      const response = await employeeResendOTP({
        user_id: userInfo?._id,
      }).unwrap() as any;

      if (response?.status) {
        successToast(response?.message);
        dispatch(setUserInfo(response?.data));
        updateSignupData({ timer: 30 });
        // dispatch(clearEmployeeAccount());
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error handleResendOTP user:', error);
    }
  };

  const handleFinishSetup = async () => {
    let form = new FormData();

    form.append('about', describe);
    form.append('dob', dob);
    form.append('gender', selected1);
    form.append('nationality', selected2);
    form.append('country', selected3);

    if (picture?.path) {
      form.append('picture', {
        uri: picture?.path,
        type: picture?.mime || 'image/jpeg',
        name: picture?.path.split('/').pop() || 'profile.jpg',
      });
    }

    let res;
    try {
      res = await empUpdateProfile(form).unwrap();

      if (res?.status) {
        successToast(res?.message);
        dispatch(setUserInfo(res?.data?.user));

        try {
          const profileResponse = await getProfile({}).unwrap();
          if (profileResponse?.status && profileResponse?.data?.user?.profile_completion) {
            console.log("🔥 ~ handleFinishSetup ~ profileResponse.data.user.profile_completion:", profileResponse.data.user.profile_completion)
            dispatch(setProfileCompletion(profileResponse.data.user.profile_completion));
          }
        } catch (profileError) {
        }

        nextStep();
      } else {
        errorToast(res?.message);
      }
    } catch (error) {
      console.error('Error handleFinishSetup user:', error);
    }
  };

  const nextStep = () => {
    // Fade out and slide left
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(
        setCreateEmployeeAccount({
          step: signupData.step + 1,
        }),
      );
      // Reset and fade in from right
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  const prevStep = (num: number) => {
    if (num == 1) {
      navigationRef.goBack();
    } else {
      // Fade out and slide right
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        updateSignupData({ step: step - 1 });
        // Reset and fade in from left
        slideAnim.setValue(-50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const handleSkip = async () => {
    try {
      const profileResponse = await getProfile({}).unwrap();
      if (profileResponse?.status && profileResponse?.data?.user?.profile_completion) {
        dispatch(setProfileCompletion(profileResponse.data.user.profile_completion));
      }
    } catch (error) {
    }
    nextStep();
  };

  const handleChangeOtp = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    // setOtp(newOtp);
    console.log('🔥 ~ handleChangeOtp ~ newOtp:', newOtp);

    updateSignupData({ otp: newOtp });

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
      // setOtp(newOtp);
      updateSignupData({ otp: newOtp });
      inputRefsOtp.current[index - 1]?.focus();
    }
  };

  const renderStep = () => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    };

    switch (step || 1) {
      case 1:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t(`Hi! Let’s start with your full name 🙂 Please enter your first and last name`)}</Text>
              <CustomTextInput
                placeholder={t('ex. John smith')}
                placeholderTextColor={colors._7B7878}
                onChangeText={text => updateSignupData({ name: text })}
                value={name}
                inputStyle={styles.input}
                containerStyle={{ marginBottom: 0 }}
                maxLength={20}
                returnKeyType='next'
                onSubmitEditing={() => {
                  if (!name?.trim()) {
                    errorToast(t('Name is required'));
                    return;
                  }
                  nextStep();
                }}
              />
              <CharLength chars={20} value={name} type={'employee'} />
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              title={'Next'}
              onPress={() => {
                if (!name?.trim()) {
                  errorToast(t('Name is required'));
                  return;
                }
                nextStep();
              }}
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>
                {t('Great! Can you share your email so we can create your account?')}
              </Text>
              <CustomTextInput
                placeholder={t('Type your email here')}
                placeholderTextColor={colors._7B7878}
                onChangeText={text => updateSignupData({ email: text })}
                value={email}
                inputStyle={{ ...styles.input, textTransform: 'lowercase' }}
                keyboardType="email-address"
                returnKeyType='next'
                onSubmitEditing={() => {
                  if (!email?.trim()) {
                    errorToast(t('Email is required'));
                    return;
                  }
                  if (!emailRegex.test(email)) {
                    errorToast('Please enter a valid email address');
                    return;
                  }
                  handleRegister(true);
                }}
              />
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              title={'Next'}
              onPress={() => {
                if (!email?.trim()) {
                  errorToast(t('Email is required'));
                  return;
                }
                if (!emailRegex.test(email)) {
                  errorToast('Please enter a valid email address');
                  return;
                }
                // nextStep();
                handleRegister(true);
              }}
            />
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t('Set a secure password')}</Text>
              {/* <View style={styles.info_row}>
                <CustomImage
                  source={IMAGES.info}
                  size={hp(22)}
                  imageStyle={{marginTop: hp(2)}}
                />
                <Text style={styles.infotext}>
                  {
                    'Password must include at least 8 characters, one uppercase letter, one number, and one symbol.'
                  }
                </Text>
              </View> */}
              <View style={styles.otpContainer}>
                <CustomTextInput
                  showRightIcon
                  inputStyle={styles.passinput}
                  containerStyle={styles.inputcontainer}
                  imgStyle={styles.eye}
                  placeholder="* * * * * * * *"
                  placeholderTextColor={colors._DADADA}
                  isPassword
                  value={password}
                  returnKeyType='next'
                  onChangeText={(text: any) => {
                    setPassword(text);

                    dispatch(
                      setCreateEmployeeAccount({
                        full_password: text,
                      }),
                    );
                  }}
                  onSubmitEditing={() => {
                    const enteredPassword = password;

                    if (!enteredPassword) {
                      errorToast(t('Password is required'));
                      return;
                    }
                    if (!passwordRules.every(rule => rule.test(enteredPassword))) {
                      errorToast('Password does not meet all the requirements');
                      return;
                    }

                    nextStep();
                  }}
                />
              </View>
              <View>
                <View style={styles.passlableCon}>
                  <Image
                    source={IMAGES.shield}
                    resizeMode="contain"
                    style={styles.shield}
                  />
                  <Text style={styles.passRule}>{t('Password Rule')}</Text>
                </View>
                {passwordRules?.map((item: any, index: number) => {
                  const passed = item?.test(password);
                  return (
                    <View key={index} style={styles.rules}>
                      {passed ? (
                        <Image
                          source={IMAGES.check}
                          style={styles.check}
                          tintColor={colors._0B3970}
                        />
                      ) : (
                        <View style={styles.point} />
                      )}
                      <Text style={styles.ruleTitle}>{item?.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              title={'Next'}
              onPress={() => {
                const enteredPassword = password;

                if (!enteredPassword) {
                  errorToast(t('Password is required'));
                  return;
                }
                if (!passwordRules.every(rule => rule.test(enteredPassword))) {
                  errorToast('Password does not meet all the requirements');
                  return;
                }

                nextStep();
              }}
            />
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>
                {t('What is your phone number?')}
              </Text>
              <PhoneInput
                phone={phone}
                callingCode={phone_code}
                countryCode={countryCode}
                placeholderTextColor={colors._7B7878}
                onPhoneChange={(e: any) => updateSignupData({ phone: e })}
                onCallingCodeChange={(e: any) =>
                  updateSignupData({
                    phone_code: e.callingCode[0],
                    countryCode: e.cca2,
                  })
                }
                category="Employee"
                returnKeyType='next'
                onSubmitEditing={() => {
                  if (!phone?.trim()) {
                    errorToast(t('Phone number is required'));
                    return;
                  }
                  if (phone?.length < 9) {
                    errorToast('Please enter a valid phone number');
                    return;
                  }
                  handleRegister();
                }}
              // placeholder='Enter your phone number'
              />
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              title={'Next'}
              onPress={() => {
                if (!phone?.trim()) {
                  errorToast(t('Phone number is required'));
                  return;
                }
                if (phone?.length < 9) {
                  errorToast('Please enter a valid phone number');
                  return;
                }
                handleRegister();
              }}
            />
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t('Verify OTP Code')}</Text>
              {timer !== 0 && (
                <View style={[styles.info_row, { marginTop: hp(19) }]}>
                  <Text style={styles.infotext}>
                    {t(`You will receive an OTP via email at ${email}`)}
                  </Text>
                </View>
              )}
              <View style={styles.otpContainer}>
                {otp &&
                  otp?.map(
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
                        // autoFocus={idx === 0}
                        placeholderTextColor={colors._D5D5D5}
                        returnKeyType={idx === otp.length - 1 ? 'done' : 'next'}
                        onSubmitEditing={() => {
                          if (idx === otp.length - 1) {
                            handleOTPVerify();
                          }
                        }}
                      />
                    ),
                  )}
              </View>
              <>
                {showModal ? null : timer == 0 ? (
                  <Text
                    onPress={() => handleResendOTP()}
                    style={styles.resendText}>
                    {t('Resend')}
                  </Text>
                ) : (
                  <View style={[{ marginTop: hp(40), alignItems: 'center' }]}>
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
              type="Company"
              style={styles.btn}
              title={t('Next')}
              onPress={() => {
                handleOTPVerify();
              }}
            />
          </Animated.View>
        );

      case 6:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t('Which best describes you?')}</Text>
              <CustomTextInput
                placeholder={t(`Select which describe you`)}
                placeholderTextColor={colors._7B7878}
                onChangeText={text => updateSignupData({ describe: text })}
                value={describe}
                inputStyle={styles.input1}
                multiline
                numberOfLines={3}
                returnKeyType='next'
                onSubmitEditing={nextStep}
              />
              {options.map((option, index) => {
                const isSelected = option === selected;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionContainer]}
                    onPress={() => {
                      updateSignupData({ describe: option });
                      updateSignupData({ selected: option });
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
                        style={{ width: 25, height: 22, resizeMode: 'contain', tintColor: colors._0B3970 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              title={'Next'}
              onPress={nextStep}
            />
          </Animated.View>
        );

      case 7:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>
                {t('What is your date of birth?')}
              </Text>
              <Pressable
                style={styles.dateRow}
                onPress={() => updateSignupData({ open: true })}>
                <Image
                  source={IMAGES.cake}
                  style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: colors._0B3970 }}
                />
                <Text style={styles.dateText}>
                  {dob
                    ? moment(dob).format('MM/DD/YYYY')
                    : moment().format('MM/DD/YYYY')}
                </Text>
              </Pressable>

              <DateTimePicker
                pickerStyleIOS={{
                  alignSelf: 'center',
                }}
                date={dob ? new Date(dob) : new Date()}
                display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                isVisible={open}
                maximumDate={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 16),
                  )
                }
                minimumDate={new Date(1900, 0, 1)} // or any earliest DOB you allow
                onConfirm={dates => {
                  updateSignupData({
                    open: false,
                    dob: moment(dates).format('YYYY-MM-DD'),
                  });
                }}
                onCancel={() => updateSignupData({ open: false })}
              />
              <View style={styles.underline} />
              <Text style={[styles.title, { marginTop: 40 }]}>
                {t('What is your gender?')}
              </Text>
              <Pressable style={styles.dateRow} onPress={() => { }}>
                <Text
                  style={[
                    styles.dateText,
                    {
                      marginLeft: 0,
                    },
                  ]}>
                  {selected1 ? selected1 : t('Choose the option that best fits you')}
                </Text>
              </Pressable>
              <View style={styles.underline} />
              {options1.map((option, index) => {
                const isSelected = option === selected1;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionContainer]}
                    onPress={() => updateSignupData({ selected1: option })}>
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
                        style={{ width: 25, height: 22, resizeMode: 'contain', tintColor: colors._0B3970 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              title={'Next'}
              onPress={() => {
                if (!selected1) {
                  errorToast('Please select a gender');
                  return;
                }
                nextStep();
              }}
            />
          </Animated.View>
        );

      case 8:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldHeaderText}>{t('Select your nationality ')}</Text>
                <Tooltip
                  position="bottom"
                  containerStyle={styles.tooltipIcon}
                  message={t('This helps hotels understand your background and visa options.')}
                  tooltipBoxStyle={{ right: wp(5), top: hp(30), width: wp(280), maxWidth: wp(280) }}
                />
              </View>
              <TouchableOpacity
                style={[styles.dateRow, { alignItems: 'center' }]}
                onPress={() => {
                  setIsVisible('1');
                }}>
                {selected2Code ? (
                  <Flag
                    withFlagButton
                    flagSize={wp(20)}
                    withEmoji={true}
                    countryCode={selected2Code as any}
                  />
                ) : (
                  <Image
                    source={IMAGES.close}
                    style={{
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                      tintColor: colors._0B3970,
                    }}
                  />
                )}
                <Text style={styles.dateText}>{selected2 || 'Select '}</Text>
              </TouchableOpacity>

              <View style={styles.underline} />

              <View style={[styles.fieldHeader, { marginTop: hp(27) }]}>
                <Text style={styles.fieldHeaderText}>{t('Where are you currently residing?')}</Text>
                <Tooltip
                  message={t('Used to match you with jobs near you or offering relocation support.')}
                  position="bottom"
                  containerStyle={styles.tooltipIcon}
                  tooltipBoxStyle={{ right: wp(5), top: hp(30), width: wp(280), maxWidth: wp(280) }}
                />
              </View>
              <TouchableOpacity
                style={[styles.dateRow, { alignItems: 'center', marginTop: 27 }]}
                onPress={() => {
                  setIsVisible('2');
                }}>
                {selected3Code ? (
                  <Flag
                    withFlagButton
                    flagSize={wp(20)}
                    withEmoji={true}
                    countryCode={selected3Code as any}
                  />
                ) : (
                  <Image
                    source={IMAGES.close}
                    style={{
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                      tintColor: colors._0B3970,
                    }}
                  />
                )}
                <Text style={styles.dateText}>{selected3 || 'Select '}</Text>
              </TouchableOpacity>

              <View style={styles.underline} />

              {isVisible && (
                <CountryPicker
                  visible={isVisible ? true : false}
                  countryCode={
                    isVisible === '1'
                      ? (selected2Code as any) || 'US'
                      : (selected3Code as any) || 'US'
                  }
                  withFilter
                  withCountryNameButton
                  withCallingCode={false}
                  withFlag
                  withEmoji={false}
                  onSelect={(item: Country) => {
                    const countryName =
                      typeof item?.name === 'string'
                        ? item.name
                        : item?.name?.common || '';
                    const countryCode = item?.cca2 || '';

                    if (isVisible === '1') {
                      updateSignupData({
                        selected2: countryName,
                        selected2Code: countryCode,
                      });
                    } else {
                      updateSignupData({
                        selected3: countryName,
                        selected3Code: countryCode,
                      });
                    }

                    setIsVisible(null);
                  }}
                  onClose={() => {
                    setIsVisible(null);
                  }}
                // placeholder=""
                />
              )}
            </ScrollView>
            <View style={{ marginBottom: 30 }} />
            <GradientButton
              type="Company"
              style={styles.btn}
              title={'Next'}
              onPress={() => {
                if (selected2 && selected3) {
                  nextStep();
                } else {
                  errorToast('Please select nationality and residing');
                }
              }}
            />
          </Animated.View>
        );

      case 9:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>
                {t('Want to make your profile stand out? Add a photo 📸')}
              </Text>
              <Text style={styles.infotext1}>
                {t(
                  'Let employers see who you are first impressions make all the difference!',
                )}
              </Text>

              <TouchableOpacity
                onPress={() => updateSignupData({ imageModal: true })}
                style={styles.uploadBox}>
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={picture?.path ? { uri: picture?.path } : IMAGES.user}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                </View>
                {picture?.path && (
                  <Pressable
                    onPress={() => updateSignupData({ picture: '' })}
                    style={styles.removeButton}>
                    <CustomImage
                      size={hp(12)}
                      source={IMAGES.close}
                      tintColor={colors.red}
                    />
                  </Pressable>
                )}
                <Text style={styles.uploadText}>
                  Upload Profile Image (optional)
                </Text>
              </TouchableOpacity>
            </View>
            <GradientButton
              type="Company"
              style={styles.btn}
              title={t('Finish Setup')}
              onPress={handleFinishSetup}
            />
          </Animated.View>
        );

      case 10:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t('Completion Acknowledgment')}</Text>
              <Text style={styles.infotext1}>
                {t(
                  `You're almost there! Your profile is ${profile_completion}% complete. Add your experience & skills to start applying for the best opportunities.`,
                )}
              </Text>
            </View>
            <View style={{ gap: hp(20) }}>
              <GradientButton
                type="Company"
                title={t('Complete My Profile')}
                onPress={() => navigateTo(SCREENS.CreateProfileScreen)}
                style={styles.btn}
              />
              <GradientButton
                type="Company"
                style={styles.btn}
                title={t('Explore Jobs')}
                onPress={() => {
                  navigateTo(SCREENS.TabNavigator);
                }}
              />
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };
  const totalSteps = 10;

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {t('Step')} {step} {t('of')} {totalSteps}
          </Text>
        </View>
        <Progress.Bar
          progress={step / totalSteps}
          width={SCREEN_WIDTH - wp(70)}
          borderRadius={0}
          animated
          height={13}
          borderWidth={0}
          color={colors._0B3970}
        />
      </View>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollcontainer}
        style={styles.container}>
        <View style={styles.rowView}>
          <TouchableOpacity
            onPress={() => {
              if (isAppleAuth || isGoogleAuth) {
                if (step === 4) {
                  resetNavigation(SCREENS.EmployeeWelcomeScreen);
                } else {
                  prevStep(step);
                }
              } else {
                prevStep(step);
              }
            }}
            hitSlop={8}
            style={[styles.backBtn, { flex: 1 }]}>
            <Image
              resizeMode="contain"
              source={IMAGES.leftSide}
              style={styles.back}
            />
          </TouchableOpacity>
          {step == 9 && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
        {renderStep()}
      </KeyboardAwareScrollView>
      <WelcomeModal
        visible={showModal}
        name={name}
        onClose={() => {
          nextStep();
          updateSignupData({ showModal: false });
        }}
      />
      <ImagePickerModal
        actionSheet={imageModal}
        setActionSheet={() => updateSignupData({ imageModal: false })}
        onUpdate={(image: any) => updateSignupData({ picture: image })}
      />
    </LinearContainer>
  );
};
export default SignUp;

const styles = StyleSheet.create({
  progressContainer: {
    paddingTop: hp(4),
    paddingHorizontal: wp(35),
    marginBottom: hp(6),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: hp(6),
  },
  progressText: {
    ...commonFontStyle(500, 14, colors._0B3970),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipBtn: {
    backgroundColor: colors._0B3970,
    borderRadius: 20,
    width: 65,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
  },
  skipText: {
    ...commonFontStyle(500, 14, colors.white),
  },
  back: {
    width: wp(21),
    height: wp(21),
    tintColor: colors._0B3970,
  },
  container: {
    paddingHorizontal: wp(35),
    paddingVertical: hp(24),
    paddingTop: hp(12),
  },
  scrollcontainer: {
    flex: 1,
    paddingBottom: hp(25),
    // justifyContent: 'space-between',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    columnGap: wp(8),
  },
  fieldHeaderText: {
    flex: 1,
    flexWrap: 'wrap',
    ...commonFontStyle(500, 25, colors._0B3970),
    paddingTop: hp(30),
  },
  tooltipIcon: {
    marginTop: hp(30),
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  title: {
    ...commonFontStyle(500, 25, colors._0B3970),
    paddingTop: hp(16),
  },
  infotext1: {
    ...commonFontStyle(400, 20, colors._0B3970),
    paddingTop: hp(18),
    lineHeight: 28,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderColor: colors._7B7878,
    paddingBottom: hp(15),
    marginTop: hp(65),
    ...commonFontStyle(400, 22, colors._050505),
  },
  input1: {
    borderBottomWidth: 2,
    borderColor: colors._0B3970,
    ...commonFontStyle(700, 22, colors._0B3970),
    flex: 1,
    paddingBottom: hp(15),
    marginTop: hp(65),
  },
  btn: {
    marginHorizontal: wp(13),
  },
  btn1: {
    marginBottom: hp(38),
    borderColor: colors._0B3970
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
    ...commonFontStyle(400, 16, colors._0B3970),
    lineHeight: hp(24),
  },
  secText: {
    ...commonFontStyle(500, 25, colors._0B3970),
  },
  secText1: {
    marginVertical: hp(34),
    ...commonFontStyle(400, 17, colors._0B3970),
  },
  resendText: {
    ...commonFontStyle(600, 20, colors._0B3970),
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: hp(74),
  },
  info_row: {
    gap: wp(10),
    marginTop: hp(15),
    flexDirection: 'row',
  },
  cellStyle: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: colors._0B3970,
    // marginLeft: 6,
    // marginRight: 6,
  },
  cellStyle1: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: colors._0B3970,
    marginLeft: 6,
    marginRight: 6,
  },
  cellStyleFocused: {
    // borderWidth: 0,
  },
  textStyle: {
    ...commonFontStyle(300, 30, colors._0B3970),
    // bottom: 9,
  },
  textStyle1: {
    ...commonFontStyle(300, 30, colors._0B3970),
    bottom: -2,
    // paddingBottom: hp(-10),
  },
  foc_textStyle: {
    ...commonFontStyle(300, 60, colors._0B3970),
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
    ...commonFontStyle(400, 18, colors._0B3970),
  },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  selectedOptionContainer: {
    borderBottomColor: colors._0B3970,
  },
  optionText: {
    ...commonFontStyle(400, 21, colors._0B3970),
    flex: 1,
  },
  selectedText: {
    ...commonFontStyle(500, 21, colors._0B3970),
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
    ...commonFontStyle(400, 20, colors._0B3970),
    marginLeft: 10,
  },
  underline: {
    height: 2,
    backgroundColor: colors._0B3970,
    marginBottom: 20,
  },
  otpBox1: {
    width: wp(64),
    height: hp(50),
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: colors._0B3970,
    ...commonFontStyle(700, 30, colors._050505),
  },
  otpBox: {
    width: (width - 48 - 14 * 7) / 8,
    height: 50,
    borderBottomWidth: 2,
    textAlign: 'center',
    ...commonFontStyle(700, 30, colors._0B3970),
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
    ...commonFontStyle(400, 18, colors._0B3970),
    marginTop: 12,
  },
  profileImage: {
    width: wp(120),
    height: hp(120),
    borderRadius: hp(100),
    resizeMode: 'contain',
  },
  removeButton: {
    width: wp(22),
    height: hp(22),
    position: 'absolute',
    top: '25%',
    right: '40%',
    zIndex: 9999,
    overflow: 'visible',
    borderRadius: hp(22),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  inputcontainer: {
    borderWidth: 2,
    borderColor: colors._234F86,
    borderRadius: 10,
    paddingHorizontal: wp(23),
    paddingVertical: hp(16),
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  passinput: {
    ...commonFontStyle(700, 24, colors._0B3970),
    paddingTop: 8,
  },
  eye: {
    tintColor: colors._0B3970,
  },
  passlableCon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(9),
    marginBottom: hp(10),
    marginTop: hp(28),
  },
  shield: {
    width: wp(27),
    height: wp(27),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  passRule: {
    ...commonFontStyle(500, 25, colors._0B3970),
  },
  point: {
    width: wp(9),
    height: wp(9),
    backgroundColor: colors._0B3970,
    borderRadius: 100,
  },
  rules: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(20),
    paddingLeft: wp(10),
    paddingBottom: hp(2),
  },
  ruleTitle: {
    ...commonFontStyle(400, 15, colors._0B3970),
  },
  check: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
});
