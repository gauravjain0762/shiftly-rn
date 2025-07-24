import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {
  LinearContainer,
  LocationContainer,
  ParallaxContainer,
} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import {navigateTo, resetNavigation} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {RootState} from '../../../store';
import { useGetProfileQuery} from '../../../api/authApi';
import {useAppDispatch} from '../../../redux/hooks';
import {setCompanyProfileAllData} from '../../../features/authSlice';

const CompanyProfile = () => {
  const {
    businessType = [],
    fcmToken,
    language,
    companyRegistrationStep,
    userInfo,
    registerSuccessModal,
    companyProfileData,
    companyProfileAllData,
    companyServices = [],
  } = useSelector((state: RootState) => state.auth);
  console.log(
    '🔥🔥🔥 ~ CompanyProfile ~ companyProfileData:',
    companyProfileData,
  );
  console.log(
    '🔥🔥🔥 ~ CompanyProfile ~ companyProfileAllData:',
    companyProfileAllData,
  );
  const dispatch = useAppDispatch();
  const {t, i18n} = useTranslation();
  const {data, isLoading} = useGetProfileQuery();

  useEffect(() => {
    if (data?.status && data.data?.company) {
      dispatch(setCompanyProfileAllData(data.data.company));
    }
  }, [data]);

  return (
    <ParallaxContainer
      imagePath={{uri: companyProfileData?.cover_images?.uri}}
      ImageChildren={
        <TouchableOpacity
          onPress={() => resetNavigation(SCREENS.CoTabNavigator)}
          style={styles.backButton}>
          <Image source={IMAGES.backArrow} style={styles.backArrow} />
        </TouchableOpacity>
      }
      ContainerStyle={styles.container}>
      <LinearContainer
        SafeAreaProps={{edges: ['bottom']}}
        containerStyle={{paddingHorizontal: wp(21)}}
        colors={['#FFF8E6', '#F3E1B7']}>
        <View style={styles.profileHeader}>
          <Image
            source={{uri: companyProfileData?.logo?.uri}}
            style={styles.logo}
          />
          <View style={styles.titleTextContainer}>
            <Text style={styles.companyName}>
              {t(companyProfileAllData?.company_name) || 'N/A'}
            </Text>
            <Text style={styles.tagline}>
              Experience a world away from your everyday
            </Text>
            <Text style={styles.industry}>Hospitality The Palm, Dubai</Text>
          </View>
        </View>

        <Text style={styles.description}>
          {/* Discover an extraordinary world beyond anything you’ve ever imagined.
          Our Atlantis properties in Dubai and Sanya, China redefine the concept
          of entertainment destination resorts. They are extraordinary,
          intriguing and unique destinations full of life, wonder and surprise. */}
          {t(companyProfileAllData?.about)}
        </Text>
        <Text style={styles.description}>
          {/* Atlantis is all about superlatives: more variety and choice than you
          can imagine, experiences so creative and fun they astound, and service
          truly dedicated to wonder and excitement. */}
          {t(companyProfileAllData?.values)}
        </Text>

        <View style={styles.infoRow}>
          <View style={AppStyles.flex}>
            <Text style={styles.infoTitle}>
              {t(companyProfileAllData?.address)}
            </Text>
            <View style={styles.row}>
              <Image source={IMAGES.web} style={styles.web} />
              <Text style={styles.infoValue}>
                {t(companyProfileData?.website)}
              </Text>
            </View>
          </View>
          <View style={AppStyles.flex}>
            <Text style={styles.infoTitle}>Type</Text>
            <Text style={styles.infoValue}>Hotel</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Company size</Text>
          <Text style={styles.infoValue}>
            {/* 5,001-10,000 employees | 8,464 associated members */}
            {t(companyProfileAllData?.company_size)}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Sectors/industry</Text>
          <Text style={styles.infoValue}>
            Industry Sectors or Specializations
          </Text>
        </View>
        <LocationContainer
          containerStyle={styles.map}
          lat={companyProfileAllData?.lat}
          lng={companyProfileAllData?.lng}
        />
      </LinearContainer>
    </ParallaxContainer>
  );
};

export default CompanyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E1B7',
  },
  bannerImage: {
    width: '100%',
    height: hp(306),
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 22,
    zIndex: 111,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: hp(20),
    alignItems: 'center',
  },
  logo: {
    width: wp(82),
    height: wp(82),
    borderRadius: 100,
  },
  titleTextContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: hp(7),
  },
  companyName: {
    ...commonFontStyle(600, 22, colors._0B3970),
  },
  tagline: {
    ...commonFontStyle(400, 14, colors.black),
  },
  industry: {
    ...commonFontStyle(400, 14, colors.black),
  },
  description: {
    ...commonFontStyle(400, 15, colors._3D3D3D),
    marginTop: hp(11),
    lineHeight: hp(25),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoSection: {
    marginTop: 14,
  },
  infoTitle: {
    ...commonFontStyle(400, 18, colors._0B3970),
    marginBottom: hp(10),
  },
  infoValue: {
    ...commonFontStyle(400, 16, colors._434343),
  },
  locationCard: {
    backgroundColor: colors._0B3970,
    paddingHorizontal: wp(22),
    paddingVertical: hp(12),
  },
  locationLabel: {
    ...commonFontStyle(400, 18, colors.white),
  },
  primaryTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    ...commonFontStyle(400, 14, colors.white),
    marginTop: hp(7),
  },
  mapImage: {
    height: 140,
    width: '100%',
    resizeMode: 'cover',
  },
  backArrow: {
    width: wp(21),
    height: wp(21),
    tintColor: colors.black,
  },
  web: {
    width: wp(19),
    height: wp(19),
    resizeMode: 'contain',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(5),
  },
  map: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: hp(30),
  },
  primary: {
    ...commonFontStyle(500, 11, colors.white),
  },
});
