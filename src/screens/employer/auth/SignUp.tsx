import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
  PinCodeInputs,
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
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
const {width} = Dimensions.get('window');

const PIN_LENGTH = 8;
const SignUp = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const {t, i18n} = useTranslation();
  const [timer, setTimer] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [selected, setSelected] = useState("I'm a job seeker");
  const [selected1, setSelected1] = useState('Male');
  const [selected2, setSelected2] = useState('United State America');
  const [selected3, setSelected3] = useState('United State America');
  const [date, setDate] = useState(new Date('2001-02-10'));
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const nextStep = () => setStep(prev => prev + 1);

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const [password, setPassword] = useState(new Array(8).fill(''));
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const inputRefs = useRef([]);
  const inputRefsOtp = useRef([]);

  const handleChange = (text: any, index: any) => {
    const newPass = [...password];
    newPass[index] = text;
    setPassword(newPass);

    if (text && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: any) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      password[index] === '' &&
      index > 0
    ) {
      const newPass = [...password];
      newPass[index - 1] = '';
      setPassword(newPass);
      inputRefs.current[index - 1]?.focus();
    }
  };

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

  const renderStep = () => {
    switch (step || 1) {
      case 1:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('What’s your full name?')}</Text>
              <CustomTextInput
                placeholder={t('Type your name here...')}
                placeholderTextColor={colors._F4E2B8}
                onChangeText={(e: any) => setName(e)}
                value={name}
                style={styles.input}
              />
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={() => nextStep()}
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
                onChangeText={(e: any) => setEmail(e)}
                value={email}
                style={styles.input}
              />
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={() => nextStep()}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('Set a secure password')}</Text>
              <View style={styles.info_row}>
                <Image source={IMAGES.info} style={styles.info} />
                <Text style={styles.infotext}>
                  {
                    'Password must include at least 8 characters, one uppercase letter, one number, and one symbol.'
                  }
                </Text>
              </View>
              {/* OTP Input */}
              <View style={styles.otpContainer}>
                {password.map((val, idx) => (
                  <TextInput
                    key={idx}
                    ref={el => (inputRefs.current[idx] = el)}
                    value={val ? '*' : ''}
                    onChangeText={text => handleChange(text, idx)}
                    onKeyPress={e => handleKeyPress(e, idx)}
                    maxLength={1}
                    style={styles.otpBox}
                    keyboardType="decimal-pad"
                    // secureTextEntry
                    autoFocus={idx === 0}
                  />
                ))}
              </View>
              {/* <SmoothPinCodeInput
                ref={pinInput}
                password
                // mask="﹡"
                cellSize={34}
                codeLength={8}
                value={pin}
                autoFocus
                onTextChange={(password: any) => setPin(password)}
                cellStyle={styles.cellStyle}
                cellStyleFocused={styles.cellStyleFocused}
                // animationFocused={false}
                textStyle={styles.textStyle}
                containerStyle={styles.pinconatiner}
                // onFulfill={code => {
                //   Keyboard.dismiss(); // or pinInput.current?.blur()
                // }}
                // animated={false}
              /> */}
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={() => nextStep()}
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
              <PhoneInput />
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={() => nextStep()}
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
                {otp.map((val, idx) => (
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
              {/* <SmoothPinCodeInput
                password
                // mask="﹡"
                cellSize={71}
                codeLength={4}
                value={otp}
                autoFocus
                onTextChange={(password: any) => setOtp(password)}
                cellStyle={styles.cellStyle1}
                cellStyleFocused={styles.cellStyleFocused}
                animationFocused={false}
                textStyle={styles.textStyle1}
                containerStyle={styles.pinconatiner1}
                animated={false}
              /> */}
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
                    <Text style={styles.secText}>
                      {timer} {t('Sec')}
                    </Text>
                    <Text style={styles.secText1}>
                      {t("Didn't receive the code? Resend in")} {timer}
                      {'s'}
                    </Text>
                    {/* {true && (
                      <View style={styles.errorRow}>
                        <Image
                          source={IMAGES.error_icon}
                          style={{width: 31, height: 28, resizeMode: 'contain'}}
                        />
                        <Text style={styles.errorText}>{t('Invalid OTP')}</Text>
                      </View>
                    )} */}
                  </View>
                )}
              </>
            </View>
            <GradientButton
              style={styles.btn}
              title={t('Next')}
              onPress={() => setShowModal(true)}
            />
          </View>
        );

      case 6:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('Which best describes you?')}</Text>
              <CustomTextInput
                placeholder={t('I’m a job seeker')}
                placeholderTextColor={colors._F4E2B8}
                onChangeText={(e: any) => setName(e)}
                value={name}
                style={styles.input1}
              />
              {options.map((option, index) => {
                const isSelected = option === selected;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionContainer,
                      // isSelected && styles.selectedOptionContainer,
                    ]}
                    onPress={() => setSelected(option)}>
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
              onPress={() => nextStep()}
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
                onPress={() => {
                  setOpen(true);
                }}>
                <Image
                  source={IMAGES.cake}
                  style={{width: 24, height: 24, resizeMode: 'contain'}}
                />
                <Text style={styles.dateText}>
                  {moment(date).format('DD/MM/YYYY')}
                </Text>
              </Pressable>

              <DateTimePicker
                value={new Date(date)}
                display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                isVisible={open}
                maximumDate={new Date()}
                onConfirm={dates => {
                  setOpen(false);

                  if (dates) setDate(dates);
                }}
                onCancel={() => setOpen(false)}
              />

              <View style={styles.underline} />
              <Text style={[styles.title, {marginTop: 40}]}>
                {t('What is your gender?')}
              </Text>
              {/* <CustomCalendar /> */}
              <Pressable style={styles.dateRow} onPress={() => {}}>
                <Text style={styles.dateText}>{selected1}</Text>
              </Pressable>
              <View style={styles.underline} />
              {options1.map((option, index) => {
                const isSelected = option === selected1;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionContainer,
                      // isSelected && styles.selectedOptionContainer,
                    ]}
                    onPress={() => setSelected1(option)}>
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
              onPress={() => nextStep()}
            />
          </View>
        );

      case 8:
        return (
          <View style={[styles.innerConrainer, {}]}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{t('Select your nationality ')}</Text>
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
                    style={[
                      styles.optionContainer,
                      // isSelected && styles.selectedOptionContainer,
                    ]}
                    onPress={() => setSelected2(option)}>
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
              {/* <CustomCalendar /> */}
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
                    style={[
                      styles.optionContainer,
                      // isSelected && styles.selectedOptionContainer,
                    ]}
                    onPress={() => setSelected3(option)}>
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
              onPress={() => nextStep()}
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
                onPress={() => {
                  setImageModal(true);
                }}
                style={styles.uploadBox}>
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={IMAGES.user} // Replace with your own image
                    style={{width: 91, height: 100, top: 15}}
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
              onPress={() => nextStep()}
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
                // style={styles.btn}
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
            onPress={() => {
              prevStep(step);
            }}
            hitSlop={8}
            style={[styles.backBtn, {flex: 1}]}>
            <Image
              resizeMode="contain"
              source={IMAGES.leftSide}
              style={styles.back}
            />
          </TouchableOpacity>
          {step == 9 && (
            <TouchableOpacity
              onPress={() => {
                nextStep();
              }}
              style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
        {renderStep()}
      </KeyboardAwareScrollView>
      <WelcomeModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          nextStep();
        }}
      />
      <ImagePickerModal
        actionSheet={imageModal}
        setActionSheet={() => {
          setImageModal(false);
        }}
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
    width: 70,
    height: 50,
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
