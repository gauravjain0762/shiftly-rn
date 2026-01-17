import {
  Animated,
  FlatList,
  Image,
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CustomDropdown,
  CustomTextInput,
  GradientButton,
  LinearContainer,
  LocationContainer,
} from '../../../component';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { IMAGES } from '../../../assets/Images';
import { navigationRef } from '../../../navigation/RootContainer';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import { AppStyles } from '../../../theme/appStyles';
import PhoneInput from '../../../component/auth/PhoneInput';
import WelcomeModal from '../../../component/auth/WelcomeModal';
import {
  companyEmailCheck,
  errorToast,
  fullNameCheck,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import { getAddressList, getPlaceDetails, requestLocationPermission } from '../../../utils/locationHandler';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  useCompanyOTPVerifyMutation,
  useCompanySignUpMutation,
  useGetBusinessTypesQuery,
} from '../../../api/authApi';
import {
  clearCompanyRegisterData,
  setCompanyProfileAllData,
  setCompanyProfileData,
  setCompanyRegisterData,
  setCompanyRegistrationStep,
  setRegisterSuccessModal,
  setUserInfo,
} from '../../../features/authSlice';
import { useAppDispatch } from '../../../redux/hooks';
import {
  useCreateCompanyProfileMutation,
  useGetServicesQuery,
} from '../../../api/dashboardApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CharLength from '../../../component/common/CharLength';
import CustomCheckBox from '../../../component/common/CustomCheckBox';
import { debounce } from 'lodash';
import BaseText from '../../../component/common/BaseText';
import Tooltip from '../../../component/common/Tooltip';

export const companySize = [
  { label: '0 - 50', value: '0 - 50' },
  { label: '50 - 100', value: '50 - 100' },
  { label: '100 - 500', value: '100 - 500' },
  { label: '500 - 1,000', value: '500 - 1,000' },
  { label: '1,000+', value: '1,000+' },
];

