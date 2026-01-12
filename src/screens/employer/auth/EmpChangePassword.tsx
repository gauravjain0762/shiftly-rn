import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  BackHeader,
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import { colors } from '../../../theme/colors';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import {
  useEmployeeChangePasswordMutation,
} from '../../../api/authApi';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import {
  errorToast,
  passwordRules,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import { IMAGES } from '../../../assets/Images';
import { setChangePasswordSteps, setUserInfo } from '../../../features/authSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { SCREENS } from '../../../navigation/screenNames';

const ChangePassword = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { changePasswordSteps } = useSelector((state: RootState) => state.auth);
  const [employeeChangedPassword] = useEmployeeChangePasswordMutation({});

  const handleChangePassword = async () => {
    if (!oldPassword.trim()) {
      errorToast('Please enter your old password');
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      errorToast('Please enter new password and confirm password');
      return;
    }

    if (!passwordRules.every(rule => rule.test(newPassword))) {
      errorToast('Password does not meet all the requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      errorToast('New password and confirm password do not match');
      return;
    }

    try {
      const res = await employeeChangedPassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap() as any;
      if (res?.status) {
        successToast(res?.message);
        dispatch(setUserInfo(res.data?.user));
        resetNavigation(SCREENS.TabNavigator);
      } else {
        errorToast(res?.message || 'Something went wrong');
      }
    } catch (error: any) {
      errorToast(error?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{ edges: ['bottom'] }}
      colors={[colors._F7F7F7, colors.white]}>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        // scrollEnabled={false}
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={passwordStyles.scrollcontainer}
        style={passwordStyles.container}>
        <BackHeader
          isRight={false}
          title="Change Password"
          titleStyle={{ flex: 1 }}
          containerStyle={{ gap: wp(20), paddingTop: hp(20) }}
        />

        {/* {renderStepUI()} */}
        <View style={passwordStyles.inputView}>
          <Text style={passwordStyles.label}>{t('Old Password')}</Text>
          <CustomTextInput
            showRightIcon
            value={oldPassword}
            inputStyle={passwordStyles.emailText}
            placeholder="Enter old password"
            placeholderTextColor={colors._7B7878}
            containerStyle={passwordStyles.inputcontainer}
            onChangeText={setOldPassword}
            isPassword
          />
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
            onChangeText={setConfirmPassword}
            isPassword
          />
          <View style={passwordStyles.passwordRulesContainer}>
            <View style={passwordStyles.passlableCon}>
              <Image
                source={IMAGES.shield}
                resizeMode="contain"
                style={passwordStyles.shield}
              />
              <Text style={passwordStyles.passRule}>{t('Password Rule')}</Text>
            </View>
            {passwordRules?.map((item: any, index: number) => {
              const passed = item?.test(newPassword);
              return (
                <View key={index} style={passwordStyles.rules}>
                  {passed ? (
                    <Image
                      source={IMAGES.check}
                      style={passwordStyles.check}
                      tintColor={colors._0B3970}
                    />
                  ) : (
                    <View style={passwordStyles.point} />
                  )}
                  <Text style={passwordStyles.ruleTitle}>{item?.label}</Text>
                </View>
              );
            })}
          </View>
          <GradientButton
            type="Employee"
            title="Submit"
            style={passwordStyles.button}
            onPress={handleChangePassword}
          />
        </View>
      </KeyboardAwareScrollView>
    </LinearContainer>
  );
};

export default ChangePassword;

export const passwordStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(25),
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
  title: {
    flex: 3,
    textAlign: 'center',
    ...commonFontStyle(500, 25, colors._2F2F2F),
  },
  description: {
    marginTop: hp(60),
    ...commonFontStyle(500, 17, colors._2F2F2F),
  },
  inputView: {
    gap: hp(16),
    marginTop: hp(50),
  },
  label: {
    ...commonFontStyle(400, 18, colors._2F2F2F),
  },
  inputcontainer: {
    borderWidth: hp(1),
    borderRadius: hp(10),
    paddingVertical: hp(12),
    paddingHorizontal: wp(23),
    minHeight: hp(50),
    borderColor: colors._D9D9D9,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  emailText: {
    flex: 1,
    ...commonFontStyle(400, 18, colors._050505),
    padding: 0,
    margin: 0,
  },
  button: {
    marginTop: hp(40),
    // backgroundColor: colors._F7F7F7
  },
  passwordRulesContainer: {
    marginTop: hp(28),
  },
  passlableCon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(9),
    marginBottom: hp(10),
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
