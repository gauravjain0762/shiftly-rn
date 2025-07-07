import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {navigationRef} from '../../../navigation/RootContainer';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import PhoneInput from '../../../component/auth/PhoneInput';
import WelcomeModal from '../../../component/auth/WelcomeModal';

const options1 = [
  'Hospitality Group / Operator',
  'Hotel / Resort',
  'Restaurant / Café',
  'Beach Club',
  'Event / Catering Company',
  'Private Company',
  'Government Organization',
  'School / University',
  'Beach Club',
  'Event / Catering Company',
  'Private Company',
];

const size = ['0 - 50', '50 - 100', '100 - 500', '500 - 1,000', '1,000+'];

const Rule = [
  'Minimum 8 characters',
  'At least 1 uppercase letter',
  'At least 1 lowercase letter',
  'At least 1 number',
  'At least 1 special character (e.g. @, #, $, !)',
];

const CreateAccount = () => {
  const [step, setStep] = useState(1);
  const [selected1, setSelected1] = useState('Hotel/Resort');
  const [selected, setSelected] = useState('0 - 50');

  const [name, setName] = useState('');
  const [name1, setName1] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [timer, setTimer] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [web, setWeb] = useState('');

  const inputRefsOtp = useRef([]);
  const [otp, setOtp] = useState(new Array(4).fill(''));

  const nextStep = () => setStep(prev => prev + 1);

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    }
    setStep(prev => prev - 1);
  };
  const {t, i18n} = useTranslation();

  useEffect(() => {
    if (timer == 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

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
              <Text style={styles.title}>
                {t('What type of business are you?')}
              </Text>
              <Pressable style={styles.dateRow} onPress={() => {}}>
                <Text style={styles.dateText}>{selected1}</Text>
              </Pressable>
              <View style={styles.underline} />
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{maxHeight: hp(300)}}>
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
              </ScrollView>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => nextStep()}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('Business / Organization Name')}
              </Text>
              <View style={styles.row}>
                <CustomTextInput
                  placeholder={t('Enter Business / Organization Name')}
                  placeholderTextColor={colors._4A4A4A}
                  onChangeText={(e: any) => setName(e)}
                  value={name}
                  style={styles.input1}
                  containerStyle={styles.Inputcontainer}
                />
                <TouchableOpacity hitSlop={10}>
                  <Image
                    source={IMAGES.info}
                    resizeMode="contain"
                    style={styles.info}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => nextStep()}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('What is your name?')}</Text>
              <View style={styles.row}>
                <Image
                  source={IMAGES.badge}
                  resizeMode="contain"
                  style={styles.badge}
                />
                <CustomTextInput
                  placeholder={t('Enter Name')}
                  placeholderTextColor={colors._4A4A4A}
                  onChangeText={(e: any) => setName1(e)}
                  value={name1}
                  style={styles.input1}
                  containerStyle={styles.Inputcontainer}
                />
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => nextStep()}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('What is your company email address?')}
              </Text>
              <View style={styles.row}>
                <Image
                  source={IMAGES.mail}
                  resizeMode="contain"
                  style={styles.mail}
                />
                <CustomTextInput
                  placeholder={t('Enter Email')}
                  placeholderTextColor={colors._4A4A4A}
                  onChangeText={(e: any) => setMail(e)}
                  value={mail}
                  style={styles.input1}
                  containerStyle={styles.Inputcontainer}
                />
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => nextStep()}
            />
          </View>
        );
      case 5:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>{t('Set a secure password')}</Text>
              <CustomTextInput
                placeholder={t('Enter Password')}
                placeholderTextColor={colors._4A4A4A}
                onChangeText={(e: any) => setPassword(e)}
                value={password}
                secureTextEntry
                style={styles.input1}
                showRightIcon
                imgStyle={{tintColor: '#1C1B1F'}}
                containerStyle={styles.passwordContiner}
              />
              <View>
                <View style={styles.passlableCon}>
                  <Image
                    source={IMAGES.shield}
                    resizeMode="contain"
                    style={styles.shield}
                  />
                  <Text style={styles.passRule}>{t('Password Rule')}</Text>
                </View>
                {Rule?.map((item: any) => (
                  <View style={styles.rules}>
                    <View style={styles.point} />
                    <Text style={styles.ruleTitle}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => nextStep()}
            />
          </View>
        );
      case 6:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('What is your phone number?')}
              </Text>
              <PhoneInput
                callingCodeStyle={{
                  ...commonFontStyle(400, 22, colors._4A4A4A),
                }}
                downIcon={{
                  tintColor: colors._4A4A4A,
                }}
              />
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => nextStep()}
            />
          </View>
        );
      case 7:
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
                    <Text style={styles.secText}>{`00:${
                      timer < 10 ? `0${timer}` : timer
                    }`}</Text>
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
              type="Company"
              title={t('Next')}
              onPress={() => setShowModal(!showModal)}
            />
          </View>
        );

      case 8:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('What is your company website?')}
              </Text>
              <CustomTextInput
                placeholder={t('Enter website')}
                placeholderTextColor={colors._4A4A4A}
                onChangeText={(e: any) => setWeb(e)}
                value={web}
                style={styles.input}
                containerStyle={[styles.Inputcontainer, {marginTop: hp(20)}]}
              />
              <Text style={styles.title}>
                {t('Company size')}{' '}
                <Text style={{fontSize: 15}}>{t('(Employees)')}</Text>
              </Text>
              <Pressable style={styles.dateRow} onPress={() => {}}>
                <Text style={styles.dateText}>{selected}</Text>
              </Pressable>
              <View
                style={[styles.underline, {backgroundColor: colors._7B7878}]}
              />
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{maxHeight: hp(300)}}>
                {size.map((option, index) => {
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
              </ScrollView>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => nextStep()}
            />
          </View>
        );
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top', 'bottom']}}
      colors={['#FFF8E6', '#F3E1B7']}>
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
        </View>
        {renderStep()}
      </KeyboardAwareScrollView>
      <WelcomeModal
        name={t('Aboard!')}
        description={t(
          'We’re excited to have you here. Let’s complete your company profile to get started.',
        )}
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          nextStep();
        }}
        ButtonContainer={
          <View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Complete Profile')}
              onPress={() => {
                setShowModal(!showModal);
                nextStep();
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setShowModal(!showModal);
              }}
              style={styles.skip}>
              <Text style={styles.skiptitle}>{t('Skip')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </LinearContainer>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(35),
    paddingVertical: hp(35),
    paddingTop: hp(40),
    flex: 1,
  },
  scrollcontainer: {
    flexGrow: 1,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  back: {
    width: wp(21),
    height: wp(21),
    tintColor: colors._0B3970,
  },
  btn: {
    marginHorizontal: wp(13),
  },
  innerConrainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    ...commonFontStyle(500, 25, colors._0B3970),
    paddingTop: hp(30),
  },
  dateRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 10,
    marginTop: 67,
  },
  dateText: {
    ...commonFontStyle(400, 22, colors._4A4A4A),
    marginLeft: 10,
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
    ...commonFontStyle(400, 22, colors._4A4A4A),
    flex: 1,
  },
  selectedText: {
    ...commonFontStyle(500, 21, colors._4A4A4A),
  },
  underline: {
    height: 2,
    backgroundColor: colors._F4E2B8,
    marginBottom: 20,
  },
  input1: {
    ...commonFontStyle(400, 22, colors._4A4A4A),
    marginLeft: wp(12),
  },
  info: {
    width: wp(22),
    height: wp(22),
    tintColor: '#959595',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(65),
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingBottom: hp(16),
  },
  badge: {
    width: wp(28),
    height: wp(28),
    tintColor: colors.black,
  },
  Inputcontainer: {
    flex: 1,
    marginBottom: 0,
  },
  mail: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
  },
  passwordContiner: {
    justifyContent: 'space-between',
    borderBottomColor: colors._7B7878,
    borderBottomWidth: 1,
    paddingBottom: hp(14),
    marginTop: hp(65),
    flex: 1,
    marginBottom: 0,
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
  },
  passRule: {
    ...commonFontStyle(500, 25, colors._0B3970),
  },
  point: {
    width: wp(9),
    height: wp(9),
    backgroundColor: '#1C1B1F',
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
    ...commonFontStyle(400, 15, colors._4A4A4A),
  },
  info_row: {
    flexDirection: 'row',
    gap: wp(10),
    marginTop: hp(15),
  },
  infotext: {
    ...commonFontStyle(400, 20, colors._0B3970),
    lineHeight: hp(28),
    top: -8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(40),
  },
  otpBox1: {
    width: 70,
    height: 50,
    borderBottomWidth: 2,
    borderColor: colors._7B7878,
    textAlign: 'center',
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
    ...commonFontStyle(600, 20, colors._0B3970),
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: hp(74),
  },
  skip: {
    borderWidth: 2,
    borderColor: '#BDBDBD',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(10),
    marginTop: hp(24),
  },
  skiptitle: {
    ...commonFontStyle(400, 22, '#B4B4B4'),
    paddingVertical: hp(10),
  },
  input: {
    ...commonFontStyle(400, 22, colors._4A4A4A),
    paddingBottom: hp(16),
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: colors._7B7878,
  },
});
