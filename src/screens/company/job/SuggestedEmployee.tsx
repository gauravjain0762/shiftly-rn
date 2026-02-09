import React, { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  BackHeader,
  GradientButton,
  LinearContainer,
} from '../../../component';
import { colors } from '../../../theme/colors';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { useTranslation } from 'react-i18next';
import CustomImage from '../../../component/common/CustomImage';
import { IMAGES } from '../../../assets/Images';
import {
  useGetSuggestedEmployeesQuery,
  useGetCompanyJobDetailsQuery,
} from '../../../api/dashboardApi';
import { navigateTo, errorToast } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import SuggestedEmployeeSkeleton from '../../../component/skeletons/SuggestedEmployeeSkeleton';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';

const SuggestedEmployeeScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const { jobId, jobData, isFromJobCard } = route.params || {};

  const {
    data: suggestedResponse,
    isLoading,
    isFetching,
    refetch: refetchSuggested,
  } = useGetSuggestedEmployeesQuery(jobId, { skip: !jobId });

  const {
    data: jobDetailsResponse,
    isLoading: isJobLoading,
    refetch: refetchJobDetails,
  } = useGetCompanyJobDetailsQuery(jobId, { skip: !jobId });

  useFocusEffect(
    React.useCallback(() => {
      refetchSuggested();
      refetchJobDetails();
    }, [jobId])
  );
  console.log("🔥 ~ SuggestedEmployeeScreen ~ jobDetailsResponse:", jobDetailsResponse)

  const jobInfo = jobData?.data?.job || jobDetailsResponse?.data?.job || {};
  console.log("🔥 ~ SuggestedEmployeeScreen ~ jobData:", jobData)
  console.log("🔥 ~ SuggestedEmployeeScreen ~ jobInfo:", jobInfo)

  const employees = suggestedResponse?.data?.users || [];
  const ai_data = suggestedResponse?.data || {};
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'suggested' | 'shortlisted'>('suggested');

  const invitedEmployees = useMemo(() => {
    // Check various locations where invited_users might be populated
    const list =
      jobDetailsResponse?.data?.invited_users ||
      jobData?.data?.invited_users ||
      jobInfo?.invited_users ||
      [];

    if (list.length === 0) {
      return [];
    }
    return list;
  }, [jobInfo, jobData, jobDetailsResponse]);


  const [inviteAllSelected, setInviteAllSelected] = useState(false);
  const isScreenLoading = isJobLoading || isLoading || isFetching;
  const hasDataLoaded = useRef(false);

  const showSkeleton = useMemo(() => {
    if (hasDataLoaded.current || (employees && employees.length > 0) || (jobInfo && Object.keys(jobInfo).length > 0)) {
      return false;
    }
    return isScreenLoading;
  }, [isScreenLoading, employees, jobInfo]);

  useEffect(() => {
    if (!isScreenLoading && (employees?.length > 0 || (jobInfo && Object.keys(jobInfo).length > 0))) {
      hasDataLoaded.current = true;
    }
  }, [isScreenLoading, employees, jobInfo]);

  const toggleUserSelection = (userId: string) => {
    if (!userId) return;
    setSelectedUserIds(prev => {
      const updated = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      const totalValidIds =
        (employees || [])
          ?.map((emp: any) => emp?._id)
          .filter((id: string) => !!id)?.length || 0;
      setInviteAllSelected(
        totalValidIds > 0 && updated.length === totalValidIds,
      );
      return updated;
    });
  };

  const handleNavigateToQuestions = ({
    invite_to,
    user_ids = [],
  }: {
    invite_to: 'all' | 'specific';
    user_ids?: string[];
  }) => {
    const jobIdToUse = jobId || jobInfo?._id;
    if (!jobIdToUse) {
      errorToast(t('Job reference missing. Please try again.'));
      return;
    }
    navigateTo(SCREENS.CreateQuestion, {
      jobId: jobIdToUse,
      jobData: jobInfo,
      invitePayload: {
        invite_to,
        user_ids,
      },
    });
  };

  const handleInviteAll = () => {
    const ids = (employees || [])
      ?.map((emp: any) => emp?._id)
      .filter((id: string | null) => !!id) as string[];

    if (!ids || ids.length === 0) {
      errorToast(t('No employees available to invite'));
      return;
    }

    if (inviteAllSelected) {
      setSelectedUserIds([]);
      setInviteAllSelected(false);
      return;
    }

    setSelectedUserIds(ids);
    setInviteAllSelected(true);
  };

  const handleBulkInvite = () => {
    if (inviteAllSelected) {
      handleNavigateToQuestions({ invite_to: 'all', user_ids: [] });
      return;
    }
    if (!selectedUserIds.length) {
      errorToast(t('Select at least one employee'));
      return;
    }
    handleNavigateToQuestions({
      invite_to: 'specific',
      user_ids: selectedUserIds,
    });
  };

  useEffect(() => {
    const validIds =
      (employees || [])
        ?.map((emp: any) => emp?._id)
        .filter((id: string | null) => !!id) || [];

    setSelectedUserIds(prev => {
      const filtered = prev.filter(id => validIds.includes(id));
      setInviteAllSelected(
        validIds.length > 0 && filtered.length === validIds.length,
      );
      return filtered;
    });
  }, [employees]);

  const salaryRange = useMemo(() => {
    const from = jobInfo?.monthly_salary_from;
    const to = jobInfo?.monthly_salary_to;
    if (from && to) {
      return `${jobInfo?.currency} ${formatCurrency(from)} - ${formatCurrency(to)}`;
    }
    if (from) {
      return `${jobInfo?.currency} ${formatCurrency(from)}`;
    }
    if (to) {
      return `${jobInfo?.currency} ${formatCurrency(to)}`;
    }
    return '';
  }, [jobInfo]);

  const jobLocation = useMemo(() => {
    // Show only city and country, not the full address
    if (jobInfo?.city || jobInfo?.country) {
      return `${jobInfo?.city || ''}${jobInfo?.city && jobInfo?.country ? ' - ' : ''
        }${jobInfo?.country || ''}`;
    }
    return '';
  }, [jobInfo]);

  const contractTypeLabel = jobInfo?.contract_type || '';

  const handleNavigateToProfile = (user: any) => {
    if (!user || !user._id) return;
    navigateTo(SCREENS.EmployeeProfile, {
      user,
      jobId: jobId || jobInfo?._id,
      jobData: jobInfo
    });
  };

  const renderShortlistedEmployee = (item: any) => {
    const user = item?.user_id || item;

    if (!user || (!user._id && !item.isSample)) return null;

    const experience = user?.experience || user?.years_of_experience || user?.total_experience || 0;
    const tracking = item?.tracking || [];

    return (
      <View key={user._id || 'sample'} style={styles.shortlistedCard}>
        <View style={styles.shortlistedContent}>
          <View style={styles.shortlistedLeft}>
            <TouchableOpacity
              style={styles.shortlistedHeader}
              onPress={() => handleNavigateToProfile(user)}
              activeOpacity={0.7}
            >
              <CustomImage
                uri={user?.picture || 'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=300&q=80'}
                containerStyle={styles.shortlistedAvatar}
                imageStyle={styles.shortlistedAvatar}
              />
              <View style={styles.shortlistedInfo}>
                <Text style={styles.shortlistedEmployeeName}>{user?.name || t('Candidate Name')}</Text>
                <Text style={styles.shortlistedEmployeeRole}>{user?.responsibility || user?.job_title || t('Job Role')}</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.shortlistedExp}>
              {experience > 0
                ? `${experience}y ${t('Experience')}`
                : t('No Experience')}
            </Text>

            <View style={styles.shortlistedActions}>
              <TouchableOpacity style={styles.viewAiButton}>
                <Text style={styles.viewAiButtonText}>{t('View AI Interview')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.assessmentButton}
                onPress={() =>
                  navigateTo(SCREENS.InterviewStatus, {
                    jobData: jobInfo,
                    candidateData: user,
                  })
                }>
                <Text style={styles.assessmentButtonText}>{t('Assessment')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timelineContainer}>
            {tracking.map((step: any, index: number) => {
              const isLast = index === tracking.length - 1;
              const isCompleted = step?.is_done;
              const dateDisplay = step?.date_time ? moment(step.date_time).format('h:mm A - DDMMM') : '';

              return (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineIndicator}>
                    <Image
                      source={IMAGES.checked}
                      style={[
                        styles.timelineIcon,
                        { tintColor: isCompleted ? colors._0B3970 : '#D9D9D9' }
                      ]}
                    />
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineRow}>
                      <Text style={styles.timelineTime}>{dateDisplay}</Text>
                    </View>
                    <Text style={[styles.timelineTitle, !isCompleted && { color: '#939393' }]}>
                      {t(step?.title || '')}
                    </Text>
                    <Text style={[styles.timelineStatus, !isCompleted && { color: '#939393' }]}>
                      {t(step?.desc || '')}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderEmployee = (item: any) => {
    if (!item || !item._id) {
      return null;
    }
    const experience =
      item?.experience ||
      item?.years_of_experience ||
      item?.total_experience ||
      0;

    // Check if user is already invited
    const isInvited = invitedEmployees?.some((invited: any) =>
      (invited?.user_id?._id === item?._id) ||
      (invited?.user_id === item?._id) ||
      (invited === item?._id)
    );

    const isSelected = selectedUserIds.includes(item?._id);

    return (
      <Pressable
        key={item._id}
        onPress={() => !isInvited && toggleUserSelection(item?._id)}
        style={[
          styles.employeeCard,
          isSelected && styles.selectedEmployeeCard,
          isInvited && styles.invitedCard
        ]}>
        <TouchableOpacity
          onPress={() => handleNavigateToProfile(item)}
          activeOpacity={0.7}
        >
          <CustomImage
            uri={
              item?.picture ||
              'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=300&q=80'
            }
            containerStyle={styles.employeeAvatar}
            imageStyle={styles.employeeAvatar}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.employeeInfo}
          onPress={() => handleNavigateToProfile(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.employeeName}>
            {item?.name || t('Candidate Name')}
          </Text>
          <Text style={styles.employeeRole}>
            {item?.responsibility || item?.job_title || t('Job Role')}
          </Text>
          <Text style={styles.employeeExperience}>
            {`${experience || 0}y ${t('Experience')}`}
          </Text>
        </TouchableOpacity>

        {isInvited || isSelected ? (
          <View style={styles.invitedIconContainer}>
            <Image source={IMAGES.checked} style={styles.invitedIcon} />
          </View>
        ) : (
          <Pressable
            onPress={event => {
              event.stopPropagation();
              setInviteAllSelected(false);
              toggleUserSelection(item?._id);
            }}
            style={[
              styles.inviteButton,
              isSelected && styles.inviteButtonSelected,
            ]}>
            <Text
              style={[
                styles.inviteButtonText,
                isSelected && styles.inviteButtonTextSelected,
              ]}>
              {t('Invite')}
            </Text>
          </Pressable>
        )}
      </Pressable>
    );
  };

  return (
    <LinearContainer colors={[colors.white, colors.white]}>
      <BackHeader
        type="company"
        title={t('Candidates List')}
        containerStyle={styles.header}
      />
      {showSkeleton ? (
        <SuggestedEmployeeSkeleton />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.jobCard}>
              <View style={styles.jobCardRow}>
                <View style={styles.companyLogo}>
                  <Text style={styles.companyLogoText}>
                    {jobInfo?.title?.[0]?.toUpperCase() ||
                      jobInfo?.company_name?.[0]?.toUpperCase() ||
                      'J'}
                  </Text>
                </View>
                <View style={styles.jobCardInfo}>
                  <Text style={styles.jobTitle}>{jobInfo?.title || ''}</Text>
                  {(jobLocation || contractTypeLabel) && (
                    <Text style={styles.jobLocation}>
                      {jobLocation}
                      {contractTypeLabel ? ` - ${contractTypeLabel}` : ''}
                    </Text>
                  )}
                  {!!salaryRange && (
                    <Text style={styles.jobSalary}>{salaryRange}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.analyticsCard}>
              <View style={styles.analyticsRow}>
                <View style={styles.analyticsIcon}>
                  <Text style={styles.analyticsIconText}>✓</Text>
                </View>
                <View style={styles.analyticsTextWrapper}>
                  <Text style={styles.analyticsPrimary}>
                    {`${ai_data?.ai_candidates || 0} ${t('Candidates Analyzed by AI')}`}
                  </Text>
                  <Text style={styles.analyticsSecondary}>
                    {t('Covers all received profiles')}
                  </Text>
                </View>
              </View>
              <View style={styles.analyticsRow}>
                <View style={styles.analyticsIcon}>
                  <Text style={styles.analyticsIconText}>✓</Text>
                </View>
                <View style={styles.analyticsTextWrapper}>
                  <Text style={styles.analyticsPrimary}>
                    {`${ai_data?.matched_candidates || 0} ${t('Highly Matched Profiles')}`}
                  </Text>
                  <Text style={styles.analyticsSecondary}>
                    {t('For profiles above 75% match score')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Tabs - Only visible if coming from Job Card */}
            {isFromJobCard && (
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'suggested' && styles.activeTabButton]}
                  onPress={() => setActiveTab('suggested')}>
                  <Image
                    source={IMAGES.people}
                    style={[styles.tabIcon, activeTab === 'suggested' && { tintColor: colors._0B3970 }]}
                  />
                  <Text style={[styles.tabText, activeTab === 'suggested' && styles.activeTabText]}>{t('Suggested List')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'shortlisted' && styles.activeTabButton, activeTab === 'shortlisted' && { backgroundColor: colors._0B3970, borderColor: colors._0B3970 }]}
                  onPress={() => setActiveTab('shortlisted')}>
                  <View style={styles.starIconContainer}>
                    <Image
                      source={IMAGES.star1}
                      style={[
                        styles.starSmall,
                        { tintColor: activeTab === 'shortlisted' ? '#8FDBF5' : '#0B3970' }
                      ]}
                    />
                    <Image
                      source={IMAGES.star2}
                      style={[
                        styles.starLarge,
                        { tintColor: activeTab === 'shortlisted' ? '#D4C6F9' : '#0B3970' }
                      ]}
                    />
                  </View>
                  <Text style={[styles.tabText, activeTab === 'shortlisted' && { color: colors.white }]}>{t('AI Shortlisted')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'suggested' ? (
              <>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('Suggested Employee')}</Text>
                  <TouchableOpacity
                    style={[
                      styles.inviteAllButton,
                      inviteAllSelected && styles.inviteAllButtonSelected,
                    ]}
                    onPress={handleInviteAll}>
                    <View
                      style={[
                        styles.inviteAllIcon,
                        inviteAllSelected && styles.inviteAllIconSelected,
                      ]}>
                      <Text
                        style={[
                          styles.inviteAllIconText,
                          inviteAllSelected && styles.inviteAllIconTextSelected,
                        ]}>
                        ✓
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.inviteAllText,
                        inviteAllSelected && styles.inviteAllTextSelected,
                      ]}>
                      {t('Invite All')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {employees && employees.length > 0 ? (
                  employees
                    .filter((item: any) => item && item._id)
                    .map((item: any, index: number) => renderEmployee(item))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>
                      {t('No suggestions available yet')}
                    </Text>
                    <Text style={styles.emptyMessage}>
                      {t(
                        'Once candidates start matching your job, they will appear here.',
                      )}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              // Shortlisted Tab Content
              <>
                {invitedEmployees && invitedEmployees.length > 0 ? (
                  invitedEmployees.map((item: any) => (
                    <React.Fragment key={item.user_id?._id || item._id || 'sample'}>
                      {renderShortlistedEmployee(item)}
                    </React.Fragment>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>
                      {t('No shortlisted candidates yet')}
                    </Text>
                    <Text style={styles.emptyMessage}>
                      {t('Invited candidates will appear here.')}
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
          {activeTab === 'suggested' && (
            <View style={styles.ctaWrapper}>
              <GradientButton
                type="Company"
                style={styles.ctaButton}
                onPress={handleBulkInvite}
                title={t('Invite for AI Interview')}
              />
            </View>
          )}
        </>
      )}
    </LinearContainer>
  );
};

export default SuggestedEmployeeScreen;

const formatCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    return value?.toString() || '0';
  }
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(25),
    paddingTop: hp(26),
    marginBottom: hp(10),
  },
  scrollContent: {
    paddingHorizontal: wp(25),
    paddingBottom: '40%',
    gap: hp(20),
  },
  jobCard: {
    borderWidth: 1,
    borderColor: '#E2E6F0',
    borderRadius: wp(18),
    padding: wp(18),
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  jobCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(12),
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(12),
  },
  companyLogoText: {
    ...commonFontStyle(600, 16, colors._0B3970),
  },
  jobCardInfo: {
    flex: 1,
  },
  jobTitle: {
    ...commonFontStyle(700, 18, colors._0B3970),
  },
  jobLocation: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
    marginTop: hp(4),
  },
  jobSalary: {
    ...commonFontStyle(700, 16, colors._0B3970),
    marginTop: hp(6),
  },
  analyticsCard: {
    backgroundColor: '#072F61',
    borderRadius: wp(18),
    paddingVertical: hp(18),
    paddingHorizontal: wp(20),
    gap: hp(18),
  },
  analyticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(12),
  },
  analyticsIcon: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsIconText: {
    ...commonFontStyle(700, 16, colors.white),
  },
  analyticsTextWrapper: {
    flex: 1,
  },
  analyticsPrimary: {
    ...commonFontStyle(600, 15, colors.white),
  },
  analyticsSecondary: {
    ...commonFontStyle(400, 12, colors.white),
    opacity: 0.8,
    marginTop: hp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...commonFontStyle(600, 18, colors._4A4A4A),
  },
  inviteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(14),
    paddingVertical: hp(6),
    borderRadius: wp(20),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors._0B3970,
    gap: wp(8),
  },
  inviteAllButtonSelected: {
    backgroundColor: colors._0B3970,
  },
  inviteAllText: {
    ...commonFontStyle(600, 12, colors._0B3970),
  },
  inviteAllTextSelected: {
    color: colors.white,
  },
  inviteAllIcon: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    borderWidth: 1,
    borderColor: colors._0B3970,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteAllIconSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  inviteAllIconText: {
    ...commonFontStyle(600, 12, colors._0B3970),
  },
  inviteAllIconTextSelected: {
    color: colors._0B3970,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D7C8',
    borderRadius: wp(18),
    padding: wp(12),
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  selectedEmployeeCard: {
    borderColor: colors._0B3970,
    backgroundColor: '#EEF4FF',
  },
  employeeAvatar: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(12),
  },
  employeeInfo: {
    flex: 1,
    marginHorizontal: wp(14),
  },
  employeeName: {
    ...commonFontStyle(600, 16, colors._0B3970),
  },
  employeeRole: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
    marginTop: hp(2),
  },
  employeeExperience: {
    ...commonFontStyle(400, 13, colors._939393),
    marginTop: hp(4),
  },
  inviteButton: {
    paddingHorizontal: wp(18),
    paddingVertical: hp(8),
    borderRadius: wp(20),
    backgroundColor: colors._0B3970,
  },
  inviteButtonText: {
    ...commonFontStyle(600, 13, colors.white),
  },
  inviteButtonSelected: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors._0B3970,
  },
  inviteButtonTextSelected: {
    color: colors._0B3970,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: hp(40),
    gap: hp(8),
  },
  emptyTitle: {
    ...commonFontStyle(600, 16, colors._0B3970),
  },
  emptyMessage: {
    ...commonFontStyle(400, 14, colors._0B3970),
    textAlign: 'center',
    lineHeight: hp(20),
    paddingHorizontal: wp(10),
  },
  ctaWrapper: {
    position: 'absolute',
    left: wp(20),
    right: wp(20),
    bottom: hp(20),
  },
  ctaButton: {
    borderRadius: wp(22),
    marginBottom: hp(30)
  },
  invitedIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
    tintColor: colors._0B3970, // Or use the original color if check_circle is already colored
  },
  invitedIconContainer: {
    padding: wp(10),
  },
  invitedCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#EEE',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: wp(10),
    marginBottom: hp(20),
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(12),
    backgroundColor: '#F2F2F2',
    borderRadius: wp(20),
    gap: wp(8),
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  activeTabButton: {
    backgroundColor: '#EBEBEB',
  },
  tabIcon: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
  },
  tabText: {
    ...commonFontStyle(600, 14, '#939393'),
  },
  activeTabText: {
    color: colors._0B3970,
  },
  shortlistedCard: {
    borderWidth: 1,
    borderColor: '#E0D7C8',
    borderRadius: wp(24),
    padding: wp(14),
    backgroundColor: '#F0F8FF',
    marginBottom: hp(16),
    height: hp(190), // Fixed height as requested
    justifyContent: 'center', // Center content vertically
    overflow: 'hidden', // Ensure no overflow
  },
  shortlistedContent: {
    flexDirection: 'row',
  },
  shortlistedLeft: {
    flex: 1, // Reduced from 1.2
    marginRight: wp(8), // Reduced margin,
    paddingTop: hp(10)
  },
  shortlistedHeader: {
    flexDirection: 'row',
    marginBottom: hp(10), // Slightly reduced
    alignItems: 'center',
  },
  shortlistedAvatar: {
    width: wp(65), // Slightly smaller to help with spacing
    height: wp(65),
    borderRadius: wp(14),
    marginRight: wp(10), // Reduced spacing
  },
  shortlistedInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: hp(2),
  },
  shortlistedEmployeeName: {
    ...commonFontStyle(700, 17, colors._0B3970),
  },
  shortlistedEmployeeRole: {
    ...commonFontStyle(400, 14, colors.black),
  },
  shortlistedExp: {
    ...commonFontStyle(400, 15, colors._4A4A4A),
    marginTop: hp(2), // Reduced top margin
    marginBottom: hp(16),
  },
  shortlistedActions: {
    flexDirection: 'row',
    gap: wp(8), // Reduced gap
  },
  viewAiButton: {
    backgroundColor: '#341A95',
    borderRadius: wp(24),
    paddingVertical: hp(12),
    paddingHorizontal: wp(8), // Reduced horizontal padding
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  viewAiButtonText: {
    ...commonFontStyle(600, 11, colors.white),
    textAlign: 'center',
  },
  assessmentButton: {
    backgroundColor: '#1F8A4D',
    borderRadius: wp(24),
    paddingVertical: hp(12),
    paddingHorizontal: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  assessmentButtonText: {
    ...commonFontStyle(600, 11, colors.white),
    textAlign: 'center',
  },
  timelineContainer: {
    width: wp(100),
    borderLeftWidth: 2,
    borderLeftColor: '#D9D9D9',
    paddingLeft: wp(14),
    paddingVertical: hp(2),
    justifyContent: 'space-between', // Distribute items evenly
  },
  timelineItem: {
    marginBottom: hp(6), // Significantly reduced from 20 to fit 4 items
  },
  timelineIndicator: {
    position: 'absolute',
    left: wp(-24),
    top: hp(11), // Align with timelineTitle
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(20),
    height: wp(20), // Use wp for height to keep circle
    backgroundColor: '#F0F8FF',
  },
  timelineIcon: {
    width: wp(18), // Slightly smaller icons
    height: wp(18),
    resizeMode: 'contain',
  },
  timelineLine: {
  },
  timelineContent: {
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: hp(0), // Remove extra margin
  },
  timelineTime: {
    fontSize: wp(8), // Sligthly smaller
    color: '#939393',
    fontWeight: '400',
    marginBottom: hp(2),
  },
  timelineTitle: {
    ...commonFontStyle(700, 11, colors._0B3970), // Slightly smaller font
    marginBottom: hp(0),
    lineHeight: hp(14),
  },
  timelineStatus: {
    ...commonFontStyle(400, 10, '#939393'),
    lineHeight: hp(14),
  },
  starIconContainer: {
    width: wp(28),
    height: wp(24),
  },
  starSmall: {
    width: wp(14),
    height: wp(14),
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  starLarge: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
