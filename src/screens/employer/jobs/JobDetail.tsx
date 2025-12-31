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
  Share,
  ActivityIndicator,
} from 'react-native';

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
  formatDate,
  goBack,
  navigateTo,
  resetNavigation,
} from '../../../utils/commonFunction';
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
  const curr_jobdetails = jobDetail?.data?.job;
  console.log("🔥 ~ JobDetail ~ curr_jobdetails:", curr_jobdetails)
  const resumeList = jobDetail?.data?.resumes;
  const job_facilities = jobDetail?.data?.job?.facilities;
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [addRemoveFavoriteJob] = useAddRemoveFavouriteMutation({});
  const { data: getFavoriteJobs, refetch } = useGetFavouritesJobQuery({});
  const favJobList = getFavoriteJobs?.data?.jobs;
  const [activeIndex, setActiveIndex] = useState(0);
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

  const JobDetailsArr = {
    'Job Type': curr_jobdetails?.job_type,
    Department: curr_jobdetails?.job_sector,
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

  const coverImages =
    curr_jobdetails?.company_id?.cover_images?.length > 0
      ? curr_jobdetails?.company_id?.cover_images
      : [curr_jobdetails?.company_id?.logo];

  const renderCarouselItem = ({ item, index }: any) => {

    return (
      <View key={index} style={styles.carouselItemContainer}>
        <CustomImage
          resizeMode="cover"
          imageStyle={styles.imageStyle}
          containerStyle={styles.carouselImage}
          source={item ? { uri: item } : IMAGES.newlogo}
        />
      </View>
    );
  };

  const handleShare = async () => {
    try {
      const jobId = data?._id || curr_jobdetails?._id;

      if (!jobId) {
        errorToast('Job ID not found');
        return;
      }

      const shareUrl = `https://sky.devicebee.com/Shiftly/share-job/${jobId}`;

      const result = await Share.share({
        message: `Check out this job on Shiftly: ${curr_jobdetails?.title}`,
        url: shareUrl,
        title: 'Shiftly Job',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      console.error('Error sharing:', error.message);
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
          <TouchableOpacity onPress={handle} style={styles.right}>
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
            {/* <View style={styles.alertContainer}>
              <View style={styles.rowContainer}>
                <CustomImage source={IMAGES.ring} size={hp(20)} />
                <BaseText style={styles.addJobText}>{'Add this to J'}</BaseText>
                <Pressable style={styles.alertButton}>
                  <BaseText style={styles.alertText}>{'Job Alert'}</BaseText>
                </Pressable>
              </View>
            </View> */}
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
              <CustomImage
                resizeMode="cover"
                uri={curr_jobdetails?.company_id?.logo}
                containerStyle={styles.logoBg}
                imageStyle={{ width: '100%', height: '100%' }}
              />
              <View style={styles.locationTitle}>
                <Text style={styles.jobTitle}>{curr_jobdetails?.title}</Text>
                <Text style={styles.coNameTitle}>{curr_jobdetails?.company_id?.company_name}</Text>
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
                  <Text style={styles.snapshotValue}>{curr_jobdetails?.contract_type}</Text>
                </View>
              )}

              {/* {curr_jobdetails?.department_id && (
                <View style={styles.snapshotItem}>
                  <Text style={styles.snapshotLabel}>Department</Text>
                  <Text style={styles.snapshotValue}>{curr_jobdetails?.department_id}</Text>
                </View>
              )} */}

              {curr_jobdetails?.monthly_salary_from && curr_jobdetails?.monthly_salary_to && (
                <View style={styles.snapshotItem}>
                  <Text style={styles.snapshotLabel}>Salary</Text>
                  <Text style={styles.snapshotValue}>
                    AED {curr_jobdetails?.monthly_salary_from} - {curr_jobdetails?.monthly_salary_to}
                  </Text>
                </View>
              )}

              {curr_jobdetails?.createdAt && (
                <View style={styles.snapshotItem}>
                  <Text style={styles.snapshotLabel}>Posted</Text>
                  <Text style={styles.snapshotValue}>{getDaysAgo(curr_jobdetails?.createdAt)}</Text>
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
              {curr_jobdetails?.requirements?.map(
                (item: any, index: number) => {
                  if (item?.length) {
                    return (
                      <View key={index}>
                        <BaseText
                          style={styles.description}>{`• ${item}`}</BaseText>
                      </View>
                    );
                  }
                },
              )}
            </View>

            {/* Offer */}
            <Text style={styles.sectionTitle}>What we offer</Text>
            <View style={styles.bulletList}>
              {job_facilities?.map((item: any, index: number) => {
                return (
                  <View key={index}>
                    <BaseText
                      style={styles.description}>{`• ${item?.title}`}</BaseText>
                  </View>
                );
              })}
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
                        {key === 'Salary' && <Image source={IMAGES.currency} />}
                        <Text style={styles.detailValue}>{value || '-'}</Text>
                      </View>
                    </View>
                  );
                }}
              />
            </View>

            <View style={{ height: hp(40) }} />
            {curr_jobdetails?.is_applied ? (
              <BaseText
                style={{
                  textAlign: 'center',
                  ...commonFontStyle(500, 18, colors._0B3970),
                }}>{`Applied on ${formatDate(
                  curr_jobdetails?.createdAt,
                )}`}</BaseText>
            ) : (
              <GradientButton
                type="Company"
                onPress={() => {
                  if (curr_jobdetails?.is_applied) {
                    errorToast('You already applied for this job.');
                    return;
                  }
                  navigateTo(SCREEN_NAMES.ApplyJob, {
                    data: curr_jobdetails,
                    resumeList: resumeList,
                  });
                }}
                title={curr_jobdetails?.is_applied ? 'Applied' : 'Apply Now'}
              />
            )}
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
    position: 'relative',
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
});
