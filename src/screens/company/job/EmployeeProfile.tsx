import {useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  NativeModules,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {IMAGES} from '../../../assets/Images';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import BottomModal from '../../../component/common/BottomModal';
import BaseText from '../../../component/common/BaseText';
import CustomImage from '../../../component/common/CustomImage';
import ReadMoreText from '../../../component/common/ReadMoreText';
import {SCREENS} from '../../../navigation/screenNames';
import {colors} from '../../../theme/colors';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {
  navigateTo,
  getInitials,
  hasValidImage,
  formatLocationToCityCountry,
} from '../../../utils/commonFunction';
import {useGetEmployeeProfileByIdQuery} from '../../../api/dashboardApi';
import RNFS from 'react-native-fs';
import ProfileImageViewer, {
  ProfileImageViewerRef,
} from '../../../component/common/ProfileImageViewer';

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i;
const PDF_EXTENSIONS = /\.(pdf)(\?|$)/i;

const EmployeeProfile = () => {
  const {params} = useRoute<any>();
  const userParam = params?.user;
  const userId = userParam?._id;

  const {data: profileResponse, isLoading} = useGetEmployeeProfileByIdQuery(
    {user_id: userId},
    {skip: !userId},
  );
  const profileViewerRef = useRef<ProfileImageViewerRef>(null);
  const userData = profileResponse?.data?.user;
  const assessFirst = userData?.assess_first || userParam?.assess_first;
  const hasAssessFirst = !!assessFirst;
  const assessStatus = assessFirst?.status as string | undefined;
  const reportUrl =
    typeof assessFirst?.report === 'string'
      ? assessFirst.report
      : (assessFirst?.report as any)?.url;

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [downloadingResumeKey, setDownloadingResumeKey] = useState<
    string | null
  >(null);

  const rawLocation =
    userData?.location || userParam?.location || userParam?.area;
  console.log(
    '🔥 ~ EmployeeProfile ~ userData:',
    JSON.stringify(userData, null, 2),
  );

  const toArray = (value: any) =>
    Array.isArray(value) ? value : value ? [value] : [];
  const formatMonthYear = (dateObj: any) => {
    if (!dateObj) return '';
    if (typeof dateObj === 'string') return dateObj;
    const month = dateObj?.month || '';
    const year = dateObj?.year || '';
    return [month, year].filter(Boolean).join(' ');
  };

  const educationRaw = toArray(userData?.education || userParam?.education);
  const experienceRaw = toArray(userData?.experience || userParam?.experience);
  console.log('🔥 ~ EmployeeProfile ~ experienceRaw:', experienceRaw);
  const profileData = {
    name: userData?.name || userParam?.name || 'No data available',
    desiredJobTitle:
      userData?.desired_job_title || userParam?.desired_job_title || '',
    yearsOfExperience:
      userData?.years_of_experience || userParam?.years_of_experience || '',
    location:
      formatLocationToCityCountry(
        rawLocation,
        userData?.city || userParam?.city,
        userData?.country || userParam?.country,
      ) ||
      userData?.country ||
      userParam?.country ||
      'No data available',
    picture: userData?.picture || userParam?.picture || null,
    about: userData?.about || 'No about information provided.',
    education: educationRaw.map((edu: any) => {
      const degree =
        typeof edu?.degree === 'object'
          ? edu?.degree?.title || edu?.degree?.name || edu?.degree?.label || ''
          : edu?.degree || '';
      const start = formatMonthYear(edu?.start_date || edu?.startDate);
      const end = formatMonthYear(edu?.end_date || edu?.endDate);
      const years = [start, end].filter(Boolean).join(' - ');
      return {
        degree: degree || 'No data available',
        years: years || '',
        institution: edu?.university || edu?.institution || 'No data available',
        location:
          [edu?.province, edu?.country].filter(Boolean).join(', ') ||
          'No data available',
      };
    }),
    experience: experienceRaw.map((exp: any) => {
      const start = formatMonthYear(exp?.job_start);
      const end = exp?.still_working
        ? 'Present'
        : formatMonthYear(exp?.job_end);
      return {
        title: exp?.title || 'No data available',
        years: [start, end].filter(Boolean).join(' - '),
        company: exp?.company || 'No data available',
        location:
          [exp?.province, exp?.country].filter(Boolean).join(', ') ||
          exp?.country ||
          'No data available',
      };
    }),
    skills: (userData?.skills || userParam?.skills || [])
      .map((s: any) => s?.title)
      .filter(Boolean),
    languages: userData?.languages || userParam?.languages || [],
    resumes: toArray(userData?.resumes || userParam?.resumes).filter(
      (r: any) => r?.file,
    ),
  };

  const proficiencyLevels = ['Basic', 'Conversational', 'Fluent', 'Native'];

  const getLanguageDotColor = (level: string) => {
    switch (level) {
      case 'Native':
        return colors._0B3970;
      case 'Fluent':
        return colors._4A4A4A;
      case 'Conversational':
        return colors._7B7878;
      case 'Basic':
        return colors._D9D9D9;
      default:
        return '#999';
    }
  };

  const jobData = params?.jobData;
  const jobId = params?.jobId;

  const handleChat = () => {
    if (!userId) return;

    try {
      navigateTo(SCREENS.CoStack, {
        screen: SCREENS.CoChat,
        params: {
          isFromJobDetail: true,
          data: {
            user_id: userData || userParam,
          },
          mainjob_data: jobData || {_id: jobId},
        },
      });
    } catch (e: any) {
      console.error('Navigation failed', e);
      Alert.alert('Error', `Nav failed: ${e.message}`);
    }
  };

  const handleViewResume = (resume: any) => {
    const fileUrl = resume?.file;
    if (!fileUrl) return;
    const fileName = resume?.file_name || '';
    const lower = `${fileUrl} ${fileName}`.toLowerCase();

    const isImage =
      IMAGE_EXTENSIONS.test(fileUrl) || IMAGE_EXTENSIONS.test(fileName);
    const isPdf =
      PDF_EXTENSIONS.test(fileUrl) ||
      PDF_EXTENSIONS.test(fileName) ||
      lower.includes('pdf');

    navigateTo(SCREENS.AttachmentViewerScreen, {
      url: fileUrl,
      type: isImage ? 'image' : isPdf ? 'pdf' : 'document',
    });
  };

  const handleDownloadResume = async (
    resume: any,
    options?: {showLoader?: boolean},
  ) => {
    const fileUrl = resume?.file;
    if (!fileUrl) return;
    const showLoader = options?.showLoader ?? true;
    try {
      if (Platform.OS === 'android') {
        const resumeKey = String(resume?._id || resume?.file_name || fileUrl);
        if (showLoader) {
          setDownloadingResumeKey(resumeKey);
        }

        const apiLevel =
          typeof Platform.Version === 'string'
            ? Number.parseInt(Platform.Version, 10)
            : (Platform.Version as number | undefined);

        // Storage runtime permission (needed on older Android versions)
        if (apiLevel && apiLevel < 33) {
          const permissions: any[] = [];
          if (PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE) {
            permissions.push(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
          }
          if (PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE) {
            permissions.push(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
          }

          if (permissions.length > 0) {
            const results = await Promise.all(
              permissions.map((p: any) => PermissionsAndroid.request(p as any)),
            );
            const allGranted = results.every(
              r => r === PermissionsAndroid.RESULTS.GRANTED,
            );
            if (!allGranted) {
              Alert.alert('Permission denied', 'Cannot download resume.');
              return;
            }
          }
        }

        const rawName =
          resume?.file_name ||
          resume?.fileName ||
          resume?.name ||
          resume?.filename ||
          fileUrl.split('?')[0].split('/').pop() ||
          `resume_${Date.now()}`;

        // Display name should match the resume name we show in UI.
        const displayName = String(rawName);
        const safeName = displayName.replace(/[^\w.\-]/g, '_');

        const lowerName = displayName.toLowerCase();
        const mimeType = lowerName.endsWith('.pdf')
          ? 'application/pdf'
          : lowerName.endsWith('.docx')
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : lowerName.endsWith('.doc')
          ? 'application/msword'
          : 'application/octet-stream';

        // Prefer Android DownloadManager so the download shows in the system notification tray.
        try {
          const nativeModule = (NativeModules as any)?.DownloadResumeModule;
          if (nativeModule?.downloadToDownloads) {
            await nativeModule.downloadToDownloads(
              fileUrl,
              safeName,
              mimeType,
              displayName,
              `Downloading ${displayName}`,
            );
            Alert.alert('Downloading', 'Resume added to your downloads.');
            return;
          }
        } catch (e: any) {
          // Fallback to RNFS if the native module is not available or download fails.
          console.log(
            'Native DownloadManager resume download failed:',
            e?.message || e,
          );
        }

        const downloadDirs = [
          (RNFS as any).DownloadDirectoryPath,
          RNFS.ExternalDirectoryPath,
          RNFS.DocumentDirectoryPath,
          RNFS.CachesDirectoryPath,
        ].filter(Boolean);

        let lastError: any = null;
        for (const dir of downloadDirs) {
          const toFile = `${dir}/${safeName}`;
          try {
            await RNFS.downloadFile({fromUrl: fileUrl, toFile}).promise;
            Alert.alert('Downloaded', 'Resume saved.');
            return toFile;
          } catch (e: any) {
            lastError = e;
          }
        }

        throw lastError || new Error('Download failed');
      }

      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert('Error', 'Could not open resume link');
      }
    } catch (_) {
      Alert.alert(
        'Error',
        Platform.OS === 'android'
          ? 'Could not download resume'
          : 'Could not open resume link',
      );
    } finally {
      // Clear loader regardless of success/failure
      if (Platform.OS === 'android' && showLoader) {
        setDownloadingResumeKey(null);
      }
    }
  };

  if (isLoading) {
    return (
      <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
        <BackHeader
          title="Employee Profile"
          containerStyle={styles.headerContainer}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors._0B3970} />
        </View>
      </LinearContainer>
    );
  }

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <BackHeader
        title="Employee Profile"
        containerStyle={styles.headerContainer}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {hasValidImage(profileData.picture) ? (
              <CustomImage
                uri={profileData.picture}
                source={IMAGES.logoText}
                imageStyle={styles.profileImage}
                containerStyle={styles.profileImage}
                resizeMode="cover"
                onPress={() => profileViewerRef.current?.open()}
              />
            ) : (
              <View style={[styles.profileImage, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {getInitials(profileData.name)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          {(!!profileData.desiredJobTitle ||
            !!profileData.yearsOfExperience) && (
            <View style={styles.jobInfoRow}>
              {/* {!!profileData.desiredJobTitle && (
                <View style={styles.jobInfoPill}>
                  <Text style={styles.jobInfoPillText}>{profileData.desiredJobTitle}</Text>
                </View>
              )}
              {!!profileData.desiredJobTitle && !!profileData.yearsOfExperience && (
                <View style={styles.pillDivider} />
              )} */}
              {!!profileData.yearsOfExperience && (
                <View style={styles.jobInfoPill}>
                  <Text style={styles.jobInfoPillText}>
                    {profileData.yearsOfExperience}
                  </Text>
                </View>
              )}
            </View>
          )}
          {(!!profileData.desiredJobTitle ||
            !!profileData.yearsOfExperience) && (
            <View>
              <BaseText style={styles.desiredText} numberOfLines={1}>
                {'Desired Job:'}
              </BaseText>
              <View style={[styles.jobInfoRow, {marginTop: hp(5)}]}>
                {!!profileData.desiredJobTitle && (
                  <View style={styles.jobInfoPill}>
                    <Text style={styles.jobInfoPillText}>
                      {profileData.desiredJobTitle}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          <View style={styles.locationContainer}>
            <Image
              source={IMAGES.location}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.locationText}>{profileData.location}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.assessmentCard}
          // onPress={() => setShowAssessmentModal(true)}
          activeOpacity={0.8}>
          <View style={styles.iconCircle}>
            <Image
              source={
                assessStatus === 'Completed' ? IMAGES.check : IMAGES.document
              }
              style={[
                styles.assessmentIcon,
                assessStatus === 'Completed' && {tintColor: colors._0B3970},
              ]}
            />
          </View>
          <View style={styles.assessmentTextContainer}>
            <BaseText style={styles.assessmentTitle}>
              {assessStatus === 'Completed'
                ? 'Assessment Completed'
                : 'Skill Assessment'}
            </BaseText>
            <BaseText style={styles.assessmentSubtitle}>
              {!hasAssessFirst && 'Soft Skill Assessment is pending'}
              {hasAssessFirst &&
                assessStatus === 'Invited' &&
                'Assessment link sent – awaiting completion'}
              {hasAssessFirst &&
                assessStatus === 'Completed' &&
                (reportUrl
                  ? 'View the assessment report'
                  : 'Soft Skill Assessment completed')}
              {hasAssessFirst &&
                assessStatus &&
                assessStatus !== 'Invited' &&
                assessStatus !== 'Completed' &&
                `Status: ${assessStatus}`}
            </BaseText>
            {assessStatus === 'Completed' &&
              typeof reportUrl === 'string' &&
              reportUrl.trim() !== '' && (
                <TouchableOpacity
                  style={styles.showReportButton}
                  onPress={() =>
                    Linking.openURL(reportUrl).catch(() =>
                      Alert.alert('Error', 'Could not open report'),
                    )
                  }
                  activeOpacity={0.8}>
                  <Text style={styles.showReportText}>Show Report</Text>
                </TouchableOpacity>
              )}
          </View>
        </TouchableOpacity>

        <BottomModal
          visible={showAssessmentModal}
          onClose={() => setShowAssessmentModal(false)}
          backgroundColor={colors.white}>
          <Text style={styles.modalHeading}>Skill Assessment</Text>
          <BaseText style={styles.modalDescription}>
            {!hasAssessFirst &&
              'Soft Skill Assessment has not been requested for this employee yet.'}
            {hasAssessFirst &&
              assessStatus === 'Invited' &&
              'The assessment link has been sent to this employee. You will be notified once it is completed.'}
            {hasAssessFirst &&
              assessStatus === 'Completed' &&
              'This employee has completed the soft skill assessment.'}
            {hasAssessFirst &&
              assessStatus &&
              assessStatus !== 'Invited' &&
              assessStatus !== 'Completed' &&
              `Status: ${assessStatus}`}
            {hasAssessFirst && !assessStatus && 'Assessment status is pending.'}
          </BaseText>
          {assessStatus === 'Completed' &&
            typeof reportUrl === 'string' &&
            reportUrl.trim() !== '' && (
              <TouchableOpacity
                style={styles.modalShowReportButton}
                onPress={() => {
                  Linking.openURL(reportUrl).catch(() =>
                    Alert.alert('Error', 'Could not open report'),
                  );
                  setShowAssessmentModal(false);
                }}
                activeOpacity={0.8}>
                <Text style={styles.modalShowReportText}>Show Report</Text>
              </TouchableOpacity>
            )}
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setShowAssessmentModal(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </BottomModal>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About me</Text>
          <ReadMoreText
            text={profileData?.about}
            numberOfLines={8}
            style={styles.cardText}
          />
        </View>

        {profileData.education.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Education</Text>
            {profileData.education.map((edu: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.entryContainer,
                  index > 0 && {marginTop: hp(15)},
                ]}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.degree}</Text>
                  <Text style={styles.entryYears}>{edu.years}</Text>
                </View>
                <View style={styles.entryDetails}>
                  <Text style={styles.entryLink}>{edu.institution}</Text>
                  <View style={styles.entryLocation}>
                    <Image
                      source={IMAGES.location}
                      style={styles.smallLocationIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.entryLocationText}>{edu.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Past Experience Card */}
        {profileData.experience.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Past Experience</Text>
            {profileData.experience.map((exp: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.entryContainer,
                  index > 0 && {marginTop: hp(15)},
                ]}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.title}</Text>
                  <Text style={styles.entryYears}>{exp.years}</Text>
                </View>
                <View style={styles.entryDetails}>
                  <Text style={styles.entryLink}>{exp.company}</Text>
                  <View style={styles.entryLocation}>
                    <Image
                      source={IMAGES.location}
                      style={styles.smallLocationIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.entryLocationText}>{exp.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills Card */}
        {profileData.skills.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Skills</Text>
            <View style={styles.pillsContainer}>
              {profileData.skills.map((skill: string, index: number) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {profileData.languages.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Languages</Text>
            <View style={styles.languageContainer}>
              {profileData.languages.map((lang: any, index: number) => (
                <View key={index} style={styles.languageChipWithDots}>
                  <Text style={styles.languageChipName}>{lang?.name}</Text>
                  <View style={styles.languageDotsRow}>
                    {proficiencyLevels.map(level => {
                      const isActive = lang?.level === level;
                      return (
                        <View
                          key={level}
                          style={[
                            styles.langDotWrapper,
                            isActive && {
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
                              {backgroundColor: getLanguageDotColor(level)},
                            ]}
                          />
                          {isActive && (
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.langDotLabel,
                                {color: getLanguageDotColor(level)},
                              ]}>
                              {level}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {profileData.resumes.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Documents</Text>
            {profileData.resumes.map((resume: any, index: number) => (
              <View
                key={resume?._id || resume?.file_name || index}
                style={[styles.resumeRow, index > 0 && {marginTop: hp(10)}]}>
                <View style={styles.resumeChip}>
                  <Text numberOfLines={1} style={styles.resumeChipText}>
                    {resume?.file_name || 'Resume'}
                  </Text>
                </View>
                <View style={styles.resumeActions}>
                  {(() => {
                    return (
                      <>
                        <TouchableOpacity
                          style={styles.resumeActionIconBtn}
                          onPress={() => handleViewResume(resume)}
                          activeOpacity={0.8}>
                          <Image
                            source={IMAGES.view}
                            style={styles.resumeActionIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.resumeActionIconBtn}
                          onPress={() => handleDownloadResume(resume)}
                          activeOpacity={0.8}>
                          {downloadingResumeKey ===
                          String(
                            resume?._id || resume?.file_name || resume?.file,
                          ) ? (
                            <ActivityIndicator
                              size="small"
                              color={colors.white}
                            />
                          ) : (
                            <Image
                              source={IMAGES.download}
                              style={styles.resumeActionIcon}
                              resizeMode="contain"
                            />
                          )}
                        </TouchableOpacity>
                      </>
                    );
                  })()}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <ProfileImageViewer
        ref={profileViewerRef}
        imageUri={profileData.picture}
        userName={profileData.name}
      />

      {/* Chat Button */}
      <View style={styles.chatButtonContainer}>
        <View style={styles.chatButtonWrapper}>
          <GradientButton
            title="Chat"
            onPress={handleChat}
            type="Company"
            style={styles.chatButton}
            textStyle={styles.chatButtonText}
            textContainerStyle={styles.chatButtonContent}
          />
          <Image
            source={IMAGES.ic_chat}
            style={styles.chatIcon}
            resizeMode="contain"
          />
        </View>
      </View>
    </LinearContainer>
  );
};

export default EmployeeProfile;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: hp(15),
    paddingHorizontal: wp(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(25),
    paddingTop: hp(20),
    paddingBottom: hp(50),
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: hp(30),
  },
  profileImageContainer: {
    width: wp(120),
    height: wp(120),
    borderRadius: wp(60),
    backgroundColor: '#E8F4FD', // Light blue-gray background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(16),
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(60),
  },
  avatarPlaceholder: {
    backgroundColor: colors._0B3970,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: wp(28),
    fontWeight: '700',
  },
  profileName: {
    ...commonFontStyle(700, 24, colors._0B3970),
    marginBottom: hp(8),
  },
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(8),
    paddingHorizontal: wp(14),
    backgroundColor: colors._0B3970 + '12',
    borderRadius: wp(22),
    alignSelf: 'center',
    paddingVertical: hp(6),
    maxWidth: '95%',
  },
  jobInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobInfoPillText: {
    ...commonFontStyle(500, 14, colors._0B3970),
  },
  desiredText: {
    ...commonFontStyle(500, 12, colors._4A4A4A),
  },
  pillDivider: {
    width: 1,
    height: hp(14),
    backgroundColor: colors._0B3970 + '40',
    marginHorizontal: wp(10),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  locationIcon: {
    width: wp(14),
    height: wp(14),
    tintColor: colors._0B3970,
  },
  locationText: {
    ...commonFontStyle(400, 14, colors._0B3970),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: wp(15),
    padding: hp(20),
    marginBottom: hp(20),
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  cardTitle: {
    ...commonFontStyle(700, 18, colors.black),
    marginBottom: hp(16),
  },
  cardText: {
    ...commonFontStyle(400, 14, colors._656464),
    lineHeight: hp(20),
  },
  entryContainer: {},
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(8),
  },
  entryTitle: {
    ...commonFontStyle(700, 16, colors._0B3970),
    flex: 1,
    marginRight: wp(10),
  },
  entryYears: {
    ...commonFontStyle(400, 14, colors._656464),
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryLink: {
    ...commonFontStyle(500, 14, colors.empPrimary),
    flex: 1,
  },
  entryLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  smallLocationIcon: {
    width: wp(12),
    height: wp(12),
    tintColor: colors._656464,
  },
  entryLocationText: {
    ...commonFontStyle(400, 12, colors._656464),
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
  },
  pill: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: wp(20),
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: colors._E8E8E8,
  },
  pillText: {
    ...commonFontStyle(400, 14, colors._0B3970), // Dark blue text
  },
  bottomSpacing: {
    height: hp(100),
  },
  chatButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(25),
    paddingBottom: hp(50),
    paddingTop: hp(20),
    backgroundColor: colors.white,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 5,
  },
  chatButtonWrapper: {
    width: '100%',
    position: 'relative',
  },
  chatButton: {
    width: '100%',
  },
  chatButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(12),
  },
  chatIcon: {
    width: wp(22),
    height: wp(22),
    left: '39%',
    top: '32%',
    position: 'absolute',
    alignSelf: 'center',
    tintColor: colors.white,
  },
  chatButtonText: {
    ...commonFontStyle(600, 20, colors.white),
    marginLeft: wp(24),
  },
  assessmentCard: {
    backgroundColor: colors._0B3970,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(15),
    paddingHorizontal: wp(20),
    marginBottom: hp(20),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
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
  showReportButton: {
    marginTop: hp(8),
    alignSelf: 'flex-start',
    paddingVertical: hp(4),
    paddingHorizontal: wp(12),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: wp(8),
  },
  showReportText: {
    ...commonFontStyle(600, 14, colors.white),
    textDecorationLine: 'underline',
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
  modalShowReportButton: {
    alignSelf: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: wp(24),
    backgroundColor: colors._0B3970,
    borderRadius: wp(8),
    marginBottom: hp(12),
  },
  modalShowReportText: {
    ...commonFontStyle(600, 14, colors.white),
  },
  modalCancelButton: {
    paddingVertical: hp(12),
    alignItems: 'center',
  },
  modalCancelText: {
    ...commonFontStyle(500, 16, colors._4A4A4A),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageContainer: {
    gap: hp(8),
    flexDirection: 'column',
  },
  languageChipWithDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0D7C8',
    backgroundColor: '#F5F5F5',
    borderRadius: wp(12),
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    paddingBottom: hp(20), // space for the absolute label
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
  resumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resumeChip: {
    flex: 1,
    maxWidth: '72%',
    backgroundColor: '#EAF1F8',
    borderWidth: 1,
    borderColor: '#D6DEE8',
    borderRadius: wp(25),
    paddingHorizontal: wp(18),
    paddingVertical: hp(10),
  },
  resumeChipText: {
    ...commonFontStyle(500, 15, colors._0B3970),
  },
  resumeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
  },
  resumeActionIconBtn: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: colors._0B3970,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeActionIcon: {
    width: wp(16),
    height: wp(16),
    tintColor: colors.white,
  },
});
