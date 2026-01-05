import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
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
import {
  useGetSuggestedEmployeesQuery,
  useGetCompanyJobDetailsQuery,
} from '../../../api/dashboardApi';
import { navigateTo, errorToast } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import SuggestedEmployeeSkeleton from '../../../component/skeletons/SuggestedEmployeeSkeleton';

const SuggestedEmployeeScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const { jobId, jobData } = route.params || {};

  const {
    data: suggestedResponse,
    isLoading,
    isFetching,
  } = useGetSuggestedEmployeesQuery(jobId, { skip: !jobId });
  console.log("🔥 ~ SuggestedEmployeeScreen ~ suggestedResponse:", suggestedResponse)

  const {
    data: jobDetailsResponse,
    isLoading: isJobLoading,
  } = useGetCompanyJobDetailsQuery(jobId, { skip: !jobId });

  const jobInfo = jobData || jobDetailsResponse?.data || {};
  const employees = suggestedResponse?.data?.users || [];
  const ai_data = suggestedResponse?.data || {};
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [inviteAllSelected, setInviteAllSelected] = useState(false);
  const isScreenLoading = isJobLoading || isLoading || isFetching;

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => {
      const updated = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      const totalValidIds =
        employees?.map((emp: any) => emp?._id).filter((id: string) => !!id)
          ?.length || 0;
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
    const ids = employees
      ?.map((emp: any) => emp?._id)
      .filter((id: string | null) => !!id) as string[];

    if (!ids?.length) {
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
      employees
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
      return `AED ${formatCurrency(from)} - ${formatCurrency(to)}`;
    }
    if (from) {
      return `AED ${formatCurrency(from)}`;
    }
    if (to) {
      return `AED ${formatCurrency(to)}`;
    }
    if (to) {
      return `AED ${formatCurrency(to)}`;
    }
  }, [jobInfo]);

  const jobLocation = useMemo(() => {
    if (jobInfo?.area) {
      return jobInfo.area;
    }
    if (jobInfo?.city || jobInfo?.country) {
      return `${jobInfo?.city || ''}${jobInfo?.city && jobInfo?.country ? ', ' : ''
        }${jobInfo?.country || ''}`;
    }
  }, [jobInfo, t]);

  const jobTypeLabel = jobInfo?.contract_type;

  const renderEmployee = ({ item }: { item: any }) => {
    const experience =
      item?.experience ||
      item?.years_of_experience ||
      item?.total_experience ||
      0;
    const isSelected = selectedUserIds.includes(item?._id);
    return (
      <Pressable
        onPress={() => toggleUserSelection(item?._id)}
        style={[
          styles.employeeCard,
          isSelected && styles.selectedEmployeeCard,
        ]}>
        <CustomImage
          uri={
            item?.picture ||
            'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=300&q=80'
          }
          containerStyle={styles.employeeAvatar}
          imageStyle={styles.employeeAvatar}
        />
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>
            {item?.name || t('Candidate Name')}
          </Text>
          <Text style={styles.employeeRole}>
            {item?.responsibility || item?.job_title || t('Job Role')}
          </Text>
          <Text style={styles.employeeExperience}>
            {`${experience || 0}y ${t('Experience')}`}
          </Text>
        </View>
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
            {isSelected ? t('Invited') : t('Invite')}
          </Text>
        </Pressable>
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
      {isScreenLoading ? (
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
                      jobInfo?.company_name?.[0]?.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.jobCardInfo}>
                  <Text style={styles.jobTitle}>{jobInfo?.title}</Text>
                  <Text style={styles.jobLocation}>
                    {jobLocation}
                    {jobTypeLabel ? ` - ${jobTypeLabel}` : ''}
                  </Text>
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
                    {`${ai_data?.matched_candidates || 0} ${'Highly Matched Profiles'}`}
                  </Text>
                  <Text style={styles.analyticsSecondary}>
                    {t('For profiles above 75% match score')}
                  </Text>
                </View>
              </View>
            </View>

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
                  {inviteAllSelected ? t('Invited') : t('Invite All')}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={employees}
              keyExtractor={(item, index) => item?._id || index.toString()}
              scrollEnabled={false}
              renderItem={renderEmployee}
              extraData={{ selectedUserIds, inviteAllSelected }}
              ListEmptyComponent={
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
              }
            />
          </ScrollView>
          <View style={styles.ctaWrapper}>
            <GradientButton
              style={styles.ctaButton}
              type="Company"
              title={t('Invite for AI Interview')}
              onPress={handleBulkInvite}
            />
          </View>
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
    paddingBottom: hp(120),
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
    marginTop: hp(15),
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
    bottom: hp(40),
  },
  ctaButton: {
    borderRadius: wp(22),
  },
});
