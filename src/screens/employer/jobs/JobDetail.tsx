import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

import {
  BackHeader,
  GradientButton,
  LinearContainer,
  ShareModal,
} from '../../../component';
import { useTranslation } from 'react-i18next';
import { IMAGES } from '../../../assets/Images';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { RouteProp, useRoute } from '@react-navigation/native';
import {
  errorToast,
  goBack,
  navigateTo,
  resetNavigation,
} from '../../../utils/commonFunction';
import { getCurrencySymbol } from '../../../utils/currencySymbols';
import { SCREEN_NAMES, SCREENS } from '../../../navigation/screenNames';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useAddRemoveFavouriteMutation,
  useGetEmployeeJobDetailsQuery,
  useGetFavouritesJobQuery,
} from '../../../api/dashboardApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import BaseText from '../../../component/common/BaseText';
import CustomImage from '../../../component/common/CustomImage';
import Carousel from 'react-native-reanimated-carousel';
import { navigationRef } from '../../../navigation/RootContainer';

const { width: screenWidth } = Dimensions.get('window');

const JobDetail = () => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [modal, setModal] = useState(false);
  const { params } = useRoute<RouteProp<any, any>>() as any;
  const data = params || params?.item;
  const { data: jobDetail, isLoading } = useGetEmployeeJobDetailsQuery(
    data?.item?._id || data?.jobId,
  );
  console.log("~ JobDetail ~ jobDetail:", jobDetail)
  const curr_jobdetails = jobDetail?.data?.job;
  console.log('~ JobDetail ~ curr_jobdetails:', curr_jobdetails);
  const resumeList = jobDetail?.data?.resumes;
  const job_facilities = jobDetail?.data?.job?.facilities;
  const shareUrl = jobDetail?.data?.share_url;
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [addRemoveFavoriteJob] = useAddRemoveFavouriteMutation({});
  const { data: getFavoriteJobs, refetch } = useGetFavouritesJobQuery({});
  const favJobList = getFavoriteJobs?.data?.jobs;
  const [activeIndex, setActiveIndex] = useState(0);
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);
  const is_applied = params?.is_applied;
  const hide_apply = params?.hide_apply;

  const JobDetailsArr = {
    'Job Type': curr_jobdetails?.contract_type,
    Department: curr_jobdetails?.department_id?.title,
    'Start Date': curr_jobdetails?.start_date,
    Duration: curr_jobdetails?.duration,
    Vacancy: curr_jobdetails?.no_positions,
  };
  const keyValueArray = Object.entries(JobDetailsArr);

  useEffect(() => {
    if (favJobList) {
      setLocalFavorites(favJobList.map((job: any) => job._id));
    }
  }, [favJobList]);

  const handleToggleFavorite = async (job: any) => {
    const jobId = job._id;

    setLocalFavorites(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId],
    );

    try {
      const res = await addRemoveFavoriteJob({
        job_id: jobId,
        user_id: userInfo?.user_id,
      }).unwrap();

      if (!res?.status) {
        setLocalFavorites(prev =>
          prev.includes(jobId)
            ? prev.filter(id => id !== jobId)
            : [...prev, jobId],
        );
        errorToast(res?.message);
      } else {
        refetch();
      }
    } catch (error) {
      setLocalFavorites(prev =>
        prev.includes(jobId)
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId],
      );
      console.log('error', error);
    }
  };

  const isFavorite = localFavorites.includes(curr_jobdetails?._id);

  const coverImages = (() => {
    const coverImgs = curr_jobdetails?.company_id?.cover_images;
    const logo = curr_jobdetails?.company_id?.logo;

    // Check if cover_images exists and has valid entries
    if (coverImgs && Array.isArray(coverImgs) && coverImgs.length > 0) {
      // Filter out null/undefined/empty values
      const validCoverImages = coverImgs.filter(
        img => img && typeof img === 'string' && img.trim() !== '',
      );
      if (validCoverImages.length > 0) {
        return validCoverImages;
      }
    }

    // Fallback to logo if available
    if (logo && typeof logo === 'string' && logo.trim() !== '') {
      return [logo];
    }

    // Final fallback to logoText
    return [IMAGES.logoText];
  })();

  const renderCarouselItem = ({ item, index }: any) => {
    // Handle both URI strings and require resources (numbers)
    const isCoverImage = typeof item === 'string';
    const imageSource = isCoverImage
      ? { uri: item }
      : typeof item === 'number'
        ? item
        : IMAGES.logoText;

    return (
      <View key={index?.toString()} style={styles.carouselItemContainer}>
        <CustomImage
          resizeMode={isCoverImage ? 'cover' : 'contain'}
          imageStyle={styles.imageStyle}
          containerStyle={styles.carouselImage}
          source={imageSource}
        />
      </View>
    );
  };

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
      const title = curr_jobdetails?.title || 'Job Opportunity';
      const area = curr_jobdetails?.address || curr_jobdetails?.area || '';
      const description = curr_jobdetails?.description || '';
      const salary =
        curr_jobdetails?.monthly_salary_from ||
          curr_jobdetails?.monthly_salary_to
          ? `Salary: ${getCurrencySymbol(curr_jobdetails?.currency)}${curr_jobdetails?.monthly_salary_from?.toLocaleString()} - ${curr_jobdetails?.monthly_salary_to?.toLocaleString()}`
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

      // Use cover image if available, otherwise use company logo
      // Only use string URLs for sharing (not require resources)
      const coverImageUri =
        coverImages &&
          coverImages.length > 0 &&
          typeof coverImages[0] === 'string'
          ? coverImages[0]
          : curr_jobdetails?.company_id?.logo &&
            typeof curr_jobdetails.company_id.logo === 'string'
            ? curr_jobdetails.company_id.logo
            : null;

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

  const handleGoBack = () => {
    if (navigationRef.canGoBack()) {
      goBack();
    } else {
      console.log('navigating to the Jobscreen');
      resetNavigation(SCREENS.EmployeeStack, SCREENS.JobsScreen);
    }
  };

  const getDaysAgo = (dateString: string) => {
    if (!dateString) return null;
    const jobDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - jobDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleLearnMore = () => {
    if (curr_jobdetails?.company_id?._id) {
      (navigationRef.navigate as any)(SCREENS.CompanyProfile, {
        companyId: curr_jobdetails?.company_id?._id,
        fromJobDetail: true,
      });
    }
  };

  return (
    <LinearContainer
      SafeAreaProps={{ edges: ['bottom', 'top'] }}
      containerStyle={{ paddingBottom: bottom }}
      colors={[colors._F7F7F7, colors._F7F7F7]}>
      <BackHeader
        type="employe"
        title={'Job Detail'}
        onBackPress={handleGoBack}
        containerStyle={styles.headerContainer}
        RightIcon={
          <TouchableOpacity onPress={handleShare} style={styles.right}>
            <Image
              source={IMAGES.share}
              resizeMode="contain"
              style={styles.share}
              tintColor={colors._0B3970}
            />
          </TouchableOpacity>
        }
        leftStyle={styles.lefticon}
      />

      {isLoading ? (
        <ActivityIndicator size={'large'} color={colors._D5D5D5} />
      ) : (
        <>
          <View style={styles.bannerWrapper}>
            {coverImages && coverImages?.length > 0 && (
              <>
                <View style={styles.carouselShadowContainer}>
                  <Carousel
                    loop={coverImages?.length > 1}
                    width={screenWidth}
                    height={hp(230)}
                    autoPlay={coverImages?.length > 1}
                    autoPlayInterval={4000}
                    data={coverImages}
                    scrollAnimationDuration={500}
                    onSnapToItem={index => setActiveIndex(index)}
                    renderItem={renderCarouselItem}
                    style={styles.carousel}
                  />
                </View>
                {/* Pagination Dots - Only show if more than 1 image */}
                {coverImages?.length > 1 && (
                  <View style={styles.pagination}>
                    {coverImages?.map(
                      (_: any, index: React.Key | null | undefined) => (
                        <View
                          key={index}
                          style={[
                            styles.dot,
                            activeIndex === index && styles.activeDot,
                          ]}
                        />
                      ),
                    )}
                  </View>
                )}
              </>
            )}
          </View>

          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: hp(20) }}
            showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleLearnMore}>
                <CustomImage
                  resizeMode={
                    curr_jobdetails?.company_id?.logo ? 'cover' : 'contain'
                  }
                  uri={curr_jobdetails?.company_id?.logo || undefined}
                  source={
                    !curr_jobdetails?.company_id?.logo
                      ? IMAGES.logoText
                      : undefined
                  }
                  containerStyle={styles.logoBg}
                  imageStyle={{ width: '100%', height: '100%' }}
                />
              </TouchableOpacity>
              <View style={styles.locationTitle}>
                <Text style={styles.jobTitle}>{curr_jobdetails?.title}</Text>
                <Text style={styles.coNameTitle}>
                  {curr_jobdetails?.company_id?.company_name}
                </Text>

                {(curr_jobdetails?.monthly_salary_from ||
                  curr_jobdetails?.monthly_salary_to) && (
                    <View style={styles.salaryContainerHeader}>
                      <Text style={styles.salaryTextHeader}>
                        {curr_jobdetails?.currency?.toUpperCase()}
                      </Text>
                      {curr_jobdetails?.currency?.toUpperCase() === 'AED' ? (
                        <Image source={IMAGES.currency} style={styles.currencyImage} />
                      ) : (
                        <Text style={styles.salaryTextHeader}>{getCurrencySymbol(curr_jobdetails?.currency)}</Text>
                      )}
                      <Text style={styles.salaryTextHeader}>
                        {`${curr_jobdetails?.monthly_salary_from?.toLocaleString()} - ${curr_jobdetails?.monthly_salary_to?.toLocaleString()}`}
                      </Text>
                    </View>
                  )}
              </View>
              <TouchableOpacity
                onPress={() => handleToggleFavorite(curr_jobdetails)}
                style={[styles.like]}>
                <Image
                  style={styles.heart}
                  source={isFavorite ? IMAGES.like : IMAGES.hart}
                  tintColor={colors._0B3970}
                />
              </TouchableOpacity>
            </View>

            {/* Quick Info Snapshot */}
            <View style={styles.snapshotContainer}>
              {curr_jobdetails?.contract_type && (
                <View style={styles.snapshotItem}>
                  <Text style={styles.snapshotLabel}>Employment Type</Text>
                  <Text style={styles.snapshotValue}>
                    {curr_jobdetails?.contract_type}
                  </Text>
                </View>
              )}

              {curr_jobdetails?.department_id?.title && (
                <View style={styles.snapshotItem}>
                  <Text style={styles.snapshotLabel}>Department</Text>
                  <Text style={styles.snapshotValue}>
                    {curr_jobdetails?.department_id?.title}
                  </Text>
                </View>
              )}

              {curr_jobdetails?.monthly_salary_from &&
                curr_jobdetails?.monthly_salary_to && (
                  <View style={styles.snapshotItem}>
                    <Text style={styles.snapshotLabel}>Salary</Text>
                    <View style={styles.valueRow}>
                      <Text style={styles.snapshotValue}>
                        {curr_jobdetails?.currency?.toUpperCase()}
                      </Text>
                      {curr_jobdetails?.currency?.toUpperCase() === 'AED' ? (
                        <Image source={IMAGES.currency} style={styles.currencyImageSnapshot} />
                      ) : (
                        <Text style={styles.snapshotValue}>{getCurrencySymbol(curr_jobdetails?.currency)}</Text>
                      )}
                      <Text style={styles.snapshotValue}>
                        {`${curr_jobdetails?.monthly_salary_from?.toLocaleString()} - ${curr_jobdetails?.monthly_salary_to?.toLocaleString()}`}
                      </Text>
                    </View>
                  </View>
                )}

              {curr_jobdetails?.createdAt && (
                <View style={styles.snapshotItem}>
                  <Text style={styles.snapshotLabel}>Posted</Text>
                  <Text style={styles.snapshotValue}>
                    {getDaysAgo(curr_jobdetails?.createdAt)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.row}>
              <Image
                source={IMAGES.location}
                style={styles.location}
                tintColor={colors._0B3970}
              />
              <Text style={styles.locationText}>
                {curr_jobdetails?.address}
              </Text>
            </View>

            {/* Description */}
            <Text style={styles.sectionTitle}>Responsibilities</Text>
            <Text style={styles.description}>
              {curr_jobdetails?.description || 'N|A'}
            </Text>

            {/* Requirements */}
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.bulletList}>
              {curr_jobdetails?.job_requirements?.length > 0 ? (
                curr_jobdetails?.job_requirements?.map((item: any, index: number) => (
                  <View key={index}>
                    <BaseText style={styles.description}>{`• ${item?.title}`}</BaseText>
                  </View>
                ))
              ) : (
                <Text style={styles.description}>N/A</Text>
              )}
            </View>

            {/* Offer */}
            <Text style={styles.sectionTitle}>What we offer</Text>
            <View style={styles.bulletList}>
              {curr_jobdetails?.essential_benefits?.length > 0 ? (
                curr_jobdetails?.essential_benefits?.map((item: any, index: number) => (
                  <View key={index}>
                    <BaseText style={styles.description}>{`• ${item?.title}`}</BaseText>
                  </View>
                ))
              ) : (
                <Text style={styles.description}>N/A</Text>
              )}
            </View>


            <View style={styles.jobDetailsContainer}>
              <Text style={styles.sectionTitle}>{t('Job Details')}</Text>

              <FlatList
                numColumns={3}
                scrollEnabled={false}
                data={keyValueArray}
                style={styles.flatlist}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item, index }) => {
                  const [key, value] = item;

                  return (
                    <View key={index} style={styles.detailItem}>
                      <Text style={styles.detailKey}>{key}</Text>

                      <View style={styles.valueWrapper}>
                        <Text style={styles.detailValue}>
                          {key === 'Salary' && value ? (
                            <Text>
                              {`${curr_jobdetails?.currency?.toUpperCase()} `}
                              {curr_jobdetails?.currency?.toUpperCase() === 'AED' ? (
                                <Image
                                  source={IMAGES.currency}
                                  style={styles.currencyImageSnapshot}
                                />
                              ) : (
                                <BaseText style={styles.snapshotValue}>
                                  {getCurrencySymbol(curr_jobdetails?.currency)}
                                </BaseText>
                              )}
                              {`${curr_jobdetails?.monthly_salary_from?.toLocaleString()} - ${curr_jobdetails?.monthly_salary_to?.toLocaleString()}`}
                            </Text>
                          ) : (value || '-')}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            </View>

            <View style={{ height: hp(40) }} />
            {!hide_apply && (
              <GradientButton
                type="Company"
                disabled={is_applied}
                onPress={() => {
                  if (is_applied) {
                    errorToast('You already applied for this job.');
                    return;
                  }
                  navigateTo(SCREEN_NAMES.ApplyJob, {
                    data: curr_jobdetails,
                    resumeList: resumeList,
                  });
                }}
                title={is_applied ? 'Applied' : 'Apply Now'}
              />
            )}

            <TouchableOpacity
              style={styles.learnMoreContainer}
              onPress={handleLearnMore}>
              <Text style={styles.learnMoreText}>
                Learn more about{' '}
                <Text style={styles.companyNameText}>
                  {curr_jobdetails?.company_id?.company_name}
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
      <ShareModal visible={modal} onClose={() => setModal(!modal)} />
    </LinearContainer>
  );
};

