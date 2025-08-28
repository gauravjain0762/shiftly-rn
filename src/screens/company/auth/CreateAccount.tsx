import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  CustomDropdown,
  CustomTextInput,
  GradientButton,
  LinearContainer,
  LocationContainer,
} from '../../../component';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {navigationRef} from '../../../navigation/RootContainer';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import PhoneInput from '../../../component/auth/PhoneInput';
import WelcomeModal from '../../../component/auth/WelcomeModal';
import {
  errorToast,
  goBack,
  navigateTo,
  resetNavigation,
  successToast,
} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import MapView, {Marker} from 'react-native-maps';
import {requestLocationPermission} from '../../../utils/locationHandler';
import {API} from '../../../utils/apiConstant';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
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
} from '../../../features/authSlice';
import {useAppDispatch} from '../../../redux/hooks';
import {
  useCreateCompanyProfileMutation,
  useGetServicesQuery,
} from '../../../api/dashboardApi';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const companySize = [
  {label: '0 - 50', value: '0 - 50'},
  {label: '50 - 100', value: '50 - 100'},
  {label: '100 - 500', value: '100 - 500'},
  {label: '500 - 1,000', value: '500 - 1,000'},
  {label: '1,000+', value: '1,000+'},
];

const rules = [
  {label: 'Minimum 8 characters', test: (pw: string | any[]) => pw.length >= 8},
  {
    label: 'At least 1 uppercase letter',
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: 'At least 1 lowercase letter',
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {label: 'At least 1 number', test: (pw: string) => /\d/.test(pw)},
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
    companyServices = [],
  } = useSelector((state: RootState) => state.auth);
  const {
    services = [],
    logo,
    cover_images,
  } = useSelector((state: RootState) => state.auth.companyProfileData || {});
  // console.log('🔥🔥🔥 ~ CreateAccount ~ cover_images:', cover_images);
  // console.log(
  //   '🔥🔥🔥 ~ CreateAccount ~ companyProfileData:',
  //   companyProfileData,
  // );
  const {data: businessTypes} = useGetBusinessTypesQuery(
    {},
  );
  const {data: servicesData} = useGetServicesQuery({});
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
  // const [logo, setLogo] = useState({});
  const [coverImages, setCoverImages] = useState<any[]>([]);
  const [type, setType] = useState<'logo' | 'cover'>('logo');
  const [model, setModel] = useState(false);
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(false);
  const [userAddress, setUserAddress] = useState<
    | {
        address: string;
        lat: number;
        lng: number;
        state: string;
        country: string;
      }
    | undefined
  >();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      dispatch(clearCompanyRegisterData());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!companyProfileData?.website || companyProfileData?.website === '') {
      dispatch(
        setCompanyProfileData({
          ...companyProfileData,
          website: 'https://',
        }),
      );
    }
  }, []);

  const getUserLocation = async () => {
    try {
      const locationString = await AsyncStorage.getItem('user_location');
      if (locationString !== null) {
        const location = JSON.parse(locationString);
        setUserAddress(location);
        console.log('Retrieved location:', location);
        return location;
      }
    } catch (error) {
      console.error('Failed to retrieve user location:', error);
    }
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      getUserLocation();
    }, []),
  );

  useEffect(() => {
    onCurrentLocation();
    // dispatch(setCompanyRegistrationStep(1));
  }, [companyRegistrationStep]);

  const inputRefsOtp = useRef<any>([]);
  const [otp, setOtp] = useState(new Array(4).fill(''));

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

  const nextStep = () => {
    setTimeout(() => {
      dispatch(setCompanyRegistrationStep(Number(companyRegistrationStep) + 1));
    }, 100);
  };

  const prevStep = (num?: any) => {
    if (num == 1) {
      navigationRef.goBack();
    } else {
      dispatch(setCompanyRegistrationStep(Number(companyRegistrationStep) - 1));
    }
    // setStep(prev => prev - 1);
  };
  const {t, i18n} = useTranslation();

  useEffect(() => {
    if (timer == 0) return;
    console.log('startttttt', start);
    if (start) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, start]);

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

  const UploadPhoto = (e: any) => {
    console.log('🔥🔥🔥 ~ UploadPhoto ~ e:', e);
    console.log('🔥🔥🔥 ~ UploadPhoto ~ type:', type);

    if (type === 'cover') {
      const newImage = {
        name: e?.filename || e?.name || 'cover.jpg',
        uri: e?.sourceURL || e?.uri || e?.path,
        type: e?.mime || 'image/jpeg',
      };
      console.log('🔥🔥🔥 ~ UploadPhoto ~ newImage:', newImage);
      console.log('🔥🔥🔥 ~ UploadPhoto ~ current cover_images:', cover_images);

      // want to upload multiple images
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

  console.log(
    '🔥 ~ handleSignup ~ companyRegisterData:',
    companyRegisterData?.phone_code,
  );
  const handleSignup = async () => {
    const formData = new FormData();

    // Add regular fields
    formData.append('website', companyProfileData?.website || '');
    formData.append('company_size', companyProfileData?.company_size || '');
    formData.append('address', companyProfileData?.address || '');
    formData.append('lat', companyProfileData?.lat?.toString() || '0');
    formData.append('lng', companyProfileData?.lng?.toString() || '0');
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
    console.log('🔥 ~ handleSignup ~ formData:', formData);

    const response = await companySignUp(formData).unwrap();
    console.log(response, response?.status, 'response----handleSignup');
    dispatch(setCompanyProfileAllData(response?.data?.company));
    if (response?.status) {
      successToast(response?.message);
      setStart(prev => !prev);
      nextStep();
      dispatch(
        setCompanyRegisterData({
          business_type_id: '',
          company_name: '',
          name: '',
          email: '',
          password: '',
          phone_code: '971',
          phone: '',
        }),
      );
    } else {
      errorToast(response?.message);
    }
  };
  const emailCheck = async () => {
    // Add validation before API call
    if (!companyRegisterData?.email) {
      errorToast('Please enter email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyRegisterData.email)) {
      errorToast('Please enter a valid email address');
      return;
    }

    // setEmailLoading(true);

    try {
      let data = {
        email: companyRegisterData?.email,
        validate_email: true,
      };

      const response = await companySignUp(data).unwrap();
      console.log(response, 'response----', companyRegistrationStep);

      if (response?.status) {
        nextStep();
      } else {
        errorToast(response?.message || 'Email validation failed');
      }
    } catch (error: any) {
      console.error('Email validation error:', error);
      errorToast(
        error?.data?.message || 'Something went wrong. Please try again.',
      );
    }
  };

  const verifyOTP = async () => {
    let data = {
      otp: otp.join(''),
      company_id: userInfo?._id,
      language: language,
      deviceToken: fcmToken ?? 'ddd',
      deviceType: Platform.OS,
    };
    console.log(data, 'data');

    const response = await OtpVerify(data).unwrap();
    console.log(response, 'response----');
    if (response?.status) {
      dispatch(setRegisterSuccessModal(true));
      successToast(response?.message);
    } else {
      errorToast(response?.message);
    }
  };

  const handleCreateProfile = async () => {
    const formData = new FormData();

    // Add regular fields
    formData.append('website', companyProfileData?.website || '');
    formData.append('company_size', companyProfileData?.company_size || '');
    formData.append('address', companyProfileData?.address || '');
    formData.append('lat', companyProfileData?.lat?.toString() || '0');
    formData.append('lng', companyProfileData?.lng?.toString() || '0');
    formData.append('about', companyProfileData?.about || '');
    formData.append('mission', companyProfileData?.mission || '');
    formData.append('values', companyProfileData?.values || '');
    formData.append('services', companyProfileData?.services?.join(',') || '');
    formData.append('company_name', companyRegisterData?.company_name || '');

    // Add logo if exists
    if (companyProfileData?.logo?.uri) {
      formData.append('logo', {
        uri: companyProfileData.logo.uri,
        type: companyProfileData.logo.type || 'image/jpeg',
        name: companyProfileData.logo.name || 'logo.jpg',
      });
    }

    console.log(
      '🔥🔥🔥 ~ handleCreateProfile ~ companyProfileData.cover_images:',
      companyProfileData?.cover_images,
    );
    if (companyProfileData?.cover_images?.length > 0) {
      companyProfileData.cover_images.forEach((image: any, index: number) => {
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

          console.log('📸 Appending imageData:', imageData);
          formData.append('cover_images', imageData);
        }
      });
    }

    const response = await companyProfile(formData).unwrap();
    console.log(response, response?.status, 'response----handleCreateProfile');
    dispatch(setCompanyProfileAllData(response?.data?.company));
    if (response?.status) {
      resetNavigation(SCREENS.CoStack, SCREENS.CompanyProfile);
      dispatch(
        setCompanyRegisterData({
          website: '',
          company_size: '',
          address: '',
          lat: 0,
          lng: 0,
          about: '',
          mission: '',
          values: '',
          services: '',
          logo: {},
          cover_images: {},
        }),
      );
      successToast(response?.message);
    } else {
      errorToast(response?.message);
    }
  };

  const renderStep = () => {
    switch (companyRegistrationStep || 1) {
      case 1:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('What type of business are you?')}
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{maxHeight: hp(350), marginTop: hp(15)}}>
                <CustomDropdown
                  data={
                    businessTypes?.data?.types?.map((item: any) => ({
                      label: item.title,
                      value: item._id,
                    })) || []
                  }
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
                  placeholder={t('Enter Business / Organiization name')}
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyRegisterData({
                        company_name: e,
                      }),
                    );
                  }}
                  value={companyRegisterData?.company_name}
                  inputStyle={styles.input1}
                  containerStyle={styles.Inputcontainer}
                  numberOfLines={1}
                />
                {/* <TouchableOpacity onPress={() => setModel(!model)} hitSlop={10}>
                  <Image
                    source={IMAGES.info}
                    resizeMode="contain"
                    style={styles.info}
                  />
                </TouchableOpacity> */}
              </View>
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
                    textStyle={{fontSize: 14}}
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
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(e: any) =>
                    dispatch(
                      setCompanyRegisterData({
                        name: e,
                      }),
                    )
                  }
                  value={companyRegisterData?.name}
                  inputStyle={styles.input1}
                  containerStyle={styles.Inputcontainer}
                />
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
                if (!companyRegisterData?.name?.trim()) {
                  errorToast('Please enter your name');
                  return;
                }
                nextStep();
              }}
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
                  placeholder={t('Enter your email')}
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(e: any) =>
                    dispatch(
                      setCompanyRegisterData({
                        email: e,
                      }),
                    )
                  }
                  value={companyRegisterData?.email}
                  inputStyle={styles.input1}
                  containerStyle={styles.Inputcontainer}
                />
              </View>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={emailCheck}
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
                imgStyle={{tintColor: '#1C1B1F'}}
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
                  <Text style={styles.passRule}>{t('Password Rule')}</Text>
                </View>
                {rules?.map((item: any, index: number) => {
                  const passed = item?.test(companyRegisterData?.password);
                  return (
                    <View key={index} style={styles.rules}>
                      {passed ? (
                        <Image source={IMAGES.check} style={styles.check} />
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
                nextStep();
              }}
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
                placeholder={t('Enter your phone number')}
                phoneStyle={{color: colors._0B3970}}
                callingCodeStyle={{color: colors._0B3970}}
                callingCode={companyRegisterData?.phone_code}
                placeholderTextColor={colors._7B7878}
                phone={companyRegisterData?.phone}
                downIcon={{
                  tintColor: colors._4A4A4A,
                }}
                onPhoneChange={(e: any) =>
                  dispatch(setCompanyRegisterData({phone: e}))
                }
                onCallingCodeChange={(e: any) =>
                  dispatch(setCompanyRegisterData({phone_code: e}))
                }
                maxLength={10}
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
          </View>
        );
      case 7: {
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
                {otp?.map((val, idx) => (
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
              onPress={() => {
                if (!otp.length) {
                  errorToast('Please enter OTP');
                  return;
                }
                verifyOTP();
              }}
            />
          </View>
        );
      }
      case 8:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('What is your company website?')}
              </Text>
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
                containerStyle={[styles.Inputcontainer, {marginTop: hp(20)}]}
              />
              <View style={{marginTop: hp(50)}}>
                <Text style={styles.title}>
                  {t('Company size')}{' '}
                  <Text style={{fontSize: 15}}>{t('(Employees)')}</Text>
                </Text>
                {/* <Pressable style={styles.dateRow} onPress={() => {}}>
                  <Text style={styles.dateText}>{selected}</Text>
                </Pressable>
                <View
                  style={[styles.underline, {backgroundColor: colors._7B7878}]}
                /> */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{maxHeight: hp(300), marginTop: hp(25)}}>
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
          </View>
        );
      case 9:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('Confirm your business address')}
              </Text>
              <View style={[styles.inputIconLabel, {marginTop: hp(60)}]}>
                <Text style={styles.label}>{t('Address')}</Text>
                {/* <Image style={styles.info} source={IMAGES.info} /> */}
              </View>
              <View style={[styles.row, {marginTop: hp(15)}]}>
                <CustomTextInput
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyProfileData({
                        address: userAddress?.address,
                      }),
                    );
                  }}
                  value={userAddress?.address}
                  inputStyle={styles.addressInput}
                  multiline
                  editable={false}
                  textAlignVertical="top"
                  containerStyle={styles.Inputcontainer}
                />
                <Image
                  source={IMAGES.edit}
                  resizeMode="contain"
                  style={styles.edit}
                />
              </View>
              <Text style={styles.maplable}>
                {t('Choose your map location')}
              </Text>
              <LocationContainer
                address={userAddress?.address}
                onPressMap={() => {
                  navigateTo(SCREENS.LocationScreen, {
                    userAddress: userAddress,
                  });
                }}
                containerStyle={styles.map}
                lat={userAddress?.lat}
                lng={userAddress?.lng}
                showAddressCard={false}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigateTo(SCREENS.LocationScreen, {
                    userAddress: userAddress,
                  });
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
                  console.log(
                    'lat:',
                    position?.latitude,
                    'lng:',
                    position?.longitude,
                  );
                  dispatch(
                    setCompanyProfileData({
                      lat: userAddress?.lat,
                      lng: userAddress?.lng,
                      address: userAddress?.address,
                    }),
                  );
                  nextStep();
                }}
              />
            </View>
          </View>
        );

      case 10:
        return (
          <View style={styles.innerConrainer}>
            <View style={AppStyles.flex}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>
                  {t('Describe in few lines about you business e.g.')}
                  <Text style={{...commonFontStyle(500, 20, colors._0B3970)}}>
                    {t('Description')}
                  </Text>
                </Text>
                {/* <Image
                  style={[styles.info, {marginLeft: 0}]}
                  source={IMAGES.info}
                /> */}
              </View>
              <View>
                <CustomTextInput
                  placeholder={t('Introduce your company in few lines')}
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyProfileData({
                        about: e,
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
                <Text style={styles.characterlanght}>{`${
                  companyProfileData?.about.length || 0
                }/500 Characters`}</Text>
              </View>
              <View>
                <Text style={styles.title}>{t('Mission')}</Text>
                <CustomTextInput
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyProfileData({
                        mission: e,
                      }),
                    );
                  }}
                  value={companyProfileData?.mission}
                  inputStyle={[styles.coIntroInput, {height: hp(80)}]}
                  multiline
                  containerStyle={styles.Inputcontainer}
                  textAlignVertical="top"
                  maxLength={100}
                />
                <Text style={styles.characterlanght}>{`${
                  companyProfileData?.mission.length || 0
                }/100 Characters`}</Text>
              </View>
              <View>
                <Text style={styles.title}>{t('Values')}</Text>
                <CustomTextInput
                  placeholderTextColor={colors._7B7878}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyProfileData({
                        values: e,
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
                <Text style={styles.characterlanght}>{`${
                  companyProfileData?.values.length || 0
                }/100 Characters`}</Text>
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
      case 11:
        return (
          <View style={styles.innerConrainer}>
            <View style={AppStyles.flex}>
              <Text style={styles.title}>
                {t('Select your industry sectors')}
              </Text>
              <Text style={[styles.title, {marginVertical: hp(33)}]}>
                {t('Your company’s services.')}
              </Text>
              <Pressable
                style={[styles.dateRow, {marginTop: hp(10)}]}
                onPress={() => {}}>
                {serviceSelect?.length ? (
                  <Text style={styles.dateText}>
                    {serviceSelect.join(', ')}
                  </Text>
                ) : (
                  <Text style={{...commonFontStyle(400, 20, colors._7B7878)}}>
                    {'Please select services below'}
                  </Text>
                )}
              </Pressable>
              <View style={styles.underline} />

              <FlatList
                data={serviceList}
                style={{maxHeight: hp(300)}}
                contentContainerStyle={{flexGrow: 1}}
                showsVerticalScrollIndicator={true}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}: any) => {
                  const isSelected = serviceSelect.includes(item?.title);

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionContainer,
                        isSelected && styles.selectedOptionContainer,
                      ]}
                      onPress={() => {
                        dispatch(
                          setCompanyProfileData({
                            services: services.includes(item?._id)
                              ? services?.filter((i: any) => i !== item?._id)
                              : [...services, item?._id],
                          }),
                        );
                        if (serviceSelect?.includes(item?.title)) {
                          setServiceSelect(
                            serviceSelect?.filter(
                              (i: any) => i !== item?.title,
                            ),
                          );
                        } else {
                          setServiceSelect(prev => [...prev, item?.title]);
                        }
                      }}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedText,
                        ]}>
                        {item?.title}
                      </Text>
                      {isSelected && (
                        <Image
                          source={IMAGES.mark}
                          style={{
                            width: 25,
                            height: 22,
                            resizeMode: 'contain',
                            tintColor: colors._4A4A4A,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
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
      case 12:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('Personalise your company profile')}
              </Text>
              <TouchableOpacity
                onPress={() => (setType('logo'), setImageModal(!imageModal))}
                style={styles.logoConatiner}>
                <Image
                  source={
                    Object.keys(logo)?.length
                      ? {uri: logo?.uri}
                      : IMAGES.logoImg
                  }
                  style={
                    Object.keys(logo)?.length
                      ? {
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                          marginVertical: hp(22),
                        }
                      : styles.logoImg
                  }
                />
              </TouchableOpacity>
              {Object.keys(logo)?.length && (
                <Pressable
                  onPress={() => {
                    dispatch(setCompanyProfileData({logo: {}}));
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
                {t(
                  'Your logo helps job seekers recognise and trust your brand.',
                )}
              </Text>
              <View style={styles.coverContainer}>
                {/* Static upload placeholder */}
                <TouchableOpacity
                  onPress={() => (setType('cover'), setImageModal(true))}
                  style={styles.uploadPlaceholder}>
                  <Image
                    source={IMAGES.uploadImg}
                    style={{width: wp(72), height: hp(72)}}
                  />
                </TouchableOpacity>

                <View style={styles.coverGrid}>
                  {(cover_images || [])?.map((img: any, index: number) => (
                    <View key={index} style={styles.coverImageWrapper}>
                      <Image
                        source={{uri: img?.uri}}
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
            <View>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Continue')}
                onPress={() => handleCreateProfile()}
              />
              <TouchableOpacity
                onPress={() => resetNavigation(SCREENS.CoTabNavigator)}
                style={styles.skipBtn}>
                <Text style={styles.skipNow}>{t('Skip for now')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top', 'bottom']}}
      colors={['#FFF8E6', '#F3E1B7']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
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
      </SafeAreaView>

      {registerSuccessModal && (
        <WelcomeModal
          name={t('Aboard!')}
          description={t(
            'We’re excited to have you here. Let’s complete your company profile to get started.',
          )}
          visible={registerSuccessModal}
          onClose={() => {
            dispatch(setRegisterSuccessModal(false));
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
                <Text style={styles.skiptitle}>{t('Skip')}</Text>
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
  diffButton: {
    borderRadius: 100,
    borderWidth: 2.5,
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
    width: '100%',
    height: hp(150),
    marginTop: hp(33),
    overflow: 'hidden',
    borderWidth: hp(1),
    borderRadius: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors._EBDCB8,
    backgroundColor: colors.white,
  },
  logoImg: {
    width: wp(113),
    height: wp(113),
    resizeMode: 'contain',
    marginVertical: hp(22),
  },
  logolabel: {
    marginVertical: hp(14),
    ...commonFontStyle(400, 15, colors._050505),
  },
  closeContainer: {
    top: hp(95),
    right: wp(-7),
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
    ...commonFontStyle(400, 19, '#B4B4B4'),
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
    tintColor: colors._0B3970,
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
  coverContainer: {
    backgroundColor: '#fff',
    padding: wp(10),
    borderRadius: 8,
  },
  uploadPlaceholder: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: hp(35),
    justifyContent: 'center',
  },
  coverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: wp(10),
  },
  coverImage: {
    width: SCREEN_WIDTH / 4.5,
    height: hp(100),
    borderRadius: 8,
    marginBottom: hp(10),
    resizeMode: 'cover',
  },
  coverImageWrapper: {
    position: 'relative',
    marginBottom: hp(10),
  },
  closeIcon: {
    position: 'absolute',
    top: '-5%',
    right: '-5%',
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
});
