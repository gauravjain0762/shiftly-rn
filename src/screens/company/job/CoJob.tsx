import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CustomTextInput,
  GradientButton,
  LinearContainer,
} from '../../../component';
import { useTranslation } from 'react-i18next';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../../../theme/fonts';
import { IMAGES } from '../../../assets/Images';
import { colors } from '../../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import MyJobCard from '../../../component/common/MyJobCard';
import { errorToast, goBack, navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import BottomModal from '../../../component/common/BottomModal';
import { Dropdown } from 'react-native-element-dropdown';
import { useGetCompanyJobsQuery } from '../../../api/dashboardApi';
import RangeSlider from '../../../component/common/RangeSlider';
import MyJobsSkeleton from '../../../component/skeletons/MyJobsSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetJobFormState,
  setFilters,
  resetFilters,
} from '../../../features/companySlice';
import { useFocusEffect } from '@react-navigation/native';

const contractTypes = [
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Freelance', value: 'Freelance' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Temporary', value: 'Temporary' },
];
export const SLIDER_WIDTH = SCREEN_WIDTH - 70;

const CoJob = () => {
  const { t } = useTranslation<any>();
  const dispatch = useDispatch<any>();
  const filters = useSelector((state: any) => state.company.filters);
  const insets = useSafeAreaInsets();

  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);

  const [range, setRange] = useState<number[]>([
    filters.salary_from,
    filters.salary_to,
  ]);
  const [value, setValue] = useState<any>(filters.job_types || null);
  const [location, setLocation] = useState<string>(filters.location || '');

  const [page, setPage] = useState<number>(1);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(false);

  useEffect(() => {
    setRange([filters.salary_from, filters.salary_to]);
    setValue(filters.job_types || null);
    setLocation(filters.location || '');
    setPage(1);
    setAllJobs([]);
    setOnEndReachedCalled(false);
  }, [filters]);

  const queryParams = {
    ...filters,
    page: page,
  };

  const { data, isLoading, isFetching, refetch } = useGetCompanyJobsQuery(queryParams);
  const jobList = data?.data?.jobs || [];
  console.log("🔥 ~ CoJob ~ jobList:", jobList)
  const pagination = data?.data?.pagination;

  useFocusEffect(
    useCallback(() => {
      if (page === 1 && !isLoading) {
        refetch();
      }
    }, [filters, page]),
  );

  useEffect(() => {
    if (data) {
      const newData = jobList;
      setAllJobs(prev =>
        pagination?.current_page === 1 ? newData : [...prev, ...newData],
      );
      setOnEndReachedCalled(false);
    }
  }, [data]);

  const handleLoadMore = () => {
    if (
      pagination?.current_page < pagination?.total_pages &&
      !onEndReachedCalled &&
      !isFetching &&
      !isLoading
    ) {
      const nextPage = page + 1;
      setOnEndReachedCalled(true);
      setPage(nextPage);
    }
  };

  const handleRefresh = () => {
    if (page !== 1) {
      setPage(1);
    }
    setOnEndReachedCalled(false);
    refetch();
  };

  const handleApplyFilter = async () => {
    try {
      dispatch(
        setFilters({
          location: location,
          job_types: value,
          salary_from: range[0],
          salary_to: range[1],
        }),
      );
      setIsFilterModalVisible(false);
    } catch (error) {
      errorToast('Failed to apply filter');
    }
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setLocation('');
    setValue(null);
    setRange([1000, 50000]);
    setIsFilterModalVisible(false);
  };

  const renderPostJobButton = () => {
    return <LinearGradient
      colors={['#024AA1', '#041428']}
      style={styles.gradient}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          dispatch(resetJobFormState());
          navigateTo(SCREENS.PostJob);
        }}
        style={styles.postJobButton}>
        <View style={styles.plusIconContainer}>
          <Image source={IMAGES.pluse} style={styles.plusIcon} />
        </View>
        <Text style={styles.postJobText}>{t('Post Job')}</Text>
      </TouchableOpacity>
    </LinearGradient>
  }

  return (
    <LinearContainer colors={[colors.coPrimary, colors.white]}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={() => goBack()}
            style={styles.backButton}
            activeOpacity={0.6}>
            <Image
              source={IMAGES.backArrow}
              tintColor={colors._0B3970}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{'My Jobs'}</Text>
        </View>

        <View style={styles.rightSection}>
          {renderPostJobButton()}

          {data && (
            <Pressable
              onPress={() => {
                setValue(filters.job_types || null);
                setLocation(filters.location || '');
                setRange([
                  filters.salary_from || 1000,
                  filters.salary_to || 50000,
                ]);
                setIsFilterModalVisible(true);
              }}>
              <Image source={IMAGES.post_filter} style={styles.filterLogo} />
            </Pressable>
          )}
        </View>
      </View>

      {isLoading && !data && <MyJobsSkeleton />}

      {(!isLoading || data) && (
        <View style={styles.outerContainer}>
          <FlatList
            data={allJobs}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            keyExtractor={(item, index) => item?._id || item?.id || index.toString()}
            renderItem={({ item, index }) => (
              <View key={index} style={{ marginBottom: hp(10) }}>
                <MyJobCard
                  item={item}
                  onPressCard={() => navigateTo(SCREENS.CoJobDetails, item)}
                />
              </View>
            )}
            onRefresh={handleRefresh}
            refreshing={isFetching && page === 1}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => {
              if (isLoading && !data) {
                return null;
              }
              return (
                <View style={styles.emptyContainer}>
                  {renderPostJobButton()}
                  <Text style={styles.emptyText}>
                    {filters?.location ||
                      filters?.job_types ||
                      filters?.salary_from !== 1000 ||
                      filters?.salary_to !== 50000
                      ? 'No filtered jobs found'
                      : 'Create your first job to start hiring talent.'}
                  </Text>
                </View>
              );
            }}
            ListFooterComponent={
              isFetching &&
                pagination?.current_page < pagination?.total_pages ? (
                <ActivityIndicator
                  color={colors._0B3970}
                  style={{ marginVertical: hp(16) }}
                />
              ) : null
            }
          />
        </View>
      )}

      {isFilterModalVisible && (
        <BottomModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>{t('Filters')}</Text>
              <Pressable onPress={() => setIsFilterModalVisible(false)}>
                <Image source={IMAGES.close} style={styles.closeIcon} />
              </Pressable>
            </View>
            <View style={styles.inputWrapper}>
              <CustomTextInput
                value={location}
                onChangeText={text => setLocation(text)}
                placeholder={t('Location')}
                inputStyle={styles.locationInput}
              />
              <View style={styles.underline} />
            </View>
            <View style={styles.salarySection}>
              <Text style={styles.salaryLabel}>{'Salary Range'}</Text>
              <RangeSlider range={range} setRange={setRange} />
            </View>
            <Dropdown
              data={contractTypes}
              labelField="label"
              valueField="value"
              placeholder="Job Type"
              value={value}
              onChange={item => setValue(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              dropdownPosition="top"
              renderRightIcon={() => (
                <Image source={IMAGES.dropdown} style={styles.dropdownIcon} />
              )}
            />
            <GradientButton
              style={styles.btn}
              type="Company"
              title={t('Apply')}
              onPress={handleApplyFilter}
            />
            <Pressable style={styles.resetButton} onPress={handleResetFilters}>
              <Text style={{ ...commonFontStyle(600, 18, colors._4D4D4D) }}>
                {'Reset Filters'}
              </Text>
            </Pressable>
          </View>
        </BottomModal>
      )}
    </LinearContainer>
  );
};

