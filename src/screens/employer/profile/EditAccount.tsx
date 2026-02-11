import React, { useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { goBack, successToast, errorToast } from '../../../utils/commonFunction';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flag } from 'react-native-country-picker-modal';
import { callingCodeToCountryCode } from '../../../utils/countryFlags';
import CustomImage from '../../../component/common/CustomImage';
import CustomInput from '../../../component/common/CustomInput';
import CountryPicker from 'react-native-country-picker-modal';
import GradientButton from '../../../component/common/GradientButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useEmpUpdateProfileMutation } from '../../../api/dashboardApi';
import CharLength from '../../../component/common/CharLength';

export const callingCodeToCountry = (callingCode: any) => {
  const cleanCode = callingCode
    ?.toString()
    ?.replace('+', '') as keyof typeof callingCodeToCountryCode;
  return callingCodeToCountryCode[cleanCode] || 'AE';
};

const EditAccountScreen = () => {
  const { userInfo }: any = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    picture: '',
    name: '',
    location: '',
    nationality: '',
    about: '',
    phone: '',
    phone_code: '',
    email: '',
  });
  const countryCode = formData?.phone_code || '';
  const [picture, setPicture] = useState<any>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [countryPickerReady, setCountryPickerReady] = useState(false);
  const [nationalityPickerReady, setNationalityPickerReady] = useState(false);
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [updateProfile] = useEmpUpdateProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setFormData({
        picture: userInfo?.picture || '',
        name: userInfo?.name || '',
        location: userInfo?.location || '',
        nationality: userInfo?.nationality || '',
        about: userInfo?.about || '',
        phone: (userInfo?.phone || '').replace(/\s/g, ''),
        phone_code: userInfo?.phone_code || '',
        email: userInfo?.email || '',
      });
    }
  }, [userInfo]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      errorToast('Name is required');
      return;
    }

    if (!formData.phone.trim()) {
      errorToast('Phone number is required');
      return;
    }

    console.log('🔥 ~ handleSave ~ formData:', formData);

    // Set loading state if image is being uploaded
    if (picture?.path) {
      setIsUploadingImage(true);
    }

    try {
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('address', formData.location);
      updateData.append('nationality', formData.nationality);
      updateData.append('phone', formData.phone);
      updateData.append(
        'phone_code',
        formData.phone_code?.replace('+', '') || '',
      );
      updateData.append('about', formData.about);

      if (picture?.path) {
        updateData.append('picture', {
          uri: picture?.path,
          type: picture?.mime || 'image/jpeg',
          name: picture?.path.split('/').pop() || 'profile.jpg',
        });
      }

      const response = await updateProfile(updateData).unwrap();
      console.log('🔥 ~ handleSave ~ response?.data:', response?.data);
      if (response?.status) {
        setIsUploadingImage(false);
        successToast('Profile updated successfully');
        goBack();
      } else {
        setIsUploadingImage(false);
      }
    } catch (error) {
      setIsUploadingImage(false);
      errorToast('Failed to update profile');
      console.log('Update error:', error);
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{ edges: ['top'] }}
      colors={[colors._F7F7F7, colors.white]}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <KeyboardAwareScrollView
          enableOnAndroid
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => goBack()}>
              <Image source={IMAGES.backArrow} style={styles.backIcon} />
            </Pressable>
            <Text style={styles.headerTitle}>Edit Account</Text>
            <View style={{ width: wp(24) }} />
          </View>

          {/* Profile Section */}
          <View style={styles.container}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity
                onPress={() => setIsImagePickerVisible(true)}
                style={styles.avatarContainer}
                disabled={isUploadingImage}>
                <View style={styles.avatar}>
                  {isUploadingImage ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="large" color={colors._0B3970} />
                    </View>
                  ) : (
                    <Image
                      source={
                        picture?.path || formData?.picture
                          ? { uri: picture?.path || formData?.picture }
                          : IMAGES.logoText
                      }
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
                {!isUploadingImage && (
                  <View style={styles.editIconContainer}>
                    <Image source={IMAGES.edit_icon} style={styles.editIcon} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <CustomInput
              label="Full Name"
              placeholder="Enter your name"
              value={formData?.name}
              onChange={(text: any) =>
                setFormData(prev => ({ ...prev, name: text }))
              }
              containerStyle={styles.inputContainer}
            />

            <CustomInput
              label="About Me"
              placeholder="Tell us about yourself"
              value={formData?.about}
              onChange={(text: any) =>
                setFormData(prev => ({ ...prev, about: text }))
              }
              inputStyle={[
                styles.inputContainer,
                {
                  height: hp(120),
                },
              ]}
              multiline={true}
              maxLength={100}
            />
            <CharLength chars={100} value={formData?.about} type={'employee'} style={{ marginTop: 0 }} />
          </View>

          {/* Details Section */}
          <View style={styles.detailsContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nationality</Text>
              <TouchableOpacity
                onPress={() => {
                  setNationalityPickerReady(true);
                  setTimeout(() => {
                    setShowNationalityPicker(true);
                  }, 100);
                }}
                style={styles.countrySelector}>
                <Text
                  style={
                    formData?.nationality
                      ? styles.countryText
                      : styles.countryPlaceholder
                  }>
                  {formData?.nationality || 'Select Nationality'}
                </Text>
                <Image source={IMAGES.down1} style={styles.dropdownIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.nonEditableField}>
                <Text style={styles.nonEditableText}>{formData?.email}</Text>
              </View>
            </View>

            {/* Phone - FIXED STYLING */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <View style={styles.phoneContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setCountryPickerReady(true);
                    setTimeout(() => {
                      setShowCountryPicker(true);
                    }, 100);
                  }}
                  style={styles.countryCodeSelector}>
                  <Flag
                    withFlagButton
                    flagSize={wp(18)}
                    withEmoji={true}
                    countryCode={callingCodeToCountry(countryCode) as any}
                  />
                  <Text style={styles.countryCodeText}>
                    {`${formData?.phone_code}` || ''}
                  </Text>
                  <Image
                    source={IMAGES.down1}
                    style={styles.dropdownIconSmall}
                  />
                </TouchableOpacity>

                <View style={styles.phoneSeparator} />

                <TextInput
                  style={styles.phoneTextInput}
                  placeholder="Enter phone number"
                  placeholderTextColor="#969595"
                  value={formData?.phone}
                  onChangeText={text => {
                    // Remove all spaces from the phone number
                    const phoneWithoutSpaces = text.replace(/\s/g, '');
                    setFormData(prev => ({ ...prev, phone: phoneWithoutSpaces }));
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          <GradientButton
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </KeyboardAwareScrollView>

        {countryPickerReady && (
          <CountryPicker
            visible={showCountryPicker}
            withFilter
            withFlag
            withEmoji={true}
            withCallingCode={true}
            modalProps={{
              animationType: 'slide',
              transparent: true,
              presentationStyle: 'overFullScreen',
            }}
            onSelect={country => {
              setFormData(prev => ({
                ...prev,
                phone_code: `+${country.callingCode[0]}`,
              }));
              setShowCountryPicker(false);
            }}
            onClose={() => {
              setShowCountryPicker(false);
              setTimeout(() => setCountryPickerReady(false), 300);
            }}
          />
        )}

        {nationalityPickerReady && (
          <CountryPicker
            withFlag
            withFilter
            withEmoji={false}
            visible={showNationalityPicker}
            modalProps={{
              animationType: 'slide',
              transparent: true,
              presentationStyle: 'overFullScreen',
            }}
            onSelect={country => {
              const countryName =
                typeof country?.name === 'string'
                  ? country.name
                  : country?.name?.common || '';
              setFormData(prev => ({ ...prev, nationality: countryName }));
              setShowNationalityPicker(false);
            }}
            onClose={() => {
              setShowNationalityPicker(false);
              setTimeout(() => setNationalityPickerReady(false), 300);
            }}
          />
        )}

        <ImagePickerModal
          onUpdate={(image: any) => {
            setPicture(image);
          }}
          actionSheet={isImagePickerVisible}
          setActionSheet={setIsImagePickerVisible}
        />
      </SafeAreaView>
    </LinearContainer>
  );
};

export default EditAccountScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(23),
    paddingVertical: hp(15),
  },
  backIcon: {
    height: hp(20),
    width: wp(24),
    tintColor: colors._0B3970,
  },
  headerTitle: {
    ...commonFontStyle(600, 20, colors._2F2F2F),
  },

  avatarWrapper: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: hp(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: wp(60),
    backgroundColor: colors.white, // Ensure shadow is visible
  },
  avatar: {
    width: wp(120),
    height: wp(120),
    overflow: 'hidden',
    borderRadius: wp(60),
  },
  avatarImage: {
    width: wp(120),
    height: wp(120),
  },
  loaderContainer: {
    width: wp(120),
    height: wp(120),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: colors._F4E2B8,
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: '#0A376D',
  },
  avatarLabel: {
    ...commonFontStyle(400, 14, '#EAEAEA'),
    marginTop: hp(5),
  },

  container: {
    paddingHorizontal: wp(23),
    marginTop: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: hp(15),
  },
  detailsContainer: {
    paddingHorizontal: wp(23),
    marginTop: hp(20),
  },
  fieldContainer: {
    marginBottom: hp(20),
  },
  fieldLabel: {
    ...commonFontStyle(600, 18, colors._2F2F2F),
    marginBottom: hp(8),
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp(59),
    borderWidth: 1.5,
    borderRadius: hp(20),
    borderColor: '#225797',
    paddingHorizontal: wp(20),
    backgroundColor: 'transparent',
  },
  countryText: {
    flex: 1,
    ...commonFontStyle(400, 16, colors._050505),
  },
  countryPlaceholder: {
    flex: 1,
    ...commonFontStyle(400, 16, '#969595'),
  },
  dropdownIcon: {
    width: 12,
    height: 13,
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  dropdownIconSmall: {
    width: 10,
    height: 11,
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  nonEditableField: {
    height: hp(59),
    borderWidth: 1.5,
    borderRadius: hp(20),
    borderColor: '#666666',
    paddingHorizontal: wp(20),
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  nonEditableText: {
    ...commonFontStyle(400, 16, '#969595'),
  },

  // FIXED PHONE CONTAINER STYLING
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(59),
    borderWidth: 1.5,
    borderRadius: hp(20),
    borderColor: '#225797',
    backgroundColor: 'transparent',
    paddingHorizontal: wp(15),
    overflow: 'hidden',
  },
  countryCodeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: wp(12),
    minWidth: wp(100),
  },
  phoneSeparator: {
    width: 1,
    height: hp(30),
    backgroundColor: '#225797',
    marginRight: wp(12),
  },
  phoneTextInput: {
    flex: 1,
    height: '100%',
    ...commonFontStyle(400, 16, colors._050505),
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
  },
  countryCodeText: {
    ...commonFontStyle(400, 16, colors._050505),
    minWidth: wp(35),
  },

  // FIXED SAVE BUTTON STYLING
  buttonContainer: {
    paddingHorizontal: wp(23),
    marginTop: hp(40),
    marginBottom: hp(30),
  },
  saveButton: {
    marginHorizontal: wp(24),
  },
  saveButtonText: {
    ...commonFontStyle(600, 18, colors.white),
    textAlign: 'center',
  },
});
