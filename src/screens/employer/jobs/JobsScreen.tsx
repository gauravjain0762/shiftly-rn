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
} from '../../../utils/commonFunction';
import {SCREEN_NAMES, SCREENS} from '../../../navigation/screenNames';
import {useTranslation} from 'react-i18next';
import {
  useAddRemoveFavouriteMutation,
  useGetFavouritesJobQuery,
  useGetFilterDataQuery,
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
import CustomImage from '../../../component/common/CustomImage';

const jobTypes: object[] = [
  {type: 'Full Time', value: 'Full Time'},
  {type: 'Part Time', value: 'Part Time'},
  {type: 'Temporary', value: 'Temporary'},
  {type: 'Internship', value: 'Internship'},
  {type: 'Freelance', value: 'Freelance'},
];

// const departments: string[] = ['Management', 'Marketing', 'Chef', 'Cleaner'];

const JobsScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch<any>();
  const [modal, setModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [addRemoveFavoriteJob] = useAddRemoveFavouriteMutation({});
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const {data: getFavoriteJobs, refetch} = useGetFavouritesJobQuery({});
  const {data: getDepartmentData} = useGetFilterDataQuery({});
  const departments = getDepartmentData?.data?.job_sectors;
  const favJobList = getFavoriteJobs?.data?.jobs;
  const [trigger, {data, isLoading}] = useLazyGetEmployeeJobsQuery();
  const jobList = data?.data?.jobs;
  const resumeList = data?.data?.resumes;
  const carouselImages = data?.data?.banners;

  const [filters, setFilters] = useState<{
    job_sectors: string[];
    job_types: string[];
    salary_from: number;
    salary_to: number;
    location: string;
  }>({
    job_sectors: [],
    job_types: [],
    salary_from: 0,
    salary_to: 0,
    location: '',
  });

  const [range, setRange] = useState<number[]>([0, 50000]);
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  useEffect(() => {
    trigger({});
  }, [trigger]);

  useEffect(() => {
    if (favJobList) {
      setLocalFavorites(favJobList.map((job: any) => job._id));
    }
  }, [favJobList]);

  const handleApplyFilter = () => {
    const newFilters = {
      ...filters,
      salary_from: range[0],
      salary_to: range[1],
    };
    setFilters(newFilters);
    setIsFilterModalVisible(false);

    const newQueryParams = {
      salary_from: newFilters.salary_from || undefined,
      salary_to: newFilters.salary_to || undefined,
      location: newFilters.location || undefined,
      job_types: newFilters.job_types.length
        ? newFilters.job_types.join(',')
        : undefined,
      job_sectors: newFilters.job_sectors.length
        ? newFilters.job_sectors.join(',')
        : undefined,
    };

    trigger(newQueryParams);
  };

  const clearFilters = () => {
    setFilters({
      job_sectors: [],
      job_types: [],
      salary_from: 0,
      salary_to: 0,
      location: '',
      // employer_type: '',
    });
    setRange([0, 100000]);
    trigger({});
  };

  const handleToggleFavorite = async (job: any) => {
    const jobId = job._id;

    setLocalFavorites(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId],
    );

    try {
      const res = await addRemoveFavoriteJob({
        job_id: jobId,
        user_id: userInfo?._id,
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
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('Search Jobs')}</Text>
          <View style={styles.headerImgBar}>
            <TouchableOpacity
              onPress={() => {
                navigateTo(SCREENS.SearchJob, {
                  data: jobList,
                });
              }}>
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
            <BannerSkeleton backgroundColor="#E0E0E0" highlightColor="#F5F5F5" />
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

        <View style={styles.innerContainer}>
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
          <MyJobsSkeleton backgroundColor="#E0E0E0" highlightColor="#F5F5F5" />
        ) : (
          <FlatList
            data={jobList}
            style={AppStyles.flex}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}: any) => {
              const isFavorite = localFavorites.includes(item?._id);

              return (
                <JobCard
                  key={index}
                  item={item}
                  onPressShare={() => {
                    setModal(true);
                  }}
                  heartImage={isFavorite}
                  onPressFavorite={() => handleToggleFavorite(item)}
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
              <View style={styles.emptyContainer}>
                <BaseText style={styles.emptyText}>
                  {t('No jobs found')}
                </BaseText>
              </View>
            }
          />
        )}

        <BottomModal
          visible={isFilterModalVisible}
          backgroundColor={colors._F7F7F7}
          onClose={() => setIsFilterModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.filterContainer}>
              <Text style={styles.filterTitle}>{t('Search Filter')}</Text>

              <CustomImage
                onPress={() => {
                  setIsFilterModalVisible(false);
                }}
                source={IMAGES.close}
                size={wp(18)}
              />
            </View>

            <Text style={styles.sectionLabel}>{t('Department')}</Text>
            <View style={styles.pillRow}>
              {departments?.map((dept: any) => {
                const isSelected = filters.job_sectors.includes(dept);
                return (
                  <Pressable
                    key={dept}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => {
                      setFilters(prev => ({
                        ...prev,
                        job_sectors: isSelected
                          ? prev.job_sectors.filter(d => d !== dept)
                          : [...prev.job_sectors, dept],
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
    paddingVertical: hp(24),
  },
  headerTitle: {
    ...commonFontStyle(600, 22, colors._0B3970),
  },
  headerIcons: {
    width: wp(26),
    height: wp(26),
    tintColor: colors._0B3970,
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
    ...commonFontStyle(500, 20, colors._0B3970),
    paddingVertical: hp(12),
    paddingHorizontal: wp(25),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: '5%',
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
    flex: 3,
    marginLeft: '12%',
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
    backgroundColor: colors._F7F7F7,
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerContainer: {
    marginTop: hp(10),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    marginTop: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(500, 17, colors._0B3970),
  },
});
