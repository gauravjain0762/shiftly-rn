import {
  ActivityIndicator,
  FlatList,
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
  ShareModal,
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
  const jobsList = JobData?.data?.jobs;

  const { companyProfileData, companyProfileAllData, userInfo } = useSelector(
    (state: RootState) => state.auth,
  );

  const { data: getPost } = useGetCompanyPostsQuery({}, { skip: !!companyId });
  const allPosts = getPost?.data?.posts;

  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching, isSuccess } = useGetProfileQuery(undefined, { skip: !!companyId });

  // Fetch company profile by ID when viewing another company
  const [getCompanyProfileById, { data: companyData, isLoading: isCompanyLoading }] =
    useLazyGetCompanyProfileByIdQuery();

  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedTanIndex, setSelectedTabIndex] = useState<number>(0);
  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const logoLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [viewedCompanyPosts, setViewedCompanyPosts] = useState<any[]>([]);
  const [viewedCompanyJobs, setViewedCompanyJobs] = useState<any[]>([]);

  // Fetch company profile by ID if viewing another company
  useEffect(() => {
    if (companyId) {
      getCompanyProfileById({ company_id: companyId, tab: 'posts', page: 1 });
    }
  }, [companyId]);

  useEffect(() => {
    if (data?.status && data.data?.company && !companyId) {
      dispatch(setCompanyProfileAllData(data.data.company));
      dispatch(setCompanyProfileData(data.data.company));
    }
  }, [data, companyId]);

  useEffect(() => {
    if (companyData?.status && companyId) {
      setViewedCompanyPosts(companyData?.data?.posts || []);
      setViewedCompanyJobs(companyData?.data?.jobs || []);
    }
  }, [companyData, companyId]);

  const coverImages = useMemo(() => {
    // Determine the source of profile data (own or external company)
    const profile = companyId ? companyData?.data?.company : (companyProfileData || data?.data?.company || userInfo);
    const images = profile?.cover_images;
    const logo = profile?.logo;

    // Helper to validate and clean URLs
    const getCleanUrl = (url: any): string | null => {
      if (!url) return null;
      let urlStr = typeof url === 'string' ? url : (typeof url === 'object' && url.uri ? url.uri : null);
      if (!urlStr || typeof urlStr !== 'string') return null;

      const trimmed = urlStr.trim();
      if (trimmed === '' || trimmed.toLowerCase().includes('blank')) return null;

      // Fix malformed URLs with repeated base path
      const baseUrl = 'https://sky.devicebee.com/Shiftly/public/uploads/';
      if (trimmed.includes(baseUrl + baseUrl)) {
        return trimmed.replace(baseUrl + baseUrl, baseUrl);
      }
      return trimmed;
    };

    // 1. Process cover images if available
    if (images && Array.isArray(images) && images.length > 0) {
      const validImages = images
        .map(img => getCleanUrl(img))
        .filter((url): url is string => !!url);

      if (validImages.length > 0) {
        return validImages.map(url => ({ uri: url }));
      }
    }

    // 2. Fallback to logo if cover images are missing
    const cleanLogo = getCleanUrl(logo);
    if (cleanLogo) {
      return [{ uri: cleanLogo }];
    }

    // 3. Last fallback to generic logo/banner
    // Only return fallback if loading is finished or we're viewing an external company
    if (!isLoading && !isFetching) {
      return [IMAGES.logoText];
    }

    return [];
  }, [companyId, companyData, companyProfileData, userInfo, data, isLoading, isFetching]);

  const shouldShowCoverLoader = useMemo(() => {
    return coverImages.length > 0;
  }, [coverImages]);

  // Determine which profile data to use (own or viewed company)
  const displayProfile = useMemo(() => {
    if (companyId && companyData?.data?.company) {
      return companyData.data.company;
    }
    return companyProfileAllData || companyProfileData || data?.data?.company;
  }, [companyId, companyData, companyProfileAllData, companyProfileData, data]);

  // Determine which posts and jobs to show
  const displayPosts = companyId ? viewedCompanyPosts : allPosts;
  const displayJobs = companyId ? viewedCompanyJobs : jobsList;

  const navigation = useNavigation();
  const handleBackPress = useCallback(() => {
    // If viewing another company, just go back
    if (companyId) {
      navigation.goBack();
      return;
    }

    const state = navigation.getState() as any;

    if (!state?.routes || state.routes.length < 2) {
      navigation.reset({
        index: 0,
        routes: [{ name: SCREENS.CoTabNavigator as never }],
      });
      return;
    }

    const routes = state.routes;
    const previousRoute = routes[routes.length - 2];

    if (previousRoute?.name === 'CoTabNavigator') {
      console.log('go back>>>>>>>>');
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: SCREENS.CoTabNavigator as never }],
      });
    }
  }, [navigation, companyId]);

  const handleTabPress = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

  const renderPostItem = useCallback(
    ({ item }: { item: any }) => (
      <CustomPostCard title={item?.title} image={item?.images} />
    ),
    [],
  );

  const renderJobs = useMemo(() => {
    if (selectedTanIndex !== 2) return null;

    if (displayJobs?.length === 0) {
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

    return displayJobs?.map((item: any, index: number) => (
      <ScrollView
        style={{ marginBottom: hp(15) }}
        key={`job-${item.id || index}`}>
        <MyJobCard
          item={item}
          onPressShare={() => setIsShareModalVisible(true)}
        />
      </ScrollView>
    ));
  }, [selectedTanIndex, displayJobs]);

  const hasValidLogo = useMemo(() => {
    // Check multiple sources for logo
    const logo = displayProfile?.logo;

    // Handle both string (URL) and object (local URI) formats
    if (logo) {
      if (typeof logo === 'string' && logo.trim() !== '') {
        return true;
      }
      if (typeof logo === 'object' && logo?.uri) {
        return true;
      }
    }

    return false;
  }, [displayProfile?.logo]);

  // Get logo URI from multiple sources, prioritizing local URI over server URL
  const logoUri = useMemo(() => {
    const logo = displayProfile?.logo;

    // Prioritize local URI (object format) over server URL (string format)
    if (logo) {
      if (typeof logo === 'object' && logo?.uri) {
        return logo.uri;
      }
      if (typeof logo === 'string' && logo.trim() !== '') {
        return logo;
      }
    }

    return null;
  }, [displayProfile?.logo]);

  // Reset loading state when logo changes
  useEffect(() => {
    // Clear any existing timeout
    if (logoLoadTimeoutRef.current) {
      clearTimeout(logoLoadTimeoutRef.current);
      logoLoadTimeoutRef.current = null;
    }

    if (hasValidLogo && logoUri) {
      // Show loader briefly, then hide it after 200ms
      // FastImage loads very fast from cache, so we use a very short timeout
      setIsLogoLoading(true);
      setLogoLoadError(false);

      logoLoadTimeoutRef.current = setTimeout(() => {
        setIsLogoLoading(prev => {
          // Only update if still loading to avoid race conditions
          if (prev) {
            return false;
          }
          return prev;
        });
        logoLoadTimeoutRef.current = null;
      }, 200);
    } else {
      setIsLogoLoading(false);
      setLogoLoadError(false);
    }

    return () => {
      if (logoLoadTimeoutRef.current) {
        clearTimeout(logoLoadTimeoutRef.current);
        logoLoadTimeoutRef.current = null;
      }
    };
  }, [hasValidLogo, logoUri]);

  // Show loading when fetching external company profile
  if (companyId && isCompanyLoading) {
    return (
      <SafeAreaView
        edges={['bottom']}
        style={{ flex: 1, backgroundColor: colors.coPrimary, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color={colors._0B3970} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: colors.coPrimary }}
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
            containerStyle={[styles.linearContainer, { flex: 1, padding: 0, backgroundColor: colors.white, marginTop: hp(10) }]}
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
                          if (logoLoadTimeoutRef.current) {
                            clearTimeout(logoLoadTimeoutRef.current);
                            logoLoadTimeoutRef.current = null;
                          }
                          setIsLogoLoading(false);
                          setLogoLoadError(false);
                        },
                        onError: (error: any) => {
                          if (logoLoadTimeoutRef.current) {
                            clearTimeout(logoLoadTimeoutRef.current);
                            logoLoadTimeoutRef.current = null;
                          }
                          setIsLogoLoading(false);
                          setLogoLoadError(true);
                        },
                      }}
                    />
                    {isLogoLoading && (
                      <View style={styles.logoLoaderContainer} pointerEvents="none">
                        <ActivityIndicator
                          size="large"
                          color={colors._0B3970}
                        />
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
                    ? displayProfile.company_name
                      .split(' ')
                      .map(word =>
                        /[A-Z]/.test(word.slice(1))
                          ? word
                          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      )
                      .join(' ')
                    : 'N/A'}
                </Text>

                {displayProfile?.mission && (
                  <Text style={styles.tagline}>
                    {displayProfile?.mission || 'N/A'}
                  </Text>
                )}
              </View>
            </View>

            {companyProfileData?.about && (
              <ExpandableText
                maxLines={3}
                showStyle={{ paddingHorizontal: 0 }}
                descriptionStyle={styles.description}
                description={companyProfileData?.about || 'N/A'}
              />
            )}

            {companyProfileData?.values && (
              <Text style={styles.description}>
                {companyProfileData?.values || 'N/A'}
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
                companyProfileData={displayProfile}
                companyProfileAllData={displayProfile}
              />
            )}

            {selectedTanIndex === 1 && (
              <FlatList
                numColumns={2}
                data={displayPosts}
                style={{ marginTop: hp(10), backgroundColor: colors.coPrimary }}
                contentContainerStyle={{ backgroundColor: colors.coPrimary }}
                renderItem={renderPostItem}
                keyExtractor={item => `post-${item.id}`}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text
                      style={[
                        commonFontStyle(500, 16, colors._0B3970),
                        { textAlign: 'center', marginTop: hp(20) },
                      ]}>
                      No Posts Found
                    </Text>
                  </View>
                )}
              />
            )}

            {renderJobs}

            {fromOnboarding && (
              <View style={styles.ctaContainer}>
                <GradientButton
                  type="Company"
                  title="Get Started"
                  onPress={() => {
                    resetNavigation(SCREENS.CoTabNavigator);
                  }}
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
    backgroundColor: colors.coPrimary,
  },
  linearContainer: {
    paddingHorizontal: wp(21),
    backgroundColor: colors.white,
    paddingTop: 0,
    marginTop: 0,
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
    backgroundColor: colors.coPrimary,
  },
  button: {
    marginVertical: hp(26),
    marginTop: hp(40)
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
