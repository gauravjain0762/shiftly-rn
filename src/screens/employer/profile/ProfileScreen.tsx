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
import React, { useCallback, useMemo, useState } from 'react';
import Svg, { Line } from 'react-native-svg';
import { GradientButton, LinearContainer } from '../../../component';
import BottomModal from '../../../component/common/BottomModal';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { getInitials, hasValidImage, navigateTo, successToast, errorToast } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomImage from '../../../component/common/CustomImage';
import BaseText from '../../../component/common/BaseText';
import ReadMoreText from '../../../component/common/ReadMoreText';
import { navigationRef } from '../../../navigation/RootContainer';
import { useGetCompanyEducationsQuery, useGetEmployeeProfileQuery, useSendAssessmentLinkMutation } from '../../../api/dashboardApi';
import { useFocusEffect } from '@react-navigation/native';
import { Briefcase, Clock } from 'lucide-react-native';

const DASH_COLOR = '#D9D9D9';
const DASH_PATTERN = '4 4';

const LINE_EXTENSION_TOUCH_NEXT_DOT = hp(10);

const VerticalDashedLine = () => {
  const [height, setHeight] = useState(0);

  return (
    <View
      style={styles.dashedLineContainer}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        if (h > 0 && Math.abs(h - height) > 1) setHeight(h);
      }}
    >
      {height > 0 && (
        <Svg
          width={2}
          height={height + LINE_EXTENSION_TOUCH_NEXT_DOT}
          style={styles.verticalLineSvg}
        >
          <Line
            x1={1}
            y1={0}
            x2={1}
            y2={height + LINE_EXTENSION_TOUCH_NEXT_DOT}
            stroke={DASH_COLOR}
            strokeWidth={1}
            strokeDasharray={DASH_PATTERN}
          />
        </Svg>
      )}
    </View>
  );
};

