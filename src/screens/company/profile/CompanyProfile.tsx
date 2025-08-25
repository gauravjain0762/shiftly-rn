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
import {
  setCompanyProfileAllData,
  setCompanyProfileData,
} from '../../../features/authSlice';
import CustomPostCard from '../../../component/common/CustomPostCard';
import MyJobCard from '../../../component/common/MyJobCard';
import {
  useGetCompanyJobsQuery,
  useGetCompanyPostsQuery,
} from '../../../api/dashboardApi';
import CoAboutTab from '../../../component/common/CoAboutTab';
import ImageWithLoader from '../../../component/common/ImageWithLoader';

const ProfileTabs = ['About', 'Post', 'Jobs'];

const CompanyProfile = () => {
  const {data: JobData} = useGetCompanyJobsQuery({});
  const jobsList = JobData?.data?.jobs;

  const {companyProfileData, companyProfileAllData} = useSelector(
    (state: RootState) => state.auth,
  );

  const {data: getPost} = useGetCompanyPostsQuery({});
  const allPosts = getPost?.data?.posts;

  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {data} = useGetProfileQuery();
  const [selectedTanIndex, setSelectedTabIndex] = useState<number>(0);

  useEffect(() => {
    if (data?.status && data.data?.company) {
      dispatch(setCompanyProfileAllData(data.data.company));
      dispatch(setCompanyProfileData(data.data.company));
    }
  }, [data, dispatch]);

  // Memoize cover images to prevent recreation on tab changes
  const coverImages = useMemo(() => {
    if (!companyProfileData?.cover_images?.length) return [];
    return companyProfileData.cover_images
      .filter((img: any) => img && img.trim() !== '') // Filter out empty/null images
      .map((img: any) => ({uri: img}));
  }, [companyProfileData?.cover_images]);

  // Check if we should show loader based on actual cover images
  const shouldShowCoverLoader = useMemo(() => {
    return coverImages.length > 0;
  }, [coverImages]);

  // Memoize the back button handler
  const handleBackPress = useCallback(() => {
    resetNavigation(SCREENS.CoTabNavigator);
  }, []);

  // Memoize the create post handler
  const handleCreatePost = useCallback(() => {
    navigateTo(SCREENS.CoPost);
  }, []);

  // Memoize tab press handler
  const handleTabPress = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

  // Memoize the image children component
  const imageChildren = useMemo(
    () => (
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Image source={IMAGES.backArrow} style={styles.backArrow} />
      </TouchableOpacity>
    ),
    [handleBackPress],
  );

  // Memoize post render item
  const renderPostItem = useCallback(
    ({item}: {item: any}) => (
      <CustomPostCard title={item?.title} image={item?.image} />
    ),
    [],
  );

  // Memoize job render
  const renderJobs = useMemo(() => {
    if (selectedTanIndex !== 2) return null;

    return jobsList?.map((item: any, index: number) => (
      <View key={`job-${item.id || index}`}>
        <MyJobCard item={item} />
      </View>
    ));
  }, [selectedTanIndex, jobsList]);

  // Custom logo placeholder
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
          {/* Logo with conditional loader */}
          {hasValidLogo ? (
            <ImageWithLoader
              source={{uri: companyProfileData?.logo}}
              style={styles.logo}
              containerStyle={styles.logoContainer}
              loaderSize="small"
              loaderColor={colors._0B3970}
              placeholder={logoPlaceholder}
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.noLogoText}>No Logo</Text>
            </View>
          )}

          <View style={styles.titleTextContainer}>
            <Text style={styles.companyName}>
              {companyProfileData?.company_name || 'N/A'}
            </Text>
            <Text style={styles.tagline}>
              Experience a world away from your everyday
            </Text>
            <Text style={styles.industry}>Hospitality The Palm, Dubai</Text>
          </View>
        </View>

        <Text style={styles.description}>{companyProfileData?.about}</Text>
        <Text style={styles.description}>{companyProfileData?.values}</Text>

        <View style={styles.tabRow}>
          {ProfileTabs.map((item, index) => (
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
            style={{marginTop: hp(10)}}
            keyExtractor={item => `post-${item.id}`}
            data={allPosts}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            renderItem={renderPostItem}
          />
        )}

        {renderJobs}

        <GradientButton
          type="Company"
          style={styles.button}
          title={t('Create a Post')}
          onPress={handleCreatePost}
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
    tintColor: colors.white,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: hp(20),
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
