import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BackHeader,
  GradientButton,
  LinearContainer,
  ShareModal,
} from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { IMAGES } from '../../../assets/Images';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import {
  useAddShortlistEmployeeMutation,
  useGetCompanyJobDetailsQuery,
  useUnshortlistEmployeeMutation,
} from '../../../api/dashboardApi';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import {
  errorToast,
  getPostedTime,
  navigateTo,
  successToast,
} from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useDispatch } from 'react-redux';
import { setJobFormState } from '../../../features/companySlice';
import moment from 'moment';
import BaseText from '../../../component/common/BaseText';
import CustomImage from '../../../component/common/CustomImage';
import {
  Briefcase,
  Wallet,
  CalendarDays,
  Timer,
  Building2,
  Users,
} from 'lucide-react-native';

const CoJobDetails = () => {
  const { t } = useTranslation();
  const { params } = useRoute<any>();
  const dispatch = useDispatch();
  const job_id = params?._id as any;
  const [isShareModalVisible, setIsShareModalVisible] =
    useState<boolean>(false);
  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number>(3);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const metricOptions = [
    { key: 'job_view', label: 'Total', subLabel: 'Job View', icon: IMAGES.jobview },
    { key: 'applied', label: 'Total Job', subLabel: 'Applied', icon: IMAGES.appliedjob },
    { key: 'suggested', label: 'Suggested', subLabel: 'Candidate', icon: IMAGES.suggested_candidate },
    { key: 'shortlisted', label: 'Total', subLabel: 'Shortlisted', icon: IMAGES.shortlisted },
  ];
  const { data, refetch, isLoading } = useGetCompanyJobDetailsQuery(job_id);
  const [addShortListEmployee] = useAddShortlistEmployeeMutation({});
  const [removeShortListEmployee] = useUnshortlistEmployeeMutation({});
  const jobDetail = data?.data;
  console.log("🔥 ~ CoJobDetails ~ jobDetail:", jobDetail);

  // Capitalize first letter of posted time
  const postedTime = getPostedTime(jobDetail?.createdAt);
  const capitalizedPostedTime = postedTime ? postedTime.charAt(0).toUpperCase() + postedTime.slice(1) : '';

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const JobDetailsArr = [
    {
      key: 'Job Type',
      value: jobDetail?.contract_type,
      icon: <Briefcase size={18} color={colors._0B3970} />,
    },
    {
      key: 'Salary',
      value: `${jobDetail?.monthly_salary_from} - ${jobDetail?.monthly_salary_to}`,
      icon: <Wallet size={18} color={colors._0B3970} />,
    },
    {
      key: 'Expiry Date',
      value:
        jobDetail?.expiry_date !== null
          ? moment(jobDetail?.expiry_date).format('D MMMM')
          : 'Open until filled',
      icon: <CalendarDays size={18} color={colors._0B3970} />,
    },
    {
      key: 'Duration',
      value: jobDetail?.duration,
      icon: <Timer size={18} color={colors._0B3970} />,
    },
    {
      key: 'Department',
      value: jobDetail?.job_sector,
      icon: <Building2 size={18} color={colors._0B3970} />,
    },
    {
      key: 'Vacancy',
      value: jobDetail?.no_positions,
      icon: <Users size={18} color={colors._0B3970} />,
    },
  ];

  const keyValueArray = Object.entries(JobDetailsArr);

  const handleShortListEmployee = async (item: any) => {
    const params = {
      applicant_id: item?.user_id?._id,
      job_id: job_id,
    };
    try {
      const res = await addShortListEmployee(params).unwrap();

      if (res?.status === true) {
        successToast(res?.message);
        refetch();
      } else {
        errorToast(res?.message);
      }
    } catch (error) {
      console.error('Error shortlisting employee:', error);
    }
  };

  const handleRemoveShortListEmployee = async (item: any) => {
    const params = {
      applicant_id: item?.user_id?._id,
      job_id: job_id,
    };
    try {
      const res = await removeShortListEmployee(params).unwrap();

      if (res?.status === true) {
        successToast(res?.message);
        refetch();
      } else {
        errorToast(res?.message);
      }
    } catch (error) {
      console.error('Error shortlisting employee:', error);
    }
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: hp(120) }}>
            <BackHeader
              type="company"
              isRight={false}
              title="Jobs Detail"
              titleStyle={styles.title}
              containerStyle={styles.header}
            />

            <View style={styles.bodyContainer}>
              {/* Job Posting Card */}
              <View style={styles.jobPostCard}>
                <View style={styles.jobPostHeader}>
                  <View style={styles.companyLogoContainer}>
                    <CustomImage
                      uri={jobDetail?.company_id?.logo}
                      source={IMAGES.dummy_cover}
                      containerStyle={styles.companyLogo}
                      imageStyle={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.jobPostHeaderRight}>
                    <Text style={styles.companyName}>
                      {jobDetail?.company_id?.company_name || 'N/A'}
                    </Text>
                    <Text style={styles.companyLocation}>
                      {jobDetail?.address || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.jobPostActions}>
                    <TouchableOpacity
                      onPress={() => setIsShareModalVisible(true)}
                      style={styles.actionIconButton}>
                      <Image
                        source={IMAGES.share}
                        resizeMode="contain"
                        style={styles.actionIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setIsFavorite(!isFavorite)}
                      style={styles.actionIconButton}>
                      <Image
                        source={isFavorite ? IMAGES.like : IMAGES.hart}
                        resizeMode="contain"
                        style={styles.actionIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.jobTitle}>{jobDetail?.title || 'N/A'}</Text>

                <Text numberOfLines={3} style={styles.jobDescriptionSnippet}>
                  {jobDetail?.description || 'N/A'}
                </Text>

                <View style={styles.jobPostFooter}>
                  <View style={styles.applicantCountContainer}>
                    {jobDetail?.applicants?.slice(0, 3).map((item: any, index: number) => (
                      <View key={index} style={[styles.applicantAvatar, { marginLeft: index > 0 ? wp(-8) : 0 }]}>
                        <CustomImage
                          uri={item?.user_id?.picture}
                          source={IMAGES.avatar}
                          containerStyle={styles.applicantAvatarImage}
                          imageStyle={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                    <Text style={styles.applicantCountText}>
                      +{jobDetail?.applicants?.length || 0} Applicants
                    </Text>
                  </View>
                  <View style={styles.jobTypeTag}>
                    <Text style={styles.jobTypeText}>
                      {jobDetail?.job_type || 'Full Time'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Metric Cards */}
              <View style={styles.metricCardsContainer}>
                {metricOptions.map((option, index) => {
                  const isSelected = selectedMetricIndex === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => setSelectedMetricIndex(index)}
                      style={[
                        styles.metricCard,
                        isSelected && styles.metricCardHighlighted,
                      ]}>
                      <Image
                        source={option.icon}
                        resizeMode="contain"
                        style={[
                          styles.metricIcon,
                          { tintColor: isSelected ? colors.white : '#CDA953' }
                        ]}
                      />
                      <View style={styles.metricTextContainer}>
                        <Text
                          style={
                            isSelected
                              ? styles.metricLabelBoldWhite
                              : styles.metricLabelBold
                          }>
                          {option.label}
                        </Text>
                        <Text
                          style={
                            isSelected
                              ? styles.metricLabelBoldWhite
                              : styles.metricLabelBold
                          }>
                          {option.subLabel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Candidate List */}
              <View style={styles.candidateListContainer}>
                {selectedMetricIndex === 0 && (
                  // Total Job View - Show empty or placeholder
                  <View style={styles.emptyState}>
                    <BaseText>No job viewers</BaseText>
                  </View>
                )}

                {selectedMetricIndex === 1 && (
                  // Total Job Applied - Show applicants
                  jobDetail?.applicants?.length > 0 ? (
                    jobDetail.applicants.map((item: any, index: number) => {
                      if (item === null) return null;
                      return (
                        <View key={index} style={styles.candidateCard}>
                          <CustomImage
                            uri={item?.user_id?.picture}
                            source={IMAGES.avatar}
                            containerStyle={styles.candidateAvatar}
                            imageStyle={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                          <View style={styles.candidateInfo}>
                            <Text style={styles.candidateName}>
                              {item?.user_id?.name || 'N/A'}
                            </Text>
                            <Text style={styles.candidateRole}>
                              {item?.user_id?.responsibility || 'N/A'}
                            </Text>
                            <Text style={styles.candidateExperience}>
                              {item?.user_id?.years_of_experience || item?.user_id?.experience || '0'}y Experience
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.inviteButton}
                            onPress={() => {
                              // TODO: Handle invite action
                              console.log('Invite pressed for:', item?.user_id?.name);
                            }}>
                            <Text style={styles.inviteButtonText}>Invite</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.emptyState}>
                      <BaseText>No applicants</BaseText>
                    </View>
                  )
                )}

                {selectedMetricIndex === 2 && (
                  // Suggested Candidate - Show suggested matches (from lines 381-382 area)
                  jobDetail?.suggested_matches?.length > 0 ? (
                    jobDetail.suggested_matches.map((item: any, index: number) => {
                      if (item === null) return null;
                      return (
                        <View key={index} style={styles.candidateCard}>
                          <CustomImage
                            resizeMode="cover"
                            source={IMAGES.avatar}
                            containerStyle={styles.candidateAvatar}
                            uri={item?.user_id?.picture || item?.picture}
                            imageStyle={{ width: '100%', height: '100%' }}
                          />
                          <View style={styles.candidateInfo}>
                            <Text style={styles.candidateName}>
                              {item?.user_id?.name || item?.name || 'N/A'}
                            </Text>
                            <Text style={styles.candidateRole}>
                              {item?.user_id?.responsibility || item?.responsibility || 'N/A'}
                            </Text>
                            <Text style={styles.candidateExperience}>
                              {item?.user_id?.years_of_experience || item?.years_of_experience || item?.experience || '0'}y Experience
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.inviteButton}
                            onPress={() => {
                              // TODO: Handle invite action
                              console.log('Invite pressed for:', item?.user_id?.name || item?.name);
                            }}>
                            <Text style={styles.inviteButtonText}>Invite</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.emptyState}>
                      <BaseText>No suggested candidates</BaseText>
                    </View>
                  )
                )}

                {selectedMetricIndex === 3 && (
                  // Total Shortlisted - Show shortlisted employees
                  jobDetail?.shortlisted?.length > 0 ? (
                    jobDetail.shortlisted.map((item: any, index: number) => {
                      if (item === null) return null;
                      return (
                        <View key={index} style={styles.candidateCard}>
                          <CustomImage
                            uri={item?.user_id?.picture}
                            source={IMAGES.avatar}
                            containerStyle={styles.candidateAvatar}
                            imageStyle={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                          <View style={styles.candidateInfo}>
                            <Text style={styles.candidateName}>
                              {item?.user_id?.name || 'N/A'}
                            </Text>
                            <Text style={styles.candidateRole}>
                              {item?.user_id?.responsibility || 'N/A'}
                            </Text>
                            <Text style={styles.candidateExperience}>
                              {item?.user_id?.years_of_experience || item?.user_id?.experience || '0'}y Experience
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.inviteButton}
                            onPress={() => {
                              // TODO: Handle invite action
                              console.log('Invite pressed for:', item?.user_id?.name);
                            }}>
                            <Text style={styles.inviteButtonText}>Invite</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.emptyState}>
                      <BaseText>No shortlisted applicants</BaseText>
                    </View>
                  )
                )}
              </View>
            </View>
          </ScrollView>

          <GradientButton
            type="Company"
            style={styles.button}
            title={t('Edit Job')}
            onPress={() => {
              console.log('job_type>>>>>.', jobDetail?.job_type);
              dispatch(
                setJobFormState({
                  job_id: job_id,
                  title: jobDetail?.title,
                  job_type:
                    typeof jobDetail?.job_type === 'string'
                      ? {
                        label: jobDetail?.job_type,
                        value: jobDetail?.job_type,
                      }
                      : jobDetail?.job_type || {
                        label: 'Full Time',
                        value: 'Full Time',
                      },
                  area:
                    typeof jobDetail?.area === 'string'
                      ? { label: jobDetail?.area, value: jobDetail?.area }
                      : jobDetail?.area,
                  duration:
                    typeof jobDetail?.duration === 'string'
                      ? {
                        label: jobDetail?.duration,
                        value: jobDetail?.duration,
                      }
                      : jobDetail?.duration,
                  expiry_date: moment(jobDetail?.expiry_date).format(
                    'YYYY-MM-DD',
                  ),
                  job_sector:
                    typeof jobDetail?.job_sector === 'string'
                      ? {
                        label: jobDetail?.job_sector,
                        value: jobDetail?.job_sector,
                      }
                      : jobDetail?.job_sector,
                  startDate:
                    typeof jobDetail?.start_date === 'string'
                      ? {
                        label: jobDetail?.start_date,
                        value: jobDetail?.start_date,
                      }
                      : jobDetail?.start_date,
                  contract:
                    typeof jobDetail?.contract_type === 'string'
                      ? {
                        label: jobDetail?.contract_type,
                        value: jobDetail?.contract_type,
                      }
                      : jobDetail?.contract_type,
                  salary: {
                    label: `${Number(
                      jobDetail?.monthly_salary_from,
                    ).toLocaleString()} - ${Number(
                      jobDetail?.monthly_salary_to,
                    ).toLocaleString()}`,
                    value: `${Number(
                      jobDetail?.monthly_salary_from,
                    ).toLocaleString()} - ${Number(
                      jobDetail?.monthly_salary_to,
                    ).toLocaleString()}`,
                  },
                  position: {
                    label: String(jobDetail?.no_positions),
                    value: String(jobDetail?.no_positions),
                  },
                  describe: jobDetail?.description,
                  selected: jobDetail?.facilities || [],
                  jobSkills: jobDetail?.skills?.map((s: any) => s.title) || [],
                  skillId: jobDetail?.skills?.map((s: any) => s._id) || [],
                  requirements: jobDetail?.requirements || [],
                  invite_users:
                    jobDetail?.invited_users?.map((u: any) => u?._id) || [],
                  canApply: jobDetail?.people_anywhere,
                  editMode: true,
                }),
              );
              navigateTo(SCREENS.PostJob);
            }}
          />
        </>
      )}

      <ShareModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
      />
    </LinearContainer>
  );
};

export default CoJobDetails;

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(26),
    paddingHorizontal: wp(22),
  },
  title: {
    width: '75%',
    ...commonFontStyle(700, 24, colors._0B3970),
  },
  iconButton: {
    width: wp(32),
    height: hp(32),
    borderRadius: hp(32),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._0B3970,
  },
  icon: {
    width: wp(15),
    height: wp(15),
    tintColor: colors.white,
  },
  bodyContainer: {
    paddingHorizontal: wp(23),
  },
  jobId: {
    flex: 1,
    bottom: hp(10),
    marginLeft: '10%',
    ...commonFontStyle(400, 18, colors.black),
  },
  dateAndLocationContainer: {
    paddingHorizontal: wp(30),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(10),
    marginTop: hp(8),
    marginBottom: hp(8),
  },
  postedTime: {
    ...commonFontStyle(400, 14, colors.greyOpacity),
  },
  addressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(5),
    flexShrink: 1,
  },
  locationIcon: {
    width: wp(16),
    height: hp(16),
    tintColor: colors.greyOpacity,
    marginTop: hp(2),
    flexShrink: 0,
  },
  location: {
    flex: 1,
    flexShrink: 1,
    ...commonFontStyle(400, 14, colors.greyOpacity),
  },
  description: {
    marginTop: hp(13),
    ...commonFontStyle(400, 15, colors._3C3C3C),
  },
  jobDetailsContainer: {
    marginTop: hp(32),
  },
  sectionTitle: {
    marginBottom: hp(10),
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  flatlist: {
    marginTop: hp(27),
  },
  flatListContent: {
    gap: hp(34),
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // flexWrap: 'wrap',
  },
  iconWrapper: {
    width: wp(30),
    height: hp(30),
    borderRadius: 8,
    backgroundColor: '#E7EEF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(6),
  },
  detailItem: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(10),
  },
  detailKey: {
    ...commonFontStyle(600, 15, colors._0B3970),
    textAlign: 'center',
  },
  detailValue: {
    ...commonFontStyle(400, 14, colors.black),
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: hp(45),
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: wp(0),
    // justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    textAlign: 'center',
    ...commonFontStyle(600, 13, colors._0B3970),
  },
  tabIndicator: {
    bottom: '-65%',
    height: hp(4),
    width: '50%',
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: hp(20),
    backgroundColor: colors._0B3970,
    zIndex: 999
  },
  divider: {
    height: 1,
    width: '150%',
    alignSelf: 'center',
    marginVertical: hp(16),
    backgroundColor: '#D9D9D9',
  },
  button: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    marginVertical: hp(45),
    marginHorizontal: wp(22),
  },
  emptyState: {
    alignItems: 'center',
    marginVertical: hp(20),
  },
  salaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  jobPostCard: {
    backgroundColor: colors.white,
    borderRadius: wp(20),
    padding: hp(15),
    marginTop: hp(15),
    marginBottom: hp(20),
  },
  jobPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  companyLogoContainer: {
    width: wp(60),
    height: hp(60),
    borderRadius: wp(30),
    overflow: 'hidden',
    backgroundColor: colors._F4E2B8,
  },
  companyLogo: {
    width: '100%',
    height: '100%',
    borderRadius: wp(30),
  },
  jobPostHeaderRight: {
    flex: 1,
    marginLeft: wp(12),
  },
  companyName: {
    ...commonFontStyle(600, 16, colors._0B3970),
    marginBottom: hp(4),
  },
  companyLocation: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
  },
  jobPostActions: {
    flexDirection: 'row',
    gap: wp(8),
  },
  actionIconButton: {
    width: wp(32),
    height: hp(32),
    borderRadius: hp(16),
    backgroundColor: colors._F4E2B8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: wp(16),
    height: hp(16),
    tintColor: colors._0B3970,
  },
  jobTitle: {
    ...commonFontStyle(700, 20, colors._0B3970),
    marginBottom: hp(8),
  },
  jobDescriptionSnippet: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
    marginBottom: hp(12),
    lineHeight: hp(20),
  },
  jobPostFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  applicantCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicantAvatar: {
    width: wp(28),
    height: hp(28),
    borderRadius: wp(14),
    borderWidth: 2,
    borderColor: colors.white,
    overflow: 'hidden',
  },
  applicantAvatarImage: {
    width: '100%',
    height: '100%',
  },
  applicantCountText: {
    marginLeft: wp(8),
    ...commonFontStyle(400, 14, colors._4A4A4A),
  },
  jobTypeTag: {
    backgroundColor: colors._0B3970,
    paddingVertical: hp(6),
    paddingHorizontal: wp(16),
    borderRadius: hp(20),
  },
  jobTypeText: {
    ...commonFontStyle(500, 12, colors.white),
  },
  metricCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(12),
    marginBottom: hp(20),
  },
  metricCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: wp(15),
    padding: hp(15),
    paddingVertical: hp(20),
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: '#CDA953',
    justifyContent: 'flex-start',
    gap: wp(12),
  },
  metricCardHighlighted: {
    backgroundColor: colors._0B3970,
    borderColor: colors._0B3970,
  },
  metricIcon: {
    width: wp(34),
    height: hp(34),
  },
  metricTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  metricLabelBold: {
    ...commonFontStyle(700, 14, colors.black),
    marginBottom: hp(2),
  },
  metricLabel: {
    ...commonFontStyle(500, 16, colors.black),
  },
  metricLabelBoldWhite: {
    ...commonFontStyle(500, 16, colors.white),
    marginBottom: hp(2),
  },
  metricLabelWhite: {
    ...commonFontStyle(500, 12, colors.white),
  },
  candidateListContainer: {
    marginTop: hp(20),
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: wp(20),
    padding: hp(12),
    marginBottom: hp(10),
    borderWidth: 1,
    borderColor: colors._C9B68B,
  },
  candidateAvatar: {
    width: wp(60),
    height: hp(60),
    borderRadius: wp(30),
    overflow: 'hidden',
  },
  candidateInfo: {
    flex: 1,
    marginLeft: wp(12),
  },
  candidateName: {
    ...commonFontStyle(700, 18, colors._0B3970),
    marginBottom: hp(4),
  },
  candidateRole: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
    marginBottom: hp(2),
  },
  candidateExperience: {
    ...commonFontStyle(400, 13, colors._939393),
  },
  inviteButton: {
    backgroundColor: colors._0B3970,
    paddingVertical: hp(8),
    paddingHorizontal: wp(20),
    borderRadius: hp(50),
  },
  inviteButtonText: {
    ...commonFontStyle(500, 12, colors.white),
  },
});
