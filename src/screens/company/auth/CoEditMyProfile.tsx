import React, {useCallback, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import {useGetProfileQuery} from '../../../api/authApi';
import ImagePickerModal from '../../../component/common/ImagePickerModal';
import {useAppDispatch} from '../../../redux/hooks';
import {setCompanyProfileData} from '../../../features/authSlice';
import {useCreateCompanyProfileMutation} from '../../../api/dashboardApi';
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

const CoEditMyProfile = () => {
  const {t} = useTranslation();
  const {data} = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const companyProfile = data?.data?.company;
  console.log("🔥🔥🔥 ~ CoEditMyProfile ~ companyProfile:", companyProfile)
  const [updateCompanyProfile] = useCreateCompanyProfileMutation();

  const [companyName, setCompanyName] = useState(
    companyProfile?.company_name || '',
  );
  const [about, setAbout] = useState(companyProfile?.about || '');
  const [email, setEmail] = useState(companyProfile?.email || '');
  const [location, setLocation] = useState(
    companyProfile?.location || companyProfile?.address || '',
  );
  const [logo, setLogo] = useState<any | {}>(companyProfile?.logo || {});
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
  console.log('🔥 ~ PostJob ~ userAddress:', userAddress);

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

  const UploadPhoto = (e: any) => {
    const uri = e?.sourceURL || e?.path || e?.uri;
    if (!uri) return;

    const newLogo = {
      name: e?.filename || e?.name || 'logo.jpg',
      uri,
      type: e?.mime || 'image/jpeg',
    };

    setLogo(newLogo);

    dispatch(
      setCompanyProfileData({
        logo: newLogo,
      }),
    );
  };

  const handleUpdateProfile = async () => {
    const data = {
      logo: logo,
      about: about,
      address: userAddress?.address || location,
    };
    try {
      const res = await updateCompanyProfile(data).unwrap();
      const resData = res?.data?.company;
      if (res?.status) {
        dispatch(
          setCompanyProfileData({
            logo: resData?.logo,
            about: resData?.about,
            address: resData?.location,
          }),
        );
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
                <Image
                  source={
                    logo?.uri
                      ? {uri: logo?.uri}
                      : companyProfile?.logo
                      ? {uri: companyProfile.logo}
                      : IMAGES.hotel_cover
                  }
                  style={styles.logoImage}
                  resizeMode="cover"
                />
                {/* Edit Icon */}
                <TouchableOpacity
                  style={styles.editIconWrapper}
                  onPress={() => setImageModal(true)}>
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
              placeholderTextColor={colors._4D4D4D}
              textAlign="center"
            />
          </View>

          <Text style={styles.labelText}>{t('Description')}</Text>
          <TextInput
            value={about}
            onChangeText={setAbout}
            multiline
            placeholder={t('About Company')}
            style={styles.inputAbout}
            placeholderTextColor={colors._656464}
          />

          {/* Fields */}
          <View style={styles.fieldsWrapper}>
            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Email')}</Text>
              <TextInput
                value={email}
                editable={false}
                onChangeText={setEmail}
                placeholder="company@email.com"
                style={styles.inputText}
                placeholderTextColor={colors._555555}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Phone')}</Text>
              <Text style={styles.labelDesc}>{`🇦🇪 +${
                companyProfile?.phone_code || ''
              } ${companyProfile?.phone || ''}`}</Text>
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Location')}</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Company address"
                style={[styles.inputText, styles.locationInput]}
                s
                placeholderTextColor={colors._555555}
                multiline
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
    marginVertical: hp(18),
    ...commonFontStyle(400, 15, colors._656464),
    borderWidth: 1,
    borderColor: colors._C9C9C9,
    borderRadius: hp(8),
    padding: wp(10),
    textAlignVertical: 'top',
    minHeight: hp(100),
  },
  logoSection: {
    alignItems: 'center',
    marginTop: hp(10),
    marginBottom: hp(25),
  },
  logoImage: {
    width: wp(100),
    height: wp(100),
    borderRadius: wp(100),
    borderWidth: 1,
    borderColor: colors._C9C9C9,
    backgroundColor: colors.white,
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
  fieldsWrapper: {
    gap: hp(25),
  },
  labelText: {
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  labelDesc: {
    ...commonFontStyle(400, 18, colors._555555),
  },
  inputText: {
    ...commonFontStyle(400, 18, colors._555555),
    borderColor: colors._C9C9C9,
    paddingBottom: hp(5),
  },
  space: {
    gap: hp(10),
  },
  changeLocationBtn: {
    gap: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: hp(8),
    paddingHorizontal: wp(12),
    paddingVertical: hp(12),
    backgroundColor: colors._0B3970,
    borderRadius: wp(25),
  },
  changeLocationText: {
    ...commonFontStyle(500, 14, colors.white),
  },
  btn: {
    marginTop: hp(40),
  },
  locationInput: {
    height: hp(60),
    borderWidth: hp(1),
    borderRadius: hp(8),
    paddingHorizontal: wp(10),
  },
});
