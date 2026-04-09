import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  BackHeader,
  GradientButton,
  LinearContainer,
} from '../../../component';
import BottomModal from '../../../component/common/BottomModal';
import LottieView from 'lottie-react-native';
import { animation } from '../../../assets/animation';
import { colors } from '../../../theme/colors';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { useTranslation } from 'react-i18next';
import CustomImage from '../../../component/common/CustomImage';
import { IMAGES } from '../../../assets/Images';
import {
  useGetSuggestedEmployeesQuery,
  useGetCompanyJobDetailsQuery,
  useLazyGetSuggestedEmployeesQuery,
  useLazyGetCompanyJobDetailsQuery,
  useSendInterviewInvitesMutation,
} from '../../../api/dashboardApi';
import { navigateTo, errorToast, goBack, resetNavigation, getInitials, hasValidImage } from '../../../utils/commonFunction';
import { getCurrencySymbol } from '../../../utils/currencySymbols';
import { getJobMonthlySalaryRangeText } from '../../../utils/monthlySalaryRange';
import { SCREENS } from '../../../navigation/screenNames';
import { navigationRef } from '../../../navigation/RootContainer';
import SuggestedEmployeeSkeleton from '../../../component/skeletons/SuggestedEmployeeSkeleton';

import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import {
  setCoPostJobSteps,
  setJobFormState,
} from '../../../features/companySlice';
import { mapJobToFormState } from '../../../utils/jobFormMapper';
import { Alert } from 'react-native';
import { successToast } from '../../../utils/commonFunction';
import { useCloseCompanyJobMutation } from '../../../api/dashboardApi';
import BaseText from '../../../component/common/BaseText';

const SuggestedEmployeeScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const { jobId, jobData, isFromJobCard, fromPostJob } = route.params || {};

  const shouldDefaultToShortlisted =
    route.params?.fromPendingInterview === true ||
    route.params?.fromPendingInterviews === true;

  const [activeTab, setActiveTab] = useState<
    'suggested' | 'shortlisted' | 'applicants'
  >(() => (shouldDefaultToShortlisted ? 'shortlisted' : 'suggested'));

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

  const employees = useMemo(() => {
    return (
      jobDetailsResponse?.data?.suggested_employees ||
      suggestedResponse?.data?.suggested_employees ||
      suggestedResponse?.data?.users ||
      []
    );
  }, [jobDetailsResponse, suggestedResponse]);

  // Delayed refetch when suggested list is empty - backend AI matching may take time after job post
  const hasDelayedRefetched = useRef(false);
  useEffect(() => {
    hasDelayedRefetched.current = false;
  }, [jobId]);
  useEffect(() => {
    if (!jobId || employees.length > 0 || hasDelayedRefetched.current) return;
    hasDelayedRefetched.current = true;
    const timer = setTimeout(() => {
      refetchSuggested();
      refetchJobDetails();
    }, 4000);
    return () => clearTimeout(timer);
  }, [
    jobId,
    employees.length,
    refetchSuggested,
    refetchJobDetails,
  ]);

  const jobInfo =
    jobData?.data?.job ||
    jobData?.job ||
    jobDetailsResponse?.data?.job ||
    {};
  const isClosedJob = String(jobInfo?.status ?? '').toLowerCase() === 'closed';

  const ai_data = jobDetailsResponse?.data || suggestedResponse?.data || {};
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const dispatch = useDispatch<any>();
  const [closeJob] = useCloseCompanyJobMutation();

  // Pagination state for each tab
  const [suggestedPage, setSuggestedPage] = useState(1);
  const [shortlistedPage, setShortlistedPage] = useState(1);
  const [applicantsPage, setApplicantsPage] = useState(1);

  const [extraSuggested, setExtraSuggested] = useState<any[]>([]);
  const [extraShortlisted, setExtraShortlisted] = useState<any[]>([]);
  const [extraApplicants, setExtraApplicants] = useState<any[]>([]);

  const [suggestedHasMore, setSuggestedHasMore] = useState(true);
  const [shortlistedHasMore, setShortlistedHasMore] = useState(true);
  const [applicantsHasMore, setApplicantsHasMore] = useState(true);

  const [fetchMoreSuggested, { isFetching: isFetchingSuggested }] = useLazyGetSuggestedEmployeesQuery();
  const [fetchMoreJobDetails, { isFetching: isFetchingJobDetails }] = useLazyGetCompanyJobDetailsQuery();
  const [sendInterviewInvites] = useSendInterviewInvitesMutation();
  const [resendingUserId, setResendingUserId] = useState<string | null>(null);
  const [showResendSuccessModal, setShowResendSuccessModal] = useState(false);

  const handleResendInvite = async (user: any) => {
    const targetUserId = user?._id;
    const targetJobId = jobId || jobInfo?._id;
    if (!targetUserId || !targetJobId) {
      errorToast(t('Missing invite information. Please try again.'));
      return;
    }

    const existingQuestions: string[] = Array.isArray(jobInfo?.interview_questions)
      ? jobInfo.interview_questions
        .filter((q: any) => typeof q === 'string' && q.trim().length > 0)
        .map((q: string) => q.trim())
      : [];

    if (existingQuestions.length === 0) {
      errorToast(t('Please add interview questions first.'));
      return;
    }

    try {
      setResendingUserId(String(targetUserId));
      const formData = new FormData();
      formData.append('job_id', String(targetJobId));
      formData.append('invite_to', 'specific');
      formData.append('user_ids', String(targetUserId));
      existingQuestions.forEach((question: string, index: number) => {
        formData.append(`questions[${index}]`, question);
      });

      const res: any = await sendInterviewInvites(formData).unwrap();
      if (res?.status) {
        setShowResendSuccessModal(true);
        refetchJobDetails();
        refetchSuggested();
      } else {
        errorToast(res?.message || t('Failed to send interview invitation'));
      }
    } catch (error: any) {
      const message =
        error?.data?.message || error?.error || error?.message || t('Failed to send interview invitation');
      errorToast(message);
    } finally {
      setResendingUserId(null);
    }
  };

  const invitedEmployees = useMemo(() => {
    const list =
      suggestedResponse?.data?.invited_users ||
      jobDetailsResponse?.data?.invited_users ||
      jobData?.data?.invited_users ||
      jobInfo?.invited_users ||
      [];

    if (list.length === 0) {
      return [];
    }
    return list;
  }, [suggestedResponse, jobInfo, jobData, jobDetailsResponse]);

  const applications = useMemo(() => {
    return (
      suggestedResponse?.data?.applications ||
      jobDetailsResponse?.data?.applications ||
      jobData?.data?.applications ||
      []
    );
  }, [suggestedResponse, jobData, jobDetailsResponse]);

  const [inviteAllSelected, setInviteAllSelected] = useState(false);
  const isScreenLoading = isJobLoading || isLoading || isFetching;
  const hasDataLoaded = useRef(false);
  const tabScrollRef = useRef<ScrollView>(null);
  const tabLayouts = useRef<Record<string, number>>({});

  const scrollToTab = useCallback(
    (tab: 'suggested' | 'shortlisted' | 'applicants') => {
      if (tab === 'suggested') {
        tabScrollRef.current?.scrollTo({ x: 0, animated: true });
      } else {
        const x = tabLayouts.current[tab];
        if (typeof x === 'number') {
          tabScrollRef.current?.scrollTo({ x, animated: true });
        }
      }
    },
    []
  );

  const selectTab = useCallback(
    (tab: 'suggested' | 'shortlisted' | 'applicants') => {
      setActiveTab(tab);
      scrollToTab(tab);
    },
    [scrollToTab]
  );

  useEffect(() => {
    if (!isFromJobCard) return;
    const id = setTimeout(() => scrollToTab(activeTab), 250);
    return () => clearTimeout(id);
  }, [isFromJobCard]);

  const showSkeleton = useMemo(() => {
    // Show content immediately when from post job or job list - don't block on loading
    if (jobId && (fromPostJob || isFromJobCard)) return false;
    if (hasDataLoaded.current || (employees && employees.length > 0) || (jobInfo && Object.keys(jobInfo).length > 0)) {
      return false;
    }
    return isScreenLoading;
  }, [jobId, fromPostJob, isFromJobCard, isScreenLoading, employees, jobInfo]);

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

  // All suggested employees already invited?
  const allSuggestedInvited = useMemo(() => {
    if (!Array.isArray(employees) || employees.length === 0) return false;
    if (!Array.isArray(invitedEmployees) || invitedEmployees.length === 0)
      return false;

    const invitedIds = invitedEmployees
      .map((inv: any) => inv?.user_id?._id || inv?.user_id || inv)
      .filter(Boolean);

    const suggestedIds = employees
      .map((emp: any) => emp?._id)
      .filter(Boolean);

    if (suggestedIds.length === 0) return false;

    return suggestedIds.every(id => invitedIds.includes(id));
  }, [employees, invitedEmployees]);

  // Reset pagination when tab changes
  useEffect(() => {
    setExtraSuggested([]);
    setExtraShortlisted([]);
    setExtraApplicants([]);
    setSuggestedPage(1);
    setShortlistedPage(1);
    setApplicantsPage(1);
    setSuggestedHasMore(true);
    setShortlistedHasMore(true);
    setApplicantsHasMore(true);
  }, [activeTab]);

  // Set initial hasMore based on response
  useEffect(() => {
    if (suggestedResponse?.data) {
      const pagination = suggestedResponse?.data?.pagination;
      if (pagination) {
        setSuggestedHasMore(pagination.current_page < pagination.total_pages);
      } else {
        setSuggestedHasMore((employees?.length || 0) >= 10);
      }
    }
  }, [suggestedResponse, employees]);

  useEffect(() => {
    if (jobDetailsResponse?.data) {
      const pagination = jobDetailsResponse?.data?.pagination;
      if (pagination) {
        setShortlistedHasMore(pagination.current_page < pagination.total_pages);
        setApplicantsHasMore(pagination.current_page < pagination.total_pages);
      } else {
        setShortlistedHasMore((invitedEmployees?.length || 0) >= 10);
        setApplicantsHasMore((applications?.length || 0) >= 10);
      }
    }
  }, [jobDetailsResponse, invitedEmployees, applications]);

  const handleLoadMoreSuggested = useCallback(async () => {
    if (!suggestedHasMore || isFetchingSuggested) return;

    const nextPage = suggestedPage + 1;
    try {
      const result = await fetchMoreSuggested({ job_id: jobId, page: nextPage, tab: 'suggested' }).unwrap();
      const newUsers =
        result?.data?.suggested_employees ||
        result?.data?.users ||
        [];

      if (newUsers.length > 0) {
        setExtraSuggested(prev => [...prev, ...newUsers]);
        setSuggestedPage(nextPage);

        const pagination = result?.data?.pagination;
        if (pagination) {
          setSuggestedHasMore(pagination.current_page < pagination.total_pages);
        } else {
          setSuggestedHasMore(newUsers.length >= 10);
        }
      } else {
        setSuggestedHasMore(false);
      }
    } catch (error) {
      console.log('Error loading more suggested:', error);
      setSuggestedHasMore(false);
    }
  }, [suggestedHasMore, isFetchingSuggested, suggestedPage, jobId, fetchMoreSuggested]);

  const handleLoadMoreShortlisted = useCallback(async () => {
    if (!shortlistedHasMore || isFetchingJobDetails) return;

    const nextPage = shortlistedPage + 1;
    try {
      const result = await fetchMoreJobDetails(jobId).unwrap();
      const newInvited = result?.data?.invited_users || [];
      const startIndex = shortlistedPage * 10;
      const newItems = newInvited.slice(startIndex, startIndex + 10);

      if (newItems.length > 0) {
        setExtraShortlisted(prev => [...prev, ...newItems]);
        setShortlistedPage(nextPage);
        setShortlistedHasMore(newInvited.length > startIndex + 10);
      } else {
        setShortlistedHasMore(false);
      }
    } catch (error) {
      console.log('Error loading more shortlisted:', error);
      setShortlistedHasMore(false);
    }
  }, [shortlistedHasMore, isFetchingJobDetails, shortlistedPage, jobId, fetchMoreJobDetails]);

  const handleLoadMoreApplicants = useCallback(async () => {
    if (!applicantsHasMore || isFetchingJobDetails) return;

    const nextPage = applicantsPage + 1;
    try {
      const result = await fetchMoreJobDetails(jobId).unwrap();
      const newApplications = result?.data?.applications || [];
      const startIndex = applicantsPage * 10;
      const newItems = newApplications.slice(startIndex, startIndex + 10);

      if (newItems.length > 0) {
        setExtraApplicants(prev => [...prev, ...newItems]);
        setApplicantsPage(nextPage);
        setApplicantsHasMore(newApplications.length > startIndex + 10);
      } else {
        setApplicantsHasMore(false);
      }
    } catch (error) {
      console.log('Error loading more applicants:', error);
      setApplicantsHasMore(false);
    }
  }, [applicantsHasMore, isFetchingJobDetails, applicantsPage, jobId, fetchMoreJobDetails]);

  // Combined data for each tab
  const displaySuggested = useMemo(() => {
    return [...(employees || []), ...extraSuggested].filter((item: any) => item && item._id);
  }, [employees, extraSuggested]);

  const displayShortlisted = useMemo(() => {
    const initial = invitedEmployees?.slice(0, 10) || [];
    return [...initial, ...extraShortlisted];
  }, [invitedEmployees, extraShortlisted]);

  const displayApplicants = useMemo(() => {
    const initial = applications?.slice(0, 10) || [];
    return [...initial, ...extraApplicants];
  }, [applications, extraApplicants]);

  const renderSalaryRange = () => {
    const cur = (jobInfo?.currency || 'AED').toUpperCase();
    const symbol = getCurrencySymbol(cur);
    const salaryText = getJobMonthlySalaryRangeText(jobInfo);

    if (!salaryText) return null;

    return (
      <View style={styles.salaryRow}>
        {cur === 'AED' ? (
          <Image source={IMAGES.currency} style={styles.currencyImage} />
        ) : (
          <Text style={styles.currencySymbol}>{symbol}</Text>
        )}
        <Text style={styles.jobSalary} numberOfLines={1}>
          {salaryText}
        </Text>
      </View>
    );
  };

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

  const handleEditJob = () => {
    if (!jobInfo) return;

    const rawRange = jobInfo?.monthly_salary_range;
    const rangeStr =
      rawRange === null || rawRange === undefined ? '' : String(rawRange).trim();

    const normalizedRangeStr = rangeStr
      // Normalize "2000 - 3000" => "2000-3000" for dropdown matching
      .replace(/\s*-\s*/g, '-')
      .replace(/\s*\+\s*/g, '+');

    // Dropdown values are expected to be the API "from-to" format (e.g. "2000-3000")
    // so we must avoid sending "from - to" with spaces, and also avoid "-" placeholders.
    const salaryValueFromRange =
      normalizedRangeStr && normalizedRangeStr !== '-' ? normalizedRangeStr : '';

    const fromNum = jobInfo?.monthly_salary_from !== null && jobInfo?.monthly_salary_from !== undefined
      ? Number(jobInfo?.monthly_salary_from)
      : NaN;
    const toNum = jobInfo?.monthly_salary_to !== null && jobInfo?.monthly_salary_to !== undefined
      ? Number(jobInfo?.monthly_salary_to)
      : NaN;

    const salaryValueFromFromTo =
      Number.isFinite(fromNum) && Number.isFinite(toNum)
        ? `${fromNum}-${toNum}`
        : Number.isFinite(fromNum) &&
          (jobInfo?.monthly_salary_to === null ||
            jobInfo?.monthly_salary_to === undefined ||
            jobInfo?.monthly_salary_to === '' ||
            String(jobInfo?.monthly_salary_to).trim() === '-')
          ? `${fromNum}+`
          : '';

    const salaryValue = salaryValueFromRange || salaryValueFromFromTo;

    const mapped = mapJobToFormState(jobInfo);

    dispatch(
      setJobFormState({
        job_id: jobInfo?._id,
        title: jobInfo?.title,
        describe: jobInfo?.description,
        job_sector: jobInfo?.department_id
          ? typeof jobInfo.department_id === 'string'
            ? {
              // API sometimes returns `department_id` as a string id.
              // Dropdown selection uses `value` and will resolve label from options.
              label: '',
              value: jobInfo.department_id,
            }
            : {
              label: jobInfo.department_id?.title ?? '',
              value:
                (jobInfo.department_id as any)?._id ??
                (jobInfo.department_id as any)?.id,
            }
          : (typeof jobInfo?.job_sector === 'string'
            ? { label: jobInfo.job_sector, value: jobInfo.job_sector }
            : jobInfo?.job_sector),
        contract_type: { label: jobInfo?.contract_type, value: jobInfo?.contract_type },
        area: { label: jobInfo?.address || jobInfo?.area || '', value: jobInfo?.address || jobInfo?.area || '' },
        salary: {
          label: salaryValue,
          value: salaryValue,
        },
        currency: { label: jobInfo?.currency, value: jobInfo?.currency },
        position: { label: jobInfo?.no_positions?.toString(), value: jobInfo?.no_positions?.toString() },
        duration: { label: jobInfo?.duration, value: jobInfo?.duration },
        expiry_date: jobInfo?.expiry_date,
        startDate: { label: jobInfo?.start_date, value: jobInfo?.start_date },
        skillId: mapped.skillId,
        jobSkills: mapped.jobSkills,
        essential_benefits: mapped.essential_benefits,
        requirements: jobInfo?.requirements || [],
        invite_users: jobInfo?.invited_users?.map((u: any) => u?._id) || [],
        canApply: jobInfo?.people_anywhere,
        education: mapped.education,
        experience: mapped.experience,
        certification: mapped.certification,
        languages: mapped.languages,
        other_requirements: mapped.other_requirements,
        editMode: true,
      }),
    );
    dispatch(setCoPostJobSteps(0));
    navigateTo(SCREENS.PostJob);
  };

  const handleCloseJob = () => {
    Alert.alert(
      t('Close Job'),
      t('Are you sure you want to close this job?'),
      [
        { text: t('Cancel'), style: 'cancel' },
        {
          text: t('Close'),
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await closeJob({ job_id: jobId }).unwrap();
              if (res?.status) {
                successToast(res?.message || t('Job closed successfully'));
                navigateTo(SCREENS.CoJobSummary, {
                  initialTab: 'Closed Jobs',
                  fromSuggestedEmployee: true,
                });
              } else {
                errorToast(res?.message || t('Failed to close job'));
              }
            } catch (error: any) {
              errorToast(error?.data?.message || t('Something went wrong'));
            }
          },
        },
      ],
    );
  };

  const renderShortlistedEmployee = (item: any) => {
    console.log("🔥 ~ renderShortlistedEmployee ~ item:", item?.status);
    const user = item?.user_id || item;
    if (!user || !user?._id) return null;

    const experience = user?.years_of_experience || 0;
    const tracking = item?.tracking || [];
    const languages = user?.languages?.map((l: any) => l?.name)?.filter(Boolean);

    return (
      <View key={user?._id} style={styles.shortlistedCard}>
        <View style={styles.shortlistedContent}>
          <View style={styles.shortlistedLeft}>
            <TouchableOpacity
              style={styles.shortlistedHeader}
              onPress={() => handleNavigateToProfile(user)}
              activeOpacity={0.7}
            >
              {hasValidImage(user?.picture) ? (
                <CustomImage
                  uri={user?.picture || ''}
                  containerStyle={styles.shortlistedAvatar}
                  imageStyle={styles.shortlistedAvatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.shortlistedAvatar, styles.avatarFallback]}>
                  <Text style={styles.avatarInitial}>{getInitials(user?.name)}</Text>
                </View>
              )}
              <View style={styles.shortlistedInfo}>
                <Text style={styles.shortlistedEmployeeName}>
                  {user?.name || 'N/A'}
                </Text>
                {!!user?.desired_job_title && (
                  <Text style={styles.shortlistedEmployeeRole}>
                    {user.desired_job_title || 'N/A'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <Text style={styles.shortlistedExp}>
              {experience !== ""
                ? `${experience}`
                : t('No Experience')}
            </Text>

            {languages.length > 0 && (
              <View style={styles.languageRow}>
                <Image source={IMAGES.globe} style={styles.globeIcon} />
                {languages.slice(0, 3).map(
                  (language: string, index: number, arr: string[]) => (
                    <React.Fragment key={index}>
                      <Text style={styles.shortlistedLanguage}>{language}</Text>
                      {index !== arr.length - 1 && (
                        <Text style={styles.shortlistedLanguageSeparator}> | </Text>
                      )}
                    </React.Fragment>
                  ),
                )}
              </View>
            )}

            {(['invited', 'attempted'].includes(String(item?.status || '').trim().toLowerCase())) && (
              <TouchableOpacity
                style={[styles.resendButton, !!resendingUserId && resendingUserId !== String(user?._id) && { opacity: 0.6 }]}
                onPress={() => handleResendInvite(user)}
                disabled={resendingUserId === String(user?._id)}>
                <Text style={styles.resendButtonText}>
                  {resendingUserId === String(user?._id) ? t('Resending...') : t('Resend Invite')}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.shortlistedActions}>
              {String(item?.status || '').trim().toLowerCase() === 'completed' && (
                <TouchableOpacity
                  style={styles.viewAiButton}
                  onPress={() =>
                    navigateTo(SCREENS.InterviewStatus, {
                      jobData: jobInfo,
                      candidateData: user,
                      inviteData: item,
                    })
                  }>
                  <Text style={styles.viewAiButtonText}>{t('AI Interview')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.assessmentButton, item?.tracking[3]?.assessment_link === null && { opacity: 0.5 }]}
                disabled={item?.tracking[3]?.assessment_link === null}
                onPress={() => {
                  Linking.openURL(item?.tracking[3]?.assessment_link)
                }
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
    if (!item || !item._id) return null;

    const experience =
      item?.experience ||
      item?.years_of_experience ||
      item?.total_experience ||
      0;

    const isInvited = invitedEmployees?.some((invited: any) =>
      (invited?.user_id?._id === item?._id) ||
      (invited?.user_id === item?._id) ||
      (invited === item?._id)
    );

    const isSelected = selectedUserIds.includes(item?._id);
    const languages = item?.languages || [];

    return (
      <Pressable
        key={item._id}
        onPress={() => !isClosedJob && !isInvited && toggleUserSelection(item?._id)}
        style={[
          styles.employeeCard,
          isSelected && styles.selectedEmployeeCard,
          isInvited && styles.invitedCard,
        ]}>

        {/* ── Top row: avatar + info + invite button ── */}
        <View style={styles.employeeTopRow}>
          <TouchableOpacity onPress={() => handleNavigateToProfile(item)} activeOpacity={0.7}>
            {hasValidImage(item?.picture) ? (
              <CustomImage
                uri={item?.picture}
                containerStyle={styles.employeeAvatar}
                imageStyle={styles.employeeAvatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.employeeAvatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>{getInitials(item?.name)}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.employeeInfo}
            onPress={() => handleNavigateToProfile(item)}
            activeOpacity={0.7}>
            <Text style={styles.employeeName}>{item?.name || 'N/A'}</Text>
            <Text style={styles.employeeRole}>{item?.department_id?.title || 'N/A'}</Text>
            <Text style={styles.employeeExperience}>{`${experience || 0}`}</Text>
          </TouchableOpacity>

          {isInvited || isSelected ? (
            <View style={styles.invitedIconContainer}>
              <Image source={IMAGES.checked} style={styles.invitedIcon} />
            </View>
          ) : (
            <Pressable
              onPress={event => {
                event.stopPropagation();
                if (isClosedJob) return;
                setInviteAllSelected(false);
                toggleUserSelection(item?._id);
              }}
              style={[
                styles.inviteButton,
                isSelected && styles.inviteButtonSelected,
                isClosedJob && styles.disabledInviteButton,
              ]}>
              <Text
                style={[
                  styles.inviteButtonText,
                  isSelected && styles.inviteButtonTextSelected,
                  isClosedJob && styles.disabledInviteButtonText,
                ]}>
                {t('Invite')}
              </Text>
            </Pressable>
          )}
        </View>

        {/* ── Languages row — full width below ── */}
        {languages.length > 0 && (
          <View style={styles.suggestedLanguageContainer}>
            <View style={styles.suggestedLanguageRow}>
              {languages.slice(0, 3).map((lang: any, index: number) => (
                <View key={index} style={styles.suggestedLanguageChip}>
                  <Text style={styles.suggestedLanguageName}>{lang?.name}</Text>
                </View>
              ))}
            </View>
          </View>
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
        onBackPress={() => {
          if (fromPostJob) {
            resetNavigation(SCREENS.CoTabNavigator, SCREENS.CoJob);
          } else {
            goBack();
          }
        }}
      />
      {showSkeleton ? (
        <SuggestedEmployeeSkeleton />
      ) : (
        <>
          <FlatList
            data={[1]}
            keyExtractor={() => 'main'}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (activeTab === 'suggested' && suggestedHasMore && !isFetchingSuggested) {
                handleLoadMoreSuggested();
              } else if (activeTab === 'shortlisted' && shortlistedHasMore && !isFetchingJobDetails) {
                handleLoadMoreShortlisted();
              } else if (activeTab === 'applicants' && applicantsHasMore && !isFetchingJobDetails) {
                handleLoadMoreApplicants();
              }
            }}
            onEndReachedThreshold={0.5}
            renderItem={() => (
              <>
                <View style={styles.jobCard}>
                  <View style={styles.jobCardRow}>
                    <Pressable
                      onPress={() => {
                        navigateTo(SCREENS.ViewCompanyProfile, { companyId: jobInfo?.company_id?._id })
                      }}
                    >
                      {jobInfo?.company_id?.logo ?
                        <CustomImage
                          uri={jobInfo?.company_id?.logo}
                          containerStyle={styles.companyLogo}
                          imageStyle={styles.companyLogo}
                          resizeMode="cover"
                        />
                        : <View style={styles.companyLogo}>
                          <BaseText style={styles.companyLogoText}>
                            {jobInfo?.title?.[0]?.toUpperCase() ||
                              jobInfo?.company_name?.[0]?.toUpperCase() ||
                              'N/A'}
                          </BaseText>
                        </View>}
                    </Pressable>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.jobCardInfo}
                      onPress={() => {
                        const id = jobId || jobInfo?._id;
                        if (!id) return;
                        console.log("🔥 ~ SuggestedEmployeeScreen ~ id:", id)
                        navigateTo(SCREENS.JobPreview, { jobId: id });
                      }}
                    >
                      <Text style={styles.jobTitle}>{jobInfo?.title || ''}</Text>
                      {(jobLocation || contractTypeLabel) && (
                        <Text style={styles.jobLocation}>
                          {jobLocation}
                          {contractTypeLabel ? ` - ${contractTypeLabel}` : ''}
                        </Text>
                      )}
                      {renderSalaryRange()}
                    </TouchableOpacity>
                  </View>
                  {isClosedJob && (
                    <View style={styles.closedBadge}>
                      <Text style={styles.closedBadgeText}>{t('Closed')}</Text>
                    </View>
                  )}

                  {!!jobId && !isClosedJob && (
                    <View style={styles.jobActionsRow}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.editBtn]}
                        onPress={handleEditJob}>
                        <Image
                          source={IMAGES.edit}
                          style={styles.actionIcon}
                          tintColor={colors.white}
                        />
                        <Text style={styles.actionBtnText}>{t('Edit Job')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, styles.closeBtn]}
                        onPress={handleCloseJob}>
                        <Image
                          source={IMAGES.close}
                          style={[styles.actionIcon, styles.closeIcon]}
                          tintColor={colors.white}
                        />
                        <Text style={styles.actionBtnText}>{t('Close Job')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
                        {`${t('For profiles above')} ${ai_data?.match_threshold || 0}% ${t('match score')}`}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Tabs */}
                <ScrollView
                  ref={tabScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[styles.tabContainer, styles.tabScroll]}
                  style={styles.tabScrollView}>
                  <View
                    onLayout={(e) => {
                      tabLayouts.current.suggested = e.nativeEvent.layout.x;
                    }}
                    collapsable={false}>
                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        activeTab === 'suggested' && styles.activeTabButton,
                        activeTab === 'suggested' && {
                          backgroundColor: colors._0B3970,
                          borderColor: colors._0B3970,
                        },
                      ]}
                      onPress={() => selectTab('suggested')}>
                      <Image
                        source={IMAGES.people}
                        style={styles.tabIcon}
                        tintColor={activeTab === 'suggested' ? colors.white : colors._0B3970}
                      />
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'suggested' && styles.activeTabText,
                          activeTab === 'suggested' && { color: colors.white },
                        ]}
                        numberOfLines={1}>
                        {t('Suggested List')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    onLayout={(e) => {
                      tabLayouts.current.shortlisted = e.nativeEvent.layout.x;
                    }}
                    collapsable={false}>
                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        activeTab === 'shortlisted' && styles.activeTabButton,
                        activeTab === 'shortlisted' && {
                          backgroundColor: colors._0B3970,
                          borderColor: colors._0B3970,
                        },
                      ]}
                      onPress={() => selectTab('shortlisted')}>
                      <View style={styles.starIconContainer}>
                        <Image
                          source={IMAGES.star1}
                          style={[
                            styles.starSmall,
                            {
                              tintColor:
                                activeTab === 'shortlisted' ? '#8FDBF5' : '#0B3970',
                            },
                          ]}
                        />
                        <Image
                          source={IMAGES.star2}
                          style={[
                            styles.starLarge,
                            {
                              tintColor:
                                activeTab === 'shortlisted' ? '#D4C6F9' : '#0B3970',
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'shortlisted' && { color: colors.white },
                        ]}
                        numberOfLines={1}>
                        {t('AI Shortlisted')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    onLayout={(e) => {
                      tabLayouts.current.applicants = e.nativeEvent.layout.x;
                    }}
                    collapsable={false}>
                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        activeTab === 'applicants' && styles.activeTabButton,
                        activeTab === 'applicants' && {
                          backgroundColor: colors._0B3970,
                          borderColor: colors._0B3970,
                        },
                      ]}
                      onPress={() => selectTab('applicants')}>
                      <Image
                        source={IMAGES.people} // Using same icon as Suggested for now
                        style={styles.tabIcon}
                        tintColor={activeTab === 'applicants' ? colors.white : colors._0B3970}
                      />
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'applicants' && { color: colors.white },
                        ]}
                        numberOfLines={1}>
                        {t('Applicants')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                {activeTab === 'suggested' ? (
                  <>

                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>{t('Suggested Employee')}</Text>
                      <TouchableOpacity
                        style={[
                          styles.inviteAllButton,
                          inviteAllSelected && styles.inviteAllButtonSelected,
                          (isClosedJob || allSuggestedInvited || !displaySuggested?.length) && { opacity: 0.5 },
                        ]}
                        disabled={isClosedJob || allSuggestedInvited || !displaySuggested?.length}
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

                    {displaySuggested && displaySuggested.length > 0 ? (
                      <>
                        {displaySuggested.map((item: any, index: number) => renderEmployee(item))}
                        {isFetchingSuggested && (
                          <ActivityIndicator
                            size="large"
                            color={colors._0B3970}
                            style={{ marginVertical: hp(20) }}
                          />
                        )}
                      </>
                    ) : (
                      <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>
                          {t('No suggested candidates found')}
                        </Text>
                        <Text style={styles.emptyMessage}>
                          {t(
                            'Once candidates start matching your job, they will appear here.',
                          )}
                        </Text>
                      </View>
                    )}
                  </>
                ) : activeTab === 'shortlisted' ? (
                  <>
                    {displayShortlisted && displayShortlisted.length > 0 ? (
                      <>
                        {displayShortlisted.map((item: any) => (
                          <React.Fragment key={item.user_id?._id || item._id || ''}>
                            {renderShortlistedEmployee(item)}
                          </React.Fragment>
                        ))}
                        {isFetchingJobDetails && (
                          <ActivityIndicator
                            size="large"
                            color={colors._0B3970}
                            style={{ marginVertical: hp(20) }}
                          />
                        )}
                      </>
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
                ) : (
                  <>
                    {displayApplicants && displayApplicants.length > 0 ? (
                      <>
                        {displayApplicants.map((item: any) => {
                          const user = item?.user_id || item;
                          const experience =
                            user?.experience ||
                            user?.years_of_experience ||
                            user?.total_experience ||
                            0;
                          const languages =
                            user?.languages?.map((l: any) => l)?.filter(Boolean) || [];
                          const languageNames = languages
                            .map((l: any) => l?.name)
                            .filter(Boolean);

                          return (
                            <Pressable
                              key={user?._id || item?._id}
                              onPress={() => handleNavigateToProfile(user)}
                              style={styles.employeeCard}>
                              <View style={styles.employeeTopRow}>
                                <TouchableOpacity
                                  onPress={() => handleNavigateToProfile(user)}
                                  activeOpacity={0.7}>
                                  {hasValidImage(user?.picture) ? (
                                    <CustomImage
                                      uri={user?.picture}
                                      containerStyle={styles.employeeAvatar}
                                      imageStyle={styles.employeeAvatar}
                                      resizeMode="cover"
                                    />
                                  ) : (
                                    <View style={[styles.employeeAvatar, styles.avatarFallback]}>
                                      <Text style={styles.avatarInitial}>{getInitials(user?.name)}</Text>
                                    </View>
                                  )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.employeeInfo}
                                  onPress={() => handleNavigateToProfile(user)}
                                  activeOpacity={0.7}>
                                  <Text style={styles.employeeName} numberOfLines={1}>
                                    {user?.name || 'N/A'}
                                  </Text>
                                  {!!user?.desired_job_title && (
                                    <Text style={styles.employeeRole} numberOfLines={1}>
                                      {user.desired_job_title}
                                    </Text>
                                  )}
                                  <Text style={styles.employeeExperience} numberOfLines={1}>
                                    {`${experience || 0}`}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              {/* Languages row (same as Suggested cards) */}
                              {languageNames.length > 0 && (
                                <View style={styles.suggestedLanguageContainer}>
                                  <View style={styles.suggestedLanguageRow}>
                                    {languageNames.slice(0, 3).map((name: string, index: number) => (
                                      <View key={`${name}-${index}`} style={styles.suggestedLanguageChip}>
                                        <Text style={styles.suggestedLanguageName}>{name}</Text>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              )}
                            </Pressable>
                          );
                        })}
                        {isFetchingJobDetails && (
                          <ActivityIndicator
                            size="large"
                            color={colors._0B3970}
                            style={{ marginVertical: hp(20) }}
                          />
                        )}
                      </>
                    ) : (
                      <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>
                          {t('No applicants yet')}
                        </Text>
                        <Text style={styles.emptyMessage}>
                          {t('Candidates who apply will appear here.')}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          />
          {activeTab === 'suggested' && (
            <View style={styles.ctaWrapper}>
              <GradientButton
                type="Company"
                style={styles.ctaButton}
                onPress={handleBulkInvite}
                disabled={isClosedJob || allSuggestedInvited || !displaySuggested?.length}
                title={t('Invite for AI Interview')}
              />
            </View>
          )}
        </>
      )}
      <BottomModal
        visible={showResendSuccessModal}
        backgroundColor={colors.white}
        onClose={() => { }}>
        <View style={styles.modalIconWrapper}>
          <LottieView
            source={animation.success_check}
            autoPlay
            loop={false}
            style={styles.modalCheckIcon}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.modalTitle}>
          {t('AI interviews successfully sent')}
        </Text>
        <Text style={styles.modalSubtitle}>
          {t('Candidates will be automatically analyzed and scored')}
        </Text>
        <GradientButton
          style={[styles.modalPrimaryButton, styles.modalButtonSpacing]}
          type="Company"
          title={t('View pending interviews')}
          onPress={() => {
            setShowResendSuccessModal(false);
            selectTab('shortlisted');
          }}
        />
        <GradientButton
          style={[styles.modalPrimaryButton, styles.modalButtonSpacing]}
          type="Company"
          title={t('Back to dashboard')}
          onPress={() => {
            setShowResendSuccessModal(false);
            navigationRef.reset({
              index: 0,
              routes: [{ name: SCREENS.CoTabNavigator }],
            });
          }}
        />
      </BottomModal>
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
    // Extra bottom space so list ends above the fixed CTA button
    paddingBottom: hp(120),
    gap: hp(16),
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
    marginBottom: hp(16),
  },
  jobCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(56),
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  companyLogoText: {
    ...commonFontStyle(600, 16, colors._0B3970),
  },
  jobCardInfo: {
    flex: 1,
    marginLeft: wp(12),
  },
  jobActionsRow: {
    flexDirection: 'row',
    marginTop: hp(16),
    gap: wp(10),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: hp(12),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(10),
    borderRadius: wp(12),
    gap: wp(8),
  },
  editBtn: {
    backgroundColor: colors._0B3970,
  },
  closeBtn: {
    backgroundColor: '#DC2626',
  },
  actionIcon: {
    width: wp(14),
    height: wp(14),
    resizeMode: 'contain',
  },
  closeIcon: {
    width: wp(10),
    height: wp(10),
  },
  actionBtnText: {
    ...commonFontStyle(600, 13, colors.white),
  },
  closeBtnText: {
    ...commonFontStyle(600, 13, '#DC2626'),
  },
  closedBadge: {
    alignSelf: 'flex-start',
    marginTop: hp(12),
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    borderRadius: wp(20),
    backgroundColor: '#ED494E',
  },
  closedBadgeText: {
    ...commonFontStyle(600, 12, colors.white),
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(8),
  },
  currencyImage: {
    width: wp(14),
    height: hp(14),
    resizeMode: 'contain',
    marginRight: wp(4),
    tintColor: colors._0B3970,
  },
  currencySymbol: {
    ...commonFontStyle(700, 14, colors._0B3970),
    marginRight: wp(2),
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
    flexShrink: 1,
  },
  analyticsCard: {
    backgroundColor: '#072F61',
    borderRadius: wp(18),
    paddingVertical: hp(18),
    paddingHorizontal: wp(20),
    gap: hp(18),
    marginBottom: hp(16),
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
    marginBottom: hp(16),
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
    borderWidth: 1,
    borderColor: '#E2E6F0',
    borderRadius: wp(18),
    paddingVertical: hp(14),
    paddingHorizontal: wp(14),
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: hp(12),
  },
  employeeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedEmployeeCard: {
    borderColor: colors._0B3970,
    backgroundColor: '#EEF4FF',
  },
  employeeAvatar: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(60) / 2,
    overflow: 'hidden',
  },
  employeeInfo: {
    flex: 1,
    marginLeft: wp(12),
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
  disabledInviteButton: {
    backgroundColor: '#D3D3D3',
  },
  disabledInviteButtonText: {
    color: colors.white,
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
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    paddingBottom: hp(25),
    backgroundColor: colors.white,
  },
  ctaButton: {
    borderRadius: wp(22),
    marginBottom: 0,
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
  tabScrollView: {
    marginBottom: hp(16),
  },
  tabScroll: {
    flexGrow: 0,
    paddingRight: wp(20),
  },
  tabContainer: {
    flexDirection: 'row',
    gap: wp(10),
    paddingHorizontal: wp(2),
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Fix height so all three tabs match visually
    height: hp(40),
    paddingVertical: 0,
    paddingHorizontal: wp(16),
    backgroundColor: '#F2F2F2',
    borderRadius: wp(50),
    gap: wp(6),
    borderWidth: 1,
    borderColor: '#F2F2F2',
    minWidth: wp(120),
  },
  activeTabButton: {
    backgroundColor: '#EBEBEB',
  },
  tabIcon: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
    marginLeft: wp(4), // Add a bit of margin to the icon itself on the left?
    // "space around icon on left side" might mean it's too close to the edge?
  },
  tabText: {
    ...commonFontStyle(600, 12, '#939393'), // Reduced from 14
    textAlign: 'center',
    flexShrink: 1,
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
  },
  shortlistedContent: {
    flexDirection: 'row',
  },
  shortlistedLeft: {
    flex: 1,
    marginRight: wp(8),
    paddingTop: hp(10),
    paddingBottom: hp(14),
  },
  shortlistedHeader: {
    flexDirection: 'row',
    marginBottom: hp(10), // Slightly reduced
    alignItems: 'center',
  },
  shortlistedAvatar: {
    width: wp(51),
    height: wp(51),
    borderRadius: wp(56) / 2,
    overflow: 'hidden',
    marginRight: wp(10),
  },
  avatarFallback: {
    backgroundColor: colors._0B3970,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...commonFontStyle(600, 22, '#fff'),
  },
  shortlistedInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: hp(2),
  },
  shortlistedEmployeeName: {
    ...commonFontStyle(700, 16, colors._0B3970),
  },
  shortlistedEmployeeRole: {
    ...commonFontStyle(400, 14, colors.black),
  },
  shortlistedExp: {
    ...commonFontStyle(400, 15, colors._4A4A4A),
    marginTop: hp(2),
    marginBottom: hp(16),
  },
  shortlistedActions: {
    flexDirection: 'row',
    gap: wp(8),
    marginTop: hp(8),
  },
  viewAiButton: {
    backgroundColor: '#341A95',
    borderRadius: wp(24),
    paddingVertical: hp(10),
    paddingHorizontal: wp(6), // Reduced horizontal padding
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
    paddingVertical: hp(10),
    paddingHorizontal: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  assessmentButtonText: {
    ...commonFontStyle(600, 11, colors.white),
    textAlign: 'center',
  },
  resendButton: {
    marginTop: hp(8),
    alignSelf: 'flex-start',
    backgroundColor: colors._0B3970,
    borderRadius: wp(20),
    paddingVertical: hp(7),
    paddingHorizontal: wp(14),
  },
  resendButtonText: {
    ...commonFontStyle(600, 12, colors.white),
  },
  timelineContainer: {
    left: wp(16),
    width: wp(100),
    borderLeftWidth: 2,
    borderLeftColor: '#D9D9D9',
    paddingLeft: wp(14),
    paddingVertical: hp(2),
    justifyContent: 'space-between', // Distribute items evenly
  },
  timelineItem: {
    marginBottom: hp(6),
  },
  timelineIndicator: {
    position: 'absolute',
    left: wp(-24),
    top: hp(11), // Align with timelineTitle
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(18),
    height: wp(18), // Use wp for height to keep circle
    backgroundColor: '#F0F8FF',
  },
  timelineIcon: {
    width: wp(16), // Slightly smaller icons
    height: wp(16),
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
    width: wp(11),
    height: wp(11),
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  starLarge: {
    width: wp(15),
    height: wp(15),
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  loadMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(14),
    marginTop: hp(10),
    marginBottom: hp(10),
    borderRadius: wp(12),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors._0B3970,
  },
  loadMoreText: {
    ...commonFontStyle(600, 14, colors._0B3970),
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    flexWrap: 'wrap',
  },
  shortlistedLanguage: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
  },
  shortlistedLanguageSeparator: {
    ...commonFontStyle(400, 10, colors.black),
  },
  globeIcon: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
  },
  suggestedDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  suggestedDotWrapper: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  suggestedDotLabel: {
    position: 'absolute',
    top: 28,
    ...commonFontStyle(500, 9, colors._0B3970),
    textAlign: 'center',
    width: 70,
    alignSelf: 'center',
  },
  suggestedLanguageContainer: {
    marginTop: hp(8),
  },
  suggestedLanguageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(6),
  },
  suggestedLanguageChip: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(5),
    borderRadius: wp(20),
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0D7C8',
  },
  suggestedLanguageName: {
    ...commonFontStyle(400, 13, colors._0B3970),
  },
  modalIconWrapper: {
    width: wp(90),
    height: wp(90),
    alignSelf: 'center',
    borderRadius: wp(45),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._0B3970,
    overflow: 'hidden',
  },
  modalCheckIcon: {
    width: wp(90),
    height: wp(90),
  },
  modalTitle: {
    textAlign: 'center',
    marginVertical: hp(16),
    ...commonFontStyle(600, 25, colors.black),
  },
  modalSubtitle: {
    textAlign: 'center',
    ...commonFontStyle(400, 18, colors._6B6B6B),
  },
  modalPrimaryButton: {
    borderRadius: wp(25),
  },
  modalButtonSpacing: {
    marginTop: hp(20),
  },
});
