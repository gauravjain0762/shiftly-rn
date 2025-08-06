import React, {useState} from 'react';
import {
  Image,
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
import {errorToast, successToast} from '../../../utils/commonFunction';
import {navigationRef} from '../../../navigation/RootContainer';

const CoEditMyProfile = () => {
  const {t} = useTranslation();
  const {data} = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const companyProfile = data?.data?.company;
  const [updateCompanyProfile, {isLoading: profileLoading}] =
    useCreateCompanyProfileMutation();

  const [companyName, setCompanyName] = useState(
    companyProfile?.company_name || '',
  );
  const [about, setAbout] = useState(companyProfile?.about || '');
  const [email, setEmail] = useState(companyProfile?.email || '');
  const [location, setLocation] = useState(
    companyProfile?.location || companyProfile?.address || '',
  );
  const [logo, setLogo] = useState<any | {}>({});
  const [imageModal, setImageModal] = useState(false);

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
      address: location,
    };
    try {
      const res = await updateCompanyProfile(data).unwrap();
      console.log("🔥🔥🔥 ~ handleUpdateProfile ~ res:", res)
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
      <View style={styles.main}>
        <BackHeader
          type="company"
          isRight={false}
          title={t('Edit Profile')}
          titleStyle={styles.title}
          containerStyle={styles.header}
        />

        <View style={styles.profileRow}>
          <TouchableOpacity onPress={() => setImageModal(true)}>
            <Image
              source={
                logo?.uri
                  ? {uri: logo?.uri}
                  : companyProfile?.logo?.url
                  ? {uri: companyProfile.logo.url}
                  : IMAGES.hotel_cover
              }
              style={styles.logoImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TextInput
            editable={false}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder={t('Company Name')}
            style={styles.inputCompanyName}
            placeholderTextColor={colors._4D4D4D}
          />
        </View>

        <TextInput
          value={about}
          onChangeText={setAbout}
          multiline
          placeholder={t('About Company')}
          style={styles.inputAbout}
          placeholderTextColor={colors._656464}
        />

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
              style={styles.inputText}
              placeholderTextColor={colors._555555}
            />
          </View>
        </View>

        <GradientButton
          style={styles.btn}
          type="Company"
          title={t('Save Changes')}
          onPress={() => {
            handleUpdateProfile();
          }}
        />
      </View>
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(15),
  },
  inputCompanyName: {
    ...commonFontStyle(600, 25, colors._0B3970),
    flex: 1,
    // borderBottomWidth: 1,
    borderColor: colors._C9C9C9,
    paddingBottom: hp(4),
  },
  inputAbout: {
    marginVertical: hp(18),
    ...commonFontStyle(400, 15, colors._656464),
    borderWidth: 1,
    borderColor: colors._C9C9C9,
    borderRadius: 8,
    padding: wp(10),
    textAlignVertical: 'top',
    minHeight: hp(100),
  },
  fieldsWrapper: {
    marginTop: hp(18),
    gap: hp(35),
  },
  labelText: {
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  labelDesc: {
    ...commonFontStyle(400, 18, colors._555555),
  },
  inputText: {
    ...commonFontStyle(400, 18, colors._555555),
    // borderBottomWidth: 1,
    borderColor: colors._C9C9C9,
    paddingBottom: hp(5),
  },
  space: {
    gap: hp(6),
  },
  btn: {
    marginTop: hp(40),
  },
  logoImage: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: colors._C9C9C9,
    backgroundColor: colors.white,
  },
});
