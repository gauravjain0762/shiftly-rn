import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

const ForgotPassword = () => {
  const {t} = useTranslation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const renderStepUI = () => {
    switch (step) {
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
          </>
        );
      case 2:
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
            if (step === 1) {
              navigationRef.goBack();
            } else {
              setStep(1);
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
        <Text style={passwordStyles.title}>{t('Forgot Password')}</Text>

        {renderStepUI()}

        <GradientButton
          type="Company"
          onPress={() => {
            if (step === 1) {
              //   if (email.trim() !== '') {
              setStep(2);
              //   } else {
              //   }
            } else {
              if (
                newPassword &&
                confirmPassword &&
                newPassword === confirmPassword
              ) {
                console.log('Reset password with:', newPassword);
              } else {
              }
            }
          }}
          style={passwordStyles.button}
          title="Submit"
        />
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default ForgotPassword;
