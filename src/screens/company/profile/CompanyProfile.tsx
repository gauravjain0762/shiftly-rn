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
  setSelectedTabIndex,
} from '../../../features/authSlice';
import CustomPostCard from '../../../component/common/CustomPostCard';
import MyJobCard from '../../../component/common/MyJobCard';
import {
  useGetProfileQuery,
  useGetCompanyProfileByIdQuery,
  useLazyGetCompanyProfileByIdQuery,
  useLazyGetCompanyJobsQuery,
  useLazyGetCompanyPostsQuery,
} from '../../../api/dashboardApi';
import CoAboutTab from '../../../component/common/CoAboutTab';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomImage from '../../../component/common/CustomImage';
import { resetNavigation } from '../../../utils/commonFunction';
import CompanyProfileSkeleton from '../../../component/skeletons/CompanyProfileSkeleton';

const ProfileTabs = ['About', 'Posts', 'Jobs'];

const CompanyProfile = () => {
  const { params } = useRoute<any>();
  const fromOnboarding = params?.fromOnboarding || false;
  const companyId = params?.companyId;
  console.log("🔥 ~ CompanyProfile ~ companyId:", companyId)

  const { companyProfileData, companyProfileAllData, userInfo, selectedTabIndex } = useSelector(
    (state: RootState) => state.auth,
  );

  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching } = useGetProfileQuery(undefined, { skip: !!companyId });

  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const logoLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── Own-company (no companyId) ──────────────────────────────────────────
  const [ownPosts, setOwnPosts] = useState<any[]>([]);
  const [ownJobs, setOwnJobs] = useState<any[]>([]);
  const [ownExtraPosts, setOwnExtraPosts] = useState<any[]>([]);
  const [ownExtraJobs, setOwnExtraJobs] = useState<any[]>([]);
  const [ownPostsPage, setOwnPostsPage] = useState(1);
  const [ownJobsPage, setOwnJobsPage] = useState(1);
  const [ownPostsHasMore, setOwnPostsHasMore] = useState(false);
  const [ownJobsHasMore, setOwnJobsHasMore] = useState(false);

  const [fetchOwnPosts, { data: ownPostsData, isFetching: isFetchingOwnPosts }] =
    useLazyGetCompanyPostsQuery();
  const [fetchOwnJobs, { data: ownJobsData, isFetching: isFetchingOwnJobs }] =
    useLazyGetCompanyJobsQuery();

  // ── Viewed company (with companyId) ────────────────────────────────────
  const [viewedCompanyPosts, setViewedCompanyPosts] = useState<any[]>([]);
  const [viewedCompanyJobs, setViewedCompanyJobs] = useState<any[]>([]);
  const [viewedExtraPosts, setViewedExtraPosts] = useState<any[]>([]);
  const [viewedExtraJobs, setViewedExtraJobs] = useState<any[]>([]);
  const [viewedPostsPage, setViewedPostsPage] = useState(1);
  const [viewedJobsPage, setViewedJobsPage] = useState(1);
  const [viewedPostsHasMore, setViewedPostsHasMore] = useState(false);
  const [viewedJobsHasMore, setViewedJobsHasMore] = useState(false);

  const [postsFetched, setPostsFetched] = useState(false);
  const [jobsFetched, setJobsFetched] = useState(false);

  const { data: companyData, isLoading: isCompanyLoading } =
    useGetCompanyProfileByIdQuery(
      { company_id: companyId, tab: 'info', page: 1 },
      { skip: !companyId }
    );

  const [fetchMoreViewedPages, { isFetching: isFetchingViewedMore }] =
    useLazyGetCompanyProfileByIdQuery();

  const [companyInfo, setCompanyInfo] = useState<any>(null);

  // ── Own company: fetch posts / jobs when the relevant tab becomes active ──
  useEffect(() => {
    if (companyId) return;
    if (selectedTabIndex === 1) {
      setOwnPosts([]);
      setOwnExtraPosts([]);
      setOwnPostsPage(1);
      fetchOwnPosts({ page: 1 });
    } else if (selectedTabIndex === 2) {
      setOwnJobs([]);
      setOwnExtraJobs([]);
      setOwnJobsPage(1);
      fetchOwnJobs({ page: 1 });
    }
  }, [selectedTabIndex, companyId]);

  // Own company: handle posts response
  useEffect(() => {
    if (!ownPostsData) return;
    const posts = ownPostsData?.data?.posts ?? [];
    const pagination = ownPostsData?.data?.pagination;
    setOwnPosts(posts);
    setOwnExtraPosts([]);
    setOwnPostsHasMore(
      pagination ? pagination.current_page < pagination.total_pages : posts.length >= 10,
    );
  }, [ownPostsData]);

  // Own company: handle jobs response
  useEffect(() => {
    if (!ownJobsData) return;
    const jobs = ownJobsData?.data?.jobs ?? [];
    const pagination = ownJobsData?.data?.pagination;
    setOwnJobs(jobs);
    setOwnExtraJobs([]);
    setOwnJobsHasMore(
      pagination ? pagination.current_page < pagination.total_pages : jobs.length >= 10,
    );
  }, [ownJobsData]);

  // Own company: load more posts
  const handleLoadMoreOwnPosts = useCallback(async () => {
    if (!ownPostsHasMore || isFetchingOwnPosts) return;
    const nextPage = ownPostsPage + 1;
    try {
      const result = await fetchOwnPosts({ page: nextPage }).unwrap();
      const newPosts = result?.data?.posts ?? [];
      setOwnExtraPosts(prev => [...prev, ...newPosts]);
      const pagination = result?.data?.pagination;
      setOwnPostsHasMore(
        pagination ? pagination.current_page < pagination.total_pages : newPosts.length >= 10,
      );
      setOwnPostsPage(nextPage);
    } catch (_) {}
  }, [ownPostsHasMore, isFetchingOwnPosts, ownPostsPage, fetchOwnPosts]);

  // Own company: load more jobs
  const handleLoadMoreOwnJobs = useCallback(async () => {
    if (!ownJobsHasMore || isFetchingOwnJobs) return;
    const nextPage = ownJobsPage + 1;
    try {
      const result = await fetchOwnJobs({ page: nextPage }).unwrap();
      const newJobs = result?.data?.jobs ?? [];
      setOwnExtraJobs(prev => [...prev, ...newJobs]);
      const pagination = result?.data?.pagination;
      setOwnJobsHasMore(
        pagination ? pagination.current_page < pagination.total_pages : newJobs.length >= 10,
      );
      setOwnJobsPage(nextPage);
    } catch (_) {}
  }, [ownJobsHasMore, isFetchingOwnJobs, ownJobsPage, fetchOwnJobs]);

  // ── Viewed company: reset when tab switches ─────────────────────────────
  useEffect(() => {
    if (!companyId) return;
    setViewedExtraPosts([]);
    setViewedExtraJobs([]);
    setViewedPostsPage(1);
    setViewedJobsPage(1);
  }, [selectedTabIndex, companyId]);

  useEffect(() => {
    if (data?.status && data.data?.company && !companyId) {
      dispatch(setCompanyProfileAllData(data.data.company));
      dispatch(setCompanyProfileData(data.data.company));
    }
  }, [data, companyId, dispatch]);

  useEffect(() => {
    if (companyData?.status && companyId) {
      const tabData = companyData?.data?.tab_data;
      const pagination = companyData?.data?.pagination;
      // Legacy: info-tab response may include posts/jobs arrays directly
      const postsArr = Array.isArray(tabData) && selectedTabIndex === 1
        ? tabData
        : (companyData?.data?.posts ?? []);
      const jobsArr = Array.isArray(tabData) && selectedTabIndex === 2
        ? tabData
        : (companyData?.data?.jobs ?? []);

      if (postsArr.length > 0 || selectedTabIndex === 1) {
        setViewedCompanyPosts(postsArr);
        setViewedExtraPosts([]);
        setViewedPostsHasMore(
          pagination ? pagination.current_page < pagination.total_pages : postsArr.length >= 10,
        );
        setPostsFetched(true);
      }
      if (jobsArr.length > 0 || selectedTabIndex === 2) {
        setViewedCompanyJobs(jobsArr);
        setViewedExtraJobs([]);
        setViewedJobsHasMore(
          pagination ? pagination.current_page < pagination.total_pages : jobsArr.length >= 10,
        );
        setJobsFetched(true);
      }
    }
  }, [companyData, companyId, selectedTabIndex]);

  useEffect(() => {
    if (companyData?.data?.company && !companyInfo) {
      setCompanyInfo(companyData.data.company);
    }
  }, [companyData, companyInfo]);

  // Viewed company: load more posts
  const handleLoadMoreViewedPosts = useCallback(async () => {
    if (!viewedPostsHasMore || isFetchingViewedMore) return;
    const nextPage = viewedPostsPage + 1;
    try {
      const result = await fetchMoreViewedPages({
        company_id: companyId,
        tab: 'posts',
        page: nextPage,
      }).unwrap();
      if (result?.status && Array.isArray(result?.data?.tab_data)) {
        setViewedExtraPosts(prev => [...prev, ...result.data.tab_data]);
        const pagination = result?.data?.pagination;
        setViewedPostsHasMore(
          pagination
            ? pagination.current_page < pagination.total_pages
            : result.data.tab_data.length >= 10,
        );
        setViewedPostsPage(nextPage);
      }
    } catch (_) {}
  }, [viewedPostsHasMore, isFetchingViewedMore, viewedPostsPage, companyId, fetchMoreViewedPages]);

  // Viewed company: load more jobs
  const handleLoadMoreViewedJobs = useCallback(async () => {
    if (!viewedJobsHasMore || isFetchingViewedMore) return;
    const nextPage = viewedJobsPage + 1;
    try {
      const result = await fetchMoreViewedPages({
        company_id: companyId,
        tab: 'jobs',
        page: nextPage,
      }).unwrap();
      if (result?.status && Array.isArray(result?.data?.tab_data)) {
        setViewedExtraJobs(prev => [...prev, ...result.data.tab_data]);
        const pagination = result?.data?.pagination;
        setViewedJobsHasMore(
          pagination
            ? pagination.current_page < pagination.total_pages
            : result.data.tab_data.length >= 10,
        );
        setViewedJobsPage(nextPage);
      }
    } catch (_) {}
  }, [viewedJobsHasMore, isFetchingViewedMore, viewedJobsPage, companyId, fetchMoreViewedPages]);

  const displayProfile = useMemo(() => {
    if (companyInfo) return companyInfo;
    if (companyId && companyData?.data?.company) {
      return companyData.data.company;
    }
    return companyId ? null : (companyProfileAllData || companyProfileData || data?.data?.company);
  }, [companyId, companyData, companyProfileAllData, companyProfileData, data, companyInfo]);

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
    return [];
  }, [displayProfile, companyId, userInfo]);

  const shouldShowCoverLoader = useMemo(() => {
    if (companyId) {
      return isCompanyLoading && !companyInfo;
    }
    return isLoading || isFetching;
  }, [companyId, isCompanyLoading, isLoading, isFetching, companyInfo]);

  const displayPosts = companyId
    ? [...(Array.isArray(viewedCompanyPosts) ? viewedCompanyPosts : []), ...viewedExtraPosts]
    : [...(Array.isArray(ownPosts) ? ownPosts : []), ...ownExtraPosts];
  const displayJobs = companyId
    ? [...(Array.isArray(viewedCompanyJobs) ? viewedCompanyJobs : []), ...viewedExtraJobs]
    : [...(Array.isArray(ownJobs) ? ownJobs : []), ...ownExtraJobs];

  const postsHasMore = companyId ? viewedPostsHasMore : ownPostsHasMore;
  const jobsHasMore = companyId ? viewedJobsHasMore : ownJobsHasMore;
  const isFetchingPosts = companyId ? isFetchingViewedMore : isFetchingOwnPosts;
  const isFetchingJobs = companyId ? isFetchingViewedMore : isFetchingOwnJobs;
  const handleLoadMorePosts = companyId ? handleLoadMoreViewedPosts : handleLoadMoreOwnPosts;
  const handleLoadMoreJobs = companyId ? handleLoadMoreViewedJobs : handleLoadMoreOwnJobs;

  const navigation = useNavigation();
  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      resetNavigation(SCREENS.CoTabNavigator);
    }
  }, [navigation]);

  const handleTabPress = useCallback((index: number) => {
    dispatch(setSelectedTabIndex(index));
  }, [dispatch]);

  const renderJobs = useMemo(() => {
    if (selectedTabIndex !== 2) return null;

    if ((isCompanyLoading || isFetchingOwnJobs) && !jobsFetched && displayJobs.length === 0) {
      return <ActivityIndicator size="small" color={colors._0B3970} style={{ marginTop: hp(20) }} />;
    }

    if (!Array.isArray(displayJobs) || displayJobs.length === 0) {
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

    return (
      <>
        {displayJobs.map((item: any, index: number) => {
          if (!item) return null;
          return (
            <View style={{ marginBottom: hp(15) }} key={`job-${item._id || item.id || index}`}>
              <MyJobCard item={item} onPressShare={() => { }} />
            </View>
          );
        })}
        {isFetchingJobs && (
          <ActivityIndicator
            size="large"
            color={colors._0B3970}
            style={{marginVertical: hp(20)}}
          />
        )}
      </>
    );
  }, [selectedTabIndex, displayJobs, isCompanyLoading, isFetchingOwnJobs, jobsFetched,
    jobsHasMore, isFetchingJobs, handleLoadMoreJobs]);

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

  const CoverImage = useMemo(() => (
    <>
      {coverImages.length > 0 && coverImages[0]?.uri ? (
        <Image
          source={{ uri: coverImages[0].uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        !shouldShowCoverLoader && (
          <Image
            source={IMAGES.logoText}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        )
      )}
    </>
  ), [coverImages, shouldShowCoverLoader]);

  const LogoImage = useMemo(() => (
    hasValidLogo && logoUri && !logoLoadError ? (
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
      !isLogoLoading && !shouldShowCoverLoader && (
        <Image
          source={IMAGES.logoText}
          style={styles.logoPlaceholderImage}
          resizeMode="contain"
        />
      )
    )
  ), [hasValidLogo, logoUri, logoLoadError, isLogoLoading, shouldShowCoverLoader]);



  if (isLoading || isCompanyLoading) {
    return <CompanyProfileSkeleton />;
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
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
          if (isCloseToBottom) {
            if (selectedTabIndex === 0 && postsHasMore && !isFetchingPosts) {
              handleLoadMorePosts();
            } else if (selectedTabIndex === 1 && jobsHasMore && !isFetchingJobs) {
              handleLoadMoreJobs();
            }
          }
        }}
        scrollEventThrottle={400}>
        <View style={styles.container}>
          <View style={{ width: '100%', height: 250 }}>
            {CoverImage}
            {shouldShowCoverLoader && (
              <View style={[styles.logoLoaderContainer, { backgroundColor: 'rgba(255,255,255,0.5)' }]}>
                <ActivityIndicator size="small" color={colors._0B3970} />
              </View>
            )}
          </View>
          <LinearContainer
            SafeAreaProps={{ edges: ['bottom'] }}
            containerStyle={styles.linearContainer}
            colors={[colors.white, colors.white]}>
            <View style={styles.profileHeader}>
              <View style={styles.logoContainer}>
                {LogoImage}
              </View>

              <View style={styles.titleTextContainer}>
                <Text style={styles.companyName}>
                  {typeof displayProfile?.company_name === 'string'
                    ? displayProfile.company_name
                      .split(' ')
                      .filter(Boolean)
                      .map((word: string) =>
                        /[A-Z]/.test(word.slice(1))
                          ? word
                          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      )
                      .join(' ')
                    : displayProfile?.company_name
                      ? String(displayProfile.company_name)
                      : (companyId && isCompanyLoading ? 'Loading...' : 'N/A')}
                </Text>

                {displayProfile?.mission && (
                  <Text style={styles.tagline}>
                    {displayProfile?.mission}
                  </Text>
                )}
              </View>
            </View>

            {/* {displayProfile?.about && (
              <ExpandableText
                maxLines={3}
                showStyle={{ paddingHorizontal: 0 }}
                descriptionStyle={styles.description}
                description={String(displayProfile?.about)}
              />
            )} */}

            {displayProfile?.values && (
              <Text style={styles.description}>{displayProfile?.values}</Text>
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
                {(isCompanyLoading || isFetchingOwnPosts) && !postsFetched && displayPosts.length === 0 ? (
                  <ActivityIndicator size="small" color={colors._0B3970} style={{ marginTop: hp(20) }} />
                ) : displayPosts && displayPosts.length > 0 ? (
                  <>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                      {displayPosts.map((item: any, index: number) => (
                        <View key={`post-${item._id || item.id || index}`} style={{ width: '48%', marginBottom: hp(10) }}>
                          <CustomPostCard title={item?.title} image={item?.images} />
                        </View>
                      ))}
                    </View>
                    {isFetchingPosts && (
                      <ActivityIndicator
                        size="large"
                        color={colors._0B3970}
                        style={{marginVertical: hp(20)}}
                      />
                    )}
                  </>
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
        </View>
      </ScrollView >
    </SafeAreaView >
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
  logoContainerWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  loadMoreButton: {
    alignSelf: 'center',
    marginVertical: hp(16),
    paddingVertical: hp(10),
    paddingHorizontal: wp(32),
    borderRadius: hp(50),
    borderWidth: 1.5,
    borderColor: colors._0B3970,
    minWidth: wp(120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    ...commonFontStyle(600, 15, colors._0B3970),
  },
});