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
  useCompanyForgotPasswordMutation,
  useCompanyResetPasswordMutation,
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
  const [email, setEmail] = useState(__DEV__ ? 'db@company.com' : '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {changePasswordSteps} = useSelector((state: RootState) => state.auth);
  const [companyForgotPassword] = useCompanyForgotPasswordMutation({});
  const [companyChangedPassword] = useCompanyResetPasswordMutation({});

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      errorToast('Please enter new password and confirm password');
      return;
    }
    try {
      const res = await companyChangedPassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      if (res?.status) {
        successToast(res?.message);
        dispatch(setUserInfo(res.data?.user));
        resetNavigation(SCREENS.CoTabNavigator);
      } else {
        errorToast(res?.message || 'Something went wrong');
      }
    } catch (error: any) {
      errorToast(error?.data?.message || 'Failed to send OTP');
    }
  };

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    } else {
      dispatch(setChangePasswordSteps(changePasswordSteps - 1));
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
            imgStyle={passwordStyles.eye}
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
            imgStyle={passwordStyles.eye}
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
            imgStyle={passwordStyles.eye}
            value={confirmPassword}
            inputStyle={passwordStyles.emailText}
            placeholder="Confirm new password"
            placeholderTextColor={colors._7B7878}
            containerStyle={passwordStyles.inputcontainer}
            onChangeText={setConfirmPassword}
            isPassword
          />
          <GradientButton
            type="Company"
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
    tintColor: colors._0B3970,
  },
  title: {
    marginTop: hp(20),
    paddingTop: hp(10),
    ...commonFontStyle(500, 25, colors._0B3970),
  },
  description: {
    marginTop: hp(60),
    ...commonFontStyle(500, 17, colors._7B7878),
  },
  inputView: {
    gap: hp(16),
    marginTop: hp(50),
  },
  label: {
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  inputcontainer: {
    borderWidth: hp(1),
    borderRadius: hp(10),
    paddingVertical: hp(16),
    paddingHorizontal: wp(23),
    borderColor: colors._234F86,
    justifyContent: 'space-between',
  },
  emailText: {
    flex: 1,
    paddingRight: wp(10),
    ...commonFontStyle(400, 18, colors._3D3D3D),
  },
  button: {
    marginTop: hp(50),
  },
  eye: {
    tintColor: '#CDB682',
  },
});
