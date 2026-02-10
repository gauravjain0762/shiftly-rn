import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
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

const ProfileScreen = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [showAllSkills, setShowAllSkills] = useState(false);
  console.log("🔥 ~ ProfileScreen ~ userInfo:", userInfo)

  const handleEditProfile = async () => {
    navigateTo(SCREENS.CreateProfileScreen, { isEdit: true });
  };

  const skills = userInfo?.skills || [];
  const hasMoreThan8Skills = skills.length > 8;
  const displayedSkills = hasMoreThan8Skills && !showAllSkills
    ? skills.slice(0, 8)
    : skills;

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
              imageStyle={{ height: '100%', width: '100%' }}
              containerStyle={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <BaseText style={styles.avatarText}>
                {getInitials(userInfo?.name)}
              </BaseText>
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
            <View style={[styles.completionCard]}>
              <BaseText style={styles.completionTitle}>
                Profile Completion
              </BaseText>
              <View style={styles.row}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${userInfo?.profile_completion || 0}%`,
                      },
                    ]}
                  />
                </View>
                <BaseText style={styles.percentage}>
                  {`${userInfo?.profile_completion}%` || 'N/A'}
                </BaseText>
              </View>
              <View style={styles.progressRow}>
                <BaseText style={styles.progressText}>
                  Keep it up! you’re halfway there.
                </BaseText>
              </View>
            </View>
          )}

          {/* Section: About Me */}
          <Section title="About Me" content={userInfo?.about || 'N/A'} />

          {/* Section: Professional Experience */}
          {userInfo?.experience && (
            <View style={styles.card}>
              <HeaderWithAdd title="Professional Experience" />
              <View style={styles.experienceContainer}>
                {userInfo.experience.title && (
                  <BaseText style={styles.experienceTitle}>
                    {userInfo.experience.title}
                  </BaseText>
                )}
                {userInfo.experience.company && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Company:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.experience.company}
                    </BaseText>
                  </View>
                )}
                {userInfo.experience.department && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Department:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.experience.department}
                    </BaseText>
                  </View>
                )}
                {userInfo.experience.preferred_position && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Position:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.experience.preferred_position}
                    </BaseText>
                  </View>
                )}
                {userInfo.experience.country && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Location:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.experience.country}
                    </BaseText>
                  </View>
                )}
                {userInfo.experience.job_start && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Start Date:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.experience.job_start.month} {userInfo.experience.job_start.year}
                    </BaseText>
                  </View>
                )}
                {userInfo.experience.job_end && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>End Date:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.experience.job_end.month} {userInfo.experience.job_end.year}
                    </BaseText>
                  </View>
                )}
                {userInfo.experience.still_working && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Status:</BaseText>
                    <BaseText style={[styles.infoValue, styles.currentStatus]}>
                      Currently Working
                    </BaseText>
                  </View>
                )}
                {userInfo.experience.experience_type && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Type:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.experience.experience_type
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </BaseText>
                  </View>
                )}
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
          {userInfo?.education && (
            <View style={styles.card}>
              <HeaderWithAdd title="Education" />
              <View style={styles.educationContainer}>
                {userInfo.education.degree && (
                  <BaseText style={styles.educationDegree}>
                    {userInfo.education.degree}
                  </BaseText>
                )}
                {userInfo.education.university && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>University:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.education.university}
                    </BaseText>
                  </View>
                )}
                {(userInfo.education.country || userInfo.education.province) && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Location:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {[userInfo.education.province, userInfo.education.country]
                        .filter(Boolean)
                        .join(', ')}
                    </BaseText>
                  </View>
                )}
                {userInfo.education.start_date && userInfo.education.end_date && (
                  <View style={styles.infoRow}>
                    <BaseText style={styles.infoLabel}>Duration:</BaseText>
                    <BaseText style={styles.infoValue}>
                      {userInfo.education.start_date.month} {userInfo.education.start_date.year} - {userInfo.education.end_date.month} {userInfo.education.end_date.year}
                    </BaseText>
                  </View>
                )}
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
    overflow: 'hidden',
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
});