export default JobDetail;

const styles = StyleSheet.create({
  lefticon: { marginRight: wp(21) },
  share: {
    width: wp(17),
    height: wp(17),
  },
  right: {
    padding: wp(8),
    borderRadius: 100,
    marginLeft: 'auto',
    backgroundColor: 'transparent',
  },
  headerContainer: {
    paddingTop: hp(15),
    paddingHorizontal: wp(16),
  },
  bannerWrapper: {
    width: '100%',
    height: hp(230),
    marginTop: hp(10),
    marginBottom: hp(8),
    position: 'relative',
  },
  carouselShadowContainer: {
    width: '100%',
    height: hp(230),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'visible',
  },
  carousel: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselItemContainer: {
    width: '100%',
    height: '100%',
    // borderRadius: 12,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    // borderRadius: 12,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    // borderRadius: 12,
  },
  banner: {
    height: hp(230),
    overflow: 'hidden',
    // borderRadius: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 12,
    height: 8,
    borderRadius: 4,
  },
  noImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  noImageText: {
    ...commonFontStyle(400, 16, colors._0B3970),
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(26),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(20),
  },
  logo: {
    height: hp(34),
    resizeMode: 'contain',
    width: '100%',
    overflow: 'hidden',
  },
  locationTitle: {
    marginLeft: wp(12),
    gap: hp(8),
    flex: 0.89,
  },
  locationText: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
  },
  jobTitle: {
    ...commonFontStyle(700, 18, colors._0B3970),
  },
  coNameTitle: {
    ...commonFontStyle(500, 14, colors._4A4A4A),
  },
  heart: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
  },
  description: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
    lineHeight: 20,
    marginBottom: hp(12),
  },
  sectionTitle: {
    ...commonFontStyle(600, 18, colors._0B3970),
    marginBottom: hp(8),
  },
  flatlist: {
    marginTop: hp(27),
  },
  flatListContent: {
    gap: hp(34),
  },
  detailItem: {
    gap: hp(8),
    width: '34%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailKey: {
    textAlign: 'center',
    ...commonFontStyle(600, 17, colors._0B3970),
  },
  detailValue: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
    textAlign: 'center',
  },
  bulletList: {
    marginBottom: hp(20),
  },
  bullet: {
    ...commonFontStyle(400, 14, colors._4A4A4A),
    marginBottom: hp(8),
    lineHeight: 25,
  },
  logoBg: {
    backgroundColor: colors.white,
    width: wp(73),
    height: wp(73),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  like: {
    backgroundColor: colors.white,
    padding: wp(8),
    borderRadius: 100,
    marginLeft: 'auto',
  },
  location: {
    width: wp(17),
    height: wp(17),
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(4),
    marginBottom: hp(15),
  },
  jobDetailsContainer: {
    marginTop: hp(10),
  },
  alertContainer: {
    width: '70%',
    bottom: '12%',
    height: hp(45),
    alignSelf: 'center',
    borderRadius: hp(10),
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: colors.coPrimary,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
    justifyContent: 'space-between',
  },
  addJobText: { ...commonFontStyle(500, 13, colors.black) },
  alertButton: {
    borderRadius: hp(20),
    paddingVertical: hp(8),
    paddingHorizontal: wp(10),
    backgroundColor: colors.empPrimary,
  },
  alertText: { ...commonFontStyle(500, 10, colors.white) },
  snapshotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.white,
    borderRadius: hp(12),
    padding: wp(16),
    marginBottom: hp(16),
    gap: hp(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  snapshotItem: {
    width: '48%',
    gap: hp(4),
  },
  snapshotLabel: {
    ...commonFontStyle(500, 12, colors._4A4A4A),
  },
  snapshotValue: {
    ...commonFontStyle(600, 14, colors._0B3970),
  },
  learnMoreContainer: {
    paddingVertical: hp(20),
    paddingHorizontal: wp(20),
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  learnMoreText: {
    ...commonFontStyle(400, 14, colors._2F2F2F),
  },
  companyNameText: {
    ...commonFontStyle(600, 14, colors._0B3970),
    textDecorationLine: 'underline',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salaryContainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    marginTop: hp(4),
  },
  currencyImage: {
    width: wp(14),
    height: hp(11),
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  currencyImageSnapshot: {
    width: wp(14),
    height: hp(11),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  currencyImageDetail: {
    width: wp(14),
    height: hp(11),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  salaryIconHeader: {
    width: wp(14),
    height: hp(14),
    resizeMode: 'contain',
  },
  salaryTextHeader: {
    ...commonFontStyle(600, 13, colors.black),
  },
});
