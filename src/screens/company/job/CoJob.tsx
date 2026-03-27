import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  CustomTextInput,
  CustomDropdown,
  GradientButton,
  LinearContainer,
} from '../../../component';
import { useTranslation } from 'react-i18next';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../../../theme/fonts';
import { IMAGES } from '../../../assets/Images';
import { colors } from '../../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import MyJobCard from '../../../component/common/MyJobCard';
import {
  errorToast,
  goBack,
  isCompanyProfileComplete,
  navigateTo,
} from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import BottomModal from '../../../component/common/BottomModal';
import { Dropdown } from 'react-native-element-dropdown';
import CountryPicker from 'react-native-country-picker-modal';
import {
  useGetCompanyJobsQuery,
  useGetJobDropdownDataQuery,
} from '../../../api/dashboardApi';
import MyJobsSkeleton from '../../../component/skeletons/MyJobsSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetJobFormState,
  setCoPostJobSteps,
  setFilters,
  resetFilters,
} from '../../../features/companySlice';
import { useFocusEffect } from '@react-navigation/native';

const formatSalaryRangeLabel = (range: string): string => {
  if (!range || typeof range !== 'string') return range || '';
  const trimmed = range.trim();
  if (trimmed.endsWith('+')) {
    const num = parseInt(trimmed.replace(/[^\d]/g, ''), 10);
    return Number.isNaN(num) ? trimmed : `${num.toLocaleString()}+`;
  }
  const parts = trimmed.split(/[-–—]/);
  if (parts.length >= 2) {
    const from = parseInt(parts[0].replace(/[^\d]/g, ''), 10);
    const to = parseInt(parts[1].replace(/[^\d]/g, ''), 10);
    if (!Number.isNaN(from) && !Number.isNaN(to)) {
      return `${from.toLocaleString()} - ${to.toLocaleString()}`;
    }
  }
  return trimmed;
};