const HorizontalDashedLine = () => {
  const [width, setWidth] = useState(0);
  return (
    <View
      style={styles.horizontalLineWrapper}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setWidth(w);
      }}
    >
      {width > 0 && (
        <Svg width={width} height={2}>
          <Line
            x1={0}
            y1={1}
            x2={width}
            y2={1}
            stroke={DASH_COLOR}
            strokeWidth={1}
            strokeDasharray={DASH_PATTERN}
          />
        </Svg>
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const { data: getProfile, refetch } = useGetEmployeeProfileQuery({});
  const { userInfo: reduxUserInfo } = useSelector((state: RootState) => state.auth);
  const userInfo = getProfile?.data?.user || reduxUserInfo;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [showAllSkills, setShowAllSkills] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [sendAssessmentLink, { isLoading: isSendingAssessment }] =
    useSendAssessmentLinkMutation();

  const assessStatus = userInfo?.assess_first?.status as string | undefined;
  const hasAssessment = !!userInfo?.assess_first;

  const aboutText = userInfo?.about || '';

  const desiredJobTitle: string = userInfo?.desired_job_title || userInfo?.desiredJobTitle || '';
  const yearsOfExperience: string | number = userInfo?.years_of_experience ?? '';

  const hasJobInfo =
    !!desiredJobTitle ||
    (yearsOfExperience !== '' && yearsOfExperience !== null && yearsOfExperience !== undefined);

  const handleEditProfile = async () => {
    navigateTo(SCREENS.CreateProfileScreen, { isEdit: true });
  };

  const proficiencyLevels = ['Basic', 'Conversational', 'Fluent', 'Native'];

  const getLanguageDotColor = (level: string) => {
    switch (level) {
      case 'Native': return colors._0B3970;
      case 'Fluent': return colors._4A4A4A;
      case 'Conversational': return colors._7B7878;
      case 'Basic': return colors._D9D9D9;
      default: return '#999';
    }
  };

  const skills = userInfo?.skills || [];
  const hasMoreThan8Skills = skills.length > 8;
  const displayedSkills = hasMoreThan8Skills && !showAllSkills
    ? skills.slice(0, 8)
    : skills;

  const educationList = Array.isArray(userInfo?.education)
    ? userInfo?.education
    : userInfo?.education
      ? [userInfo?.education]
      : [];

  const experienceList = Array.isArray(userInfo?.experience)
    ? userInfo?.experience
    : userInfo?.experience
      ? [userInfo?.experience]
      : [];

  const { data: educationOptionsResponse } = useGetCompanyEducationsQuery({});

  const degreeMap = useMemo(() => {
    const list = educationOptionsResponse?.data?.educations ?? [];
    const map: Record<string, string> = {};
    list.forEach((edu: any) => {
      if (edu?._id) {
        map[edu._id] = edu?.title ?? '';
      }
    });
    return map;
  }, [educationOptionsResponse]);

  const getDegreeLabel = (degree: any) => {
    if (!degree) return '';
    if (typeof degree === 'object') {
      return degree?.title ?? degree?.name ?? degree?.label ?? degree?.value ?? '';
    }
    if (typeof degree === 'string') {
      return degreeMap[degree] ?? degree;
    }
    return String(degree);
  };

  const HeaderWithAdd = useCallback(
    ({ title }: any) => (
      <View style={styles.headerRow}>
        <BaseText style={styles.title}>{title}</BaseText>
      </View>
    ),
    [],
  );

  const Section = useCallback(
    ({ title, content }: any) => (
      <View style={styles.card}>
        <HeaderWithAdd title={title} />
        <BaseText style={styles.content}>{content}</BaseText>
      </View>
    ),
    [],
  );

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <ScrollView
        contentContainerStyle={styles.scrollContiner}
        showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => navigationRef.goBack()}
          style={{ padding: wp(23), paddingBottom: 0 }}>
          <Image
            source={IMAGES.backArrow}
            style={{ height: hp(20), width: wp(24), tintColor: colors._0B3970 }}
          />
        </Pressable>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          {hasValidImage(userInfo?.picture) ? (
            <View style={styles.avatar}>
              <CustomImage
                uri={userInfo?.picture}
                imageStyle={{ height: '100%', width: '100%', borderRadius: 100 }}
                containerStyle={{ flex: 1 }}
                resizeMode="cover"
                showDefaultSource={false}
                onLoadStart={() => setAvatarLoading(true)}
                onLoad={() => setAvatarLoading(false)}
              />
              {avatarLoading && (
                <View style={styles.avatarLoaderOverlay}>
                  <ActivityIndicator size="small" color={colors._0B3970} />
                </View>
              )}
            </View>
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{getInitials(userInfo?.name)}</Text>
            </View>
          )}

          <BaseText style={styles.name}>
            {userInfo?.name || 'No data available'}
          </BaseText>

          <View style={styles.locationRow}>
            <Image source={IMAGES.marker} style={styles.locationicon} tintColor={colors._0B3970} />
            <BaseText style={styles.location}>
              {userInfo?.country || 'No data available'}
            </BaseText>
          </View>

          {/* ── Desired Job Title + Years of Experience — single row ───── */}
          {hasJobInfo && (
            <View style={styles.jobInfoRow}>
              {!!desiredJobTitle && (
                <View style={styles.pill}>
                  <Briefcase size={14} color={colors._0B3970} />
                  <BaseText style={styles.pillText} numberOfLines={1}>
                    {desiredJobTitle}
                  </BaseText>
                </View>
              )}

              {!!desiredJobTitle &&
                yearsOfExperience !== '' &&
                yearsOfExperience !== null &&
                yearsOfExperience !== undefined && (
                  <View style={styles.pillDivider} />
                )}

              {yearsOfExperience !== '' &&
                yearsOfExperience !== null &&
                yearsOfExperience !== undefined && (
                  <View style={styles.pill}>
                    <Clock size={14} color={colors._0B3970} />
                    <BaseText style={styles.pillText}>
                      {yearsOfExperience}
                    </BaseText>
                  </View>
                )}
            </View>
          )}

          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <BaseText style={styles.editButtonText}>Edit Profile</BaseText>
          </TouchableOpacity>

          {!userInfo?.profile_completion && <View style={{ marginTop: hp(15) }} />}

          <TouchableOpacity
            style={styles.assessmentCard}
            onPress={() => setShowAssessmentModal(true)}
            activeOpacity={0.8}>
            <View style={styles.iconCircle}>
              <Image source={IMAGES.document} style={styles.assessmentIcon} />
            </View>
            <View style={styles.assessmentTextContainer}>
              <BaseText style={styles.assessmentTitle}>Skill assessment</BaseText>
              <BaseText style={styles.assessmentSubtitle}>
                {!hasAssessment && 'Soft Skill Assessment is pending'}
                {hasAssessment && assessStatus === 'Invited' && 'Assessment link sent – awaiting completion'}
                {hasAssessment && assessStatus === 'Completed' && 'Soft Skill Assessment completed'}
                {hasAssessment && assessStatus && assessStatus !== 'Invited' && assessStatus !== 'Completed' && `Status: ${assessStatus}`}
              </BaseText>
            </View>
          </TouchableOpacity>

          <BottomModal
            visible={showAssessmentModal}
            onClose={() => setShowAssessmentModal(false)}
            backgroundColor={colors.white}>
            <BaseText style={styles.modalHeading}>Skill Assessment</BaseText>
            <BaseText style={styles.modalDescription}>
              {!hasAssessment && 'Request a new link for your soft skill assessment.'}
              {hasAssessment && assessStatus === 'Invited' && 'Your soft skill assessment link has been sent. You will be notified once it is completed.'}
              {hasAssessment && assessStatus === 'Completed' && 'You have already completed your soft skill assessment.'}
            </BaseText>
            {!hasAssessment && (
              <GradientButton
                type="Company"
                title="Send Link"
                style={styles.sendLinkButton}
                disabled={isSendingAssessment}
                onPress={async () => {
                  if (isSendingAssessment) return;
                  try {
                    const res: any = await sendAssessmentLink().unwrap();
                    if (res?.status) {
                      successToast(res?.message);
                    } else {
                      errorToast(res?.message || 'Failed to send assessment link.');
                    }
                  } catch (err: any) {
                    const message = err?.data?.message || err?.error || err?.message || 'Failed to send assessment link.';
                    errorToast(message);
                  } finally {
                    setShowAssessmentModal(false);
                  }
                }}
              />
            )}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAssessmentModal(false)}>
              <BaseText style={styles.cancelButtonText}>Cancel</BaseText>
            </TouchableOpacity>
          </BottomModal>

          <View style={styles.card}>
            <HeaderWithAdd title="About Me" />
            <ReadMoreText
              text={aboutText || 'No data available'}
              numberOfLines={3}
              style={aboutText ? styles.content : styles.noDataContent}
            />
          </View>

          {/* ── Professional Experience ───────────────────────────────────── */}
          {experienceList?.length > 0 && (
            <View style={styles.card}>
              <HeaderWithAdd title="Professional Experience" />
              <View style={styles.timelineContainer}>
                {experienceList?.map((exp: any, index: number) => {
                  const isLast = index === experienceList.length - 1;
                  const title = exp?.title;
                  const location = [exp?.province, exp?.country].filter(Boolean).join(', ');
                  const startMonth = exp?.job_start?.month || exp?.jobStart_month;
                  const startYear = exp?.job_start?.year || exp?.jobStart_year;
                  const startDate = [startMonth, startYear].filter(Boolean).join(' ');
                  const typeLabel = exp?.experience_type
                    ? exp.experience_type
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())
                    : '';

                  return (
                    <React.Fragment key={exp?._id || `${title}-${index}`}>
                      <View style={styles.timelineRow}>
                        <View style={styles.timelineRail}>
                          <View style={styles.timelineDot} />
                          <VerticalDashedLine />
                        </View>
                        <View style={styles.timelineContentWrapper}>
                          <View style={styles.timelineContent}>
                            {!!title && (
                              <BaseText style={styles.sectionItemTitle}>{title}</BaseText>
                            )}
                            {exp?.company && (
                              <View style={styles.kvRow}>
                                <BaseText style={styles.kvLabel}>Company:</BaseText>
                                <BaseText style={styles.kvValue}>{exp?.company}</BaseText>
                              </View>
                            )}
                            {(exp?.preferred_position || exp?.position) && (
                              <View style={styles.kvRow}>
                                <BaseText style={styles.kvLabel}>Position:</BaseText>
                                <BaseText style={styles.kvValue}>
                                  {exp?.preferred_position || exp?.position}
                                </BaseText>
                              </View>
                            )}
                            {!!location && (
                              <View style={styles.kvRow}>
                                <BaseText style={styles.kvLabel}>Location:</BaseText>
                                <BaseText style={styles.kvValue}>{location}</BaseText>
                              </View>
                            )}
                            {!!startDate && (
                              <View style={styles.kvRow}>
                                <BaseText style={styles.kvLabel}>Start Date:</BaseText>
                                <BaseText style={styles.kvValue}>{startDate}</BaseText>
                              </View>
                            )}
                            <View style={styles.kvRow}>
                              <BaseText style={styles.kvLabel}>Status:</BaseText>
                              <BaseText style={[styles.kvValue, exp?.still_working && styles.currentStatus]}>
                                {exp?.still_working ? 'Currently Working' : 'Completed'}
                              </BaseText>
                            </View>
                            {!!typeLabel && (
                              <View style={styles.kvRow}>
                                <BaseText style={styles.kvLabel}>Type:</BaseText>
                                <BaseText style={styles.kvValue}>{typeLabel}</BaseText>
                              </View>
                            )}
                          </View>
                          {!isLast && (
                            <View style={styles.horizontalLineRow}>
                              <HorizontalDashedLine />
                            </View>
                          )}
                        </View>
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── My Languages ─────────────────────────────────────────────── */}
          <View style={[styles.card, { width: '90%' }]}>
            <HeaderWithAdd title="My Languages" />
            <View style={styles.languageContainer}>
              {userInfo?.languages?.length ? (
                userInfo.languages.map((item: any, index: number) => (
                  <View key={index} style={styles.languageChipWithDots}>
                    <BaseText style={styles.languageChipName}>{item?.name}</BaseText>
                    <View style={styles.languageDotsRow}>
                      {proficiencyLevels.map(level => {
                        const isSelected = item?.level === level;
                        return (
                          <View
                            key={level}
                            style={[
                              styles.langDotWrapper,
                              isSelected && {
                                borderWidth: 2,
                                borderColor: getLanguageDotColor(level),
                                borderRadius: 16,
                                width: 32,
                                height: 32,
                                justifyContent: 'center',
                                alignItems: 'center',
                              },
                            ]}>
                            <View
                              style={[
                                styles.langDot,
                                { backgroundColor: getLanguageDotColor(level) },
                              ]}
                            />
                            {isSelected && (
                              <BaseText
                                numberOfLines={1}
                                style={[
                                  styles.langDotLabel,
                                  { color: getLanguageDotColor(level) },
                                ]}>
                                {level}
                              </BaseText>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))
              ) : (
                <BaseText style={styles.noDataText}>No data available</BaseText>
              )}
            </View>
          </View>

          {/* ── Education ────────────────────────────────────────────────── */}
          {educationList?.length > 0 && (
            <View style={styles.card}>
              <HeaderWithAdd title="Education" />
              <View style={styles.timelineContainer}>
                {educationList?.map((edu: any, index: number) => {
                  const isLast = index === educationList.length - 1;
                  const degree = getDegreeLabel(edu?.degree);
                  const location = [edu?.province, edu?.country].filter(Boolean).join(', ');
                  const startMonth = edu?.start_date?.month || edu?.startDate_month;
                  const startYear = edu?.start_date?.year || edu?.startDate_year;
                  const endMonth = edu?.end_date?.month || edu?.endDate_month;
                  const endYear = edu?.end_date?.year || edu?.endDate_year;
                  const duration =
                    startMonth || startYear || endMonth || endYear
                      ? `${[startMonth, startYear].filter(Boolean).join(' ')} - ${[endMonth, endYear].filter(Boolean).join(' ')}`
                      : '';

                  return (
                    <React.Fragment key={edu?._id || `${degree}-${index}`}>
                      <View style={styles.timelineRow}>
                        <View style={styles.timelineRail}>
                          <View style={styles.timelineDot} />
                          <VerticalDashedLine />
                        </View>
                        <View style={styles.timelineContentWrapper}>
                          <View style={styles.timelineContent}>
                            {!!degree && (
                              <BaseText style={styles.sectionItemTitle}>{degree}</BaseText>
                            )}
                            {edu?.university && (
                              <View style={styles.kvRow}>
                                <BaseText style={styles.kvLabel}>University:</BaseText>
                                <BaseText style={styles.kvValue}>{edu?.university}</BaseText>
                              </View>
                            )}
                            {!!location && (
                              <View style={styles.kvRow}>
                                <BaseText style={styles.kvLabel}>Location:</BaseText>
                                <BaseText style={styles.kvValue}>{location}</BaseText>
                              </View>
                            )}
                            {!!duration && (
                              <View style={styles.kvRow}>
                                <BaseText style={styles.kvLabel}>Duration:</BaseText>
                                <BaseText style={styles.kvValue}>{duration}</BaseText>
                              </View>
                            )}
                          </View>
                          {!isLast && (
                            <View style={styles.horizontalLineRow}>
                              <HorizontalDashedLine />
                            </View>
                          )}
                        </View>
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Skills ───────────────────────────────────────────────────── */}
          <View style={styles.card}>
            <HeaderWithAdd title="Skills" />
            <View style={styles.skillContainer}>
              {skills.length ? (
                <>
                  {displayedSkills.map((skill: any, index: number) => (
                    <View key={skill?._id || skill?.title || index} style={styles.skillBadge}>
                      <BaseText style={styles.skillText}>{skill?.title}</BaseText>
                    </View>
                  ))}
                </>
              ) : (
                <BaseText style={styles.noDataText}>No data available</BaseText>
              )}
            </View>
            {hasMoreThan8Skills && (
              <TouchableOpacity onPress={() => setShowAllSkills(!showAllSkills)} style={styles.showMoreButton}>
                <BaseText style={styles.showMoreText}>
                  {showAllSkills ? 'Show less' : 'Show more'}
                </BaseText>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </LinearContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 12,
  },
  avatar: {
    width: wp(130),
    height: wp(130),
    borderRadius: 100,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarLoaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    ...commonFontStyle(600, 22, colors._0B3970),
    marginTop: 8,
  },
  locationRow: {
    gap: wp(6),
    width: '90%',
    marginTop: hp(6),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    ...commonFontStyle(500, 16, colors._0B3970),
    textAlign: 'center',
  },
  locationicon: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },

  // ── Job info row ─────────────────────────────────────────────────────────
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(12),
    paddingHorizontal: wp(20),
    backgroundColor: colors._0B3970 + '12',
    borderRadius: wp(25),
    alignSelf: 'center',
    paddingVertical: hp(7),
    width: '90%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(5),
  },
  pillText: {
    ...commonFontStyle(500, 14, colors._0B3970),
  },
  pillDivider: {
    width: 1,
    height: hp(16),
    backgroundColor: colors._0B3970 + '40',
    marginHorizontal: wp(10),
  },

  editButton: {
    marginTop: hp(20),
    paddingVertical: hp(10),
    paddingHorizontal: wp(30),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E6E6E6',
    backgroundColor: '#E6E6E6',
  },
  editButtonText: {
    ...commonFontStyle(400, 17, colors._0B3970),
  },
  card: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: wp(18),
    marginBottom: hp(15),
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#E0D7C8',
    paddingBottom: hp(16),
    marginHorizontal: wp(21),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(14),
    marginBottom: hp(10),
  },
  title: {
    ...commonFontStyle(600, 16, colors._0B3970),
  },
  content: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
    lineHeight: hp(25),
    marginTop: hp(6),
  },
  noDataContent: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
    lineHeight: hp(25),
    marginTop: hp(6),
    textAlign: 'center',
    width: '100%',
  },
  languageContainer: {
    gap: wp(8),
    flexDirection: 'column',
    alignItems: 'center',
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  skillBadge: {
    borderWidth: 1,
    borderColor: '#E0D7C8',
    borderRadius: 8,
    paddingVertical: hp(10),
    paddingHorizontal: wp(16),
    marginRight: wp(5),
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  skillText: {
    ...commonFontStyle(400, 16, colors._0B3970),
  },
  noDataText: {
    ...commonFontStyle(400, 16, colors._0B3970),
    textAlign: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  showMoreButton: {
    marginTop: hp(12),
    alignSelf: 'flex-start',
  },
  showMoreText: {
    ...commonFontStyle(500, 16, colors._0B3970),
    textDecorationLine: 'underline',
  },
  scrollContiner: {},
  avatarPlaceholder: {
    backgroundColor: colors._0B3970,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: wp(22),
    fontWeight: '700',
  },

  // ── Timeline shared styles ───────────────────────────────────────────────
  timelineContainer: {
    marginTop: hp(6),
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineRail: {
    width: wp(18),
    alignItems: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  timelineDot: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    borderWidth: 2,
    borderColor: '#D9D9D9',
    backgroundColor: colors.white,
    marginTop: hp(6),
    zIndex: 2,
  },
  dashedLineContainer: {
    flex: 1,
    width: 2,
    alignItems: 'center',
    minHeight: 4,
    marginTop: hp(4),
    overflow: 'visible',
  },
  verticalLineSvg: {
    position: 'absolute',
    overflow: 'visible',
  },
  timelineContentWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  horizontalLineRow: {
    paddingVertical: hp(15),
  },
  horizontalLineWrapper: {
    width: '90%',
    paddingHorizontal: wp(10),
  },
  timelineContent: {
    flex: 1,
    paddingLeft: wp(10),
  },
  sectionItemTitle: {
    ...commonFontStyle(500, 16, colors._0B3970),
    marginBottom: hp(10),
  },
  kvRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(6),
    justifyContent: 'space-between',
  },
  kvLabel: {
    ...commonFontStyle(400, 15, colors._4A4A4A),
    flexShrink: 0,
    width: wp(92),
  },
  kvValue: {
    ...commonFontStyle(500, 14, colors._0B3970),
    flex: 1,
    textAlign: 'left',
  },
  currentStatus: {
    color: colors.empPrimary || '#4CAF50',
    fontWeight: '600',
  },

  // ── Assessment card ──────────────────────────────────────────────────────
  assessmentCard: {
    backgroundColor: colors._0B3970,
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(15),
    paddingHorizontal: wp(20),
    marginHorizontal: wp(20),
    marginVertical: hp(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  iconCircle: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(22.5),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(15),
  },
  assessmentIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  assessmentTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  assessmentTitle: {
    ...commonFontStyle(700, 16, colors.white),
    marginBottom: hp(2),
  },
  assessmentSubtitle: {
    ...commonFontStyle(400, 12, 'rgba(255, 255, 255, 0.8)'),
  },
  modalHeading: {
    ...commonFontStyle(600, 22, colors._0B3970),
    marginBottom: hp(12),
    textAlign: 'center',
  },
  modalDescription: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
    marginBottom: hp(24),
    textAlign: 'center',
    lineHeight: hp(24),
  },
  sendLinkButton: {
    marginBottom: hp(12),
  },
  cancelButton: {
    paddingVertical: hp(12),
    alignItems: 'center',
  },
  cancelButtonText: {
    ...commonFontStyle(500, 16, colors._4A4A4A),
  },
  languageChipWithDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0D7C8',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingVertical: hp(8),
    paddingHorizontal: wp(12),
    paddingBottom: hp(20),   // ← space for the absolute label
    marginBottom: hp(8),
    width: '100%',
  },
  languageChipName: {
    ...commonFontStyle(400, 16, colors._0B3970),
    flex: 1,
    marginRight: wp(8),
  },
  languageDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },
  langDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  langDotAndLabel: {
    alignItems: 'center',
    gap: hp(4),
  },
  langDotWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langDotLabel: {
    position: 'absolute',
    top: 32,
    ...commonFontStyle(500, 10, colors._0B3970),
    textAlign: 'center',
    width: 80,
    alignSelf: 'center',
  },
});