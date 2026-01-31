import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import {
  GradientButton,
  LinearContainer,
  ParallaxContainer,
} from '../../../component';
import { IMAGES } from '../../../assets/Images';
import { colors } from '../../../theme/colors';
import { SCREENS } from '../../../navigation/screenNames';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAppDispatch } from '../../../redux/hooks';
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
  useLazyGetCompanyProfileByIdQuery,
} from '../../../api/dashboardApi';
import CoAboutTab from '../../../component/common/CoAboutTab';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomImage from '../../../component/common/CustomImage';
import ExpandableText from '../../../component/common/ExpandableText';
import { resetNavigation } from '../../../utils/commonFunction';

const ProfileTabs = ['About', 'Post', 'Jobs'];

const CompanyProfile = () => {
  const { params } = useRoute<any>();
  const fromOnboarding = params?.fromOnboarding || false;
  const companyId = params?.companyId;

  const { data: JobData } = useGetCompanyJobsQuery({}, { skip: !!companyId });
  const jobsList = JobData?.data?.jobs || [];

  const { companyProfileData, companyProfileAllData, userInfo } = useSelector(
    (state: RootState) => state.auth,
  );

  const { data: getPost } = useGetCompanyPostsQuery({}, { skip: !!companyId });
  const allPosts = getPost?.data?.posts || [];

  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching } = useGetProfileQuery(undefined, { skip: !!companyId });

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const logoLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [viewedCompanyPosts, setViewedCompanyPosts] = useState<any[]>([]);
  const [viewedCompanyJobs, setViewedCompanyJobs] = useState<any[]>([]);

  // Use lazy query for external company profile
  const [getCompanyProfile, { data: companyData, isLoading: isCompanyLoading }] =
    useLazyGetCompanyProfileByIdQuery();

  useEffect(() => {
    if (companyId) {
      // Clear previous data state when fetching new company
      setViewedCompanyPosts([]);
      setViewedCompanyJobs([]);
      getCompanyProfile({ company_id: companyId, tab: 'posts', page: 1 });
    }
  }, [companyId, getCompanyProfile]);

  useEffect(() => {
    if (data?.status && data.data?.company && !companyId) {
      dispatch(setCompanyProfileAllData(data.data.company));
      dispatch(setCompanyProfileData(data.data.company));
    }
  }, [data, companyId, dispatch]);

  useEffect(() => {
    if (companyData?.status && companyId) {
      setViewedCompanyPosts(companyData?.data?.posts || []);
      setViewedCompanyJobs(companyData?.data?.jobs || []);
    }
  }, [companyData, companyId]);

  const displayProfile = useMemo(() => {
    if (companyId && companyData?.data?.company) {
      return companyData.data.company;
    }
    // Fallback to own profile only if NOT in external viewing mode
    return companyId ? null : (companyProfileAllData || companyProfileData || data?.data?.company);
  }, [companyId, companyData, companyProfileAllData, companyProfileData, data]);

  const coverImages = useMemo(() => {
    const profile = displayProfile || (companyId ? null : userInfo);
    if (!profile) return [];

    const images = profile?.cover_images;

    const getCleanUrl = (url: any): string | null => {
      if (!url) return null;
      let urlStr = typeof url === 'string' ? url : (typeof url === 'object' && url.uri ? url.uri : null);
      if (!urlStr || typeof urlStr !== 'string') return null;

      const trimmed = urlStr.trim();
      if (trimmed === '' || trimmed.toLowerCase().includes('blank')) return null;

      const baseUrl = 'https://sky.devicebee.com/Shiftly/public/uploads/';
      if (trimmed.includes(baseUrl + baseUrl)) {
        return trimmed.replace(baseUrl + baseUrl, baseUrl);
      }
      return trimmed;
    };

    if (images && Array.isArray(images) && images.length > 0) {
      const validImages = images
        .map(img => getCleanUrl(img))
        .filter((url): url is string => !!url);

      if (validImages.length > 0) {
        return validImages.map(url => ({ uri: url }));
      }
    }

    // Return empty array if no cover images - don't fallback to logo
    return [];
  }, [displayProfile, companyId, userInfo]);

  const shouldShowCoverLoader = useMemo(() => {
    return companyId ? isCompanyLoading : (isLoading || isFetching);
  }, [companyId, isCompanyLoading, isLoading, isFetching]);

  const displayPosts = companyId ? (viewedCompanyPosts || []) : (allPosts || []);
  const displayJobs = companyId ? (viewedCompanyJobs || []) : (jobsList || []);

  const navigation = useNavigation();
  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      resetNavigation(SCREENS.CoTabNavigator);
    }
  }, [navigation]);

  const handleTabPress = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

  const renderJobs = useMemo(() => {
    if (selectedTabIndex !== 2) return null;

    if (!displayJobs || displayJobs.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              commonFontStyle(500, 16, colors._0B3970),
              { textAlign: 'center', marginTop: hp(20) },
            ]}>
            No Jobs Found
          </Text>
        </View>
      );
    }

    return displayJobs.map((item: any, index: number) => (
      <View style={{ marginBottom: hp(15) }} key={`job-${item.id || index}`}>
        <MyJobCard
          item={item}
          onPressShare={() => { }}
        />
      </View>
    ));
  }, [selectedTabIndex, displayJobs]);

  const hasValidLogo = useMemo(() => {
    const logo = displayProfile?.logo;
    if (logo) {
      if (typeof logo === 'string' && logo.trim() !== '') return true;
      if (typeof logo === 'object' && logo?.uri) return true;
    }
    return false;
  }, [displayProfile?.logo]);

  const logoUri = useMemo(() => {
    const logo = displayProfile?.logo;
    if (logo) {
      if (typeof logo === 'object' && logo?.uri) return logo.uri;
      if (typeof logo === 'string' && logo.trim() !== '') return logo;
    }
    return null;
  }, [displayProfile?.logo]);

  useEffect(() => {
    if (logoLoadTimeoutRef.current) {
      clearTimeout(logoLoadTimeoutRef.current);
      logoLoadTimeoutRef.current = null;
    }

    if (hasValidLogo && logoUri) {
      setIsLogoLoading(true);
      setLogoLoadError(false);

      logoLoadTimeoutRef.current = setTimeout(() => {
        setIsLogoLoading(false);
        logoLoadTimeoutRef.current = null;
      }, 500);
    } else {
      setIsLogoLoading(false);
      setLogoLoadError(false);
    }

    return () => {
      if (logoLoadTimeoutRef.current) {
        clearTimeout(logoLoadTimeoutRef.current);
      }
    };
  }, [hasValidLogo, logoUri]);

  if (companyId && isCompanyLoading && viewedCompanyPosts.length === 0) {
    return (
      <SafeAreaView
        edges={['bottom']}
        style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color={colors._0B3970} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: colors.white }}
    >
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Image source={IMAGES.backArrow} style={styles.backArrow} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{ paddingBottom: hp(40), backgroundColor: colors.white }}
        showsVerticalScrollIndicator={false}>
        <ParallaxContainer
          imagePath={coverImages}
          ContainerStyle={styles.container}
          showLoader={shouldShowCoverLoader}
          loaderColor={colors._0B3970}>
          <LinearContainer
            SafeAreaProps={{ edges: ['bottom'] }}
            containerStyle={styles.linearContainer}
            colors={[colors.white, colors.white]}>
            <View style={styles.profileHeader}>
              <View style={styles.logoContainer}>
                {hasValidLogo && logoUri && !logoLoadError ? (
                  <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <CustomImage
                      uri={logoUri}
                      containerStyle={{ height: '100%', width: '100%' }}
                      imageStyle={{ height: '100%', width: '100%' }}
                      resizeMode="cover"
                      props={{
                        onLoad: () => {
                          setIsLogoLoading(false);
                          setLogoLoadError(false);
                        },
                        onError: () => {
                          setIsLogoLoading(false);
                          setLogoLoadError(true);
                        },
                      }}
                    />
                    {isLogoLoading && (
                      <View style={styles.logoLoaderContainer} pointerEvents="none">
                        <ActivityIndicator size="small" color={colors._0B3970} />
                      </View>
                    )}
                  </View>
                ) : (
                  <Image
                    source={IMAGES.logoText}
                    style={styles.logoPlaceholderImage}
                    resizeMode="contain"
                  />
                )}
              </View>

              <View style={styles.titleTextContainer}>
                <Text style={styles.companyName}>
                  {displayProfile?.company_name
                    ? String(displayProfile.company_name)
                      .split(' ')
                      .filter(Boolean)
                      .map((word: string) =>
                        /[A-Z]/.test(word.slice(1))
                          ? word
                          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      )
                      .join(' ')
                    : (companyId && isCompanyLoading ? 'Loading...' : 'N/A')}
                </Text>

                {displayProfile?.mission && (
                  <Text style={styles.tagline}>
                    {displayProfile?.mission}
                  </Text>
                )}
              </View>
            </View>

            {displayProfile?.about && (
              <ExpandableText
                maxLines={3}
                showStyle={{ paddingHorizontal: 0 }}
                descriptionStyle={styles.description}
                description={displayProfile?.about}
              />
            )}

            {displayProfile?.values && (
              <Text style={styles.description}>
                {displayProfile?.values}
              </Text>
            )}

            <View style={styles.tabRow}>
              {ProfileTabs.map((item, index) => (
                <Pressable
                  key={item}
                  onPress={() => handleTabPress(index)}
                  style={styles.tabItem}>
                  <Text style={styles.tabText}>{item}</Text>
                  {selectedTabIndex === index && (
                    <View style={styles.tabIndicator} />
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.divider} />

            {selectedTabIndex === 0 && displayProfile && (
              <CoAboutTab
                companyProfileData={displayProfile}
                companyProfileAllData={displayProfile}
              />
            )}

            {selectedTabIndex === 1 && (
              <View style={{ marginTop: hp(10) }}>
                {displayPosts && displayPosts.length > 0 ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {displayPosts.map((item: any, index: number) => (
                      <View key={`post-${item.id || index}`} style={{ width: '48%', marginBottom: hp(10) }}>
                        <CustomPostCard title={item?.title} image={item?.images} />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={[commonFontStyle(500, 16, colors._0B3970), { textAlign: 'center' }]}>
                      No Posts Found
                    </Text>
                  </View>
                )}
              </View>
            )}

            {renderJobs}

            {fromOnboarding && (
              <View style={styles.ctaContainer}>
                <GradientButton
                  type="Company"
                  title="Get Started"
                  onPress={() => resetNavigation(SCREENS.CoTabNavigator)}
                  style={styles.ctaButton}
                />
              </View>
            )}
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
    backgroundColor: colors.white,
  },
  linearContainer: {
    paddingHorizontal: wp(21),
    backgroundColor: colors.white,
    paddingTop: 0,
    marginTop: hp(10),
    flex: 1,
    padding: 0
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
    tintColor: colors.empPrimary,
  },
  profileHeader: {
    gap: 12,
    marginTop: hp(-30),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    width: wp(90),
    height: wp(90),
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLoaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 100,
    zIndex: 1,
  },
  logoPlaceholderImage: {
    width: '80%',
    height: '80%',
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
    backgroundColor: colors.coPrimary,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: hp(20),
  },
  ctaContainer: {
    marginTop: hp(40),
    marginBottom: hp(20),
    paddingHorizontal: wp(13),
  },
  ctaButton: {
    marginHorizontal: 0,
  },
});