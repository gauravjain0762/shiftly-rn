import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import SmoothPinCodeInput from '@dreamwalk-os/react-native-smooth-pincode-input';

const PIN_LENGTH = 8;
const SignUp = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const {t, i18n} = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = (num?: any) => {
    if (num == 0) {
      navigationRef.goBack();
    }
    setStep(prev => prev - 1);
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
              <SmoothPinCodeInput
                password
                // mask="﹡"
                cellSize={34}
                codeLength={8}
                value={pin}
                autoFocus
                onTextChange={(password: any) => setPin(password)}
                cellStyle={styles.cellStyle}
                cellStyleFocused={styles.cellStyleFocused}
                animationFocused={false}
                textStyle={styles.textStyle}
                containerStyle={styles.pinconatiner}
                animated={false}
              />
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
            </View>
            <GradientButton
              style={styles.btn}
              title={'Next'}
              onPress={() => nextStep()}
            />
          </View>
        );

      default:
        return null;
    }
  };
  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <Progress.Bar
        progress={(step * 20) / 100}
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
        contentContainerStyle={styles.scrollcontainer}
        style={styles.container}>
        <TouchableOpacity
          onPress={() => prevStep()}
          hitSlop={8}
          style={styles.backBtn}>
          <Image
            resizeMode="contain"
            source={IMAGES.leftSide}
            style={styles.back}
          />
        </TouchableOpacity>
        {renderStep()}
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default SignUp;

const styles = StyleSheet.create({
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
  input: {
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    ...commonFontStyle(400, 22, colors._F4E2B8),
    flex: 1,
    paddingBottom: hp(15),
    marginTop: hp(65),
  },
  btn: {
    marginHorizontal: wp(13),
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
  info_row: {
    flexDirection: 'row',
    gap: wp(10),
    marginTop: hp(15),
  },
  cellStyle: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    marginLeft: 6,
    marginRight: 6,
  },
  cellStyleFocused: {
    borderWidth: 0,
  },
  textStyle: {
    ...commonFontStyle(300, 30, colors._F4E2B8),
    paddingBottom: hp(40),
  },
  foc_textStyle: {
    ...commonFontStyle(300, 60, colors._F4E2B8),
  },
  pinconatiner: {
    marginTop: hp(40),
  },
});
