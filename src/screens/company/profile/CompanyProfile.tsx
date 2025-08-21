import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {
  GradientButton,
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
import {useGetProfileQuery} from '../../../api/authApi';
import {useAppDispatch} from '../../../redux/hooks';
import {setCompanyProfileAllData} from '../../../features/authSlice';
import CustomPostCard from '../../../component/common/CustomPostCard';
import MyJobCard from '../../../component/common/MyJobCard';
import {useGetCompanyPostsQuery} from '../../../api/dashboardApi';
import { navigationRef } from '../../../navigation/RootContainer';

const ProfileTabs = ['About', 'Post', 'Jobs'];

const StaticPosts = [
  {
    id: 1,
    title: 'Hotel Receptionist Job',
    image: IMAGES.staticpost1,
  },
  {
    id: 2,
    title: 'Hotel & Restaurant Manager',
    image: IMAGES.staticpost2,
  },
  {
    id: 3,
    title: 'Hotel Room Services Staff',
    image: IMAGES.staticpost3,
  },
  {
    id: 4,
    title: 'Restaurant Chef Job',
    image: IMAGES.staticpost4,
  },
  {
    id: 5,
    title: 'Hotel Room Services Staff',
    image: IMAGES.staticpost3,
  },
  {
    id: 6,
    title: 'Restaurant Chef Job',
    image: IMAGES.staticpost4,
  },
];

const CompanyProfile = () => {
  const {companyProfileData, companyProfileAllData} = useSelector(
    (state: RootState) => state.auth,
  );
  const {data: getPost, isLoading: Loading} = useGetCompanyPostsQuery({});
  const allPosts = getPost?.data?.posts;

  const dispatch = useAppDispatch();
  const {t, i18n} = useTranslation();
  const {data, isLoading} = useGetProfileQuery();
  const [selectedTanIndex, setSelectedTabIndex] = useState<number>(0);

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
        containerStyle={styles.linearContainer}
        colors={['#FFF8E6', '#F3E1B7']}>
        <View style={styles.profileHeader}>
          <Image
            style={styles.logo}
            source={{uri: companyProfileData?.logo?.uri}}
          />
          <View style={styles.titleTextContainer}>
            <Text style={styles.companyName}>
              {companyProfileAllData?.company_name || 'N/A'}
            </Text>
            <Text style={styles.tagline}>
              Experience a world away from your everyday
            </Text>
            <Text style={styles.industry}>Hospitality The Palm, Dubai</Text>
          </View>
        </View>

        <Text style={styles.description}>{companyProfileAllData?.about}</Text>
        <Text style={styles.description}>{companyProfileAllData?.values}</Text>

        <View style={styles.tabRow}>
          {ProfileTabs.map((item, index) => (
            <Pressable
              key={item}
              onPress={() => setSelectedTabIndex(index)}
              style={styles.tabItem}>
              <Text style={styles.tabText}>{item}</Text>
              {selectedTanIndex === index && (
                <View style={styles.tabIndicator} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.divider} />

        {selectedTanIndex == 0 && (
          <>
            <View style={styles.infoRow}>
              <View style={AppStyles.flex}>
                <Text style={styles.infoTitle}>
                  {companyProfileAllData?.address}
                </Text>
                <View style={styles.row}>
                  <Image source={IMAGES.web} style={styles.web} />
                  <Text style={styles.infoValue}>
                    {companyProfileData?.website}
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
                {companyProfileAllData?.company_size}
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
          </>
        )}

        {selectedTanIndex === 1 && (
          <FlatList
            numColumns={2}
            style={{marginTop: hp(10)}}
            keyExtractor={item => item.id.toString()}
            data={allPosts}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            renderItem={({item}) => (
              <CustomPostCard title={item?.title} image={item?.image} />
            )}
          />
        )}

        {selectedTanIndex === 2 && (
          <View>
            <MyJobCard />
          </View>
        )}

        <GradientButton
          type="Company"
          style={styles.button}
          title={t('Post A Job')}
          onPress={() => {
            navigateTo(SCREENS.CoPost);
          }}
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
  linearContainer: {
    paddingHorizontal: wp(21),
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 22,
    zIndex: 111,
  },
  backArrow: {
    width: wp(21),
    height: wp(21),
    tintColor: colors.black,
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
  tabRow: {
    flexDirection: 'row',
    marginTop: hp(30),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    ...commonFontStyle(500, 18, colors._0B3970),
  },
  tabIndicator: {
    bottom: '-85%',
    height: hp(4),
    width: '50%',
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: hp(20),
    backgroundColor: colors._0B3970,
  },
  divider: {
    height: 1,
    width: '150%',
    alignSelf: 'center',
    marginVertical: hp(16),
    backgroundColor: '#D9D9D9',
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
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp(5),
  },
  web: {
    width: wp(19),
    height: wp(19),
    resizeMode: 'contain',
  },
  map: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: hp(30),
  },
  button: {
    marginVertical: hp(26),
  },
});
