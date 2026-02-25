import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

import { useRoute } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { hp, wp, commonFontStyle } from '../../../theme/fonts';
import { BackHeader, LinearContainer } from '../../../component';
import { IMAGES } from '../../../assets/Images';
import { useGetAppliedJobsQuery, useGetEmployeeJobsQuery, useGetInterviewsQuery } from '../../../api/dashboardApi';
import FastImage from 'react-native-fast-image';
import { getTimeAgo, navigateTo } from '../../../utils/commonFunction';
import { getCurrencySymbol } from '../../../utils/currencySymbols';
import Share from 'react-native-share';
import { SCREENS } from '../../../navigation/screenNames';
import { Eye } from 'lucide-react-native';

const MyJobs = () => {
    const route = useRoute<any>();
    const initialTab = route.params?.initialTab || 'Applied';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [refreshing, setRefreshing] = useState(false);

    const tabs = ['Applied', 'Interviews', 'Matched'];
    const [pageApplied, setPageApplied] = useState(1);
    const [pageInterviews, setPageInterviews] = useState(1);
    const [pageMatched, setPageMatched] = useState(1);

    const [listApplied, setListApplied] = useState<any[]>([]);
    const [listInterviews, setListInterviews] = useState<any[]>([]);
    const [listMatched, setListMatched] = useState<any[]>([]);

    const appliedJobsQuery = useGetAppliedJobsQuery({ page: pageApplied }, { skip: activeTab !== 'Applied' });
    const interviewsQuery = useGetInterviewsQuery({ page: pageInterviews }, { skip: activeTab !== 'Interviews' });
    console.log("🔥 ~ MyJobs ~ interviewsQuery:", interviewsQuery)
    const matchedJobsQuery = useGetEmployeeJobsQuery({ type: 'matched', page: pageMatched }, { skip: activeTab !== 'Matched' });

    const getActiveQuery = () => {
        switch (activeTab) {
            case 'Applied': return appliedJobsQuery;
            case 'Interviews': return interviewsQuery;
            case 'Matched': return matchedJobsQuery;
            default: return appliedJobsQuery;
        }
    };

    const { isLoading, isFetching } = getActiveQuery();

    useEffect(() => {
        if (appliedJobsQuery.data?.status) {
            const newList = appliedJobsQuery.data?.data?.applicants || [];
            if (pageApplied === 1) {
                setListApplied(newList);
            } else {
                // Avoid duplicating data if the result is already in the list (e.g. from cache)
                setListApplied(prev => {
                    const existingIds = new Set(prev.map(item => item._id));
                    const uniqueNewItems = newList.filter((item: any) => !existingIds.has(item._id));
                    return [...prev, ...uniqueNewItems];
                });
            }
        }
    }, [appliedJobsQuery.data, pageApplied]);

    useEffect(() => {
        if (interviewsQuery.data?.status) {
            const newList = interviewsQuery.data?.data?.invitations || interviewsQuery.data?.data?.interviews || [];
            if (pageInterviews === 1) {
                setListInterviews(newList);
            } else {
                setListInterviews(prev => {
                    const existingIds = new Set(prev.map(item => item._id));
                    const uniqueNewItems = newList.filter((item: any) => !existingIds.has(item._id));
                    return [...prev, ...uniqueNewItems];
                });
            }
        }
    }, [interviewsQuery.data, pageInterviews]);

    useEffect(() => {
        if (matchedJobsQuery.data?.status) {
            const newList = matchedJobsQuery.data?.data?.jobs || [];
            if (pageMatched === 1) {
                setListMatched(newList);
            } else {
                setListMatched(prev => {
                    const existingIds = new Set(prev.map(item => item._id));
                    const uniqueNewItems = newList.filter((item: any) => !existingIds.has(item._id));
                    return [...prev, ...uniqueNewItems];
                });
            }
        }
    }, [matchedJobsQuery.data, pageMatched]);

    const jobsList = activeTab === 'Applied' ? listApplied :
        activeTab === 'Interviews' ? listInterviews :
            listMatched;

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        if (activeTab === 'Applied') {
            setPageApplied(1);
            await appliedJobsQuery.refetch();
        } else if (activeTab === 'Interviews') {
            setPageInterviews(1);
            await interviewsQuery.refetch();
        } else {
            setPageMatched(1);
            await matchedJobsQuery.refetch();
        }
        setRefreshing(false);
    }, [activeTab, appliedJobsQuery, interviewsQuery, matchedJobsQuery]);

    const handleLoadMore = () => {
        const query = getActiveQuery();
        const totalPages = query.data?.data?.pagination?.total_pages || 1;
        const currentPage = activeTab === 'Applied' ? pageApplied :
            activeTab === 'Interviews' ? pageInterviews :
                pageMatched;

        if (!isFetching && currentPage < totalPages) {
            if (activeTab === 'Applied') setPageApplied(prev => prev + 1);
            else if (activeTab === 'Interviews') setPageInterviews(prev => prev + 1);
            else setPageMatched(prev => prev + 1);
        }
    };

    const handleShare = async (job: any) => {
        try {
            const title = job?.title || 'Job Opportunity';
            const description = job?.description || '';
            const salary =
                job?.monthly_salary_from || job?.monthly_salary_to
                    ? `Salary: ${getCurrencySymbol(job?.currency || 'USD')}${job?.monthly_salary_from?.toLocaleString()} - ${job?.monthly_salary_to?.toLocaleString()}`
                    : '';

            const shareUrl = job?.share_url || '';
            const shareUrlText = shareUrl ? `\n\n${shareUrl}` : '';

            const message = `${title}\n\n${description}\n\n${salary}${shareUrlText}`;

            const shareOptions = {
                title: title,
                message: message,
                url: shareUrl,
            };

            await Share.open(shareOptions);
        } catch (err: any) {
            if (err?.message !== 'User did not share') {
                console.log('❌ Share error:', err);
            }
        }
    };

    const renderTab = (tab: string) => (
        <TouchableOpacity
            key={tab}
            style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton
            ]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
            ]}>
                {tab}
            </Text>
        </TouchableOpacity>
    );

    const renderJobCard = ({ item }: { item: any }) => {
        const job = item?.job_id || item?.job || item;

        const companyName = job?.company_id?.company_name || job?.company?.name || 'N/A';
        const companyLogo = job?.company_id?.logo || job?.company?.logo;
        const location = (job?.city || job?.country) ? `${job?.city}${job?.city && job?.country ? ', ' : ''}${job?.country}` : (job?.location || job?.company?.location || 'N/A');

        return (
            <TouchableOpacity
                activeOpacity={activeTab === 'Interviews' ? 0.7 : 1}
                onPress={() => {
                    if (activeTab === 'Interviews') {
                        navigateTo(SCREENS.JobInvitationScreen, {
                            jobDetail: { job },
                            link: item?.interview_link,
                        });
                    }
                }}
            >
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => {
                            const companyId = (typeof job?.company_id === 'object' ? job?.company_id?._id : job?.company_id) ||
                                (typeof job?.company === 'object' ? job?.company?._id || job?.company?.id : job?.company);

                            if (companyId && typeof companyId === 'string') {
                                navigateTo(SCREENS.CompanyProfile, { companyId });
                            }
                        }}
                    >
                        <View style={styles.logoContainer}>
                            {companyLogo ? (
                                <FastImage
                                    source={{ uri: companyLogo }}
                                    style={{ width: wp(48), height: wp(48), borderRadius: wp(24) }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text style={styles.logoText}>{companyName.charAt(0)}</Text>
                            )}
                        </View>
                        <View style={styles.headerInfo}>
                            <View style={styles.headerTopRow}>
                                <Text style={styles.companyName} numberOfLines={1}>{companyName}</Text>
                                <TouchableOpacity onPress={() => handleShare(job)}>
                                    <Image source={IMAGES.share} style={styles.shareIcon} resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.location} numberOfLines={1}>{location}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.body}>
                        <View style={styles.titleRow}>
                            <Text style={styles.jobTitle} numberOfLines={1}>{job?.title || 'N/A'}</Text>
                            <TouchableOpacity
                                style={styles.viewButton}
                                onPress={() => navigateTo(SCREENS.JobDetail, { jobId: job?._id, is_applied: activeTab === 'Applied', hide_apply: activeTab === 'Interviews' })}
                            >
                                <Eye size={wp(14)} color={colors.white} />
                                <Text style={styles.viewText}>View</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.descriptionRow}>
                            <Text style={styles.description} numberOfLines={2}>
                                {job?.description || 'N/A'}
                            </Text>
                            <Text style={styles.timeAgo}>
                                {getTimeAgo(job?.createdAt) || 'N/A'}
                            </Text>
                        </View>

                        {job?.contract_type && (
                            <View style={[styles.tag, { backgroundColor: '#F0F4F8', alignSelf: 'flex-start' }]}>
                                <Text style={[styles.tagText, { color: '#0B1C39' }]}>{job?.contract_type}</Text>
                            </View>
                        )}

                        <View style={styles.tagsRow}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: wp(8) }}
                            >
                                {(job?.monthly_salary_from || job?.monthly_salary_to) && (
                                    <View style={[styles.tag, { backgroundColor: '#2CCF54' }]}>
                                        <View style={styles.salaryRow}>
                                            {job?.currency?.toUpperCase() === 'AED' ? (
                                                <Image source={IMAGES.currency} style={styles.currencyImage} />
                                            ) : (
                                                <Text style={styles.currencySymbol}>{getCurrencySymbol(job?.currency || 'USD')}</Text>
                                            )}
                                            <Text style={styles.tagText}>
                                                {`${job?.monthly_salary_from?.toLocaleString()} - ${job?.monthly_salary_to?.toLocaleString()}`}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                {(job?.contract_period || job?.duration) && (
                                    <View style={[styles.tag, { backgroundColor: '#2196F3' }]}>
                                        <Text style={styles.tagText}>
                                            {job?.contract_period || job?.duration}{!(job?.contract_period || job?.duration)?.toLowerCase().includes('contract') ? ' Contract' : ''}
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>

                        {activeTab === 'Interviews' && (
                            <ImageBackground source={IMAGES.tag} style={styles.tagImage} resizeMode="cover">
                                <Text style={styles.appliedTagText}>
                                    {item?.status || 'Invited'}
                                </Text>
                            </ImageBackground>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <LinearContainer colors={[colors.white, colors.white]}>
            <BackHeader title="My Jobs" containerStyle={{ paddingHorizontal: wp(20), paddingTop: hp(12) }} />
            <View style={styles.container}>
                <View style={styles.tabsContainer}>
                    {tabs.map(renderTab)}
                </View>

                <FlatList
                    data={jobsList}
                    renderItem={renderJobCard}
                    keyExtractor={(item, index) => item?._id || index.toString()}
                    contentContainerStyle={[
                        styles.contentContainer,
                        jobsList.length === 0 && { flex: 1, justifyContent: 'center' }
                    ]}
                    ListEmptyComponent={() => {
                        const query = getActiveQuery();
                        const rawData = activeTab === 'Applied' ? query.data?.data?.applicants :
                            activeTab === 'Interviews' ? (query.data?.data?.invitations || query.data?.data?.interviews) :
                                query.data?.data?.jobs;

                        const isActuallyEmpty = query.isSuccess && (!Array.isArray(rawData) || rawData.length === 0);

                        if ((isLoading || isFetching) && !refreshing) {
                            return <ActivityIndicator size="large" color={colors._0B3970} />;
                        }

                        if (isActuallyEmpty) {
                            return (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ ...commonFontStyle(500, 16, colors._656464) }}>No jobs found</Text>
                                </View>
                            );
                        }

                        return <ActivityIndicator size="large" color={colors._0B3970} />;
                    }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListFooterComponent={isFetching && jobsList.length > 0 ? (
                        <ActivityIndicator size="small" color={colors._0B3970} />
                    ) : null}
                    showsVerticalScrollIndicator={false}
                />

            </View>

        </LinearContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: hp(25)
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp(20),
        marginBottom: hp(20),
        gap: wp(10),
    },
    tabButton: {
        flex: 1,
        paddingVertical: hp(10),
        paddingHorizontal: wp(10),
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#E2E6F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabButton: {
        backgroundColor: colors._0B3970, // Assuming primary color
        borderColor: colors._0B3970,
    },
    tabText: {
        ...commonFontStyle(500, 14, '#999'),
        textAlign: 'center'
    },
    activeTabText: {
        color: colors.white,
    },
    contentContainer: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(20),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: wp(16),
        marginBottom: hp(16),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(12),
    },
    logoContainer: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
        borderWidth: 1,
        borderColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(12),
    },
    logoText: {
        ...commonFontStyle(600, 18, colors._0B3970),
    },
    headerInfo: {
        flex: 1,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    companyName: {
        ...commonFontStyle(600, 16, colors.black),
    },
    shareIcon: {
        width: wp(18),
        height: wp(18),
        tintColor: colors.black
    },
    location: {
        ...commonFontStyle(400, 13, colors._656464),
        marginTop: hp(2),
    },
    body: {
        gap: hp(8),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    jobTitle: {
        ...commonFontStyle(600, 16, colors.black),
    },
    viewButton: {
        backgroundColor: '#0F2E60',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(6),
        paddingHorizontal: wp(12),
        borderRadius: 20,
        gap: wp(4)
    },
    viewText: {
        ...commonFontStyle(500, 12, colors.white)
    },
    descriptionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: wp(10),
    },
    description: {
        flex: 1,
        ...commonFontStyle(400, 13, colors._656464),
        lineHeight: hp(18),
    },
    tagsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        marginTop: hp(4),
        flexWrap: 'wrap'
    },
    tag: {
        paddingVertical: hp(6),
        paddingHorizontal: wp(12),
        borderRadius: 20,
    },
    tagText: {
        ...commonFontStyle(500, 10, colors.white),
    },
    salaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyImage: {
        width: wp(13),
        height: hp(10),
        resizeMode: 'contain',
        marginHorizontal: wp(2),
        tintColor: colors.white,
    },
    currencySymbol: {
        ...commonFontStyle(500, 10, colors.white),
        marginRight: wp(2),
    },
    tagImage: {
        position: 'absolute',
        bottom: 0,
        right: -wp(16),
        width: wp(75),
        height: hp(28),
        justifyContent: 'center',
        alignItems: 'center',
    },
    appliedTagText: {
        ...commonFontStyle(600, 11, colors.white),
        textAlign: 'center',
        paddingLeft: '25%',
    },
    timeAgo: {
        ...commonFontStyle(400, 11, colors._656464),
        marginTop: hp(2),
    }
} as any);

export default MyJobs;
