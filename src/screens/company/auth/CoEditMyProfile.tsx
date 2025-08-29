import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BackHeader,
  CustomDropdown,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {useAppDispatch} from '../../../redux/hooks';
import {setCompanyProfileData, setUserInfo} from '../../../features/authSlice';
import {
  useCreateCompanyProfileMutation,
  useGetBusinessTypesQuery,
  useGetProfileQuery,
} from '../../../api/dashboardApi';
import {
  errorToast,
  navigateTo,
  successToast,
} from '../../../utils/commonFunction';
import {navigationRef} from '../../../navigation/RootContainer';
import {SCREENS} from '../../../navigation/screenNames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {callingCodeToCountry} from '../../employer/profile/ViewProfileScreen';
import {Flag} from 'react-native-country-picker-modal';
import CustomImage from '../../../component/common/CustomImage';
import {companySize} from './CreateAccount';

const CoEditMyProfile = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {userInfo} = useSelector((state: RootState) => state.auth);
  console.log('🔥 ~ CoEditMyProfile ~ userInfo:', userInfo);
  const [updateCompanyProfile] = useCreateCompanyProfileMutation();
  const {data: profileData} = useGetProfileQuery();
  const {data: businessTypes} = useGetBusinessTypesQuery({});

  const [companyName, setCompanyName] = useState(userInfo?.company_name || '');
  const [about, setAbout] = useState(userInfo?.about || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [location, setLocation] = useState(
    userInfo?.location || userInfo?.address || '',
  );
  const [website, setWebsite] = useState(userInfo?.website || '');
  const [coSize, setCoSize] = useState(userInfo?.company_size || '');
  const [businessType, setBusinessType] = useState(
    userInfo?.business_type_id?._id || '',
  );
  const [coverImages, setCoverImages] = useState<any[]>(
    userInfo?.cover_images || [],
  );
  console.log("🔥🔥 ~ CoEditMyProfile ~ coverImages:", coverImages)
  const [logo, setLogo] = useState<any | {}>(userInfo?.logo || {});
  const [imgType, setImageType] = useState<'logo' | 'cover'>('logo');
  const [imageModal, setImageModal] = useState(false);
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
    dispatch(setUserInfo(profileData?.data?.company));
  }, [dispatch, profileData]);

  const getUserLocation = async () => {
    try {
      const locationString = await AsyncStorage.getItem('user_location');
      if (locationString !== null) {
        const location = JSON.parse(locationString);
        setUserAddress(location);
        setLocation(location.address);
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

  const hasChanges = useMemo(() => {
    if (!userInfo) return false;

    const logoChanged =
      (logo && typeof logo === 'object') || logo !== userInfo.logo;
    const aboutChanged = about !== (userInfo.about || '');
    const locationChanged =
      location !== (userInfo.location || userInfo.address || '');
    const companyNameChanged = companyName !== (userInfo.company_name || '');
    const websiteChanged = website !== (userInfo.website || '');
    const coSizeChanged = coSize !== (userInfo.company_size || '');
    const businessTypeChanged =
      businessType !== (userInfo.business_type_id?._id || '');
    const coverImagesChanged = coverImages !== userInfo.cover_images;

    return (
      logoChanged ||
      aboutChanged ||
      locationChanged ||
      companyNameChanged ||
      websiteChanged ||
      coSizeChanged ||
      businessTypeChanged ||
      coverImagesChanged
    );
  }, [
    logo,
    about,
    location,
    companyName,
    website,
    coSize,
    businessType,
    userInfo,
    coverImages,
  ]);

  const UploadPhoto = (e: any) => {
    const uri = e?.sourceURL || e?.path || e?.uri;
    if (!uri) return;

    const newImage = {
      name: e?.filename || e?.name || 'image.jpg',
      uri,
      type: e?.mime || 'image/jpeg',
    };

    if (imgType === 'logo') {
      setLogo(newImage);
    } else {
      const updatedCovers = [...(coverImages || []), newImage];
      setCoverImages(updatedCovers);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();

      if (logo && typeof logo === 'object' && logo.uri) {
        formData.append('logo', {
          uri: logo.uri,
          type: logo.type || 'image/jpeg',
          name: logo.name || 'logo.jpg',
        } as any);
      }

      if (coverImages?.length > 0) {
        coverImages.forEach((img, index) => {
          if (img.uri) {
            const imageData = {
              uri: img.uri,
              type: img.type || 'image/jpeg',
              name: img.name || `cover_${index}.jpg`,
            };

            formData.append('cover_images', imageData);
          }
        });
      }

      if (about) {
        formData.append('about', about);
      }

      formData.append('address', userAddress?.address || location);
      formData.append('lat', userAddress?.lat?.toString() || '');
      formData.append('lng', userAddress?.lng?.toString() || '');
      formData.append('website', website);
      formData.append('company_size', coSize);
      formData.append('business_type_id', businessType);

      const res = await updateCompanyProfile(formData).unwrap();
      const resData = res?.data?.company;
      if (res?.status) {
        dispatch(
          setCompanyProfileData({
            logo: resData?.logo,
            about: resData?.about,
            address: resData?.location,
            company_size: resData?.company_size,
            cover_images: resData?.cover_images,
            otp: resData?.otp,
            lat: resData?.lat,
            lng: resData?.lng,
            website: resData?.website,
          }),
        );
        dispatch(setUserInfo(resData));
        successToast(res?.message);
        navigationRef?.current?.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      errorToast('Failed to update profile');
    }
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <SafeAreaView edges={['bottom']}>
        <ScrollView style={styles.main}>
          <BackHeader
            type="company"
            isRight={false}
            title={t('Edit Profile')}
            titleStyle={styles.title}
            containerStyle={styles.header}
          />

          <View style={styles.logoSection}>
            <TouchableOpacity onPress={() => setImageModal(true)}>
              <View>
                <CustomImage
                  source={
                    logo?.uri
                      ? {uri: logo?.uri}
                      : userInfo?.logo
                      ? {uri: userInfo.logo}
                      : IMAGES.hotel_cover
                  }
                  imageStyle={{height: '100%', width: '100%'}}
                  containerStyle={styles.logoImage}
                  resizeMode="cover"
                />
                {/* Edit Icon */}
                <TouchableOpacity
                  style={styles.editIconWrapper}
                  onPress={() => {
                    setImageModal(true), setImageType('logo');
                  }}>
                  <Image
                    source={IMAGES.edit}
                    style={styles.editIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <TextInput
              editable={false}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder={t('Company Name')}
              style={styles.inputCompanyName}
              textAlign="center"
            />
          </View>

          <View style={styles.coverSection}>
            <Text style={styles.labelText}>{t('Cover Images')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {coverImages?.map((img, index) => (
                <View key={index} style={styles.coverImageWrapper}>
                  <CustomImage
                    source={{uri: img?.uri || img}}
                    containerStyle={styles.coverImage}
                    resizeMode="cover"
                    imageStyle={{height: '100%', width: '100%'}}
                  />
                  <TouchableOpacity
                    style={styles.removeCoverBtn}
                    onPress={() => {
                      const updatedCovers = coverImages.filter(
                        (_, i) => i !== index,
                      );
                      setCoverImages(updatedCovers);
                      dispatch(
                        setCompanyProfileData({cover_images: updatedCovers}),
                      );
                    }}>
                    <Text style={styles.removeText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addCoverBtn}
                onPress={() => {
                  setImageModal(true), setImageType('cover');
                }}>
                <Image source={IMAGES.pluse} style={{width: 30, height: 30}} />
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={{marginTop: hp(10)}}>
            <Text style={styles.labelText}>{t('Description')}</Text>
            <TextInput
              multiline
              value={about}
              onChangeText={setAbout}
              style={styles.inputAbout}
              placeholder={t('About Company')}
              placeholderTextColor={colors._7B7878}
            />
          </View>

          {/* Fields */}
          <View style={[styles.fieldsWrapper, {marginTop: hp(10)}]}>
            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Email')}</Text>
              <TextInput
                value={email}
                editable={false}
                onChangeText={setEmail}
                placeholder="company@email.com"
                style={styles.inputText}
                placeholderTextColor={colors._7B7878}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Phone')}</Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Flag
                  withEmoji
                  flagSize={hp(26)}
                  withFlagButton
                  countryCode={
                    callingCodeToCountry(userInfo?.phone_code) as any
                  }
                />
                <Text style={styles.labelDesc}>{`+${
                  userInfo?.phone_code || ''
                } ${userInfo?.phone || ''}`}</Text>
              </View>
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Website')}</Text>
              <TextInput
                value={website}
                onChangeText={setWebsite}
                placeholder="https://company.com"
                style={styles.inputContainer}
                placeholderTextColor={colors._7B7878}
                keyboardType="url"
              />
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Company Size')}</Text>
              <CustomDropdown
                data={companySize || []}
                labelField="label"
                valueField="value"
                placeholder={'Please select company size'}
                value={userInfo?.company_size}
                onChange={(e: any) => {
                  setCoSize(e?.value);
                }}
                dropdownStyle={styles.dropdown}
                renderRightIcon={IMAGES.ic_down}
                RightIconStyle={styles.rightIcon}
                selectedTextStyle={[styles.selectedTextStyle]}
              />
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Business Type')}</Text>
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
                value={businessType}
                onChange={(e: any) => {
                  setBusinessType(e?.value);
                }}
                dropdownStyle={styles.dropdown}
                renderRightIcon={IMAGES.ic_down}
                RightIconStyle={styles.rightIcon}
                selectedTextStyle={styles.selectedTextStyle}
              />
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Location')}</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Company address"
                style={[styles.inputText, styles.locationInput]}
                placeholderTextColor={colors._7B7878}
                multiline
                editable={false}
              />
              <TouchableOpacity
                style={styles.changeLocationBtn}
                onPress={() => {
                  navigateTo(SCREENS.LocationScreen, {
                    userAddress: userAddress,
                  });
                }}>
                <Image
                  source={IMAGES.location}
                  style={{width: wp(16), height: hp(16)}}
                />
                <Text style={styles.changeLocationText}>
                  {t('Change Location')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <GradientButton
            style={styles.btn}
            type="Company"
            title={t('Save Changes')}
            onPress={handleUpdateProfile}
            disabled={!hasChanges}
          />
        </ScrollView>

        <ImagePickerModal
          actionSheet={imageModal}
          setActionSheet={() => {
            setImageModal(false);
          }}
          onUpdate={(e: any) => UploadPhoto(e)}
        />
      </SafeAreaView>
    </LinearContainer>
  );
};

export default CoEditMyProfile;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: wp(35),
  },
  header: {
    paddingTop: hp(24),
    marginBottom: hp(28),
  },
  title: {
    right: '60%',
  },
  inputAbout: {
    marginVertical: hp(12),
    ...commonFontStyle(400, 18, colors._181818),
    borderWidth: 1,
    borderColor: colors._C9C9C9,
    borderRadius: hp(8),
    padding: wp(10),
    textAlignVertical: 'top',
    minHeight: hp(100),
    maxHeight: hp(130),
  },
  logoSection: {
    alignItems: 'center',
    marginTop: hp(8),
    marginBottom: hp(14),
  },
  logoImage: {
    width: wp(95),
    height: wp(95),
    borderWidth: 1,
    borderRadius: wp(95),
    borderColor: colors._C9C9C9,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  loaderContainer: {
    width: wp(100),
    height: hp(100),
    borderRadius: hp(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  editIconWrapper: {
    position: 'absolute',
    top: -hp(3),
    right: wp(5),
    backgroundColor: colors.white,
    borderRadius: wp(12),
    padding: wp(4),
    elevation: 3,
  },
  editIcon: {
    width: wp(18),
    height: wp(18),
  },
  inputCompanyName: {
    ...commonFontStyle(600, 25, colors._0B3970),
    marginTop: hp(10),
    borderColor: colors._C9C9C9,
    paddingBottom: hp(4),
  },
  inputContainer: {
    padding: wp(14),
    borderWidth: hp(1),
    borderRadius: hp(8),
    borderColor: colors._C9C9C9,
    ...commonFontStyle(400, 18, colors._181818),
  },
  fieldsWrapper: {
    gap: hp(20),
  },
  labelText: {
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  labelDesc: {
    ...commonFontStyle(400, 18, colors._181818),
  },
  inputText: {
    paddingBottom: hp(5),
    borderColor: colors._C9C9C9,
    ...commonFontStyle(400, 18, colors._181818),
  },
  space: {
    gap: hp(10),
  },
  changeLocationBtn: {
    gap: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    // marginTop: hp(2),
    paddingHorizontal: wp(12),
    paddingVertical: hp(12),
    backgroundColor: colors._0B3970,
    borderRadius: wp(25),
  },
  changeLocationText: {
    ...commonFontStyle(500, 14, colors.white),
  },
  btn: {
    marginTop: hp(24),
  },
  locationInput: {
    height: hp(58),
    borderWidth: hp(1),
    borderRadius: hp(8),
    paddingHorizontal: wp(14),
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
  coverSection: {
    gap: hp(10),
    marginBottom: hp(12),
  },
  coverImageWrapper: {
    marginRight: wp(10),
    position: 'relative',
  },
  coverImage: {
    width: wp(120),
    height: hp(80),
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: hp(8),
    borderColor: colors._C9C9C9,
  },
  removeCoverBtn: {
    top: 5,
    right: 5,
    width: hp(22),
    height: hp(22),
    borderRadius: hp(22),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  removeText: {
    ...commonFontStyle(600, 12, colors.white),
  },
  addCoverBtn: {
    width: wp(120),
    height: hp(80),
    borderRadius: hp(8),
    borderWidth: 1,
    borderColor: colors._C9C9C9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
});
