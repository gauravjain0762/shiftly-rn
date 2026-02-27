import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BackHeader, LinearContainer } from '../../../component';
import { colors } from '../../../theme/colors';
import { hp, wp, commonFontStyle } from '../../../theme/fonts';
import { useGetCompletedInterviewsQuery } from '../../../api/dashboardApi';
import { getTimeAgo, navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import FastImage from 'react-native-fast-image';

const CompletedInterviews = () => {
    const { t } = useTranslation();
    const { data, isLoading, isFetching, refetch } = useGetCompletedInterviewsQuery();

    const interviews = data?.data?.interviews ?? [];

    const renderItem = ({ item }: { item: any }) => {
        const job = item?.job_id;
        const company = job?.company_id;
        const user = item?.user_id;
        const interviewCompletedAt = item?.interview_completed || item?.updatedAt || item?.createdAt;
        const scores = item?.interview_response?.scores || {};
        const hasScores =
            scores &&
            Object.values(scores).some((v: any) => v !== null && v !== undefined);

        const handleOpenInterviewStatus = () => {
            if (!job || !user) {
                return;
            }

            navigateTo(SCREENS.InterviewStatus, {
                jobData: job,
                candidateData: user,
                inviteData: item,
            });
        };

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={handleOpenInterviewStatus}
            >
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        {company?.logo ? (
                            <FastImage
                                source={{ uri: company.logo }}
                                style={styles.logo}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text style={styles.logoText}>
                                {company?.company_name?.charAt(0) || 'C'}
                            </Text>
                        )}
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.jobTitle} numberOfLines={1}>
                            {job?.title || 'N/A'}
                        </Text>
                        <Text style={styles.companyName} numberOfLines={1}>
                            {company?.company_name || 'Company'}
                        </Text>
                        <Text style={styles.candidateName} numberOfLines={1}>
                            {user?.name || t('Candidate')}
                        </Text>
                        <Text style={styles.location} numberOfLines={1}>
                            {job?.country || job?.area || 'Location N/A'}
                        </Text>
                    </View>
                </View>

                {hasScores && (
                    <View style={styles.scoresRow}>
                        <View style={styles.scoreChip}>
                            <Text style={styles.scoreLabel}>{t('Communication')}</Text>
                            <Text style={styles.scoreValue}>
                                {scores.communication ?? '-'}
                            </Text>
                        </View>
                        <View style={styles.scoreChip}>
                            <Text style={styles.scoreLabel}>{t('Motivation')}</Text>
                            <Text style={styles.scoreValue}>{scores.motivation ?? '-'}</Text>
                        </View>
                        <View style={styles.scoreChip}>
                            <Text style={styles.scoreLabel}>{t('Skills')}</Text>
                            <Text style={styles.scoreValue}>{scores.skills ?? '-'}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.footer}>
                    <View style={styles.footerLeft}>
                        <TouchableOpacity
                          style={styles.assessmentButton}
                          activeOpacity={0.8}
                          onPress={handleOpenInterviewStatus}>
                          <Text style={styles.assessmentButtonText}>
                            {t('View Assessment')}
                          </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.timeAgo}>
                        {getTimeAgo(interviewCompletedAt)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <LinearContainer colors={[colors.white, colors.white]}>
            <BackHeader title={t('Completed Interviews')} containerStyle={{ paddingHorizontal: wp(20), paddingTop: hp(12) }} />
            <View style={styles.container}>
                {isLoading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={colors._0B3970} />
                    </View>
                ) : (
                    <FlatList
                        data={interviews}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item._id || index.toString()}
                        contentContainerStyle={styles.listContent}
                        refreshing={isFetching}
                        onRefresh={refetch}
                        ListFooterComponent={isFetching ? <ActivityIndicator size="small" color={colors._0B3970} /> : null}
                        ListEmptyComponent={
                            !isLoading ? (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>{t('No completed interviews found')}</Text>
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
    ...commonFontStyle(500, 14, colors._656464),
    marginBottom: hp(2),
  },
  candidateName: {
    ...commonFontStyle(400, 13, colors._656464),
    marginBottom: hp(2),
  },
    location: {
        ...commonFontStyle(400, 12, '#939393'),
    },
  scoresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
    marginTop: hp(4),
  },
  scoreChip: {
    paddingVertical: hp(4),
    paddingHorizontal: wp(8),
    borderRadius: wp(10),
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreLabel: {
    ...commonFontStyle(400, 10, '#6B7280'),
  },
  scoreValue: {
    ...commonFontStyle(600, 12, colors._0B3970),
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
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
  },
  assessmentButton: {
    paddingVertical: hp(4),
    paddingHorizontal: wp(12),
    borderRadius: wp(12),
    backgroundColor: colors._0B3970,
  },
  assessmentButtonText: {
    ...commonFontStyle(500, 12, colors.white),
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