export default CoJob;

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(26),
    paddingHorizontal: wp(25),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: wp(10),
  },
  backIcon: {
    width: wp(24),
    height: hp(24),
    resizeMode: 'contain',
  },
  title: {
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(18),
    zIndex: 1,
  },
  gradient: {
    borderRadius: hp(100),
    overflow: 'hidden',
  },
  postJobButton: {
    gap: wp(10),
    padding: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
  },
  plusIconContainer: {
    width: wp(18),
    height: hp(18),
    borderRadius: hp(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  plusIcon: {
    width: '50%',
    height: '50%',
  },
  postJobText: {
    ...commonFontStyle(500, 12, colors.white),
  },
  outerContainer: {
    flex: 1,
    marginTop: hp(14),
    paddingHorizontal: wp(21),
  },
  modalContent: {
    paddingHorizontal: wp(15),
    paddingVertical: hp(4),
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterTitle: {
    ...commonFontStyle(600, 25, colors.black),
  },
  closeIcon: {
    height: hp(20),
    width: wp(20),
    right: '-5%',
  },
  inputWrapper: {
    marginTop: hp(30),
  },
  locationInput: {
    ...commonFontStyle(400, 18, colors._181818),
  },
  underline: {
    height: hp(1.5),
    backgroundColor: colors._7B7878,
  },
  salarySection: {
    marginTop: hp(35),
  },
  salaryLabel: {
    ...commonFontStyle(400, 18, colors._181818),
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
    marginTop: hp(8),
    textAlign: 'center',
    position: 'absolute',
    ...commonFontStyle(600, 18, colors._0A0A0A),
  },
  dropdown: {
    height: hp(50),
    marginTop: hp(5),
    borderBottomWidth: hp(1.5),
    borderColor: colors._7B7878,
  },
  placeholderStyle: {
    ...commonFontStyle(400, 18, colors._181818),
  },
  selectedTextStyle: {
    ...commonFontStyle(400, 18, colors._181818),
  },
  dropdownIcon: {
    width: wp(16),
    height: wp(16),
    resizeMode: 'contain',
    tintColor: colors._7B7878,
  },
  btn: {
    marginTop: hp(40),
  },
  filterLogo: {
    width: wp(28),
    height: hp(28),
  },
  resetButton: {
    marginTop: hp(20),
    borderWidth: hp(1),
    borderRadius: hp(50),
    alignItems: 'center',
    paddingVertical: hp(12),
    justifyContent: 'center',
    borderColor: colors._4D4D4D,
  },
  emptyContainer: {
    flex: 1,
    gap: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(500, 18, colors._0B3970),
  },
  contentContainer: {
    flexGrow: 1,
    marginTop: hp(12),
    paddingBottom: '20%',
  },
});