const CoJob = () => {
  const { t } = useTranslation<any>();
  const dispatch = useDispatch<any>();
  const filters = useSelector((state: any) => state.company.filters);
  const { userInfo }: any = useSelector((state: any) => state.auth);
  const [completeProfileModal, setCompleteProfileModal] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>(
    filters.salary_range || '',
  );
  const [value, setValue] = useState<any>(filters.contract_types || []);
  const [location, setLocation] = useState<string>(filters.location || '');
  const [page, setPage] = useState<number>(1);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(false);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const { data: jobDropdownData } = useGetJobDropdownDataQuery();
  const contractTypeData = useMemo(() => {
    const list = jobDropdownData?.data?.job_types;
    if (Array.isArray(list) && list.length > 0) {
      return list
        .map((item: any) => ({
          label: item?.title || '',
          value: item?.title || item?._id || '',
        }))
        .filter((item: any) => item.label && item.value);
    }
    return [];
  }, [jobDropdownData?.data?.job_types]);
  const salaryRangeData = useMemo(() => {
    const ranges = jobDropdownData?.data?.salary_ranges;
    if (Array.isArray(ranges) && ranges.length > 0) {
      return ranges.map((r: string) => ({
        label: formatSalaryRangeLabel(r),
        value: r,
      }));
    }
    return [];
  }, [jobDropdownData?.data?.salary_ranges]);

  // ─── Refs: always-fresh values accessible in callbacks ────────────────────
  const pageRef = useRef<number>(1);
  const refetchRef = useRef<(() => void) | null>(null);

  const syncPageRef = (p: number) => {
    pageRef.current = p;
  };

  // ─── Build query params ───────────────────────────────────────────────────
  const hasContractFilter =
    Array.isArray(filters?.contract_types) && filters.contract_types.length > 0;
  const hasLocationFilter = !!String(filters?.location || '').trim();
  const hasSalaryFilter = !!String(filters?.salary_range || '').trim();

  const queryParams: Record<string, any> = { page };
  if (hasContractFilter) queryParams.contract_types = filters.contract_types;
  if (hasLocationFilter) queryParams.location = filters.location;
  if (hasSalaryFilter) queryParams.monthly_salary_range = filters.salary_range;

  const { data, isLoading, isFetching, refetch } = useGetCompanyJobsQuery(
    queryParams,
    { refetchOnMountOrArgChange: true },
  );

  // Keep refetchRef pointing to the latest refetch function
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const jobList = data?.data?.jobs || [];
  const pagination = data?.data?.pagination;

  // ─── Sync filter UI when Redux filters change ─────────────────────────────
  useEffect(() => {
    setSelectedSalaryRange(filters.salary_range || '');
    setValue(filters.contract_types || []);
    setLocation(filters.location || '');
    syncPageRef(1);
    setPage(1);
    setOnEndReachedCalled(false);
    // allJobs will be replaced once the new query settles (see data effect below)
  }, [filters]);

  // ─── Core list population effect ──────────────────────────────────────────
  //
  // WHY `isFetching` is in the deps:
  //   RTK Query uses structural sharing — if the server returns the same payload,
  //   it reuses the previous `data` object reference, so `useEffect([data])`
  //   would NOT re-run.  Adding `isFetching` means this effect fires the moment
  //   any fetch settles (isFetching true→false), guaranteeing the list is
  //   repopulated even when the data reference hasn't changed.
  //
  // WHY we do NOT call setAllJobs([]) in useFocusEffect:
  //   Eagerly clearing + RTK Query reusing the same reference = permanent empty
  //   list on every return to the screen.  Instead we show stale data while
  //   fetching (good UX) and replace it here once settled.
  useEffect(() => {
    if (isFetching || !data) return; // wait for the fetch to fully complete

    const newData = data?.data?.jobs || [];
    const currentPage = data?.data?.pagination?.current_page ?? 1;

    if (currentPage === 1) {
      // Initial load, refresh, focus-return, or filter change → replace list
      setAllJobs(newData);
    } else {
      // Next page → append, dedup by _id
      setAllJobs(prev => {
        const existingIds = new Set(prev.map((j: any) => j?._id).filter(Boolean));
        const uniqueNew = newData.filter(
          (j: any) => j?._id && !existingIds.has(j._id),
        );
        return uniqueNew.length ? [...prev, ...uniqueNew] : prev;
      });
    }

    setOnEndReachedCalled(false);
  }, [data, isFetching]); // <── isFetching is the key fix

  // ─── Focus effect: trigger a page-1 reload each time screen gains focus ───
  useFocusEffect(
    useCallback(() => {
      setOnEndReachedCalled(false);

      if (pageRef.current !== 1) {
        // Changing the arg triggers RTK Query auto-refetch
        syncPageRef(1);
        setPage(1);
      } else {
        // Args are already page=1 → RTK Query won't auto-refetch → call manually
        // The data effect above will repopulate allJobs once isFetching settles
        refetchRef.current?.();
      }
    }, []), // empty deps: refs keep values fresh without re-registering
  );

  // ─── Load next page ───────────────────────────────────────────────────────
  const handleLoadMore = () => {
    if (
      pagination?.current_page < pagination?.total_pages &&
      !onEndReachedCalled &&
      !isFetching &&
      !isLoading
    ) {
      setOnEndReachedCalled(true);
      setPage(prev => {
        const next = prev + 1;
        syncPageRef(next);
        return next;
      });
    }
  };

  // ─── Pull-to-refresh ──────────────────────────────────────────────────────
  const handleRefresh = () => {
    setOnEndReachedCalled(false);

    if (pageRef.current !== 1) {
      syncPageRef(1);
      setPage(1); // arg change → RTK Query auto-refetches
    } else {
      refetch(); // same args → manual refetch; data effect handles repopulation
    }
  };

  // ─── Apply / reset filter ─────────────────────────────────────────────────
  const handleApplyFilter = async () => {
    try {
      dispatch(
        setFilters({
          location,
          contract_types: value,
          salary_range: selectedSalaryRange,
        }),
      );
      setIsFilterModalVisible(false);
    } catch {
      errorToast('Failed to apply filter');
    }
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setLocation('');
    setValue(null);
    setSelectedSalaryRange('');
    setIsFilterModalVisible(false);
  };

  // ─── Post Job button ──────────────────────────────────────────────────────
  const renderPostJobButton = () => (
    <LinearGradient colors={['#024AA1', '#041428']} style={styles.gradient}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          if (!isCompanyProfileComplete(userInfo)) {
            setCompleteProfileModal(true);
            return;
          }
          dispatch(resetJobFormState());
          dispatch(setCoPostJobSteps(0));
          navigateTo(SCREENS.PostJob);
        }}
        style={styles.postJobButton}>
        <View style={styles.plusIconContainer}>
          <Image source={IMAGES.pluse} style={styles.plusIcon} />
        </View>
        <Text style={styles.postJobText}>{t('Post Job')}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const isFilteredEmpty =
    filters?.location ||
    filters?.contract_types?.length ||
    !!String(filters?.salary_range || '').trim();

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <LinearContainer colors={[colors.coPrimary, colors.white]}>
      {/* Header */}
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
          {jobList.length > 0 && renderPostJobButton()}

          {data && (
            <Pressable
              onPress={() => {
                setValue(filters.contract_types || []);
                setLocation(filters.location || '');
                setSelectedSalaryRange(filters.salary_range || '');
                setIsFilterModalVisible(true);
              }}>
              <Image source={IMAGES.post_filter} style={styles.filterLogo} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Skeleton shown only on very first load */}
      {isLoading && !data && <MyJobsSkeleton />}

      {/* List */}
      {(!isLoading || data) && (
        <View style={styles.outerContainer}>
          <FlatList
            data={allJobs}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            keyExtractor={(item, index) =>
              item?._id || item?.id || index.toString()
            }
            renderItem={({ item }) => (
              <View style={{ marginBottom: hp(10) }}>
                <MyJobCard
                  item={item}
                  onPressCard={() =>
                    navigateTo(SCREENS.SuggestedEmployee, {
                      jobId: item?._id,
                      jobData: { data: { job: item } },
                      isFromJobCard: true,
                      fromMyJobs: true,
                    })
                  }
                />
              </View>
            )}
            onRefresh={handleRefresh}
            refreshing={isFetching && page === 1}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => {
              if (isLoading && !data) return null;
              return (
                <View style={styles.emptyContainer}>
                  {!isFilteredEmpty && renderPostJobButton()}
                  <Text style={styles.emptyText}>
                    {isFilteredEmpty
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

      {/* Filter bottom modal */}
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
              <TouchableOpacity
                onPress={() => setIsCountryPickerVisible(true)}
                style={styles.countrySelector}>
                <Text
                  style={location ? styles.countryText : styles.countryPlaceholder}
                  numberOfLines={1}>
                  {location || t('Select Country')}
                </Text>
                <Image source={IMAGES.dropdown} style={styles.dropdownIcon} />
              </TouchableOpacity>
              <View style={styles.underline} />
            </View>

            {isCountryPickerVisible && (
              <CountryPicker
                visible={isCountryPickerVisible}
                countryCode="US"
                withFilter
                withCountryNameButton
                withCallingCode={false}
                withFlag
                withEmoji={false}
                modalProps={{
                  animationType: 'slide',
                  transparent: true,
                  presentationStyle: 'overFullScreen',
                }}
                onSelect={(item: any) => {
                  const countryName =
                    typeof item?.name === 'string'
                      ? item.name
                      : item?.name?.common || '';
                  setLocation(countryName);
                  setIsCountryPickerVisible(false);
                }}
                onClose={() => setIsCountryPickerVisible(false)}
              />
            )}

            <View style={styles.salarySection}>
              <Text style={styles.salaryLabel}>{'Salary Range'}</Text>
              <CustomDropdown
                data={salaryRangeData}
                labelField="label"
                valueField="value"
                value={selectedSalaryRange}
                placeholder="Select Salary Range"
                dropdownStyle={styles.coFilterDropdown}
                renderRightIcon={IMAGES.ic_down}
                RightIconStyle={styles.rightIcon}
                selectedTextStyle={styles.selectedTextStyle}
                placeholderStyle={styles.placeholderStyle}
                container={styles.salaryDropdownContainer}
                onChange={(item: any) =>
                  setSelectedSalaryRange(item?.value ? String(item.value) : '')
                }
              />
            </View>

            <Dropdown
              data={contractTypeData}
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
    width: wp(21),
    height: hp(21),
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(18),
    paddingVertical: hp(10),
    borderRadius: hp(100),
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
  salaryDropdownContainer: {
    marginTop: hp(8),
  },
  coFilterDropdown: {
    borderRadius: 10,
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
    ...commonFontStyle(400, 16, colors._181818),
  },
  rightIcon: {
    width: wp(16),
    height: hp(13),
    tintColor: colors._0B3970,
  },
  dropdownIcon: {
    width: wp(14),
    height: wp(14),
    resizeMode: 'contain',
    tintColor: colors._7B7878,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: hp(12),
  },
  countryText: {
    ...commonFontStyle(400, 18, colors._181818),
    flex: 1,
  },
  countryPlaceholder: {
    ...commonFontStyle(400, 18, colors._7B7878),
    flex: 1,
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