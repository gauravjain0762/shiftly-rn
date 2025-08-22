import React, {useState} from 'react';
import {
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
import {useTranslation} from 'react-i18next';
import {IMAGES} from '../../../assets/Images';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  errorToast,
  navigateTo,
  successToast,
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
import {API} from '../../../utils/apiConstant';
import BaseText from '../../../component/common/BaseText';

const JobDetail = () => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const [modal, setModal] = useState(false);
  const {params} = useRoute<RouteProp<any, any>>();
  const data = params?.item;
  const {data: jobDetail} = useGetEmployeeJobDetailsQuery(data?._id);
  const curr_jobdetails = jobDetail?.data?.job;
  const resumeList = jobDetail?.data?.resumes;
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const [addRemoveFavoriteJob] = useAddRemoveFavouriteMutation({});
  const {data: getFavoriteJobs, refetch} = useGetFavouritesJobQuery({});
  const favJobList = getFavoriteJobs?.data?.jobs;

  const handleAddRemoveFavoriteJob = async (item: any) => {
    try {
      const res = await addRemoveFavoriteJob({
        job_id: item?._id,
        user_id: userInfo?.user_id,
      }).unwrap();

      if (res?.status) {
        successToast(res?.message);
        await refetch();
      } else {
        errorToast(res?.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const isFavorite = favJobList?.some((fav: any) => fav._id === data?._id);

  return (
    <LinearContainer
      SafeAreaProps={{edges: ['bottom', 'top']}}
      containerStyle={{paddingBottom: bottom}}
      colors={['#1958a7ff', '#041326']}>
      <BackHeader
        title={t('Job Detail')}
        containerStyle={styles.headerContainer}
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
      <Image
        resizeMode="cover"
        style={styles.banner}
        source={
          curr_jobdetails?.company_id?.cover_images?.length
            ? {uri: API.BASE_URL + curr_jobdetails.company_id.cover_images[0]}
            : data?.company_id?.logo
        }
      />

      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoBg}>
            <Image
              resizeMode="contain"
              source={{
                uri: data?.company_id?.logo,
              }}
              style={styles.logo}
            />
          </View>
          <View style={styles.locationTitle}>
            <View style={styles.row}>
              <Image source={IMAGES.location} style={styles.location} />
              <Text style={styles.locationText}>{data?.address}</Text>
            </View>
            <Text style={styles.jobTitle}>{data?.title}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleAddRemoveFavoriteJob(data)}
            style={[styles.like, {padding: isFavorite ? hp(4) : hp(8)}]}>
            <Image
              style={isFavorite ? styles.filledHeart : styles.heart}
              source={isFavorite ? IMAGES.ic_favorite : IMAGES.like}
            />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          {data?.description ||
            `Atlantis Collection is a diverse group of luxury hotels with a fresh focus, offering guests a more authentic and thoughtful way to travel. We've created a collection brand that gives guests & colleagues an inspiring new choice. One that puts people at the heart of everything we do, to reframe luxury hospitality for the better.`}
        </Text>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>What we need from you</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>
            • Bachelor's degree / higher education qualification / equivalent in
            Hotel Management/ Business Administration
          </Text>
          <Text style={styles.bullet}>
            • 3 years of Front Office/Guest Service experience including
            management experience
          </Text>
          <Text style={styles.bullet}>• Must speak fluent English</Text>
          <Text style={styles.bullet}>• Other languages preferred</Text>
        </View>

        {/* Offer */}
        <Text style={styles.sectionTitle}>What we offer</Text>
        {data?.requirements?.map((item: any, index: number) => {
          return (
            <View key={index}>
              <BaseText style={styles.description}>{item}</BaseText>
            </View>
          );
        })}
        <View style={{height: hp(10)}} />
        <GradientButton
          onPress={() =>
            navigateTo(SCREEN_NAMES.ApplyJob, {
              data: data,
              resumeList: resumeList,
            })
          }
          title={t(data?.is_applied ? 'Applied' : 'Apply Job')}
        />
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
  banner: {
    height: hp(230),
    marginTop: hp(10),
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
  },
  filledHeart: {
    width: wp(30),
    height: hp(30),
  },
});
