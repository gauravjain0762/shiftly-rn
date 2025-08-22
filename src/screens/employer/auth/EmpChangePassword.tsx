import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {navigationRef} from '../../../navigation/RootContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {
  useEmployeeChangePasswordMutation,
  useEmployeeForgotPasswordMutation,
} from '../../../api/authApi';
import {RootState} from '../../../store';
import {useSelector} from 'react-redux';
import {
  errorToast,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {setChangePasswordSteps, setUserInfo} from '../../../features/authSlice';
import {useAppDispatch} from '../../../redux/hooks';
import {SCREENS} from '../../../navigation/screenNames';

const ChangePassword = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState(__DEV__ ? 'bilal@devicebee.com' : '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {changePasswordSteps} = useSelector((state: RootState) => state.auth);
  const [employeeForgotPassword] = useEmployeeForgotPasswordMutation({});
  const [employeeChangedPassword] = useEmployeeChangePasswordMutation({});

  const handleVerifyEmail = async () => {
    if (!email.trim()) {
      errorToast('Please enter a valid email');
      return;
    }
    try {
      const res = await employeeForgotPassword({email}).unwrap();
      if (res?.status) {
        successToast('Email verified successfully');
        dispatch(setUserInfo(res.data?.user));
        nextStep();
      } else {
        errorToast(res?.message || 'Something went wrong');
      }
    } catch (error: any) {
      errorToast(error?.data?.message || 'Failed to send OTP');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      errorToast('Please enter new password and confirm password');
      return;
    }

    try {
      const res = await employeeChangedPassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
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

  const nextStep = () =>
    dispatch(setChangePasswordSteps(changePasswordSteps + 1));

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    } else {
      dispatch(setChangePasswordSteps(changePasswordSteps - 1));
    }
  };

  // const renderStepUI = () => {
  //   switch (changePasswordSteps) {
  //     case 1:
  //       return (
  //         <>
  //           <Text style={passwordStyles.description}>
  //             {t(
  //               'Enter the email associated with your account and we’ll send an email instructions to reset your password.',
  //             )}
  //           </Text>
  //           <View style={passwordStyles.inputView}>
  //             <Text style={passwordStyles.label}>{t('Your Email')}</Text>
  //             <CustomTextInput
  //               value={email}
  //               style={passwordStyles.emailText}
  //               placeholder="Enter your email"
  //               placeholderTextColor={colors._7B7878}
  //               containerStyle={passwordStyles.inputcontainer}
  //               onChangeText={setEmail}
  //             />
  //           </View>
  //           <GradientButton
  //             type="Employee"
  //             title="Submit"
  //             onPress={handleVerifyEmail}
  //             style={passwordStyles.button}
  //           />
  //         </>
  //       );
  //     case 2:
  //       return (

  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top', 'bottom']}}
      colors={['#0D468C', '#041326']}>
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
            prevStep(changePasswordSteps);
          }}
          hitSlop={8}
          style={[passwordStyles.backBtn]}>
          <Image
            resizeMode="contain"
            source={IMAGES.leftSide}
            style={passwordStyles.back}
          />
        </TouchableOpacity>
        <Text style={passwordStyles.title}>{t('Change Password')}</Text>

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
    paddingVertical: hp(35),
    paddingHorizontal: wp(35),
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
    tintColor: colors._FBE7BD,
  },
  title: {
    marginTop: hp(20),
    paddingTop: hp(10),
    ...commonFontStyle(500, 25, colors.white),
  },
  description: {
    marginTop: hp(60),
    ...commonFontStyle(500, 17, colors.white),
  },
  inputView: {
    gap: hp(16),
    marginTop: hp(50),
  },
  label: {
    ...commonFontStyle(400, 18, colors._FBE7BD),
  },
  inputcontainer: {
    borderWidth: hp(1),
    borderRadius: hp(10),
    paddingVertical: hp(16),
    paddingHorizontal: wp(23),
    borderColor: colors._FBE7BD,
    justifyContent: 'space-between',
  },
  emailText: {
    flex: 1,
    ...commonFontStyle(400, 18, colors._FBE7BD),
  },
  button: {
    marginTop: hp(50),
    // backgroundColor: colors._FBE7BD
  },
});
