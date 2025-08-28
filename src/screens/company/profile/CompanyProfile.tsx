import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {
  LinearContainer,
  ParallaxContainer,
  ShareModal,
} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useAppDispatch} from '../../../redux/hooks';
import {
  setCompanyProfileAllData,
  setCompanyProfileData,
} from '../../../features/authSlice';
import CustomPostCard from '../../../component/common/CustomPostCard';
import MyJobCard from '../../../component/common/MyJobCard';
import {
  useGetCompanyJobsQuery,
  useGetCompanyPostsQuery,
  useGetProfileQuery,
} from '../../../api/dashboardApi';
import CoAboutTab from '../../../component/common/CoAboutTab';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomImage from '../../../component/common/CustomImage';

const ProfileTabs = ['About', 'Post', 'Jobs'];

const CompanyProfile = () => {
  const {data: JobData} = useGetCompanyJobsQuery({});
  const jobsList = JobData?.data?.jobs;

  const {companyProfileData, companyProfileAllData, userInfo} = useSelector(
    (state: RootState) => state.auth,
  );

  const {data: getPost} = useGetCompanyPostsQuery({});
  const allPosts = getPost?.data?.posts;
  console.log('🔥🔥🔥 ~ CompanyProfile ~ allPosts:', allPosts);

  const dispatch = useAppDispatch();
  const {data} = useGetProfileQuery();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedTanIndex, setSelectedTabIndex] = useState<number>(0);

  useEffect(() => {
    if (data?.status && data.data?.company) {
      dispatch(setCompanyProfileAllData(data.data.company));
      dispatch(setCompanyProfileData(data.data.company));
    }
  }, [data]);

  // Memoize cover images to prevent recreation on tab changes
  const coverImages = useMemo(() => {
    if (!userInfo?.cover_images?.length) return [IMAGES.dummy_cover];

    return userInfo.cover_images
      .filter((img: any) => {
        if (!img) return false;

        if (typeof img === 'string') {
          return img.trim() !== '';
        }

        if (typeof img === 'object' && img.uri) {
          return img.uri.trim() !== '';
        }

        return false;
      })
      .map((img: any) => {
        if (typeof img === 'string') {
          return {uri: img};
        }
        return img;
      });
  }, [companyProfileData?.cover_images]);

  const shouldShowCoverLoader = useMemo(() => {
    return coverImages.length > 0;
  }, [coverImages]);

  const navigation = useNavigation();
  const handleBackPress = useCallback(() => {
    const state = navigation.getState() as any;

    if (!state?.routes || state.routes.length < 2) {
      navigation.reset({
        index: 0,
        routes: [{name: SCREENS.CoTabNavigator as never}],
      });
      return;
    }

    const routes = state.routes;
    const previousRoute = routes[routes.length - 2];
    console.log('🔥🔥🔥 ~ CompanyProfile ~ previousRoute:', previousRoute);

    if (previousRoute?.name === 'CoTabNavigator') {
      console.log('go back>>>>>>>>');
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: SCREENS.CoTabNavigator as never}],
      });
    }
  }, [navigation]);

  const handleCreatePost = useCallback(() => {
    navigateTo(SCREENS.CoPost);
  }, []);

  const handleTabPress = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

  const imageChildren = useMemo(
    () => (
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Image source={IMAGES.backArrow} style={styles.backArrow} />
      </TouchableOpacity>
    ),
    [handleBackPress],
  );

  const renderPostItem = useCallback(
    ({item}: {item: any}) => (
      <CustomPostCard title={item?.title} image={item?.images} />
    ),
    [],
  );

  const renderJobs = useMemo(() => {
    if (selectedTanIndex !== 2) return null;

    if (jobsList?.length === 0) {
      return (
        <Text
          style={[
            commonFontStyle(500, 16, colors._3D3D3D),
            {textAlign: 'center', marginTop: hp(20)},
          ]}>
          No Jobs Found
        </Text>
      );
    }

    return jobsList?.map((item: any, index: number) => (
      <ScrollView
        style={{marginBottom: hp(15)}}
        key={`job-${item.id || index}`}>
        <MyJobCard
          item={item}
          onPressShare={() => setIsShareModalVisible(true)}
        />
      </ScrollView>
    ));
  }, [selectedTanIndex, jobsList]);

  const logoPlaceholder = useMemo(
    () => (
      <View style={styles.logoPlaceholder}>
        <ActivityIndicator size="small" color={colors._0B3970} />
      </View>
    ),
    [],
  );

  const hasValidLogo = useMemo(
    () =>
      !!companyProfileData?.logo &&
      typeof companyProfileData.logo === 'string' &&
      companyProfileData.logo.trim() !== '',
    [companyProfileData?.logo],
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: colors._F3E1B7}}
      edges={['bottom']}>
      <ScrollView
        contentContainerStyle={{paddingBottom: hp(40)}}
        showsVerticalScrollIndicator={false}>
        <ParallaxContainer
          imagePath={coverImages}
          ImageChildren={imageChildren}
          ContainerStyle={styles.container}
          showLoader={shouldShowCoverLoader}
          loaderColor={colors._0B3970}>
          <LinearContainer
            SafeAreaProps={{edges: ['bottom']}}
            containerStyle={styles.linearContainer}
            colors={['#FFF8E6', '#F3E1B7']}>
            <View style={styles.profileHeader}>
              {hasValidLogo ? (
                <CustomImage
                  uri={companyProfileData?.logo}
                  imageStyle={{height: '100%', width: '100%'}}
                  containerStyle={styles.logoContainer}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.noLogoText}>No Logo</Text>
                </View>
              )}

              <View style={styles.titleTextContainer}>
                <Text style={styles.companyName}>
                  {companyProfileData?.company_name}
                </Text>
                <Text style={styles.tagline}>
                  {companyProfileData?.mission}
                </Text>
                <Text style={styles.industry}>
                  {companyProfileData?.address}
                </Text>
              </View>
            </View>

            {companyProfileData?.about && (
              <Text style={styles.description}>
                {companyProfileData?.about || ''}
              </Text>
            )}

            {companyProfileData?.values && (
              <Text style={styles.description}>
                {companyProfileData?.values || ''}
              </Text>
            )}

            <View style={styles.tabRow}>
              {ProfileTabs?.map((item, index) => (
                <Pressable
                  key={item}
                  onPress={() => handleTabPress(index)}
                  style={styles.tabItem}>
                  <Text style={styles.tabText}>{item}</Text>
                  {selectedTanIndex === index && (
                    <View style={styles.tabIndicator} />
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.divider} />

            {selectedTanIndex === 0 && (
              <CoAboutTab
                companyProfileData={companyProfileData}
                companyProfileAllData={companyProfileAllData}
              />
            )}

            {selectedTanIndex === 1 && (
              <FlatList
                numColumns={2}
                data={allPosts}
                style={{marginTop: hp(10)}}
                renderItem={renderPostItem}
                keyExtractor={item => `post-${item.id}`}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                ListEmptyComponent={() => (
                  <Text
                    style={[
                      commonFontStyle(500, 16, colors._3D3D3D),
                      {textAlign: 'center', marginTop: hp(20)},
                    ]}>
                    No Posts Found
                  </Text>
                )}
              />
            )}

            {renderJobs}

            <ShareModal
              visible={isShareModalVisible}
              onClose={() => setIsShareModalVisible(false)}
            />
          </LinearContainer>
        </ParallaxContainer>
      </ScrollView>
    </SafeAreaView>
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
    tintColor: colors.white,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 12,
    // paddingVertical: hp(20),
    alignItems: 'center',
  },
  logoContainer: {
    width: wp(82),
    height: wp(82),
    borderRadius: 100,
    overflow: 'hidden',
  },
  logo: {
    width: wp(82),
    height: wp(82),
    borderRadius: 100,
  },
  logoPlaceholder: {
    width: wp(82),
    height: wp(82),
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLogoText: {
    ...commonFontStyle(400, 12, colors._3D3D3D),
    textAlign: 'center',
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
    marginTop: hp(25),
    flexDirection: 'row',
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
  button: {
    marginVertical: hp(26),
  },
});
