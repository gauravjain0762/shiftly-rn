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
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
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
  useCloseCompanyJobMutation,
  useGetCompanyJobDetailsQuery,
  useUnshortlistEmployeeMutation,
} from '../../../api/dashboardApi';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import {
  errorToast,
  navigateTo,
  successToast,
  getExpiryDays,
  goBack,
} from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useDispatch } from 'react-redux';
import { setJobFormState } from '../../../features/companySlice';
import moment from 'moment';
import BaseText from '../../../component/common/BaseText';
import CustomImage from '../../../component/common/CustomImage';
import InterviewScoresModal from '../../../component/common/InterviewScoresModal';

const CoJobDetails = () => {
  const { t } = useTranslation();
  const { params } = useRoute<any>();
  const dispatch = useDispatch();
  const job_id = params?._id as any;
  const [isShareModalVisible, setIsShareModalVisible] =
    useState<boolean>(false);
  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'General' | 'Languages'>('General');

  const { data, refetch, isLoading } = useGetCompanyJobDetailsQuery(job_id);
  const [addShortListEmployee] = useAddShortlistEmployeeMutation({});
  const [removeShortListEmployee] = useUnshortlistEmployeeMutation({});
  const [closeJob] = useCloseCompanyJobMutation();
  const jobDetail = data?.data?.job;
  console.log("🔥 ~ CoJobDetails ~ jobDetail:", jobDetail)

  const shareUrl = data?.data?.share_url;

  const coverImages = (() => {
    const coverImgs = jobDetail?.company_id?.cover_images;
    const logo = jobDetail?.company_id?.logo;

    if (coverImgs && Array.isArray(coverImgs) && coverImgs.length > 0) {
      const validCoverImages = coverImgs.filter(img => img && typeof img === 'string' && img.trim() !== '');
      if (validCoverImages.length > 0) {
        return validCoverImages;
      }
    }

    if (logo && typeof logo === 'string' && logo.trim() !== '') {
      return [logo];
    }

    return [IMAGES.logoText];
  })();

  const downloadImage = async (url: string) => {
    const filePath = `${RNFS.CachesDirectoryPath}/job_${Date.now()}.jpg`;

    await RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
    }).promise;

    return `file://${filePath}`;
  };

  const handleShare = async () => {
    try {
      const title = jobDetail?.title || 'Job Opportunity';
      const area = jobDetail?.address || jobDetail?.area || '';
      const description = jobDetail?.description || '';
      const salary =
        jobDetail?.monthly_salary_from || jobDetail?.monthly_salary_to
          ? `Salary: ${jobDetail?.currency} ${jobDetail?.monthly_salary_from?.toLocaleString()} - ${jobDetail?.monthly_salary_to?.toLocaleString()}`
          : '';

      const shareUrlText = shareUrl ? `\n\n${shareUrl}` : '';

      const message = `${title}
${area}

${description}

${salary}${shareUrlText}`;

      const shareOptions: any = {
        title: title,
        message: message,
        url: shareUrl,
      };

      const coverImageUri = coverImages && coverImages.length > 0 && typeof coverImages[0] === 'string'
        ? coverImages[0]
        : (jobDetail?.company_id?.logo && typeof jobDetail.company_id.logo === 'string'
          ? jobDetail.company_id.logo
          : null);

      if (coverImageUri && typeof coverImageUri === 'string') {
        try {
          const imagePath = await downloadImage(coverImageUri);
          shareOptions.url = imagePath;
          shareOptions.type = 'image/jpeg';
        } catch (imageError) {
          console.log('❌ Image download error:', imageError);
        }
      }

      await Share.open(shareOptions);

    } catch (err: any) {
      if (err?.message !== 'User did not share') {
        console.log('❌ Share error:', err);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleCloseJob = async () => {
    try {
      const res = await closeJob({ job_id: job_id }).unwrap();
      if (res?.status) {
        successToast(res?.message || 'Job closed successfully');
        goBack();
      } else {
        errorToast(res?.message || 'Failed to close job');
      }
    } catch (error) {
      console.error('Error closing job:', error);
      errorToast('Something went wrong while closing the job');
    }
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} color={colors._D5D5D5} />
        </View>
      ) : (
        <>
          <BackHeader
            type="company"
            isRight={false}
            title="Jobs Detail"
            titleStyle={styles.title}
            containerStyle={styles.header}
          />

          <ScrollView>
            <View style={styles.bodyContainer}>
              {/* Job Card (Interview Status Style) */}
              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>{jobDetail?.company_id?.company_name?.[0] || 'A'}</Text>
                  </View>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{jobDetail?.title || 'N/A'}</Text>
                    <Text style={styles.companyName}>{jobDetail?.company_id?.company_name || 'N/A'}</Text>
                    <View style={styles.jobMetaRow}>
                      <Text style={styles.jobMeta}>
                        {`${jobDetail?.area || jobDetail?.address || 'Location'} - ${jobDetail?.contract_type || 'Full Time'}`}
                      </Text>
                      <Text style={styles.salary}>
                        {jobDetail?.monthly_salary_to
                          ? `${jobDetail?.currency} ${Number(jobDetail?.monthly_salary_to).toLocaleString()}`
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Candidate Card (Using first applicant/invited user or placeholder) */}
              <View style={[styles.card, { backgroundColor: '#BEDEFF3B', marginTop: hp(20) }]}>
                <View style={[styles.row, { alignItems: 'center' }]}>
                  <CustomImage
                    uri={jobDetail?.applicants?.[0]?.user_id?.picture || 'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=300&q=80'}
                    containerStyle={styles.avatar}
                    imageStyle={styles.avatar}
                  />
                  <View style={styles.candidateInfo}>
                    <Text style={styles.candidateName}>{jobDetail?.applicants?.[0]?.user_id?.name || 'Tafnol Theresa'}</Text>
                    <Text style={styles.candidateRole}>{jobDetail?.applicants?.[0]?.user_id?.responsibility || 'Hotel Management'}</Text>
                  </View>
                  <View style={styles.statusCol}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{t('Completed')}</Text>
                    </View>
                    <Text style={styles.dateText}>2:30 PM - 04Jan</Text>
                  </View>
                </View>
              </View>

              {/* Media Buttons */}
              <View style={styles.mediaRow}>
                <TouchableOpacity style={styles.mediaButton}>
                  <Image source={IMAGES.sound} style={styles.mediaIcon} />
                  <Text style={styles.mediaText}>{t('Listen Audio')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaButton}>
                  <Image source={IMAGES.watch} style={styles.mediaIcon} />
                  <Text style={styles.mediaText}>{t('Watch Interview')}</Text>
                </TouchableOpacity>
              </View>

              {/* Transcript */}
              <Text style={styles.sectionTitle}>{t('Transcript')}</Text>
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptText}>
                  <Text style={styles.speaker}>{t('Agent')}: </Text>
                  Hi, I'm from Emirates Catering calling about your AI-powered
                  interview. How are you doing?
                </Text>
                <Text style={[styles.transcriptText, { marginTop: hp(12) }]}>
                  <Text style={styles.speaker}>{t('User')}: </Text>
                  I'm very good. Thank you so much. How are you?
                </Text>
                <Text style={[styles.transcriptText, { marginTop: hp(12) }]}>
                  <Text style={styles.speaker}>{t('Agent')}: </Text>
                  I'm doing great, thanks for asking! I appreciate you taking the time
                  to chat today. So, thanks for your interest in the Flight Attendant
                  position with us. I'm really looking forward to learning more about
                  your background and seeing how this role Read More...
                </Text>
              </View>

              {/* Chat with Admin */}
              <TouchableOpacity style={styles.chatButton}>
                <View style={styles.chatIconWrapper}>
                  <Image source={IMAGES.chat} style={styles.chatIcon} resizeMode="contain" />
                </View>
                <View>
                  <Text style={styles.chatTitle}>{t('Chat With Admin')}</Text>
                  <Text style={styles.chatSubtitle}>
                    {t('Get feel free information')}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* View Interview Scores */}
              <Text style={styles.sectionTitle}>{t('View Interview Scores')}</Text>
              <View style={styles.scoreButtonsRow}>
                <TouchableOpacity
                  style={[styles.scoreButton, styles.scoreButtonActive]}
                  onPress={() => { setActiveTab('General'); setModalVisible(true); }}>
                  <Text style={styles.scoreButtonTextActive}>{t('General')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.scoreButton, styles.scoreButtonActive]}
                  onPress={() => { setActiveTab('Languages'); setModalVisible(true); }}>
                  <Text style={styles.scoreButtonTextActive}>{t('Languages')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <InterviewScoresModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            initialTab={activeTab}
          />

          <GradientButton
            type="Company"
            style={styles.button}
            title={t('Edit Job')}
            onPress={() => {
              dispatch(
                setJobFormState({
                  job_id: job_id,
                  title: jobDetail?.title,
                  contract_type:
                    typeof jobDetail?.contract_type === 'string'
                      ? {
                        label: jobDetail?.contract_type,
                        value: jobDetail?.contract_type,
                      }
                      : jobDetail?.contract_type || {
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

          <TouchableOpacity
            style={styles.closeJobButton}
            onPress={handleCloseJob}>
            <Text style={styles.closeJobText}>{t('Close Job')}</Text>
          </TouchableOpacity>
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
    ...commonFontStyle(600, 18, colors._0B3970),
    marginTop: hp(20),
    marginBottom: hp(10),
  },
  transcriptBox: {
    borderWidth: 1,
    borderColor: '#E2E6F0',
    borderRadius: wp(12),
    padding: wp(16),
    backgroundColor: colors.white,
  },
  transcriptText: {
    ...commonFontStyle(400, 14, colors.black),
    lineHeight: hp(22),
  },
  speaker: {
    fontWeight: '700',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8FE',
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: wp(40),
    paddingHorizontal: wp(20),
    paddingVertical: hp(14),
    gap: wp(14),
    marginTop: hp(20),
  },
  chatIconWrapper: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: '#2FB465',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatIcon: {
    width: wp(20),
    height: wp(20),
    tintColor: colors.white,
  },
  chatTitle: {
    ...commonFontStyle(600, 16, colors.black),
  },
  chatSubtitle: {
    ...commonFontStyle(400, 13, '#666'),
  },
  scoreButtonsRow: {
    flexDirection: 'row',
    gap: wp(16),
    marginBottom: hp(20),
  },
  scoreButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(16),
    borderRadius: wp(30),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E2E6F0',
  },
  scoreButtonActive: {
    backgroundColor: colors._0B3970,
    borderColor: colors._0B3970,
  },
  scoreButtonTextActive: {
    ...commonFontStyle(600, 16, colors.white),
  },
  button: {
    marginBottom: hp(10),
    marginHorizontal: wp(20),
  },
  closeJobButton: {
    marginBottom: hp(20),
    alignSelf: 'center',
    padding: 10,
  },
  closeJobText: {
    ...commonFontStyle(600, 16, colors._EE4444),
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: wp(0),
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
  salaryContainerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
    marginBottom: hp(12),
  },
  salaryIconDetails: {
    width: wp(18),
    height: hp(18),
    resizeMode: 'contain',
  },
  salaryTextDetails: {
    ...commonFontStyle(600, 15, colors.black),
  },
  expiryContainerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
    marginBottom: hp(12),
  },
  expiryTextDetails: {
    ...commonFontStyle(500, 14, colors._EE4444),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: wp(12),
    padding: wp(16),
    marginBottom: hp(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    gap: wp(12),
  },
  logoContainer: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(12),
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: hp(24),
    fontWeight: '700',
    color: colors._0B3970,
  },
  jobInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: hp(16),
    fontWeight: '600',
    color: colors.black,
    marginBottom: hp(4),
  },
  companyName: {
    fontSize: hp(14),
    color: '#666666',
    marginBottom: hp(4),
  },
  jobMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobMeta: {
    fontSize: hp(12),
    color: '#999999',
  },
  salary: {
    fontSize: hp(12),
    fontWeight: '600',
    color: colors._0B3970,
  },
  avatar: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
  },
  candidateInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  candidateName: {
    fontSize: hp(16),
    fontWeight: '600',
    color: colors.black,
  },
  candidateRole: {
    fontSize: hp(14),
    color: '#666666',
    marginTop: hp(2),
  },
  statusCol: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: '#E7F9E9',
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    borderRadius: wp(4),
    marginBottom: hp(4),
  },
  statusText: {
    fontSize: hp(12),
    color: '#2FB465',
    fontWeight: '600',
  },
  dateText: {
    fontSize: hp(10),
    color: '#999999',
  },
  mediaRow: {
    flexDirection: 'row',
    gap: wp(16),
    marginBottom: hp(24),
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: hp(12),
    borderRadius: wp(30),
    borderWidth: 1,
    borderColor: '#E2E6F0',
    gap: wp(8),
  },
  mediaIcon: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
  },
  mediaText: {
    fontSize: hp(14),
    fontWeight: '600',
    color: colors.black,
  },
});
