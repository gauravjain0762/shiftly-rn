import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import {
  BackHeader,
  GradientButton,
  LinearContainer,
  ShareModal,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  errorToast,
  formatDate,
  navigateTo,
} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../navigation/screenNames';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  useAddRemoveFavouriteMutation,
  useGetEmployeeJobDetailsQuery,
  useGetFavouritesJobQuery,
} from '../../../api/dashboardApi';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import BaseText from '../../../component/common/BaseText';
import CustomImage from '../../../component/common/CustomImage';
import Carousel from 'react-native-reanimated-carousel';

const {width: screenWidth} = Dimensions.get('window');

const JobDetail = () => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const [modal, setModal] = useState(false);
  const {params} = useRoute<RouteProp<any, any>>();
  const data = params?.item;
  const {data: jobDetail} = useGetEmployeeJobDetailsQuery(data?._id);
  const curr_jobdetails = jobDetail?.data?.job;
  const resumeList = jobDetail?.data?.resumes;
  const job_facilities = jobDetail?.data?.job?.facilities;
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const [addRemoveFavoriteJob] = useAddRemoveFavouriteMutation({});
  const {data: getFavoriteJobs, refetch} = useGetFavouritesJobQuery({});
  const favJobList = getFavoriteJobs?.data?.jobs;
  const [activeIndex, setActiveIndex] = useState(0);
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

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

  const isFavorite = localFavorites.includes(data?._id);

  const coverImages =
    data?.company_id?.cover_images?.length > 0
      ? data?.company_id?.cover_images
      : [data?.company_id?.logo];

  const renderCarouselItem = ({item, index}: any) => {
    const isValidImage =
      item &&
      item.startsWith('http') &&
      /\.(jpeg|jpg|png|gif|webp)$/i.test(item);

    return (
      <View key={index} style={styles.carouselItemContainer}>
        <CustomImage
          // resizeMode="cover"
          imageStyle={styles.imageStyle}
          containerStyle={styles.carouselImage}
          source={isValidImage ? {uri: item} : IMAGES.dummy_image}
        />
      </View>
    );
  };

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['bottom', 'top']}}
      containerStyle={{paddingBottom: bottom}}
      colors={['#1958a7ff', '#041326']}>
      <BackHeader
        title={t('Job Detail')}
        containerStyle={styles.headerContainer}
        titleStyle={{
          ...commonFontStyle(600, 22, colors.white),
        }}
        RightIcon={
          <TouchableOpacity
            onPress={() => setModal(!modal)}
            style={styles.right}>
            <Image
              source={IMAGES.share}
              resizeMode="contain"
              style={styles.share}
            />
          </TouchableOpacity>
        }
        leftStyle={styles.lefticon}
      />

      {/* Fixed Carousel */}
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
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <CustomImage
            resizeMode="cover"
            uri={data?.company_id?.logo}
            containerStyle={styles.logoBg}
            imageStyle={{width: '100%', height: '100%'}}
          />
          <View style={styles.locationTitle}>
            <Text style={styles.jobTitle}>{data?.title}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleToggleFavorite(data)}
            style={[styles.like]}>
            <Image
              style={styles.heart}
              source={isFavorite ? IMAGES.like : IMAGES.hart}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Image source={IMAGES.location} style={styles.location} />
          <Text style={styles.locationText}>{data?.address}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{data?.description || 'N|A'}</Text>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>What we need from you</Text>
        <View style={styles.bulletList}>
          {data?.requirements?.map((item: any, index: number) => {
            if (item?.length) {
              return (
                <View key={index}>
                  <BaseText style={styles.description}>{`• ${item}`}</BaseText>
                </View>
              );
            }
          })}
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

        <View style={{height: hp(10)}} />
        {data?.is_applied ? (
          <BaseText
            style={{
              textAlign: 'center',
              ...commonFontStyle(500, 18, colors.white),
            }}>{`Applied on ${formatDate(data?.createdAt)}`}</BaseText>
        ) : (
          <GradientButton
            onPress={() => {
              if (data?.is_applied) {
                errorToast('You already applied for this job.');
                return;
              }
              navigateTo(SCREEN_NAMES.ApplyJob, {
                data: data,
                resumeList: resumeList,
              });
            }}
            title={t(data?.is_applied ? 'Applied' : 'Apply Job')}
          />
        )}
      </ScrollView>

      <ShareModal visible={modal} onClose={() => setModal(!modal)} />
    </LinearContainer>
  );
};

export default JobDetail;

const styles = StyleSheet.create({
  lefticon: {marginRight: wp(21)},
  share: {
    width: wp(17),
    height: wp(17),
  },
  right: {
    backgroundColor: colors.white,
    borderRadius: 100,
    padding: wp(8),
    marginLeft: 'auto',
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
  },
  carouselItemContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  banner: {
    height: hp(230),
    overflow: 'hidden',
    borderRadius: 12,
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
    ...commonFontStyle(400, 16, colors.white),
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
    ...commonFontStyle(400, 14, '#fff'),
  },
  jobTitle: {
    ...commonFontStyle(700, 18, '#fff'),
  },
  heart: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
  },
  description: {
    ...commonFontStyle(400, 14, colors.white),
    lineHeight: 20,
    marginBottom: hp(12),
  },
  sectionTitle: {
    ...commonFontStyle(600, 18, colors.white),
    marginBottom: hp(8),
  },
  bulletList: {
    marginBottom: hp(20),
  },
  bullet: {
    ...commonFontStyle(400, 14, colors.white),
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
});
