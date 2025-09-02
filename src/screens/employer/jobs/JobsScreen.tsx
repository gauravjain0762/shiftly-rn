/* eslint-disable react/no-unstable-nested-components */
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CustomTextInput,
  GradientButton,
  JobCard,
  LinearContainer,
  ShareModal,
} from '../../../component';
import {SCREEN_WIDTH, commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {AppStyles} from '../../../theme/appStyles';
import Carousel from 'react-native-reanimated-carousel';
import {
  errorToast,
  navigateTo,
  successToast,
} from '../../../utils/commonFunction';
import {SCREEN_NAMES, SCREENS} from '../../../navigation/screenNames';
import {useTranslation} from 'react-i18next';
import {
  useAddRemoveFavouriteMutation,
  useGetFavouritesJobQuery,
  useLazyGetEmployeeJobsQuery,
} from '../../../api/dashboardApi';
import BottomModal from '../../../component/common/BottomModal';
import RangeSlider from '../../../component/common/RangeSlider';
import {SLIDER_WIDTH} from '../../company/job/CoJob';
import MyJobsSkeleton from '../../../component/skeletons/MyJobsSkeleton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {setIsBannerLoaded} from '../../../features/employeeSlice';
import BaseText from '../../../component/common/BaseText';
import BannerSkeleton from '../../../component/skeletons/BannerSkeleton';
import FastImage from 'react-native-fast-image';

const jobTypes: object[] = [
  {type: 'Full Time', value: 'Full Time'},
  {type: 'Part Time', value: 'Part Time'},
  {type: 'Temporary', value: 'Temporary'},
  {type: 'Internship', value: 'Internship'},
  {type: 'Freelance', value: 'Freelance'},
];

const departments: string[] = ['Management', 'Marketing', 'Chef', 'Cleaner'];

const JobsScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch<any>();
  const [modal, setModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [addRemoveFavoriteJob] = useAddRemoveFavouriteMutation({});
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const {data: getFavoriteJobs, refetch} = useGetFavouritesJobQuery({});
  const favJobList = getFavoriteJobs?.data?.jobs;
  const [trigger, {data, isLoading}] = useLazyGetEmployeeJobsQuery();
  const jobList = data?.data?.jobs;
  const resumeList = data?.data?.resumes;
  const carouselImages = data?.data?.banners;

  const [filters, setFilters] = useState<{
    departments: string[];
    job_types: string[];
    salary_from: number;
    salary_to: number;
    location: string;
  }>({
    departments: [],
    job_types: [],
    salary_from: 0,
    salary_to: 0,
    location: '',
  });

  const [range, setRange] = useState<number[]>([0, 50000]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const queryParams = {
    job_types: filters.job_types.length
      ? filters.job_types.join(',')
      : undefined,
    salary_from: filters.salary_from || undefined,
    salary_to: filters.salary_to || undefined,
    location: filters.location || undefined,
    departments: filters.departments.length
      ? filters.departments.join(',')
      : undefined,
  };

  useEffect(() => {
    trigger({});
  }, [trigger]);

  const handleApplyFilter = () => {
    const newFilters = {
      ...filters,
      salary_from: range[0],
      salary_to: range[1],
    };
    setFilters(newFilters);
    setIsFilterModalVisible(false);
    trigger({
      ...queryParams,
      job_types: newFilters.job_types.join(','),
    });
  };

  const clearFilters = () => {
    setFilters({
      departments: [],
      job_types: [],
      salary_from: 0,
      salary_to: 0,
      location: '',
      // employer_type: '',
    });
    setRange([0, 100000]);
    setIsFilterModalVisible(false);
    trigger({});
  };

  const handleAddRemoveFavoriteJob = async (item: any) => {
    try {
      // console.log('🔥🔥🔥 ~ handleAddRemoveFavoriteJob ~ item:', item?._id);
      // console.log(
      //   '🔥🔥🔥 ~ handleAddRemoveFavoriteJob ~ userInfo?.user_id:',
      //   userInfo?._id,
      // );

      const res = await addRemoveFavoriteJob({
        job_id: item?._id,
        user_id: userInfo?._id,
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

  const BannerItem = ({item, index}: any) => (
    <FastImage
      key={index}
      resizeMode="cover"
      source={{uri: item?.image}}
      style={styles.carouselImage}
      onLoadEnd={() => {
        console.log('Banner Loaded >>>>>>>>.');
        dispatch(setIsBannerLoaded(true));
      }}
      onError={() => dispatch(setIsBannerLoaded(false))}
    />
  );

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('Search Jobs')}</Text>
          <View style={styles.headerImgBar}>
            <TouchableOpacity>
              <Image style={styles.headerIcons} source={IMAGES.search} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
              <Image style={styles.headerIcons} source={IMAGES.filter} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigateTo(SCREENS.NotificationScreen)}>
              <Image style={styles.headerIcons} source={IMAGES.notification} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.carouselWrapper}>
          {isLoading ? (
            <BannerSkeleton backgroundColor={colors._lightBlueSkeleton} />
          ) : (
            <Carousel
              loop
              autoPlay
              height={180}
              data={carouselImages}
              renderItem={BannerItem}
              width={SCREEN_WIDTH - 32}
              scrollAnimationDuration={2500}
              onSnapToItem={index => setActiveIndex(index)}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          {carouselImages?.map((_: any, index: number) => (
            <View
              key={index}
              style={{
                ...styles.carouselDot,
                width: index === activeIndex ? 17 : 6,
              }}
            />
          ))}
        </View>
        <Text style={styles.sectionTitle}>{t('Recent Jobs')}</Text>
        {isLoading ? (
          <MyJobsSkeleton backgroundColor={colors._lightBlueSkeleton} />
        ) : (
          <FlatList
            data={jobList}
            style={AppStyles.flex}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}: any) => {
              const isFavorite = favJobList?.some(
                (fav: any) => fav._id === item?._id,
              );
              return (
                <JobCard
                  key={index}
                  item={item}
                  onPressShare={() => {
                    setModal(true);
                  }}
                  heartImage={isFavorite ? IMAGES.ic_favorite : null}
                  onPressFavorite={() => handleAddRemoveFavoriteJob(item)}
                  onPress={() =>
                    navigateTo(SCREEN_NAMES.JobDetail, {
                      item: item,
                      resumeList: resumeList,
                    })
                  }
                />
              );
            }}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{height: hp(28)}} />}
            contentContainerStyle={styles.scrollContainer}
            ListEmptyComponent={
              <BaseText
                style={{
                  ...commonFontStyle(500, 17, colors.white),
                  textAlign: 'center',
                }}>
                {t('No jobs found')}
              </BaseText>
            }
          />
        )}

        <BottomModal
          visible={isFilterModalVisible}
          backgroundColor={colors._FBE7BD}
          onClose={() => setIsFilterModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>{t('Search Filter')}</Text>

            <Text style={styles.sectionLabel}>{t('Department')}</Text>
            <View style={styles.pillRow}>
              {departments.map(dept => {
                const isSelected = filters.departments.includes(dept);
                return (
                  <Pressable
                    key={dept}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => {
                      setFilters(prev => ({
                        ...prev,
                        departments: isSelected
                          ? prev.departments.filter(d => d !== dept)
                          : [...prev.departments, dept],
                      }));
                    }}>
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}>
                      {dept}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.inputWrapper}>
              <CustomTextInput
                value={filters.location}
                onChangeText={txt =>
                  setFilters(prev => ({...prev, location: txt}))
                }
                placeholder={t('Location')}
                placeholderTextColor={colors.black}
                inputStyle={styles.locationInput}
              />
              <View style={styles.underline} />
            </View>

            <Text style={styles.sectionLabel}>{t('Job Type')}</Text>
            <View style={styles.pillRow}>
              {jobTypes.map((job: any) => {
                const isSelected = filters.job_types.includes(job.type);
                return (
                  <Pressable
                    key={job.type}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => {
                      setFilters(prev => ({
                        ...prev,
                        job_types: isSelected
                          ? prev.job_types.filter(j => j !== job.type)
                          : [...prev.job_types, job.type],
                      }));
                    }}>
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}>
                      {job.value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.salarySection}>
              <Text style={styles.salaryLabel}>{t('Salary Range')}</Text>
              <RangeSlider range={range} setRange={setRange} />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable onPress={clearFilters} style={styles.clearContainer}>
                <Text>{'Clear'}</Text>
              </Pressable>
              <GradientButton
                style={styles.btn}
                type="Company"
                title={t('Apply Filter')}
                onPress={handleApplyFilter}
              />
            </View>
          </View>
        </BottomModal>
        <ShareModal visible={modal} onClose={() => setModal(!modal)} />
      </ScrollView>
    </LinearContainer>
  );
};

export default JobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(25),
    paddingVertical: hp(32),
  },
  headerTitle: {
    ...commonFontStyle(600, 22, colors.white),
  },
  headerIcons: {
    width: wp(26),
    height: wp(26),
    tintColor: '#F4E2B8',
  },
  icon: {
    fontSize: 20,
    color: '#fff',
  },
  headerImgBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(18),
  },
  sectionTitle: {
    ...commonFontStyle(500, 20, colors.white),
    paddingVertical: hp(12),
    paddingHorizontal: wp(25),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(25),
  },
  carouselWrapper: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  // carouselImage: {
  //   width: '100%',
  //   height: 180,
  // },
  carouselImage: {
    height: hp(180),
    borderRadius: 12,
    width: SCREEN_WIDTH - wp(32),
  },
  skeletonBox: {
    height: 180,
    borderRadius: 12,
    alignSelf: 'center',
    width: SCREEN_WIDTH - wp(32),
  },
  inputWrapper: {
    marginTop: hp(30),
  },
  modalContent: {
    paddingHorizontal: wp(15),
    paddingVertical: hp(4),
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterTitle: {
    textAlign: 'center',
    ...commonFontStyle(500, 20, colors.black),
  },
  closeIcon: {
    height: hp(20),
    width: wp(20),
    right: '-5%',
  },
  locationInput: {
    ...commonFontStyle(400, 18, colors._7B7878),
  },
  underline: {
    height: hp(1.5),
    backgroundColor: colors._7B7878,
  },
  salarySection: {
    marginTop: hp(35),
  },
  salaryLabel: {
    ...commonFontStyle(400, 18, colors.black),
  },
  sliderWrapper: {
    width: SLIDER_WIDTH,
  },
  slider: {
    marginTop: hp(13),
    borderColor: colors._7B7878,
  },
  sliderTextWrapper: {
    position: 'relative',
    height: hp(20),
  },
  sliderValueText: {
    position: 'absolute',
    marginTop: hp(8),
    textAlign: 'center',
    ...commonFontStyle(600, 18, colors._0A0A0A),
  },
  dropdown: {
    height: hp(50),
    marginTop: hp(5),
    borderBottomWidth: hp(1.5),
    borderColor: colors._7B7878,
  },
  placeholderStyle: {
    fontSize: hp(14),
    color: colors._7B7878,
  },
  selectedTextStyle: {
    fontSize: hp(14),
    color: colors.black,
  },
  dropdownIcon: {
    width: wp(16),
    height: wp(16),
    resizeMode: 'contain',
    tintColor: colors._7B7878,
  },
  btn: {
    flex: 1,
  },
  sectionLabel: {
    ...commonFontStyle(500, 16, colors.black),
    marginTop: hp(36),
    marginBottom: hp(8),
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
    marginBottom: hp(10),
  },
  pill: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(8),
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors._1F1F1F,
    backgroundColor: colors._FBE7BD,
  },
  pillText: {
    ...commonFontStyle(400, 14, colors.black),
  },
  pillSelected: {
    backgroundColor: colors._1F1F1F,
    borderColor: colors._1F1F1F,
  },
  pillTextSelected: {
    color: colors.white,
  },
  clearContainer: {
    borderWidth: hp(1),
    borderRadius: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(28),
    paddingVertical: hp(18),
  },
  buttonContainer: {
    gap: wp(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(40),
  },
  carouselDot: {
    height: 6,
    borderRadius: 5,
    marginHorizontal: 4,
    backgroundColor: colors.white,
  },
});
