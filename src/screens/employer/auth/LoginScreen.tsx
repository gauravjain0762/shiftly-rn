// LoginScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {commonFontStyle, hp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppStyles} from '../../../theme/appStyles';
import {CustomTextInput} from '../../../component';
import CustomBtn from '../../../component/common/CustomBtn';
import {useTranslation} from 'react-i18next';

const LoginScreen = () => {
  const {t, i18n} = useTranslation();

  return (
    <LinearGradient colors={['#043379', '#041F50']} style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[AppStyles.flexGrow, {}]}
        showsVerticalScrollIndicator={false}>
        <Image source={IMAGES.logog} style={styles.logo} />

        <View style={[styles.inputWrapper, {marginBottom: hp(67)}]}>
          <Text style={styles.labelText}>Enter your email to login</Text>

          <CustomTextInput
            placeholder="Email"
            placeholderTextColor={colors._F4E2B8}
          />
        </View>

        <View style={[styles.inputWrapper, {marginBottom: hp(67)}]}>
          <Text style={styles.labelText}>Enter your password</Text>
          <CustomTextInput
            placeholder="Password"
            placeholderTextColor={colors._F4E2B8}
            showRightIcon={true}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <View style={{marginHorizontal: 35}}>
          <CustomBtn label={t('Login')} onPress={() => {}} />

          <Text style={styles.orText}>Or</Text>

          <CustomBtn label={t('Sign Up')} onPress={() => {}} />
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    height: 60,
    resizeMode: 'contain',
    marginBottom: hp(84),
    marginTop: hp(100),
  },
  inputWrapper: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: colors._F4E2B8,
    marginHorizontal: 35,
  },
  labelText: {
    ...commonFontStyle(400, 22, colors.white),
    marginBottom: 11,
  },
  inputLabel: {
    ...commonFontStyle(700, 16, '#FBE7BD'),
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors._F4E2B8,
  },
  forgotText: {
    textAlign: 'center',
    marginBottom: hp(38),
    ...commonFontStyle(400, 18, '#DCDCDC'),
  },
  primaryButton: {
    backgroundColor: '#FBE7BD',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButtonText: {
    ...commonFontStyle(700, 17, '#000'),
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    ...commonFontStyle(500, 15, '#FFFFFF'),
  },
});
