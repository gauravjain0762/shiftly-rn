import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { getInitials, hasValidImage, navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomImage from '../../../component/common/CustomImage';
import BaseText from '../../../component/common/BaseText';
import { navigationRef } from '../../../navigation/RootContainer';
import { useGetEmployeeProfileQuery } from '../../../api/dashboardApi';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
  const { data: getProfile, refetch } = useGetEmployeeProfileQuery({});
  const { userInfo: reduxUserInfo } = useSelector((state: RootState) => state.auth);
  const userInfo = getProfile?.data?.user || reduxUserInfo;

  console.log("🔥 ~ ProfileScreen ~ getProfile:", getProfile)
  console.log("🔥 ~ ProfileScreen ~ userInfo:", userInfo)

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [showAllSkills, setShowAllSkills] = useState(false);

  const handleEditProfile = async () => {
    navigateTo(SCREENS.CreateProfileScreen, { isEdit: true });
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
            <CustomImage
              source={{ uri: userInfo?.picture }}
              imageStyle={{ height: '100%', width: '100%', borderRadius: 100 }}
              containerStyle={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{getInitials(userInfo?.name)}</Text>
            </View>
          )}
          <BaseText style={styles.name}>{userInfo?.name || 'N/A'}</BaseText>
          <View style={styles.locationRow}>
            <Image source={IMAGES.marker} style={styles.locationicon} tintColor={colors._0B3970} />
            <BaseText style={styles.location}>
              {userInfo?.country || 'N/A'}
            </BaseText>
          </View>

          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.editButton}>
            <BaseText style={styles.editButtonText}>Edit Profile</BaseText>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => {
              navigateTo(SCREENS.ViewProfileScreen);
            }}
            style={styles.statsRow}>
            <BaseText style={styles.statText}>0 Connections</BaseText>
            <BaseText
              style={[
                styles.statText,
                {opacity: 0.6, color: 'rgba(255, 255, 255, 1)'},
              ]}>
              0 Profile Views
            </BaseText>
          </TouchableOpacity> */}

          {!userInfo?.profile_completion && (
            <View style={{ marginTop: hp(15) }} />
          )}

          {userInfo?.profile_completion && (
            <TouchableOpacity style={styles.assessmentCard}>
              <View style={styles.iconCircle}>
                <Image
                  source={Number(userInfo?.profile_completion) === 100 ? IMAGES.check : IMAGES.document}
                  style={[styles.assessmentIcon, Number(userInfo?.profile_completion) === 100 && { tintColor: colors._0B3970 }]}
                />
              </View>
              <View style={styles.assessmentTextContainer}>
                <BaseText style={styles.assessmentTitle}>
                  {Number(userInfo?.profile_completion) === 100 ? 'Assessment Completed' : 'Complete Assessment'}
                </BaseText>
                <BaseText style={styles.assessmentSubtitle}>
                  {userInfo?.name || 'User'} {userInfo?.profile_completion}% complete Assessment
                </BaseText>
              </View>
            </TouchableOpacity>
          )}

          {/* Section: About Me */}
          <Section title="About Me" content={userInfo?.about || 'N/A'} />

          {/* Section: Professional Experience */}
          {experienceList?.length > 0 && (
            <View style={styles.card}>
              <HeaderWithAdd title="Professional Experience" />
              <View style={styles.experienceContainer}>
                {experienceList?.map((exp: any, index: number) => (
                  <View key={index} style={{ marginBottom: hp(20), borderBottomWidth: index === experienceList?.length - 1 ? 0 : 1, borderBottomColor: '#eee', paddingBottom: hp(10) }}>
                    {exp?.title && (
                      <BaseText style={styles.experienceTitle}>
                        {exp?.title}
                      </BaseText>
                    )}
                    {exp?.company && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Company:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {exp?.company}
                        </BaseText>
                      </View>
                    )}
                    {exp?.department && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Department:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {exp?.department}
                        </BaseText>
                      </View>
                    )}
                    {exp?.preferred_position && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Position:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {exp?.preferred_position}
                        </BaseText>
                      </View>
                    )}
                    {exp?.country && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Location:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {exp?.country}
                        </BaseText>
                      </View>
                    )}
                    {(exp?.job_start || (exp?.jobStart_month && exp?.jobStart_year)) && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Start Date:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {exp?.job_start?.month || exp?.jobStart_month} {exp?.job_start?.year || exp?.jobStart_year}
                        </BaseText>
                      </View>
                    )}
                    {(exp?.job_end || (exp?.jobEnd_month && exp?.jobEnd_year)) && !exp?.still_working && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>End Date:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {exp?.job_end?.month || exp?.jobEnd_month} {exp?.job_end?.year || exp?.jobEnd_year}
                        </BaseText>
                      </View>
                    )}
                    {exp?.still_working && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Status:</BaseText>
                        <BaseText style={[styles.infoValue, styles.currentStatus]}>
                          Currently Working
                        </BaseText>
                      </View>
                    )}
                    {exp?.experience_type && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Type:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {exp?.experience_type
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </BaseText>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Section: My Languages */}
          <View style={[styles.card, { width: '90%' }]}>
            <HeaderWithAdd title="My Languages" />
            <View style={styles.languageContainer}>
              {userInfo?.languages?.length ? (
                userInfo?.languages?.map((item: any, index: number) => (
                  <View key={index} style={[styles.skillBadge]}>
                    <BaseText style={styles.skillText}>{item?.name}</BaseText>
                  </View>
                ))
              ) : (
                <BaseText style={styles.skillText}>{'N/A'}</BaseText>
              )}
            </View>
          </View>

          {/* Section: Education */}
          {educationList?.length > 0 && (
            <View style={styles.card}>
              <HeaderWithAdd title="Education" />
              <View style={styles.educationContainer}>
                {educationList?.map((edu: any, index: number) => (
                  <View key={index} style={{ marginBottom: hp(20), borderBottomWidth: index === educationList?.length - 1 ? 0 : 1, borderBottomColor: '#eee', paddingBottom: hp(10) }}>
                    {edu?.degree && (
                      <BaseText style={styles.educationDegree}>
                        {edu?.degree}
                      </BaseText>
                    )}
                    {edu?.university && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>University:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {edu?.university}
                        </BaseText>
                      </View>
                    )}
                    {(edu?.country || edu?.province) && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Location:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {[edu?.province, edu?.country]
                            .filter(Boolean)
                            .join(', ')}
                        </BaseText>
                      </View>
                    )}
                    {(edu?.start_date || (edu?.startDate_month && edu?.startDate_year)) && (edu?.end_date || (edu?.endDate_month && edu?.endDate_year)) && (
                      <View style={styles.infoRow}>
                        <BaseText style={styles.infoLabel}>Duration:</BaseText>
                        <BaseText style={styles.infoValue}>
                          {edu?.start_date?.month || edu?.startDate_month} {edu?.start_date?.year || edu?.startDate_year} - {edu?.end_date?.month || edu?.endDate_month} {edu?.end_date?.year || edu?.endDate_year}
                        </BaseText>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Section: Skills */}
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
                <BaseText style={styles.skillText}>{'N/A'}</BaseText>
              )}
            </View>
            {hasMoreThan8Skills && (
              <TouchableOpacity
                onPress={() => setShowAllSkills(!showAllSkills)}
                style={styles.showMoreButton}>
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
  name: {
    ...commonFontStyle(600, 25, colors._0B3970),
    marginTop: 8,
  },
  locationRow: {
    gap: wp(6),
    width: "90%",
    marginTop: hp(8),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    ...commonFontStyle(400, 20, colors._0B3970),
    textAlign: 'center',
  },
  locationicon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  editButton: {
    marginTop: hp(25),
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp(24),
    paddingHorizontal: wp(50),
    borderBottomWidth: hp(1),
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: hp(20),
  },
  statText: {
    ...commonFontStyle(500, 15, colors._F4E2B8),
  },
  completionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '90%',
    padding: 14,
    marginTop: 16,
    margin: wp(20),
    borderWidth: 1.2,
    borderColor: '#E0D7C8',
  },
  completionTitle: {
    ...commonFontStyle(600, 18, colors._0B3970),
    marginBottom: hp(4),
  },
  progressBarBg: {
    width: '80%',
    height: hp(6),
    borderRadius: 6,
    marginVertical: 8,
    backgroundColor: '#E6E6E6',
  },
  progressBarFill: {
    backgroundColor: colors._0B3970,
    height: 6,
    borderRadius: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    ...commonFontStyle(500, 15, colors._4A4A4A),
  },
  percentage: {
    ...commonFontStyle(500, 22, colors._0B3970),
  },
  ctaCard: {
    marginTop: 16,
    backgroundColor: '#F5F5F5)',
    paddingHorizontal: wp(26),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(20),
    marginBottom: hp(20),
  },
  ctaTextContainer: {
    flex: 1,
    gap: hp(8),
  },
  ctaTitle: {
    ...commonFontStyle(700, 17, colors.white),
    marginBottom: 2,
  },
  ctaSubtitle: {
    ...commonFontStyle(400, 14, colors.white),
  },
  ctaArrow: {
    ...commonFontStyle(700, 16, '#fff'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
    tintColor: colors._F4E2B8,
    marginLeft: 20,
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
    ...commonFontStyle(700, 22, colors._0B3970),
  },
  plus: {
    width: wp(14),
    height: wp(14),
    resizeMode: 'contain',
  },
  addButton: {
    backgroundColor: colors._F4E2B8,
    position: 'absolute',
    right: 0,
    paddingHorizontal: wp(16),
    paddingVertical: hp(13),
    borderBottomLeftRadius: 20,
  },
  content: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
    lineHeight: hp(25),
    marginTop: hp(6),
  },
  subtitle: {
    ...commonFontStyle(500, 21, colors.white),
  },
  languageContainer: {
    gap: wp(8),
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    ...commonFontStyle(500, 14, '#fff'),
    marginTop: 12,
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    marginTop: 4,
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
  showMoreButton: {
    marginTop: hp(12),
    alignSelf: 'flex-start',
  },
  showMoreText: {
    ...commonFontStyle(500, 16, colors._0B3970),
    textDecorationLine: 'underline',
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  certImage: {
    width: 82,
    height: 58,
    resizeMode: 'contain',
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
  experienceContainer: {
    marginTop: hp(2),
  },
  experienceTitle: {
    ...commonFontStyle(600, 18, colors._0B3970),
    marginBottom: hp(10),
  },
  educationContainer: {
    marginTop: hp(2),
  },
  educationDegree: {
    ...commonFontStyle(600, 18, colors._0B3970),
    marginBottom: hp(10),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: hp(6),
    flexWrap: 'wrap',
  },
  infoLabel: {
    ...commonFontStyle(500, 15, colors._4A4A4A),
    minWidth: wp(90),
    marginRight: wp(8),
  },
  infoValue: {
    ...commonFontStyle(400, 15, colors._0B3970),
    flex: 1,
  },
  currentStatus: {
    color: colors.empPrimary || '#4CAF50',
    fontWeight: '600',
  },
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
});
