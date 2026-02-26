import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

import { useRoute } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { hp, wp, commonFontStyle } from '../../../theme/fonts';
import { BackHeader, LinearContainer } from '../../../component';
import JobListCard from '../../../component/common/JobListCard';
import { useGetAppliedJobsQuery, useGetEmployeeJobsQuery, useGetInterviewsQuery } from '../../../api/dashboardApi';
import { navigateTo } from '../../../utils/commonFunction';
import { getCurrencySymbol } from '../../../utils/currencySymbols';
import Share from 'react-native-share';
import { SCREENS } from '../../../navigation/screenNames';

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
    const matchedJobsQuery = useGetEmployeeJobsQuery(
        { type: 'matched', page: pageMatched },
        { skip: false, refetchOnMountOrArgChange: true }
    );

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
        const res = matchedJobsQuery.data;
        if (res == null) return;
        const raw = res?.data;
        const newList = Array.isArray(raw?.jobs)
            ? raw.jobs
            : Array.isArray(raw?.matched_jobs)
                ? raw.matched_jobs
                : Array.isArray(raw)
                    ? raw
                    : Array.isArray(res?.jobs)
                        ? res.jobs
                        : Array.isArray(res)
                            ? res
                            : [];
        if (pageMatched === 1) {
            setListMatched(newList);
        } else {
            setListMatched(prev => {
                const existingIds = new Set(prev.map(item => item._id));
                const uniqueNewItems = newList.filter((item: any) => !existingIds.has(item._id));
                return [...prev, ...uniqueNewItems];
            });
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

        const getStatusBadge = () => {
            if (activeTab === 'Applied') return { text: 'Applied', useImageBg: false };
            if (activeTab === 'Interviews') return { text: item?.status || 'Invited', useImageBg: true };
            return undefined;
        };

        return (
            <JobListCard
                job={job}
                rawItem={item}
                dateFormat="relative"
                onPress={
                    activeTab === 'Interviews'
                        ? () =>
                              navigateTo(SCREENS.JobInvitationScreen, {
                                  jobDetail: { job },
                                  link: item?.interview_link,
                              })
                        : undefined
                }
                onPressView={() =>
                    navigateTo(SCREENS.JobDetail, {
                        jobId: job?._id,
                        is_applied: activeTab === 'Applied',
                        hide_apply: activeTab === 'Interviews',
                    })
                }
                onShare={() => handleShare(job)}
                onPressCompany={() => {
                    const companyId =
                        (typeof job?.company_id === 'object' ? job?.company_id?._id : job?.company_id) ||
                        (typeof job?.company === 'object' ? job?.company?._id || job?.company?.id : job?.company);
                    if (companyId && typeof companyId === 'string') {
                        navigateTo(SCREENS.CompanyProfile, { companyId });
                    }
                }}
                statusBadge={getStatusBadge()}
                disabled={activeTab !== 'Interviews'}
            />
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
                        let rawData: any[] | undefined;
                        if (activeTab === 'Applied') {
                            rawData = query.data?.data?.applicants;
                        } else if (activeTab === 'Interviews') {
                            rawData = query.data?.data?.invitations || query.data?.data?.interviews;
                        } else {
                            const res = query.data;
                            const raw = res?.data;
                            rawData = Array.isArray(raw?.jobs) ? raw.jobs
                                : Array.isArray(raw?.matched_jobs) ? raw.matched_jobs
                                    : Array.isArray(raw) ? raw
                                        : Array.isArray(res?.jobs) ? res.jobs
                                            : Array.isArray(res) ? res : undefined;
                        }
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
        paddingBottom: hp(25),
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
        backgroundColor: colors._0B3970,
        borderColor: colors._0B3970,
    },
    tabText: {
        ...commonFontStyle(500, 14, '#999'),
        textAlign: 'center',
    },
    activeTabText: {
        color: colors.white,
    },
    contentContainer: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(20),
    },
});

export default MyJobs;