const rules = [
  { label: 'Minimum 8 characters', test: (pw: string | any[]) => pw.length >= 8 },
  {
    label: 'At least 1 uppercase letter',
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: 'At least 1 lowercase letter',
    test: (pw: string) => /[a-z]/.test(pw),
  },
  { label: 'At least 1 number', test: (pw: string) => /\d/.test(pw) },
  {
    label: 'At least 1 special character (e.g. @, #, $, !)',
    test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
];

const CreateAccount = () => {
  const navigation = useNavigation<any>();
  const {
    businessType = [],
    fcmToken,
    language,
    companyRegistrationStep,
    companyRegisterData,
    userInfo,
    registerSuccessModal,
    companyProfileData,
  } = useSelector((state: RootState) => state.auth);
  console.log(">>>>>>>>> ~ CreateAccount ~ companyRegisterData:", companyRegisterData)
  const {
    services = [],
    logo,
    cover_images,
    otp,
  } = useSelector((state: any) => state.auth.companyProfileData || {});
  const { data: businessTypes } = useGetBusinessTypesQuery({});
  const { data: servicesData } = useGetServicesQuery({});
  const serviceList = servicesData?.data?.services;
  const dispatch = useAppDispatch();
  const [companySignUp] = useCompanySignUpMutation();
  const [OtpVerify] = useCompanyOTPVerifyMutation();
  const [companyProfile] = useCreateCompanyProfileMutation();

  const [timer, setTimer] = useState(30);
  const [serviceSelect, setServiceSelect] = useState<string[]>([]);
  const [imageModal, setImageModal] = useState(false);
  const [position, setPosition] = useState<any>(undefined);
  const mapRef = useRef<any>(null);
  const inputRefsOtp = useRef<any>([]);
  // const [otp, setOtp] = useState(new Array(4).fill(''));
  const [type, setType] = useState<'logo' | 'cover'>('logo');
  const [model, setModel] = useState(false);
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showLogoTooltip, setShowLogoTooltip] = useState(false);
  const [showCoverTooltip, setShowCoverTooltip] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      dispatch(clearCompanyRegisterData());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  useEffect(() => {
    if (!companyProfileData?.website || companyProfileData?.website === '') {
      dispatch(
        setCompanyProfileData({
          ...companyProfileData,
          website: 'https://',
        }),
      );
    }
  }, [companyProfileData, dispatch]);

  useEffect(() => {
    onCurrentLocation();
    // dispatch(setCompanyRegistrationStep(1));
  }, [companyRegistrationStep]);

  const onCurrentLocation = async () => {
    await requestLocationPermission(
      false,
      position => {
        let dataTemp = {
          latitude: position?.latitude,
          longitude: position?.longitude,
          latitudeDelta: position?.latitudeDelta,
          longitudeDelta: position?.longitudeDelta,
        };
        setPosition(dataTemp);
        mapRef?.current?.animateToRegion(dataTemp);
      },
      (error: any) => {
        console.log(error);
      },
    );
  };

  // useEffect(() => {
  //   if (inputRefsOtp.current[0]) {
  //     inputRefsOtp.current[0].focus();
  //   }
  // }, []);

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
      dispatch(setCompanyRegistrationStep(Number(companyRegistrationStep) + 1));
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

  const prevStep = (num?: any) => {
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
        dispatch(setCompanyRegistrationStep(Number(companyRegistrationStep) - 1));
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
  const { t } = useTranslation();

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

  const handleEmailChange = (email: string) => {
    dispatch(setCompanyRegisterData({ email }));

    if (!email.trim()) {
      setValidationMsg('');
      setIsValid(null);
      return;
    }

    if (companyEmailCheck(email)) {
      setValidationMsg('✅ Looks good!');
      setIsValid(true);
    } else {
      setValidationMsg(
        '❌ Please enter a valid company email (not Gmail / Yahoo).',
      );
      setIsValid(false);
    }
  };

  const handleChangeOtp = (text: any, index: any) => {
    const newPass = [...otp];
    newPass[index] = text;
    dispatch(setCompanyProfileData({ otp: newPass }));

    if (text && index < 3) {
      inputRefsOtp.current[index + 1]?.focus();
    }
  };

  const handleKeyPressOtp = (e: any, index: any) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      const newPass = [...otp];
      newPass[index - 1] = '';
      dispatch(setCompanyProfileData({ otp: newPass }));
      inputRefsOtp.current[index - 1]?.focus();
    }
  };

  const UploadPhoto = (e: any) => {
    if (type === 'cover') {
      const newImage = {
        name: e?.filename || e?.name || 'cover.jpg',
        uri: e?.sourceURL || e?.uri || e?.path,
        type: e?.mime || 'image/jpeg',
      };
      dispatch(
        setCompanyProfileData({
          cover_images: [...(cover_images || []), newImage],
        }),
      );
    } else {
      const newLogo = {
        name: e?.filename ?? e?.name,
        uri: e?.sourceURL,
        type: e?.mime,
      };

      dispatch(
        setCompanyProfileData({
          logo: newLogo,
        }),
      );
    }
  };

  const handleRemoveCoverImage = (index: number) => {
    dispatch(
      setCompanyProfileData({
        cover_images: cover_images.filter((_: any, i: number) => i !== index),
      }),
    );
  };

  const handleSignup = async () => {
    const formData = new FormData();

    console.log(
      'companyProfileData?.website>>>>>. ',
      companyProfileData?.website,
    );
    console.log(
      'companyProfileData?.company_size>>>>>. ',
      companyProfileData?.company_size,
    );
    formData.append('website', companyProfileData?.website || '');
    formData.append('company_size', companyProfileData?.company_size || '');
    formData.append('address', userInfo?.address || '');
    formData.append('lat', userInfo?.lat?.toString() || '0');
    formData.append('lng', userInfo?.lng?.toString() || '0');
    formData.append('about', companyProfileData?.about || '');
    formData.append('mission', companyProfileData?.mission || '');
    formData.append('values', companyProfileData?.values || '');
    formData.append('services', companyProfileData?.services?.join(',') || '');
    formData.append(
      'business_type_id',
      companyRegisterData?.business_type_id || '',
    );
    formData.append('company_name', companyRegisterData?.company_name || '');
    formData.append('name', companyRegisterData?.name || '');
    formData.append('email', companyRegisterData?.email || '');
    formData.append('password', companyRegisterData?.password || '');
    formData.append('phone_code', companyRegisterData?.phone_code);
    formData.append('phone', companyRegisterData?.phone || '');
    formData.append('language', language || 'en');
    formData.append('deviceToken', fcmToken ?? 'ddd');
    formData.append('deviceType', Platform.OS);

    // Add logo if exists
    if (companyProfileData?.logo?.uri) {
      formData.append('logo', {
        uri: companyProfileData.logo.uri,
        type: companyProfileData.logo.type || 'image/jpeg',
        name: companyProfileData.logo.name || 'logo.jpg',
      });
    }

    if (
      companyProfileData?.cover_images &&
      companyProfileData.cover_images.length > 0
    ) {
      companyProfileData.cover_images.forEach((image: any, index: number) => {
        if (image?.uri) {
          const imageData = {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.name || `cover_${index}.jpg`,
          };

          formData.append('cover_images', imageData);
        }
      });
    }

    const response: any = await companySignUp(formData).unwrap();
    // console.log(response, response?.status, 'response----handleSignup');
    dispatch(setCompanyProfileAllData(response?.data?.company));
    if (response?.status) {
      successToast(response?.message);
      setStart((prev: boolean) => !prev);
      nextStep();
      // dispatch(
      //   setCompanyRegisterData({
      //     business_type_id: '',
      //     company_name: '',
      //     name: '',
      //     email: '',
      //     password: '',
      //     phone_code: '971',
      //     phone: '',
      //   }),
      // );
    } else {
      errorToast(response?.message);
    }
  };
  // const emailCheck = async () => {
  //   // Add validation before API call
  //   if (!companyRegisterData?.email) {
  //     errorToast('Please enter email address');
  //     return;
  //   }

  //   // Basic email validation
  //   if (!emailRegex.test(companyRegisterData.email)) {
  //     errorToast('Please enter a valid email address');
  //     return;
  //   }

  //   // setEmailLoading(true);

  //   try {
  //     let data = {
  //       email: companyRegisterData?.email,
  //       validate_email: true,
  //     };

  //     const response = await companySignUp(data).unwrap();

  //     if (response?.status) {
  //       nextStep();
  //     } else {
  //       errorToast(response?.message || 'Email validation failed');
  //     }
  //   } catch (error: any) {
  //     console.error('Email validation error:', error);
  //     errorToast(
  //       error?.data?.message || 'Something went wrong. Please try again.',
  //     );
  //   }
  // };

  const verifyOTP = async () => {
    let data = {
      otp: otp.join(''),
      company_id: userInfo?._id,
      language: language,
      deviceToken: fcmToken ?? 'ddd',
      deviceType: Platform.OS,
    };

    const response: any = await OtpVerify(data).unwrap();
    // console.log(response, 'response----');
    if (response?.status) {
      dispatch(setRegisterSuccessModal(true));
      successToast(response?.message);
    } else {
      errorToast(response?.message);
    }
  };

  const handleCreateProfile = async (type?: string) => {
    const formData = new FormData();
    console.log(
      'companyProfileData?.website>>>>>. ',
      companyProfileData?.website,
    );

    // Add regular fields
    formData.append('website', companyProfileData?.website || '');
    formData.append('company_size', companyProfileData?.company_size || '');
    formData.append('address', userInfo?.address || '');
    formData.append('lat', userInfo?.lat?.toString() || '0');
    formData.append('lng', userInfo?.lng?.toString() || '0');
    formData.append('about', companyProfileData?.about || '');
    formData.append('mission', companyProfileData?.mission || '');
    formData.append('values', companyProfileData?.values || '');
    formData.append('services', companyProfileData?.services?.join(',') || '');
    formData.append('company_name', companyRegisterData?.company_name || '');

    // console.log(
    //   '🔥 ~ handleCreateProfile ~ formData:',
    //   JSON.stringify(formData),
    // );
    // Add logo if exists
    if (companyProfileData?.logo?.uri) {
      formData.append('logo', {
        uri: companyProfileData.logo.uri,
        type: companyProfileData.logo.type || 'image/jpeg',
        name: companyProfileData.logo.name || 'logo.jpg',
      });
    }

    if (
      companyProfileData?.cover_images &&
      companyProfileData?.cover_images?.length > 0
    ) {
      companyProfileData?.cover_images.forEach((image: any, index: number) => {
        if (image?.uri) {
          const fileName =
            image.fileName ||
            image.name ||
            `cover_${index}.${image.uri.split('.').pop() || 'jpg'}`;

          const fileType =
            image.type ||
            (fileName.endsWith('.png') ? 'image/png' : 'image/jpeg');

          const imageData = {
            uri: image.uri,
            type: fileType,
            name: fileName,
          };

          formData.append('cover_images', imageData);
        }
      });
    }

    const response: any = await companyProfile(formData).unwrap();
    // console.log(response, response?.status, 'response----handleCreateProfile');
    dispatch(setCompanyProfileAllData(response?.data?.company));
    if (response?.status) {
      if (type === 'complete') {
        resetNavigation(SCREENS.CoStack, SCREENS.CompanyProfile, { fromOnboarding: true });
      } else {
        resetNavigation(SCREENS.CoTabNavigator);
      }
      dispatch(
        setCompanyRegisterData({
          business_type_id: '',
          company_name: '',
          name: '',
          email: '',
          password: '',
          phone_code: '971',
          phone: '',
          countryCode: 'AE',
        }),
      );
      successToast(response?.message);
    } else {
      errorToast(response?.message);
    }
  };

  const {getAppData} = useSelector((state: RootState) => state.auth);
  const mapKey = getAppData?.map_key;

  const debouncedGetAddressList = useCallback(
    debounce(async (text: string) => {
      const result = await getAddressList(text, mapKey);
      setSuggestions(result?.slice(0, 5) || []);
    }, 500),
    [mapKey],
  );

  const renderStep = () => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    };

    switch (companyRegistrationStep || 1) {
      case 1:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>
                {t('What type of business are you?')}
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: hp(350), marginTop: hp(15) }}>
                <CustomDropdown
                  data={
                    (businessTypes as any)?.data?.types?.map((item: any) => ({
                      label: item.title,
                      value: item._id,
                    })) || []
                  }
                  label={t('Business Type')}
                  required
                  labelField="label"
                  valueField="value"
                  placeholder={'Please select a business type'}
                  value={companyRegisterData?.business_type_id}
                  onChange={(e: any) => {
                    dispatch(
                      setCompanyRegisterData({
                        business_type_id: e?.value,
                      }),
                    );
                  }}
                  dropdownStyle={styles.dropdown}
                  renderRightIcon={IMAGES.ic_down}
                  RightIconStyle={styles.rightIcon}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </ScrollView>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                if (!companyRegisterData?.business_type_id) {
                  errorToast('Please select business type');
                  return;
                }
                dispatch(
                  setCompanyRegisterData({
                    business_type_id:
                      companyRegisterData?.business_type_id === ''
                        ? businessType[0]?._id
                        : companyRegisterData?.business_type_id,
                  }),
                );
                nextStep();
              }}
            />
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t('Business Name')}</Text>
              <View style={styles.row}>
                <CustomTextInput
                  label={t('Business Name')}
                  required
                  placeholder={t('Ex: Atlantis The Palm, Dubai')}
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(companyName: string) => {
                    dispatch(
                      setCompanyRegisterData({
                        company_name: companyName,
                      }),
                    );
                  }}
                  value={companyRegisterData?.company_name}
                  inputStyle={styles.input1}
                  containerStyle={styles.Inputcontainer}
                  numberOfLines={1}
                  maxLength={50}
                />
              </View>
              <CharLength
                chars={50}
                value={companyRegisterData?.company_name}
              />
              {model && (
                <View style={styles.infomodel}>
                  <Text style={styles.businessName}>{t('Business Name')}</Text>
                  <Text style={styles.bussinessinfo}>
                    {t(
                      'This name will appear on your job listings and candidate messages',
                    )}
                  </Text>
                  <GradientButton
                    style={styles.closebtn}
                    type="Company"
                    title={t('Close')}
                    onPress={() => setModel(!model)}
                    textContainerStyle={{
                      paddingVertical: hp(10),
                      paddingHorizontal: wp(14),
                    }}
                    textStyle={{ fontSize: 14 }}
                  />
                </View>
              )}
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                if (!companyRegisterData?.company_name?.trim()) {
                  errorToast('Please enter business name');
                  return;
                }
                nextStep();
              }}
            />
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t("Account Manager's Name")}</Text>
              <View style={styles.row}>
                {/* <Image
                  source={IMAGES.badge}
                  resizeMode="contain"
                  style={styles.badge}
                /> */}
                <CustomTextInput
                  label={t('Account Manager Name')}
                  required
                  placeholder={t('Ex: John Smith')}
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(name: string) =>
                    dispatch(
                      setCompanyRegisterData({
                        name,
                      }),
                    )
                  }
                  inputStyle={styles.input1}
                  value={companyRegisterData?.name}
                  containerStyle={styles.Inputcontainer}
                  maxLength={50}
                />
                <TouchableOpacity
                  onPress={() => setShowTooltip(!showTooltip)}
                  style={{ marginLeft: wp(8) }}>
                  <Image source={IMAGES.info} style={styles.iBtn} />
                </TouchableOpacity>
                {showTooltip && (
                  <View style={styles.iBtnTxt}>
                    <Text style={styles.txtColor}>
                      {'Your name is not displayed on published job posts.'}
                    </Text>
                  </View>
                )}
              </View>
              <CharLength chars={50} value={companyRegisterData?.name} />
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                const name = companyRegisterData?.name?.trim();

                if (!name) {
                  errorToast('Please enter your name');
                  return;
                }
                if (!fullNameCheck(name)) {
                  errorToast('Please enter both first and last name');
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
                {t('What is your company email address?')}
              </Text>
              <View style={styles.row}>
                <Image
                  source={IMAGES.mail}
                  resizeMode="contain"
                  style={styles.mail}
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.labelRow}>
                    <Text style={styles.emailLabel}>
                      {t('Email')}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowTooltip(!showTooltip)}
                      style={{ marginLeft: wp(8) }}>
                      <Image source={IMAGES.info} style={styles.iBtn} />
                    </TouchableOpacity>
                  </View>
                  {showTooltip && (
                    <View style={styles.iBtnTxt}>
                      <Text style={styles.txtColor}>
                        {
                          'Please use your official company email.\nPersonal emails (e.g., Gmail, Yahoo) are not accepted.'
                        }
                      </Text>
                    </View>
                  )}
                  <CustomTextInput
                    placeholder={t('Enter your email')}
                    placeholderTextColor={colors._7B7878}
                    onChangeText={handleEmailChange}
                    value={companyRegisterData?.email}
                    inputStyle={[styles.input1, { textTransform: 'lowercase', marginTop: 20, paddingLeft: 0, marginLeft: 0 }]}
                    containerStyle={[styles.Inputcontainer, { marginBottom: 0, marginTop: 0, paddingLeft: 0 }]}
                  />
                </View>
              </View>

              {validationMsg.length > 0 && (
                <Text
                  style={[styles.validTxt, { color: isValid ? 'green' : 'red' }]}>
                  {validationMsg}
                </Text>
              )}
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                const email = companyRegisterData?.email?.trim();

                if (!email) {
                  errorToast('Please enter your email address');
                  return;
                }

                if (!companyEmailCheck(email)) {
                  errorToast(
                    'Please enter a valid company email (not Gmail, Yahoo, etc.)',
                  );
                  return;
                }
                nextStep();
              }}
            />
          </Animated.View>
        );
      case 5:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t('Set a secure password')}</Text>
              <CustomTextInput
                label={t('Password')}
                required
                placeholder={t('Enter Password')}
                placeholderTextColor={colors._7B7878}
                onChangeText={(e: any) =>
                  dispatch(
                    setCompanyRegisterData({
                      password: e,
                    }),
                  )
                }
                value={companyRegisterData?.password}
                secureTextEntry={!visible}
                inputStyle={[styles.input1, AppStyles.flex]}
                showRightIcon
                isPassword
                imgStyle={{ tintColor: '#1C1B1F' }}
                containerStyle={styles.passwordContiner}
                onShow={e => setVisible(e)}
              />
              <View>
                <View style={styles.passlableCon}>
                  <Image
                    source={IMAGES.shield}
                    resizeMode="contain"
                    style={styles.shield}
                  />
                  <Text style={styles.passRule}>{t('Password Rules')}</Text>
                </View>
                {rules?.map((item: any, index: number) => {
                  const passed = item?.test(companyRegisterData?.password);
                  return (
                    <View key={index} style={styles.rules}>
                      {passed ? (
                        <Image source={IMAGES.checked} style={styles.check} />
                      ) : (
                        <View style={styles.point} />
                      )}
                      <Text style={styles.ruleTitle}>{item?.label}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.checkBox}>
                <CustomCheckBox
                  checked={isChecked}
                  onPress={() => setIsChecked(!isChecked)}
                  label={
                    <Text style={styles.txt}>
                      I agree to the{' '}
                      <Text style={styles.linkedTxt} onPress={() => { }}>
                        Terms & Conditions
                      </Text>{' '}
                      and{' '}
                      <Text style={styles.linkedTxt} onPress={() => { }}>
                        Privacy Policy
                      </Text>
                    </Text>
                  }
                />
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                if (!companyRegisterData?.password) {
                  errorToast('Please enter your password');
                  return;
                }
                if (
                  !rules.every(rule => rule.test(companyRegisterData?.password))
                ) {
                  errorToast('Password does not meet all the requirements');
                  return;
                }

                if (!isChecked) {
                  errorToast(
                    'You must agree to the Terms & Conditions and Privacy Policy',
                  );
                  return;
                }

                nextStep();
              }}
            />
          </Animated.View>
        );
      case 6:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>
                {t('What is your phone number?')}
              </Text>
              <Text style={styles.fieldLabel}>
                {t('Phone Number')}<Text style={styles.required}>*</Text>
              </Text>
              <PhoneInput
                countryCode={companyRegisterData?.countryCode}
                callingCode={companyRegisterData?.phone_code}
                placeholder={t('Enter your phone')}
                phoneStyle={{ color: colors._0B3970 }}
                callingCodeStyle={{ color: colors._0B3970 }}
                placeholderTextColor={colors._7B7878}
                phone={companyRegisterData?.phone}
                downIcon={{
                  tintColor: colors._4A4A4A,
                }}
                onPhoneChange={(e: any) =>
                  dispatch(setCompanyRegisterData({ phone: e }))
                }
                onCallingCodeChange={(e: any) =>
                  dispatch(
                    setCompanyRegisterData({
                      phone_code: e.callingCode[0],
                      countryCode: e.cca2,
                    }),
                  )
                }
                maxLength={12}
              />
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                if (!companyRegisterData?.phone?.trim()) {
                  errorToast('Please enter your phone number');
                  return;
                }
                if (companyRegisterData?.phone.length < 9) {
                  errorToast('Please enter a valid phone number');
                  return;
                }
                handleSignup();
              }}
            />
          </Animated.View>
        );
      case 7: {
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>{t('Verify OTP Code')}</Text>
              {timer !== 0 && (
                <View style={[styles.info_row, { marginTop: hp(19) }]}>
                  <Text style={styles.infotext}>
                    We’ve sent a 4-digit code to your email{' '}
                    <Text style={{ fontWeight: 'bold', color: '_0B3970' }}>
                      {companyRegisterData?.email || 'N/A'}
                    </Text>
                    . Please enter it below.
                  </Text>
                </View>
              )}
              <View style={styles.otpContainer}>
                {otp?.map((val: any, idx: any | undefined) => (
                  <TextInput
                    key={idx}
                    ref={(el: any) => (inputRefsOtp.current[idx] = el)}
                    value={val ? '*' : ''}
                    onChangeText={text => handleChangeOtp(text, idx)}
                    onKeyPress={e => handleKeyPressOtp(e, idx)}
                    maxLength={1}
                    style={styles.otpBox1}
                    keyboardType="decimal-pad"
                  // autoFocus={idx === 0 && otp.every(v => v === '')}
                  />
                ))}
              </View>
              <>
                {timer == 0 ? (
                  <Text
                    onPress={() => {
                      setTimer(30);
                    }}
                    style={styles.resendText}>
                    {t('Resend')}
                  </Text>
                ) : !registerSuccessModal ? (
                  <View style={[{ marginTop: hp(31), alignItems: 'center' }]}>
                    <Text style={styles.secText}>{`00:${timer < 10 ? `0${timer}` : timer
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
                ) : null}
              </>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                if (!otp.length) {
                  errorToast('Please enter OTP');
                  return;
                }
                verifyOTP();
              }}
            />
          </Animated.View>
        );
      }
      case 8:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <View style={styles.fieldHeader}>
                <Text style={[styles.title, { flex: 1 }]}>
                  {t('What is your company website?')}
                </Text>
                <Tooltip
                  position="bottom"
                  containerStyle={styles.tooltipIcon}
                  message={t('We use this to verify your company and increase candidate trust.')}
                  tooltipBoxStyle={{ right: wp(5), top: hp(30), width: wp(280), maxWidth: wp(280) }}
                />
              </View>
              <CustomTextInput
                placeholder={t('Enter website')}
                placeholderTextColor={colors._7B7878}
                onChangeText={(e: any) => {
                  dispatch(
                    setCompanyProfileData({
                      website: e,
                    }),
                  );
                }}
                value={companyProfileData?.website}
                inputStyle={styles.input}
                containerStyle={[styles.Inputcontainer, { marginTop: hp(20) }]}
              />
              <View style={{ marginTop: hp(50) }}>
                <Text style={styles.title}>
                  {t('Company size')}{' '}
                  <Text style={{ fontSize: 15 }}>{t('(Employees)')}</Text>
                </Text>
                {/* <Pressable style={styles.dateRow} onPress={() => {}}>
                  <Text style={styles.dateText}>{selected}</Text>
                </Pressable>
                <View
                  style={[styles.underline, {backgroundColor: colors._7B7878}]}
                /> */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: hp(300), marginTop: hp(25) }}>
                  <CustomDropdown
                    data={companySize || []}
                    labelField="label"
                    valueField="value"
                    placeholder={'Please select company size'}
                    value={companyProfileData?.company_size}
                    onChange={(e: any) => {
                      dispatch(
                        setCompanyProfileData({
                          company_size: e?.value,
                        }),
                      );
                    }}
                    dropdownStyle={styles.dropdown}
                    renderRightIcon={IMAGES.ic_down}
                    RightIconStyle={styles.rightIcon}
                    selectedTextStyle={[styles.selectedTextStyle]}
                  />
                </ScrollView>
              </View>
            </View>

            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                if (!companyProfileData?.website?.length) {
                  errorToast('Please enter your company website');
                  return;
                }
                if (!companyProfileData?.company_size) {
                  errorToast('Please select your company size');
                  return;
                }
                nextStep();
              }}
            />
          </Animated.View>
        );
      case 9:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <Text style={styles.title}>
                {t('Confirm your business address')}
              </Text>
              <View style={[styles.inputIconLabel, { marginTop: hp(60) }]}>
                <Text style={styles.label}>{t('Address')}</Text>
                {/* <Image style={styles.info} source={IMAGES.info} /> */}
              </View>
              <View style={[styles.row, { marginTop: hp(15) }]}>
                <CustomTextInput
                  placeholderTextColor={colors._7B7878}
                  onChangeText={text => {
                    dispatch(setUserInfo({ ...userInfo, address: text }));
                    debouncedGetAddressList(text);
                  }}
                  value={userInfo?.address}
                  inputStyle={styles.addressInput}
                  multiline
                  textAlignVertical="top"
                  containerStyle={styles.Inputcontainer}
                />
                <Image
                  source={IMAGES.edit}
                  resizeMode="contain"
                  style={styles.edit}
                />
              </View>

              {suggestions.length > 0 && (
                <View style={styles.suggestionContainer}>
                  <FlatList
                    data={suggestions}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }: any) => (
                      <TouchableWithoutFeedback
                        key={index}
                        onPress={async () => {
                          try {
                            const location = await getPlaceDetails(item.place_id, mapKey);
                            console.log("🔥 ~ location:", location)

                            if (location) {
                              dispatch(
                                setUserInfo({
                                  ...userInfo,
                                  address: item.description,
                                  lat: location?.lat,
                                  lng: location?.lng,
                                }),
                              );

                              dispatch(
                                setCompanyProfileData({
                                  address: item.description,
                                  lat: location?.lat,
                                  lng: location?.lng,
                                }),
                              );
                            }

                            setSuggestions([]);
                          } catch (err) {
                            console.error('Error selecting address:', err);
                          }
                        }}>
                        <View style={styles.suggestionItem}>
                          <BaseText style={styles.suggestionText}>
                            {item.structured_formatting.main_text}
                          </BaseText>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  />
                </View>
              )}

              <Text style={styles.maplable}>
                {t('Choose your map location')}
              </Text>
              <LocationContainer
                address={userInfo?.address}
                onPressMap={() => {
                  navigateTo(SCREENS.CoProfileLocationScreen);
                }}
                containerStyle={styles.map}
                lat={userInfo?.lat}
                lng={userInfo?.lng}
                showAddressCard={false}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigateTo(SCREENS.CoProfileLocationScreen);
                }}
                style={styles.diffButton}>
                <Text style={styles.btnTitle}>
                  {t('Choose a different location')}
                </Text>
              </TouchableOpacity>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Next')}
                onPress={() => {
                  dispatch(
                    setCompanyProfileData({
                      lat: userInfo?.lat,
                      lng: userInfo?.lng,
                      address: userInfo?.address,
                      location: userInfo?.address,
                    }),
                  );
                  dispatch(
                    setUserInfo({
                      ...userInfo,
                      lat: userInfo?.lat,
                      lng: userInfo?.lng,
                      address: userInfo?.address,
                    }),
                  );
                  nextStep();
                }}
              />
            </View>
          </Animated.View>
        );

      case 10:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View style={AppStyles.flex}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>
                  {t('Tell job seekers who you are and what you do.')}
                </Text>
              </View>
              <View style={{ position: 'relative' }}>
                <CustomTextInput
                  placeholder={t('Tell job seekers who you are and what you do.')}
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(about: string) => {
                    dispatch(
                      setCompanyProfileData({
                        about,
                      }),
                    );
                  }}
                  value={companyProfileData?.about}
                  inputStyle={styles.coIntroInput}
                  multiline
                  containerStyle={styles.Inputcontainer}
                  textAlignVertical="top"
                  maxLength={500}
                />
                <Text style={styles.characterlanght}>{`${companyProfileData?.about.length || 0
                  }/500 Characters`}</Text>
                <TouchableOpacity
                  onPress={() => setShowTooltip(!showTooltip)}
                  style={{ position: 'absolute', right: wp(5), bottom: hp(70) }}>
                  <Image source={IMAGES.info} style={styles.iBtn} />
                </TouchableOpacity>
                {showTooltip && (
                  <View style={styles.tooltipCase10}>
                    <Text style={styles.txtColor}>
                      {'This description appears on your public company profile. A clear introduction helps talents understand your brand and attract the right candidates.'}
                    </Text>
                  </View>
                )}
              </View>
              {/* <View>
                <Text style={styles.title}>{t('Mission')}</Text>
                <CustomTextInput
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(mission: string) => {
                    dispatch(
                      setCompanyProfileData({
                        mission,
                      }),
                    );
                  }}
                  value={companyProfileData?.mission}
                  inputStyle={[styles.coIntroInput, { height: hp(80) }]}
                  multiline
                  containerStyle={styles.Inputcontainer}
                  textAlignVertical="top"
                  maxLength={100}
                />
                <Text style={styles.characterlanght}>{`${companyProfileData?.mission.length || 0
                  }/100 Characters`}</Text>
              </View>
              <View>
                <Text style={styles.title}>{t('Values')}</Text>
                <CustomTextInput
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(values: string) => {
                    dispatch(
                      setCompanyProfileData({
                        values,
                      }),
                    );
                  }}
                  value={companyProfileData?.values}
                  inputStyle={[styles.coIntroInput]}
                  multiline
                  containerStyle={styles.Inputcontainer}
                  textAlignVertical="top"
                  maxLength={100}
                />
                <Text style={styles.characterlanght}>{`${companyProfileData?.values.length || 0
                  }/100 Characters`}</Text>
              </View> */}
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                if (!companyProfileData?.about) {
                  errorToast(t('Please describe your business.'))
                  return
                }
                nextStep()
              }}
            />
          </Animated.View>
        );
      // case 11:
      //   return (
      //     <Animated.View style={[styles.innerConrainer, animatedStyle]}>
      //       <View style={AppStyles.flex}>
      //         <Text style={styles.title}>
      //           {t('Select your industry sectors')}
      //         </Text>
      //         <Text style={[styles.title, { marginVertical: hp(33) }]}>
      //           {t('Your company’s services.')}
      //         </Text>
      //         <Pressable
      //           style={[styles.dateRow, { marginTop: hp(10) }]}
      //           onPress={() => { }}>
      //           {serviceSelect?.length ? (
      //             <Text style={styles.dateText}>
      //               {serviceSelect.join(', ')}
      //             </Text>
      //           ) : (
      //             <Text style={{ ...commonFontStyle(400, 20, colors._7B7878) }}>
      //               {'Please select services below'}
      //             </Text>
      //           )}
      //         </Pressable>
      //         <View style={styles.underline} />

      //         <FlatList
      //           data={serviceList}
      //           style={{ maxHeight: hp(300) }}
      //           contentContainerStyle={{ flexGrow: 1 }}
      //           showsVerticalScrollIndicator={true}
      //           keyExtractor={(_, index) => index.toString()}
      //           renderItem={({ item, index }: any) => {
      //             const isSelected = serviceSelect.includes(item?.title);

      //             return (
      //               <TouchableOpacity
      //                 key={index}
      //                 style={[
      //                   styles.optionContainer,
      //                   isSelected && styles.selectedOptionContainer,
      //                 ]}
      //                 onPress={() => {
      //                   dispatch(
      //                     setCompanyProfileData({
      //                       services: services.includes(item?._id)
      //                         ? services?.filter((i: any) => i !== item?._id)
      //                         : [...services, item?._id],
      //                     }),
      //                   );
      //                   if (serviceSelect?.includes(item?.title)) {
      //                     setServiceSelect(
      //                       serviceSelect?.filter(
      //                         (i: any) => i !== item?.title,
      //                       ),
      //                     );
      //                   } else {
      //                     setServiceSelect(prev => [...prev, item?.title]);
      //                   }
      //                 }}>
      //                 <Text
      //                   style={[
      //                     styles.optionText,
      //                     isSelected && styles.selectedText,
      //                   ]}>
      //                   {item?.title}
      //                 </Text>
      //                 {isSelected && (
      //                   <Image
      //                     source={IMAGES.mark}
      //                     style={{
      //                       width: 25,
      //                       height: 22,
      //                       resizeMode: 'contain',
      //                       tintColor: colors._4A4A4A,
      //                     }}
      //                   />
      //                 )}
      //               </TouchableOpacity>
      //             );
      //           }}
      //         />
      //       </View>
      //       <GradientButton
      //         style={styles.btn}
      //         type="Company"
      //         title={t('Next')}
      //         onPress={() => nextStep()}
      //       />
      //     </Animated.View>
      //   );
      case 11:
        return (
          <Animated.View style={[styles.innerConrainer, animatedStyle]}>
            <View>
              <BaseText style={styles.title}>
                {('Build trust with your company profile')}
              </BaseText>

              {/* Cover Images Section */}
              <View style={{ position: 'relative', marginTop: hp(33) }}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Cover Images</Text>
                  <TouchableOpacity
                    onPress={() => setShowCoverTooltip(!showCoverTooltip)}
                    style={{ marginLeft: wp(8) }}>
                    <Image source={IMAGES.info} style={styles.iBtn} />
                  </TouchableOpacity>
                </View>

                {showCoverTooltip && (
                  <View style={styles.tooltipCase11}>
                    <Text style={styles.txtColor}>
                      {'Recommended size: 1200x400px, shows up on your company profile.'}
                    </Text>
                  </View>
                )}

                <View style={styles.coverContainer}>
                  <TouchableOpacity
                    onPress={() => (setType('cover'), setImageModal(true))}
                    style={styles.uploadPlaceholder}>
                    <Image
                      source={IMAGES.uploadImg}
                      style={{ width: wp(72), height: hp(72) }}
                    />
                  </TouchableOpacity>

                  <View style={styles.coverGrid}>
                    {(cover_images || [])?.map((img: any, index: number) => (
                      <View style={styles.coverImageWrapper}>
                        <Image
                          source={{ uri: img?.uri }}
                          style={styles.coverImage}
                        />
                        <TouchableOpacity
                          style={styles.closeIcon}
                          onPress={() => handleRemoveCoverImage(index)}>
                          <Image
                            tintColor={'red'}
                            style={styles.close}
                            source={IMAGES.close_icon}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.logolabel}>
                  {t('Your cover image showcases your workplace or atmosphere')}
                </Text>
              </View>

              {/* Logo Section */}
              <View style={{ marginTop: hp(20) }}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Company Logo</Text>
                  <TouchableOpacity
                    onPress={() => setShowLogoTooltip(!showLogoTooltip)}
                    style={{ marginLeft: wp(8) }}>
                    <Image source={IMAGES.info} style={styles.iBtn} />
                  </TouchableOpacity>
                </View>

                {showLogoTooltip && (
                  <View style={styles.tooltipCase11}>
                    <Text style={styles.txtColor}>
                      {'Recommended size: 500x500px, PNG or JPG.'}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => (setType('logo'), setImageModal(!imageModal))}
                  style={styles.logoConatiner}>
                  <Image
                    source={
                      Object.keys(logo)?.length
                        ? { uri: logo?.uri }
                        : IMAGES.logoImg
                    }
                    style={styles.logoImg}
                  />
                </TouchableOpacity>

                {Object.keys(logo)?.length && (
                  <Pressable
                    onPress={() => {
                      dispatch(setCompanyProfileData({ logo: {} }));
                    }}
                    style={styles.closeContainer}>
                    <Image
                      tintColor={'red'}
                      style={styles.close}
                      source={IMAGES.close_icon}
                    />
                  </Pressable>
                )}

                <Text style={styles.logolabel}>
                  {t('Your logo helps job seekers recognise and trust your brand.')}
                </Text>
              </View>
            </View>

            <View>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Continue')}
                onPress={() => handleCreateProfile('complete')}
              />
              <TouchableOpacity
                onPress={() => handleCreateProfile('skip now')}
                style={styles.skipBtn}>
                <Text style={styles.skipNow}>{t('Skip for now')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{ edges: ['top', 'bottom'] }}
      colors={['#F7F7F7', '#FFFFFF']}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <KeyboardAwareScrollView
          enableAutomaticScroll
          // scrollEnabled={false}
          automaticallyAdjustContentInsets
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollcontainer}
          style={styles.container}>
          <View style={styles.rowView}>
            <TouchableOpacity
              onPress={() => {
                // if (companyRegistrationStep === 7) {
                //   resetNavigation(SCREENS.CoLogin);
                //   return;
                // }
                companyRegistrationStep == 8
                  ? navigationRef.goBack()
                  : prevStep(companyRegistrationStep);
              }}
              hitSlop={8}
              style={[styles.backBtn, { flex: 1 }]}>
              <Image
                resizeMode="contain"
                source={IMAGES.leftSide}
                style={styles.back}
              />
            </TouchableOpacity>
          </View>
          {renderStep()}
        </KeyboardAwareScrollView>
      </SafeAreaView>

      {registerSuccessModal && (
        <WelcomeModal
          name={'to Shiftly! 🎉'}
          description={t(
            'You’re all set. Complete your company profile now to unlock smarter hiring and start connecting with top talent.',
          )}
          visible={registerSuccessModal}
          onClose={() => {
            dispatch(setRegisterSuccessModal(false));
            dispatch(setCompanyProfileData({ otp: new Array(4).fill('') }));
            nextStep();
          }}
          ButtonContainer={
            <View>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Complete Profile')}
                onPress={() => {
                  nextStep();
                  dispatch(setRegisterSuccessModal(false));
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  dispatch(setRegisterSuccessModal(false));
                  resetNavigation(SCREENS.CoTabNavigator);
                }}
                style={styles.skip}>
                <Text style={styles.skiptitle}>{t('Skip now')}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      <ImagePickerModal
        actionSheet={imageModal}
        setActionSheet={() => {
          setImageModal(false);
        }}
        onUpdate={(e: any) => UploadPhoto(e)}
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
    marginTop: hp(16),
  },
  title: {
    ...commonFontStyle(500, 25, colors._0B3970),
    paddingTop: hp(10),
  },
  fieldLabel: {
    marginTop: hp(30),
    marginBottom: hp(12),
    ...commonFontStyle(500, 18, colors._0B3970),
  },
  required: {
    color: 'red',
    marginLeft: 2,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: hp(25),
  },
  dateText: {
    ...commonFontStyle(400, 22, colors._4A4A4A),
    marginLeft: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(12),
    paddingHorizontal: wp(14),
    // borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  selectedOptionContainer: {
    borderBottomColor: colors._E8CE92,
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
    ...commonFontStyle(400, 20, colors._181818),
  },
  info: {
    width: wp(22),
    height: wp(22),
    tintColor: '#959595',
    marginLeft: wp(12),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp(65),
    borderBottomWidth: 2,
    borderColor: colors._F4E2B8,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingBottom: hp(8),
  },
  badge: {
    width: wp(28),
    height: wp(28),
    tintColor: colors.black,
    marginRight: wp(12),
  },
  Inputcontainer: {
    flex: 1,
    marginBottom: 0,
  },
  mail: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
    marginRight: wp(12),
    marginTop: hp(40),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(40),
  },
  emailLabel: {
    ...commonFontStyle(500, 16, colors.black),
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
    ...commonFontStyle(400, 17, colors._0B3970),
  },
  resendText: {
    ...commonFontStyle(600, 20, colors._0B3970),
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: hp(74),
  },
  skip: {
    borderColor: '#BDBDBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skiptitle: {
    ...commonFontStyle(400, 18, '#6f6e6eff'),
    paddingVertical: hp(10),
    textDecorationLine: 'underline',
  },
  input: {
    ...commonFontStyle(400, 22, colors._4A4A4A),
    paddingBottom: hp(10),
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: colors._7B7878,
  },
  inputIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...commonFontStyle(400, 22, colors._4A4A4A),
  },
  edit: {
    width: wp(22),
    height: wp(22),
    resizeMode: 'contain',
  },
  addressInput: {
    ...commonFontStyle(700, 20, colors._4A4A4A),
  },
  maplable: {
    marginTop: hp(24),
    ...commonFontStyle(400, 22, colors._4A4A4A),
  },
  map: {
    // flex: 1,
    // height: hp(150),
    // borderRadius: 15,
    // overflow: 'hidden',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    columnGap: wp(8),
  },
  tooltipIcon: {
    marginTop: hp(30),
    paddingHorizontal: wp(5),
    minWidth: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffButton: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors._0B3970,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(10),
    marginBottom: hp(36),
  },
  btnTitle: {
    ...commonFontStyle(400, 20, colors._0B3970),
    paddingVertical: hp(10),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: wp(6),
    marginBottom: hp(16),
  },
  coIntroInput: {
    ...commonFontStyle(400, 20, colors._4A4A4A),
    height: hp(150),
    borderBottomWidth: 2,
    borderColor: '#7B7878',
    flex: 1,
  },
  characterlanght: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
    textAlign: 'right',
    paddingVertical: hp(15),
  },
  logoConatiner: {
    width: hp(150),
    height: hp(150),
    overflow: 'hidden',
    borderWidth: hp(1),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(150 / 2),
    borderColor: colors._EBDCB8,
    backgroundColor: colors.white,
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logolabel: {
    marginVertical: hp(14),
    ...commonFontStyle(400, 15, colors._050505),
  },
  closeContainer: {
    top: '20%',
    right: '30%',
    zIndex: 9999,
    overflow: 'visible',
    borderRadius: hp(100),
    position: 'absolute',
    backgroundColor: colors.white,
  },
  close: {
    width: wp(26),
    height: hp(26),
  },
  uploadImg: {
    width: wp(70),
    height: wp(70),
    resizeMode: 'contain',
    marginVertical: hp(22),
  },
  skipNow: {
    ...commonFontStyle(400, 19, colors._050505),
  },
  skipBtn: {
    alignSelf: 'center',
    marginTop: hp(22),
  },
  marker: {
    width: wp(37),
    height: hp(56),
    resizeMode: 'contain',
  },
  infomodel: {
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingHorizontal: wp(16),
    paddingVertical: hp(10),
    marginTop: hp(4),
  },
  businessName: {
    ...commonFontStyle(700, 15, colors._0B3970),
  },
  bussinessinfo: {
    ...commonFontStyle(400, 13, colors.black),
    marginTop: hp(15),
  },
  closebtn: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  check: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'contain',
    tintColor: colors.green,
  },
  dropdown: {
    borderRadius: hp(10),
  },
  rightIcon: {
    width: wp(16),
    height: hp(13),
    tintColor: colors._0B3970,
  },
  selectedTextStyle: {
    ...commonFontStyle(400, 18, colors._181818),
  },
  uploadPlaceholder: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: hp(35),
    justifyContent: 'center',
  },
  coverContainer: {
    backgroundColor: '#fff',
    padding: wp(10),
    borderRadius: 8,
    width: '100%',
  },
  coverGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(10),
  },
  coverImage: {
    width: wp(300),
    height: hp(100),
    borderRadius: 8,
    resizeMode: 'cover',
  },
  coverImageWrapper: {
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: '-10%',
    right: '-2%',
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  closeIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  iBtn: {
    width: wp(20),
    height: hp(20),
    marginLeft: wp(8),
    tintColor: colors._7B7878,
  },
  iBtnTxt: {
    position: 'absolute',
    right: 0,
    bottom: hp(45),
    backgroundColor: '#F6E2B8',
    borderRadius: 8,
    padding: 8,
    borderWidth: hp(1),
    borderColor: colors._D9D9D9,
  },
  txtColor: {
    ...commonFontStyle(500, 12, colors._4F4F4F),
  },
  validTxt: {
    marginTop: hp(10),
    fontSize: wp(16),
  },
  linkedTxt: { color: 'black', textDecorationLine: 'underline' },
  txt: {
    ...commonFontStyle(500, 12, colors.black),
  },
  checkBox: { marginTop: hp(20) },
  suggestionContainer: {
    borderRadius: 10,
    maxHeight: hp(180),
    backgroundColor: colors.white,
  },
  suggestionItem: {
    paddingVertical: hp(5),
    paddingHorizontal: wp(5),
    borderBottomWidth: 0.5,
    borderBottomColor: colors._7B7878,
  },
  suggestionText: {
    ...commonFontStyle(500, 16, colors.black),
  },
  tooltipCase10: {
    position: 'absolute',
    right: wp(25),
    top: hp(50),
    backgroundColor: '#F6E2B8',
    borderRadius: 8,
    padding: wp(10),
    borderWidth: hp(1),
    borderColor: colors._D9D9D9,
    maxWidth: wp(300),
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(10),
  },
  sectionTitle: {
    ...commonFontStyle(500, 20, colors._0B3970),
  },
  tooltipCase11: {
    position: 'absolute',
    right: wp(0),
    top: hp(35),
    backgroundColor: '#F6E2B8',
    borderRadius: 8,
    padding: wp(10),
    borderWidth: hp(1),
    borderColor: colors._D9D9D9,
    maxWidth: wp(250),
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
