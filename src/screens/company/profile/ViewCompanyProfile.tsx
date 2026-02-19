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
import CustomPostCard from '../../../component/common/CustomPostCard';
import MyJobCard from '../../../component/common/MyJobCard';
import { useGetCompanyProfileByIdQuery } from '../../../api/dashboardApi';
import CoAboutTab from '../../../component/common/CoAboutTab';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectEmployeeState, setViewCompanyProfileInfo, setViewCompanyProfileTabIndex } from '../../../features/employeeSlice';
import ExpandableText from '../../../component/common/ExpandableText';

import CompanyProfileSkeleton from '../../../component/skeletons/CompanyProfileSkeleton';
import PostGridSkeleton from '../../../component/skeletons/PostGridSkeleton';

const ProfileTabs = ['About', 'Posts', 'Jobs'];

const ViewCompanyProfile = () => {
    const { params } = useRoute<any>();
    const companyId = params?.companyId;
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const { viewCompanyProfileTabIndex, viewCompanyProfileInfo } = useSelector(selectEmployeeState);
    const selectedTabIndex = viewCompanyProfileTabIndex;
    const companyInfo = viewCompanyProfileInfo;

    // const [companyInfo, setCompanyInfo] = useState<any>(null); // Removed local state
    const [companyPosts, setCompanyPosts] = useState<any[]>([]);
    const [companyJobs, setCompanyJobs] = useState<any[]>([]);

    const [isLogoLoading, setIsLogoLoading] = useState(false);
    const [logoLoadError, setLogoLoadError] = useState(false);
    const logoLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const lastLogoUriRef = useRef<string | null>(null);
    const [postsFetched, setPostsFetched] = useState(false);
    const [jobsFetched, setJobsFetched] = useState(false);

    const queryTab = useMemo(() => {
        if (selectedTabIndex === 0) return 'info';
        if (selectedTabIndex === 1) return 'posts';
        if (selectedTabIndex === 2) return 'jobs';
        return 'info';
    }, [selectedTabIndex]);

    const { data: companyData, isLoading: isCompanyLoading } =
        useGetCompanyProfileByIdQuery(
            { company_id: companyId, tab: queryTab, page: 1 },
            { skip: !companyId }
        );

    const linearColors = useMemo(() => [colors.white, colors.white], []);
    const safeAreaProps = useMemo(() => ({ edges: ['bottom'] as const }), []);

    useEffect(() => {
        if (!companyData?.status) return;

        if (companyData?.data?.company) {
            // Check if company object is effectively different before dispatching
            // JSON stringify is a quick way to check deep equality for simple objects without lodash, 
            // but might be expensive. For now, rely on ID and maybe a key field if ID isn't enough, 
            // OR trust the user's claim that it's reloading, implying state update.
            // Let's Log it.
            if (!companyInfo || companyInfo._id !== companyData.data.company._id) {
                console.log('Dispatching setViewCompanyProfileInfo - ID mismatch or null');
                dispatch(setViewCompanyProfileInfo(companyData.data.company));
            } else {
                console.log('Skipping setViewCompanyProfileInfo - Data matches');
            }
        }

        const tabData = companyData?.data?.tab_data;
        if (Array.isArray(tabData)) {
            if (selectedTabIndex === 1) {
                setCompanyPosts(tabData);
                setPostsFetched(true);
            } else if (selectedTabIndex === 2) {
                setCompanyJobs(tabData);
                setJobsFetched(true);
            }
        }
    }, [companyData, companyInfo, selectedTabIndex, dispatch]);

    const displayProfile = companyInfo || companyData?.data?.company || null;

    const coverImages = useMemo(() => {
        if (!displayProfile) return [];

        const images = displayProfile?.cover_images;

        const getCleanUrl = (url: any): string | null => {
            if (!url) return null;
            let urlStr =
                typeof url === 'string'
                    ? url
                    : typeof url === 'object' && url.uri
                        ? url.uri
                        : null;
            if (!urlStr || typeof urlStr !== 'string') return null;

            const trimmed = urlStr.trim();
            if (trimmed === '' || trimmed.toLowerCase().includes('blank'))
                return null;

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
    }, [displayProfile]);

    // Memoize the source object for Image to prevent unnecessary re-fetches/updates
    const coverImageSource = useMemo(() => {
        if (coverImages.length > 0 && coverImages[0]?.uri) {
            return { uri: coverImages[0].uri };
        }
        return null;
    }, [coverImages]);

    const shouldShowCoverLoader = isCompanyLoading && !companyInfo;

    const displayPosts = Array.isArray(companyPosts) ? companyPosts : [];
    const displayJobs = Array.isArray(companyJobs) ? companyJobs : [];

    // Debug render counts
    const renderCount = useRef(0);
    renderCount.current += 1;
    // console.log(`ViewCompanyProfile Render #${renderCount.current} - Tab: ${selectedTabIndex} IsLoading: ${isCompanyLoading}`);

    // Log important state for debugging (can be removed later)
    useEffect(() => {
        console.log('DEBUG: displayProfile:', displayProfile);
        console.log('DEBUG: shouldShowCoverLoader:', shouldShowCoverLoader);
        // console.log(`Stable Check - Loading: ${isCompanyLoading}, Info: ${!!companyInfo}, ShowLoader: ${shouldShowCoverLoader}`);
    }, [isCompanyLoading, companyInfo, shouldShowCoverLoader, displayProfile]);

    // Clear info when leaving the screen completely (optional, depends on UX preference)
    // For now, let's clear it on unmount to force fresh fetch next time the screen is opened
    /* 
    // REMOVED CLEANUP TO PREVENT FLICKER ON TAB CHANGE / REMOUNT
    useEffect(() => {
        return () => {
            dispatch(setViewCompanyProfileInfo(null));
        };
    }, [dispatch]);
    */

    const handleBackPress = useCallback(() => {
        dispatch(setViewCompanyProfileTabIndex(0));
        dispatch(setViewCompanyProfileInfo(null)); // Clear info on back press explicitly
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [navigation, dispatch]);

    // useFocusEffect(
    //     useCallback(() => {
    //         return () => {
    //             dispatch(setViewCompanyProfileTabIndex(0));
    //         };
    //     }, [dispatch])
    // );

    const handleTabPress = useCallback((index: number) => {
        dispatch(setViewCompanyProfileTabIndex(index));
    }, [dispatch]);

    const renderJobs = useMemo(() => {
        if (selectedTabIndex !== 2) return null;

        if (isCompanyLoading && !jobsFetched) {
            return (
                <ActivityIndicator
                    size="small"
                    color={colors._0B3970}
                    style={{ marginTop: hp(20) }}
                />
            );
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

        return displayJobs?.map((item: any, index: number) => {
            if (!item) return null;
            return (
                <View style={{ marginBottom: hp(15) }} key={`job-${item.id || index}`}>
                    <MyJobCard item={item} onPressShare={() => { }} />
                </View>
            );
        });
    }, [selectedTabIndex, displayJobs, isCompanyLoading, jobsFetched]);

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

    const logoSource = useMemo(() => logoUri ? { uri: logoUri } : null, [logoUri]);

    useEffect(() => {
        if (logoLoadTimeoutRef.current) {
            clearTimeout(logoLoadTimeoutRef.current);
            logoLoadTimeoutRef.current = null;
        }
        return () => {
            if (logoLoadTimeoutRef.current) {
                clearTimeout(logoLoadTimeoutRef.current);
            }
        };
    }, []);

    const coverImageContent = useMemo(() => (
        <>
            {coverImageSource ? (
                <Image
                    source={coverImageSource}
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
    ), [coverImageSource, shouldShowCoverLoader]);

    const logoImageContent = useMemo(() => (
        hasValidLogo && logoSource && !logoLoadError ? (
            <View style={styles.logoContainerWrapper}>
                <Image
                    source={logoSource}
                    style={styles.logoImage}
                    resizeMode="cover"
                    onLoadStart={() => {
                        if (logoUri !== lastLogoUriRef.current) {
                            setIsLogoLoading(true);
                            setLogoLoadError(false);
                        }
                    }}
                    onLoad={() => {
                        setIsLogoLoading(false);
                        setLogoLoadError(false);
                        lastLogoUriRef.current = logoUri;
                    }}
                    onError={() => {
                        setIsLogoLoading(false);
                        setLogoLoadError(true);
                    }}
                />
                {isLogoLoading && (
                    <View style={styles.logoLoaderContainer}>
                        <ActivityIndicator size="small" color={colors._0B3970} />
                    </View>
                )}
            </View>
        ) : (
            !isLogoLoading && !shouldShowCoverLoader && (
                <Image
                    resizeMode="contain"
                    source={IMAGES.logoText}
                    style={styles.logoPlaceholderImage}
                />
            )
        )
    ), [hasValidLogo, logoUri, logoLoadError, isLogoLoading, shouldShowCoverLoader, logoSource]);

    if (isCompanyLoading && !companyInfo) {
        return <CompanyProfileSkeleton />;
    }

    return (
        <SafeAreaView
            edges={['bottom']}
            style={{ flex: 1, backgroundColor: colors.white }}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Image source={IMAGES.backArrow} style={styles.backArrow} />
            </TouchableOpacity>
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: hp(40),
                    backgroundColor: colors.white,
                }}
                showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={{ width: '100%', height: 250 }}>
                        {coverImageContent}
                        {shouldShowCoverLoader && (
                            <View style={[styles.logoLoaderContainer, { backgroundColor: 'rgba(255,255,255,0.5)' }]}>
                                <ActivityIndicator size="small" color={colors._0B3970} />
                            </View>
                        )}
                    </View>

                    <LinearContainer
                        SafeAreaProps={safeAreaProps}
                        containerStyle={styles.linearContainer}
                        colors={linearColors}>
                        <View style={styles.profileHeader}>
                            <View style={styles.logoContainer}>
                                {logoImageContent}
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
                                                    : word.charAt(0).toUpperCase() +
                                                    word.slice(1).toLowerCase(),
                                            )
                                            .join(' ')
                                        : displayProfile?.company_name
                                            ? String(displayProfile.company_name)
                                            : isCompanyLoading
                                                ? 'Loading...'
                                                : 'N/A'}
                                </Text>

                                {displayProfile?.mission && (
                                    <Text style={styles.tagline}>{displayProfile?.mission}</Text>
                                )}
                            </View>
                        </View>

                        {displayProfile?.about && (
                            <ExpandableText
                                maxLines={3}
                                showStyle={{ paddingHorizontal: 0 }}
                                descriptionStyle={styles.description}
                                description={String(displayProfile?.about)}
                            />
                        )}

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
                                {isCompanyLoading && !postsFetched ? (
                                    <PostGridSkeleton />
                                ) : displayPosts && displayPosts.length > 0 ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between',
                                        }}>
                                        {displayPosts.map((item: any, index: number) => (
                                            <View
                                                key={`post-${item.id || index}`}
                                                style={{ width: '48%', marginBottom: hp(10) }}>
                                                <CustomPostCard
                                                    title={item?.title}
                                                    image={item?.images}
                                                />
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Text
                                            style={[
                                                commonFontStyle(500, 16, colors._0B3970),
                                                { textAlign: 'center' },
                                            ]}>
                                            No Posts Found
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {renderJobs}


                    </LinearContainer>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewCompanyProfile;

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
        padding: 0,
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
        // lineHeight: hp(25), // Potential crash cause with certain fonts/Android versions
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
    logoContainerWrapper: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
});
