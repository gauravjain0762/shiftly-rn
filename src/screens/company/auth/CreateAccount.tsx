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
import {
  errorToast,
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

const size = ['0 - 50', '50 - 100', '100 - 500', '500 - 1,000', '1,000+'];

const rules = [
  {label: 'Minimum 8 characters', test: pw => pw.length >= 8},
  {label: 'At least 1 uppercase letter', test: pw => /[A-Z]/.test(pw)},
  {label: 'At least 1 lowercase letter', test: pw => /[a-z]/.test(pw)},
  {label: 'At least 1 number', test: pw => /\d/.test(pw)},
  {
    label: 'At least 1 special character (e.g. @, #, $, !)',
    test: pw => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
];

const CreateAccount = () => {
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
  const {services = []} = useSelector(
    (state: RootState) => state.auth.companyProfileData || {},
  );
  const {data: businessTypes, isLoading: Loading} = useGetBusinessTypesQuery(
    {},
  );
  const {data: servicesData} = useGetServicesQuery({});
  const serviceList = servicesData?.data?.services;
  const dispatch = useAppDispatch();
  const [companySignUp, {isLoading: signupLoading}] =
    useCompanySignUpMutation();
  const [OtpVerify, {isLoading: otpVerifyLoading}] =
    useCompanyOTPVerifyMutation();

  const [companyProfile, {isLoading: profileLoading}] =
    useCreateCompanyProfileMutation();

  const [selected1, setSelected1] = useState(businessType[0]?.title);

  const [selected, setSelected] = useState('0 - 50');
  const [timer, setTimer] = useState(30);
  const [serviceSelect, setServiceSelect] = useState<string[]>([]);
  const [imageModal, setImageModal] = useState(false);
  const [position, setPosition] = useState<any>(undefined);
  const mapRef = useRef<any>(null);
  const [logo, setLogo] = useState({});
  const [cover, setCover] = useState({});
  const [type, setType] = useState<'logo' | 'cover'>('logo');
  const [model, setModel] = useState(false);
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(false);

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

  const nextStep = () =>
    dispatch(setCompanyRegistrationStep(Number(companyRegistrationStep) + 1)); //setStep(prev => prev + 1);

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
    if (type == 'cover') {
      setCover(e);
      dispatch(
        setCompanyProfileData({
          cover_images: {
            name: e?.name,
            uri: e?.sourceURL,
            type: e?.mime,
          },
        }),
      );
    } else {
      setLogo(e);
      dispatch(
        setCompanyProfileData({
          logo: {
            name: e?.name,
            uri: e?.sourceURL,
            type: e?.mime,
          },
        }),
      );
    }
  };

  const handleSignup = async () => {
    let data = {
      website: companyProfileData?.website,
      company_size: companyProfileData?.company_size,
      address: companyProfileData?.address,
      lat: companyProfileData?.lat,
      lng: companyProfileData?.lng,
      about: companyProfileData?.about,
      mission: companyProfileData?.mission,
      values: companyProfileData?.values,
      services: companyProfileData?.services,
      logo: companyProfileData?.logo,
      cover_images: companyProfileData?.cover_images,
      business_type_id: companyRegisterData?.business_type_id,
      company_name: companyRegisterData?.company_name,
      name: companyRegisterData?.name,
      email: companyRegisterData?.email,
      password: companyRegisterData?.password,
      phone_code: companyRegisterData?.phone_code,
      phone: companyRegisterData?.phone,
      language: language,
      deviceToken: fcmToken ?? 'ddd',
      deviceType: Platform.OS,
    };
    const response = await companySignUp(data).unwrap();
    console.log(response, response?.status, 'response----handleSignup');
    dispatch(setCompanyProfileAllData(response?.data?.company));
    if (response?.status) {
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
      successToast(response?.message);
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
    } finally {
      // setEmailLoading(false);
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
    console.log('handleCreateProfile this called');
    let data = {
      website: companyProfileData?.website,
      company_size: companyProfileData?.company_size,
      address: companyProfileData?.address,
      lat: companyProfileData?.lat,
      lng: companyProfileData?.lng,
      about: companyProfileData?.about,
      mission: companyProfileData?.mission,
      values: companyProfileData?.values,
      services: companyProfileData?.services?.join(','),
      logo: companyProfileData?.logo,
      cover_images: companyProfileData?.cover_images,
      company_name: companyRegisterData?.company_name,
    };
    console.log('🔥 ~ handleCreateProfile ~ data:', data);
    const response = await companyProfile(data).unwrap();
    console.log("🔥🔥 ~ handleCreateProfile ~ response:", response)
    console.log(response, response?.status, 'response----handleCreateProfile');
    dispatch(setCompanyProfileAllData(response?.data?.company));
    if (response?.status) {
      resetNavigation(SCREENS.CompanyProfile);
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
              <Pressable style={styles.dateRow} onPress={() => {}}>
                <Text style={styles.dateText}>{selected1}</Text>
              </Pressable>
              <View style={styles.underline} />
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{maxHeight: hp(300)}}>
                {businessType.map((option, index) => {
                  const isSelected = option.title === selected1;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionContainer,
                        // isSelected && styles.selectedOptionContainer,
                      ]}
                      onPress={() => {
                        setSelected1(option?.title);
                        dispatch(
                          setCompanyRegisterData({
                            business_type_id: option?._id,
                          }),
                        );
                      }}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedText,
                        ]}>
                        {option?.title}
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
                })}
              </ScrollView>
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => {
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
                  placeholder={t('Enter Business / Organi...')}
                  placeholderTextColor={colors._4A4A4A}
                  onChangeText={(e: any) =>
                    dispatch(
                      setCompanyRegisterData({
                        company_name: e,
                      }),
                    )
                  }
                  value={companyRegisterData?.company_name}
                  style={styles.input1}
                  containerStyle={styles.Inputcontainer}
                  numberOfLines={1}
                />
                <TouchableOpacity onPress={() => setModel(!model)} hitSlop={10}>
                  <Image
                    source={IMAGES.info}
                    resizeMode="contain"
                    style={styles.info}
                  />
                </TouchableOpacity>
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
                  onChangeText={(e: any) =>
                    dispatch(
                      setCompanyRegisterData({
                        name: e,
                      }),
                    )
                  }
                  value={companyRegisterData?.name}
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
                  onChangeText={(e: any) =>
                    dispatch(
                      setCompanyRegisterData({
                        email: e,
                      }),
                    )
                  }
                  value={companyRegisterData?.email}
                  style={styles.input1}
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
                placeholderTextColor={colors._4A4A4A}
                onChangeText={(e: any) =>
                  dispatch(
                    setCompanyRegisterData({
                      password: e,
                    }),
                  )
                }
                value={companyRegisterData?.password}
                secureTextEntry={!visible}
                style={[styles.input1, AppStyles.flex]}
                showRightIcon
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
                {rules?.map((item: any) => {
                  const passed = item?.test(companyRegisterData?.password);
                  return (
                    <View style={styles.rules}>
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
                callingCode={companyRegisterData?.phone_code}
                phone={companyRegisterData?.phone}
                downIcon={{
                  tintColor: colors._4A4A4A,
                }}
                setPhone={(e: any) =>
                  dispatch(
                    setCompanyRegisterData({
                      phone: e,
                    }),
                  )
                }
                setCallingCode={(e: any) =>
                  dispatch(
                    setCompanyRegisterData({
                      phone_code: e,
                    }),
                  )
                }
              />
            </View>
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Next')}
              onPress={() => handleSignup()}
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
              onPress={() => verifyOTP()}
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
                placeholderTextColor={colors._4A4A4A}
                onChangeText={(e: any) =>
                  dispatch(
                    setCompanyProfileData({
                      website: e,
                    }),
                  )
                }
                value={companyProfileData?.website}
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
                      onPress={() => {
                        dispatch(
                          setCompanyProfileData({
                            company_size: option,
                          }),
                        );
                        setSelected(option);
                      }}>
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
      case 9:
        return (
          <View style={styles.innerConrainer}>
            <View>
              <Text style={styles.title}>
                {t('Confirm your business address')}
              </Text>
              <View style={[styles.inputIconLabel, {marginTop: hp(60)}]}>
                <Text style={styles.label}>{t('Address')}</Text>
                <Image style={styles.info} source={IMAGES.info} />
              </View>
              <View style={[styles.row, {marginTop: hp(15)}]}>
                <CustomTextInput
                  placeholder={t('Enter Address')}
                  placeholderTextColor={colors._4A4A4A}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyProfileData({
                        address: e,
                      }),
                    );
                  }}
                  value={companyProfileData?.address}
                  style={styles.addressInput}
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
              <Text style={styles.maplable}>
                {t('Choose your map location')}
              </Text>
              <View style={styles.map}>
                <MapView
                  region={{
                    latitude: position?.latitude,
                    longitude: position?.longitude,
                    latitudeDelta: position?.latitudeDelta,
                    longitudeDelta: position?.longitudeDelta,
                  }}
                  ref={mapRef}
                  key={Config?.MAP_KEY}
                  style={styles.map}>
                  <Marker
                    coordinate={{
                      latitude: position?.latitude,
                      longitude: position?.longitude,
                    }}>
                    <Image
                      source={IMAGES.location_marker}
                      style={styles.marker}
                    />
                  </Marker>
                </MapView>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.diffButton}>
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
                      lat: position?.latitude,
                      lng: position?.longitude,
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
                <Image
                  style={[styles.info, {marginLeft: 0}]}
                  source={IMAGES.info}
                />
              </View>
              <View>
                <CustomTextInput
                  placeholder={t('Introduce your company in few lines')}
                  placeholderTextColor={'#4A4A4A80'}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyProfileData({
                        about: e,
                      }),
                    );
                  }}
                  value={companyProfileData?.about}
                  style={styles.coIntroInput}
                  multiline
                  containerStyle={styles.Inputcontainer}
                  textAlignVertical="top"
                />
                <Text style={styles.characterlanght}>{'500 Characters'}</Text>
              </View>
              <View>
                <Text style={styles.title}>{t('Mission')}</Text>
                <CustomTextInput
                  placeholderTextColor={'#4A4A4A80'}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyProfileData({
                        mission: e,
                      }),
                    );
                  }}
                  value={companyProfileData?.mission}
                  style={[styles.coIntroInput, {height: hp(80)}]}
                  multiline
                  containerStyle={styles.Inputcontainer}
                  textAlignVertical="top"
                />
                <Text style={styles.characterlanght}>{'100 Characters'}</Text>
              </View>
              <View>
                <Text style={styles.title}>{t('Values')}</Text>
                <CustomTextInput
                  placeholderTextColor={'#4A4A4A80'}
                  onChangeText={(e: any) => {
                    dispatch(
                      setCompanyProfileData({
                        values: e,
                      }),
                    );
                  }}
                  value={companyProfileData?.values}
                  style={[styles.coIntroInput]}
                  multiline
                  containerStyle={styles.Inputcontainer}
                  textAlignVertical="top"
                />
                <Text style={styles.characterlanght}>{'100 Characters'}</Text>
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
                <Text style={styles.dateText}>{serviceSelect.join(', ')}</Text>
              </Pressable>
              <View style={styles.underline} />

              {/* {companyServices?.map((option, index) => {
                  const isSelected = option?.title === searviceSelect;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionContainer,
                        // isSelected && styles.selectedOptionContainer,
                      ]}
                      onPress={() => {
                        dispatch(
                          setCompanyProfileData({
                            services: option?._id,
                          }),
                        );
                        setServiceSelect(option?.title);
                      }}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedText,
                        ]}>
                        {option?.title}
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
                })} */}
              <FlatList
                data={serviceList}
                style={{maxHeight: hp(300)}}
                contentContainerStyle={{flexGrow: 1}}
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
                      ? {uri: logo?.path}
                      : IMAGES.logoImg
                  }
                  style={
                    Object.keys(logo)?.length
                      ? {
                          resizeMode: 'contain',
                          height: hp(100),
                          width: '100%',
                          marginVertical: hp(22),
                        }
                      : styles.logoImg
                  }
                />
              </TouchableOpacity>
              <Text style={styles.logolabel}>
                {t(
                  'Your logo helps job seekers recognise and trust your brand.',
                )}
              </Text>
              <TouchableOpacity
                onPress={() => (setType('cover'), setImageModal(!imageModal))}
                style={styles.logoConatiner}>
                <Image
                  source={
                    Object.keys(cover)?.length
                      ? {uri: cover?.path}
                      : IMAGES.uploadImg
                  }
                  style={
                    Object.keys(cover)?.length
                      ? {
                          resizeMode: 'cover',
                          height: hp(200),
                          width: '100%',
                          marginVertical: hp(22),
                        }
                      : styles.uploadImg
                  }
                />
              </TouchableOpacity>
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
                  dispatch(setRegisterSuccessModal(false));
                  nextStep();
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
        onUpdate={e => UploadPhoto(e)}
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
    // alignItems: 'center',
    marginBottom: 10,
    marginTop: hp(67),
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
    ...commonFontStyle(700, 22, colors._4A4A4A),
  },
  maplable: {
    ...commonFontStyle(400, 22, colors._4A4A4A),
    paddingVertical: hp(20),
  },
  map: {
    height: hp(150),
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
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
    ...commonFontStyle(400, 20, '#4A4A4A80'),
    height: hp(180),
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors._EBDCB8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(33),
    overflow: 'hidden',
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
});
