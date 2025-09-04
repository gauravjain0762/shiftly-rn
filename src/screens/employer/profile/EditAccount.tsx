import React, {useState, useEffect} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from 'react-native';
import {BackHeader, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {goBack, successToast, errorToast} from '../../../utils/commonFunction';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Flag} from 'react-native-country-picker-modal';
import {callingCodeToCountryCode} from '../../../utils/countryFlags';
import CustomImage from '../../../component/common/CustomImage';
import CustomInput from '../../../component/common/CustomInput';
import CountryPicker from 'react-native-country-picker-modal';
import ImagePicker from 'react-native-image-crop-picker';
import GradientButton from '../../../component/common/GradientButton';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import ImagePickerModal from '../../../component/common/ImagePickerModal';

export const callingCodeToCountry = (callingCode: any) => {
  const cleanCode = callingCode
    ?.toString()
    ?.replace('+', '') as keyof typeof callingCodeToCountryCode;
  return callingCodeToCountryCode[cleanCode] || 'AE';
};

const EditAccountScreen = () => {
  const {userInfo}: any = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    nationality: '',
    phone: '',
    phone_code: '',
    about: '',
    picture: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);

  //   const [updateProfile] = useUpdateEmployeeProfileMutation();

  const handleImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {text: 'Camera', onPress: openCamera},
      {text: 'Gallery', onPress: openGallery},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.7,
    })
      .then(image => {
        setSelectedImage(image);
        setFormData(prev => ({...prev, picture: image.path}));
      })
      .catch(error => {
        console.log('Camera error:', error);
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.7,
    })
      .then(image => {
        setSelectedImage(image);
        setFormData(prev => ({...prev, picture: image.path}));
      })
      .catch(error => {
        console.log('Gallery error:', error);
      });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      errorToast('Name is required');
      return;
    }

    if (!formData.phone.trim()) {
      errorToast('Phone number is required');
      return;
    }

    try {
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('location', formData.location);
      updateData.append('nationality', formData.nationality);
      updateData.append('phone', formData.phone);
      updateData.append('phone_code', formData.phone_code);
      updateData.append('about', formData.about);

      if (selectedImage) {
        updateData.append('picture', {
          uri: selectedImage.path,
          type: selectedImage.mime,
          name: 'profile.jpg',
        } as any);
      }

      const response = await updateProfile(updateData).unwrap();
      successToast('Profile updated successfully');
      //   refetch();
      goBack();
    } catch (error) {
      errorToast('Failed to update profile');
      console.log('Update error:', error);
    }
  };

  const countryCode = formData.phone_code || 'AE';

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['top']}}
      colors={['#0D468C', '#041326']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => goBack()}>
              <Image source={IMAGES.backArrow} style={styles.backIcon} />
            </Pressable>
            <Text style={styles.headerTitle}>Edit Account</Text>
            <View style={{width: wp(24)}} />
          </View>

          {/* Profile Section */}
          <View style={styles.container}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity
                onPress={() => setIsImagePickerVisible(true)}
                style={styles.avatarContainer}>
                <CustomImage
                  uri={formData.picture || userInfo?.picture}
                  imageStyle={{height: '100%', width: '100%'}}
                  containerStyle={styles.avatar}
                  resizeMode="cover"
                />
                <View style={styles.editIconContainer}>
                  <Image source={IMAGES.edit_icon} style={styles.editIcon} />
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarLabel}>Change Photo</Text>
            </View>

            <CustomInput
              label="Full Name"
              placeholder="Enter your name"
              value={userInfo?.name}
              onChange={text => setFormData(prev => ({...prev, name: text}))}
              containerStyle={styles.inputContainer}
            />

            <CustomInput
              label="Location"
              placeholder="Enter your location"
              value={userInfo?.location}
              onChange={text =>
                setFormData(prev => ({...prev, location: text}))
              }
              containerStyle={styles.inputContainer}
            />

            <CustomInput
              label="About Me"
              placeholder="Tell us about yourself"
              value={userInfo?.about}
              onChange={text => setFormData(prev => ({...prev, about: text}))}
              containerStyle={styles.inputContainer}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Details Section */}
          <View style={styles.detailsContainer}>
            {/* Nationality */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nationality</Text>
              <TouchableOpacity
                onPress={() => setShowNationalityPicker(true)}
                style={styles.countrySelector}>
                <Text
                  style={
                    formData.nationality
                      ? styles.countryText
                      : styles.countryPlaceholder
                  }>
                  {userInfo?.nationality || 'Select Nationality'}
                </Text>
                <Image source={IMAGES.down1} style={styles.dropdownIcon} />
              </TouchableOpacity>
            </View>

            {/* Email (Non-editable) */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.nonEditableField}>
                <Text style={styles.nonEditableText}>{userInfo?.email}</Text>
              </View>
            </View>

            {/* Phone - FIXED STYLING */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <View style={styles.phoneContainer}>
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  style={styles.countryCodeSelector}>
                  <Flag
                    withEmoji
                    flagSize={18}
                    countryCode={callingCodeToCountry(countryCode) as any}
                  />
                  <Text style={styles.countryCodeText}>
                    {userInfo?.phone_code}
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
                  value={userInfo?.phone}
                  onChangeText={text =>
                    setFormData(prev => ({...prev, phone: text}))
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          <GradientButton
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
        </ScrollView>

        {showCountryPicker && (
          <CountryPicker
            visible={showCountryPicker}
            withFilter
            withFlag
            withCallingCode
            withEmoji={false}
            onSelect={country => {
              setFormData(prev => ({
                ...prev,
                phone_code: `+${country.callingCode[0]}`,
              }));
              setShowCountryPicker(false);
            }}
            onClose={() => setShowCountryPicker(false)}
          />
        )}

        {showNationalityPicker && (
          <CountryPicker
            visible={showNationalityPicker}
            withCallingCode={false}
            withFlag
            withEmoji={false}
            onSelect={country => {
              const countryName =
                typeof country?.name === 'string'
                  ? country.name
                  : country?.name?.common || '';
              setFormData(prev => ({...prev, nationality: countryName}));
              setShowNationalityPicker(false);
            }}
            onClose={() => setShowNationalityPicker(false)}
          />
        )}

        <ImagePickerModal
          onUpdate={() => {}}
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
    tintColor: colors.white,
  },
  headerTitle: {
    ...commonFontStyle(600, 20, colors.white),
  },

  avatarWrapper: {
    alignItems: 'center',
    marginTop: hp(20),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: hp(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 100,
  },
  avatar: {
    width: wp(120),
    height: wp(120),
    borderRadius: 100,
    overflow: 'hidden',
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
    ...commonFontStyle(600, 18, colors.white),
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
    ...commonFontStyle(400, 16, '#F4E2B8'),
  },
  countryPlaceholder: {
    flex: 1,
    ...commonFontStyle(400, 16, '#969595'),
  },
  dropdownIcon: {
    width: 12,
    height: 13,
    resizeMode: 'contain',
    tintColor: '#F4E2B8',
  },
  dropdownIconSmall: {
    width: 10,
    height: 11,
    resizeMode: 'contain',
    tintColor: '#F4E2B8',
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
    minWidth: wp(80),
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
    ...commonFontStyle(400, 16, '#F4E2B8'),
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
  },
  countryCodeText: {
    ...commonFontStyle(400, 14, '#F4E2B8'),
    marginHorizontal: wp(6),
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
