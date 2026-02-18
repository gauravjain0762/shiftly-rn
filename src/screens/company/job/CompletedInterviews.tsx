import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BackHeader, LinearContainer } from '../../../component';
import { colors } from '../../../theme/colors';
import { hp, wp, commonFontStyle } from '../../../theme/fonts';
import { useGetCompanyJobsQuery } from '../../../api/dashboardApi';
import { navigateTo, getTimeAgo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import FastImage from 'react-native-fast-image';

const CompletedInterviews = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [jobsList, setJobsList] = useState<any[]>([]);

    // queryParams for getCompanyJobs
    const queryParams = {
        page: page,
        limit: 10,
    };

    const { data, isLoading, isFetching } = useGetCompanyJobsQuery(queryParams);

    useEffect(() => {
        if (data?.data?.jobs) {
            if (page === 1) {
                setJobsList(data.data.jobs);
            } else {
                setJobsList(prev => [...prev, ...data.data.jobs]);
            }
        }
    }, [data, page]);

    const handleLoadMore = () => {
        if (data?.data?.pagination?.total_pages > page && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        // Note: We are listing Jobs here because we don't have a direct API for "Completed Interviews" list.
        // Ideally, we would list specific interview sessions. 
        // For now, we allow navigation to the Job's suggested employees or details where interviews can be found.
        // User requested "Candidate Name" and "Status". Without that data in 'job' object, we show Job info.

        // Check if job has interview stats if possible, otherwise just show job.

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    // Navigate to SuggestedEmployee which lists candidates (including completed interviews) or InterviewStatus directly if we had candidate data
                    navigateTo(SCREENS.SuggestedEmployee, { jobData: item, initialTab: 'Shortlisted' });
                }}
            >
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        {item?.company?.logo ? (
                            <FastImage
                                source={{ uri: item.company.logo }}
                                style={styles.logo}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text style={styles.logoText}>{item?.company?.name?.charAt(0) || 'C'}</Text>
                        )}
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.jobTitle} numberOfLines={1}>{item?.title}</Text>
                        <Text style={styles.companyName} numberOfLines={1}>{item?.company?.name || 'Company'}</Text>
                        <Text style={styles.location} numberOfLines={1}>{item?.location || item?.city || 'Location N/A'}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.statusTag}>
                        <Text style={styles.statusText}>{t('View Candidates')}</Text>
                    </View>
                    <Text style={styles.timeAgo}>
                        {getTimeAgo(item?.createdAt)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <LinearContainer colors={[colors.white, colors.white]}>
            <BackHeader title={t('Completed Interviews')} containerStyle={{ paddingHorizontal: wp(20), paddingTop: hp(12) }} />
            <View style={styles.container}>
                {isLoading && page === 1 ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={colors._0B3970} />
                    </View>
                ) : (
                    <FlatList
                        data={jobsList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item._id || index.toString()}
                        contentContainerStyle={styles.listContent}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={isFetching && page > 1 ? <ActivityIndicator size="small" color={colors._0B3970} /> : null}
                        ListEmptyComponent={
                            !isLoading ? (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>{t('No jobs found')}</Text>
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>
        </LinearContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(20),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: wp(16),
        padding: wp(16),
        marginBottom: hp(16),
        borderWidth: 1,
        borderColor: '#E2E6F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
        backgroundColor: '#F8F9FA',
    },
    logo: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
    },
    logoText: {
        ...commonFontStyle(600, 18, colors._0B3970),
    },
    headerInfo: {
        flex: 1,
    },
    jobTitle: {
        ...commonFontStyle(600, 16, colors.black),
        marginBottom: hp(4),
    },
    companyName: {
        ...commonFontStyle(400, 14, colors._656464),
        marginBottom: hp(2),
    },
    location: {
        ...commonFontStyle(400, 12, '#939393'),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(8),
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: hp(12),
    },
    statusTag: {
        backgroundColor: '#E6F4EA',
        paddingVertical: hp(4),
        paddingHorizontal: wp(10),
        borderRadius: wp(12),
    },
    statusText: {
        ...commonFontStyle(500, 12, '#1E8E3E'),
    },
    timeAgo: {
        ...commonFontStyle(400, 11, colors._656464),
    },
    emptyState: {
        flex: 1,
        paddingTop: hp(50),
        alignItems: 'center',
    },
    emptyText: {
        ...commonFontStyle(500, 16, colors._656464),
    },
});

export default CompletedInterviews;
