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
import React, { useEffect, useRef, useState } from 'react';
import {
  CustomTextInput,
  GradientButton,
  JobCard,
  LinearContainer,
} from '../../../component';
import { SCREEN_WIDTH, commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../assets/Images';
import { AppStyles } from '../../../theme/appStyles';
import Carousel from 'react-native-reanimated-carousel';
import {
  errorToast,
  navigateTo,
} from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import { useTranslation } from 'react-i18next';
import {
  useAddRemoveFavouriteMutation,
  useGetFavouritesJobQuery,
  useGetFilterDataQuery,
  useLazyGetEmployeeJobsQuery,
} from '../../../api/dashboardApi';
import BottomModal from '../../../component/common/BottomModal';
import RangeSlider from '../../../component/common/RangeSlider';
import { SLIDER_WIDTH } from '../../company/job/CoJob';
import MyJobsSkeleton from '../../../component/skeletons/MyJobsSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setIsBannerLoaded } from '../../../features/employeeSlice';
import BaseText from '../../../component/common/BaseText';
import BannerSkeleton from '../../../component/skeletons/BannerSkeleton';
import FastImage from 'react-native-fast-image';
import CustomImage from '../../../component/common/CustomImage';
import Tooltip from '../../../component/common/Tooltip';
import { getAsyncUserLocation } from '../../../utils/asyncStorage';

const jobTypes: object[] = [
  { type: 'Full Time', value: 'Full Time' },
  { type: 'Part Time', value: 'Part Time' },
  { type: 'Temporary', value: 'Temporary' },
  { type: 'Internship', value: 'Internship' },
  { type: 'Freelance', value: 'Freelance' },
];

const JobsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [addRemoveFavoriteJob] = useAddRemoveFavouriteMutation({});
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { data: getFavoriteJobs, refetch } = useGetFavouritesJobQuery({});
  const { data: getDepartmentData } = useGetFilterDataQuery({});
  const departments = getDepartmentData?.data?.job_sectors;
  const favJobList = getFavoriteJobs?.data?.jobs;

  const [trigger, { data, isLoading }] = useLazyGetEmployeeJobsQuery();
  const jobList = data?.data?.jobs;
  console.log("🔥 ~ JobsScreen ~ jobList:", jobList)
  const resumeList = data?.data?.resumes;
  const carouselImages = data?.data?.banners;
  const pagination = data?.data?.pagination;

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
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<
    'newest' | 'salary_high_low' | 'salary_low_high' | 'closest_location' | null
  >(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [sortedJobList, setSortedJobList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const lastLoadedPageRef = useRef(0);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const isFilterAppliedRef = useRef(false);

  // Get user location for closest location sorting
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        // Priority 1: Check userInfo from Redux
        if (userInfo?.lat && userInfo?.lng) {
          setUserLocation({
            lat: userInfo.lat,
            lng: userInfo.lng,
          });
          return;
        }

        // Priority 2: Check AsyncStorage
        const location = await getAsyncUserLocation();
        if (location?.lat && location?.lng) {
          setUserLocation({
            lat: location.lat,
            lng: location.lng,
          });
        }
      } catch (error) {
        console.log('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, [userInfo]);

  useEffect(() => {
    trigger({ page: 1 })
      .then((response: any) => {
        console.log('🔥 ~ Initial Load ~ getJobs API Response:', {
          status: response?.data?.status,
          message: response?.data?.message,
          jobs: response?.data?.data?.jobs,
          jobsCount: response?.data?.data?.jobs?.length,
          pagination: response?.data?.data?.pagination,
        });
      })
      .catch((error: any) => {
        console.log('🔥 ~ Initial Load ~ API Error:', error);
      });
  }, []);

  useEffect(() => {
    if (favJobList) {
      setLocalFavorites(favJobList.map((job: any) => job._id));
    }
  }, [favJobList]);

  // Update allJobs when new data arrives based on pagination
  useEffect(() => {
    if (!jobList) {
      return;
    }

    // Wait for pagination data before processing
    if (!pagination) {
      return;
    }

    // Log API response on every filter/data update
    console.log('🔥 ~ getJobs API Response:', {
      status: data?.status,
      message: data?.message,
      jobs: jobList,
      jobsCount: jobList?.length,
      pagination: pagination,
      totalRecords: pagination?.total_records,
      currentPage: pagination?.current_page,
      totalPages: pagination?.total_pages,
    });

    const responsePage = pagination.current_page;

    // Only update if this is a new page we haven't loaded yet
    if (responsePage > lastLoadedPageRef.current) {
      if (responsePage === 1) {
        // First page - replace all jobs
        setAllJobs(jobList);
        lastLoadedPageRef.current = 1;
        setCurrentPage(1);
        // Update hasMorePages based on pagination
        if (pagination.total_pages <= 1) {
          setHasMorePages(false);
        }
        // Reset filter applied flag after processing first page
        isFilterAppliedRef.current = false;
      } else {
        // Subsequent pages - append to existing jobs
        setAllJobs(prev => {
          // Prevent duplicates by checking job IDs
          const existingIds = new Set(prev.map((job: any) => job._id));
          const newJobs = jobList.filter((job: any) => job._id && !existingIds.has(job._id));
          if (newJobs.length > 0) {
            lastLoadedPageRef.current = responsePage;
            setCurrentPage(responsePage);
            return [...prev, ...newJobs];
          }
          return prev;
        });
      }
      setIsLoadingMore(false);
    }
  }, [jobList, pagination]);

  useEffect(() => {
    if (pagination) {
      const hasMore = pagination.current_page < pagination.total_pages;
      setHasMorePages(hasMore);
      // If we're on the last page or no more pages, ensure loadMore won't trigger
      if (!hasMore) {
        setIsLoadingMore(false);
        // Also reset filter applied flag when we know there are no more pages
        if (pagination.current_page === 1 && pagination.total_pages === 1) {
          isFilterAppliedRef.current = false;
        }
      }
    }
  }, [pagination]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  useEffect(() => {
    if (allJobs.length === 0) {
      setSortedJobList([]);
      return;
    }

    let sorted = [...allJobs];

    if (sortBy === 'newest') {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    } else if (sortBy === 'salary_high_low') {
      sorted.sort(
        (a, b) =>
          (b.monthly_salary_to || 0) - (a.monthly_salary_to || 0),
      );
    } else if (sortBy === 'salary_low_high') {
      sorted.sort(
        (a, b) =>
          (a.monthly_salary_from || 0) - (b.monthly_salary_from || 0),
      );
    } else if (sortBy === 'closest_location') {
      if (userLocation) {
        sorted.sort((a, b) => {
          const aLat = a?.lat || a?.location?.lat;
          const aLng = a?.lng || a?.location?.lng;
          const bLat = b?.lat || b?.location?.lat;
          const bLng = b?.lng || b?.location?.lng;

          // If job doesn't have coordinates, put it at the end
          if (!aLat || !aLng) return 1;
          if (!bLat || !bLng) return -1;

          const distanceA = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            aLat,
            aLng,
          );
          const distanceB = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            bLat,
            bLng,
          );

          return distanceA - distanceB;
        });
      } else {
        // If no user location, don't sort by distance
        console.log('User location not available for closest location sorting');
      }
    }

    setSortedJobList(sorted);
  }, [allJobs, sortBy, userLocation]);

  const handleApplyFilter = () => {
    const newFilters = {
      ...filters,
      salary_from: range[0],
      salary_to: range[1],
    };
    setFilters(newFilters);
    setIsFilterModalVisible(false);

    setCurrentPage(1);
    setAllJobs([]);
    setHasMorePages(true);
    setIsLoadingMore(false);
    lastLoadedPageRef.current = 0;
    isFilterAppliedRef.current = true; // Mark that filter was just applied
    
    // Reset pagination state to prevent immediate loadMoreJobs call
    // This ensures we wait for the new API response before allowing pagination

    const newQueryParams: any = {
      page: 1,
    };

    // Only add location if it's provided and not empty
    if (newFilters.location && newFilters.location.trim() !== '') {
      newQueryParams.location = newFilters.location;
    }

    // Only add job_types if any are selected
    if (newFilters.job_types && newFilters.job_types.length > 0) {
      newQueryParams.job_types = newFilters.job_types.join(',');
    }

    // Only pass salary parameters if they differ from default range [0, 50000]
    // Don't pass if user hasn't explicitly changed the salary range
    const defaultSalaryFrom = 0;
    const defaultSalaryTo = 50000;
    
    if (newFilters.salary_from && newFilters.salary_from !== defaultSalaryFrom) {
      newQueryParams.salary_from = newFilters.salary_from;
    }
    if (newFilters.salary_to && newFilters.salary_to !== defaultSalaryTo) {
      newQueryParams.salary_to = newFilters.salary_to;
    }

    // Add departments parameter only if any department is selected
    // Filter to ensure only string IDs are included
    const departmentIds = newFilters.job_sectors
      .filter((id: any) => typeof id === 'string' && id.trim() !== '')
      .join(',');
    
    if (departmentIds) {
      newQueryParams.departments = departmentIds;
      console.log('🔥 ~ handleApplyFilter ~ departments:', newQueryParams.departments);
    }

    console.log('🔥 ~ handleApplyFilter ~ newQueryParams:', newQueryParams);
    trigger(newQueryParams)
      .then((response: any) => {
        console.log('🔥 ~ handleApplyFilter ~ API Response:', {
          status: response?.data?.status,
          message: response?.data?.message,
          jobs: response?.data?.data?.jobs,
          jobsCount: response?.data?.data?.jobs?.length,
          pagination: response?.data?.data?.pagination,
        });
      })
      .catch((error: any) => {
        console.log('🔥 ~ handleApplyFilter ~ API Error:', error);
      });
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
    // Reset pagination when clearing filters
    setCurrentPage(1);
    setAllJobs([]);
    setHasMorePages(true);
    setIsLoadingMore(false);
    lastLoadedPageRef.current = 0;
    isFilterAppliedRef.current = true; // Mark that filter was just applied
    trigger({ page: 1 });
  };

  const loadMoreJobs = () => {
    // Prevent multiple simultaneous loads
    if (isLoadingMore || isLoading) {
      return;
    }

    // Don't load more if filter was just applied - wait for first page to be processed
    if (isFilterAppliedRef.current) {
      console.log('🔥 ~ loadMoreJobs ~ Filter just applied, skipping loadMore');
      return;
    }

    // Check if we have more pages
    if (!hasMorePages) {
      return;
    }

    // Need pagination info to determine next page
    if (!pagination) {
      return;
    }

    const nextPage = currentPage + 1;

    // Check if we've reached the last page
    if (nextPage > pagination.total_pages) {
      setHasMorePages(false);
      setIsLoadingMore(false);
      return;
    }

    // Don't load if we've already loaded this page
    if (nextPage <= lastLoadedPageRef.current) {
      return;
    }

    // Additional safety check: if current page is 1 and we only have 1 page, don't load more
    if (currentPage === 1 && pagination.total_pages === 1) {
      setHasMorePages(false);
      return;
    }

    console.log('Loading page:', nextPage);
    setIsLoadingMore(true);

    const queryParams: any = {
      page: nextPage,
    };

    // Only add location if it's provided and not empty
    if (filters.location && filters.location.trim() !== '') {
      queryParams.location = filters.location;
    }

    // Only add job_types if any are selected
    if (filters.job_types && filters.job_types.length > 0) {
      queryParams.job_types = filters.job_types.join(',');
    }

    // Only pass salary parameters if they differ from default range [0, 50000]
    // Don't pass if user hasn't explicitly changed the salary range
    const defaultSalaryFrom = 0;
    const defaultSalaryTo = 50000;
    
    if (filters.salary_from && filters.salary_from !== defaultSalaryFrom) {
      queryParams.salary_from = filters.salary_from;
    }
    if (filters.salary_to && filters.salary_to !== defaultSalaryTo) {
      queryParams.salary_to = filters.salary_to;
    }

    // Add departments parameter only if any department is selected
    // Filter to ensure only string IDs are included
    const departmentIds = filters.job_sectors
      .filter((id: any) => typeof id === 'string' && id.trim() !== '')
      .join(',');
    
    if (departmentIds) {
      queryParams.departments = departmentIds;
    }

    trigger(queryParams)
      .then((response: any) => {
        console.log('🔥 ~ loadMoreJobs ~ API Response:', {
          status: response?.data?.status,
          message: response?.data?.message,
          jobs: response?.data?.data?.jobs,
          jobsCount: response?.data?.data?.jobs?.length,
          pagination: response?.data?.data?.pagination,
        });
        // Loading state will be cleared in useEffect when data arrives
      })
      .catch((error) => {
        console.error('🔥 ~ loadMoreJobs ~ API Error:', error);
        setIsLoadingMore(false);
      });
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

  const BannerItem = ({ item, index }: any) => (
    <FastImage
      key={index}
      resizeMode="cover"
      source={{ uri: item?.image }}
      style={styles.carouselImage}
      onLoadEnd={() => {
        console.log('Banner Loaded >>>>>>>>.');
        dispatch(setIsBannerLoaded(true));
      }}
      onError={() => dispatch(setIsBannerLoaded(false))}
    />
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('Search Jobs')}</Text>
        <View style={styles.headerImgBar}>
          <TouchableOpacity
            onPress={() => {
              navigateTo(SCREENS.SearchJob, {
                data: sortedJobList.length > 0 ? sortedJobList : allJobs,
              });
            }}>
            <Image style={styles.headerIcons} source={IMAGES.search} />
          </TouchableOpacity>

          {/* Custom Sort Icon */}
          <TouchableOpacity
            onPress={() => setIsSortModalVisible(true)}
            style={styles.sortButtonContainer}>
            <View style={styles.sortIconWrapper}>
              <View style={[styles.sortLine, styles.sortLineTop, sortBy && { backgroundColor: colors.empPrimary }]} />
              <View style={[styles.sortLine, styles.sortLineMiddle, sortBy && { backgroundColor: colors.empPrimary }]} />
              <View style={[styles.sortLine, styles.sortLineBottom, sortBy && { backgroundColor: colors.empPrimary }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
            <Image style={styles.headerIcons} source={IMAGES.filter} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigateTo(SCREENS.NotificationScreen)}>
            <Image style={styles.headerIcons} source={IMAGES.notification} />
          </TouchableOpacity> */}
        </View>
      </View>

      <View style={styles.carouselWrapper}>
        {isLoading && currentPage === 1 ? (
          <BannerSkeleton backgroundColor="#E0E0E0" highlightColor="#F5F5F5" />
        ) : (
          <>
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
            {carouselImages && carouselImages.length > 1 && (
              <View style={styles.paginationContainer}>
                {carouselImages?.map((_: any, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.carouselDot,
                      index === activeIndex && styles.carouselDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </View>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{t('Recommended for You')}</Text>
        <Tooltip
          position="bottom"
          containerStyle={styles.tooltipIcon}
          message="Recommended for you, based on your profile and AI matching."
          tooltipBoxStyle={{ left: wp(-100), top: '-200%', width: wp(280), maxWidth: wp(280), zIndex: 1000, position: 'absolute', overflow: 'visible' }}
        />
      </View>
    </>
  );

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      {isLoading && currentPage === 1 ? (
        <>
          <MyJobsSkeleton />
        </>
      ) : (
        <FlatList
          data={sortedJobList.length > 0 ? sortedJobList : allJobs}
          style={AppStyles.flex}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            const isFavorite = localFavorites.includes(item?._id);
            return (
              <JobCard
                key={index}
                item={item}
                heartImage={isFavorite}
                onPressFavorite={() => handleToggleFavorite(item)}
                onPress={() =>
                  navigateTo(SCREENS.JobDetail, {
                    item: item,
                    resumeList: resumeList,
                    is_applied: item?.is_applied,
                  })
                }
              />
            );
          }}
          keyExtractor={(item, index) => item?._id || index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: hp(28) }} />}
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={renderHeader}
          onEndReached={hasMorePages ? loadMoreJobs : undefined}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BaseText style={styles.emptyText}>
                We couldn't find a perfect match right now. Try updating your profile or check back soon for new opportunities.
              </BaseText>
            </View>
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.loadingMoreContainer}>
                <BaseText style={styles.loadingMoreText}>
                  Loading more jobs...
                </BaseText>
              </View>
            ) : null
          }
        />
      )}

      <BottomModal
        visible={isFilterModalVisible}
        backgroundColor={colors._F7F7F7}
        onClose={() => {
          setIsFilterModalVisible(false);
          setShowAllDepartments(false);
        }}>
        <ScrollView
          style={styles.modalScrollView}
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>{t('Search Filter')}</Text>

            <CustomImage
              onPress={() => {
                setIsFilterModalVisible(false);
                setShowAllDepartments(false);
              }}
              source={IMAGES.close}
              size={wp(18)}
            />
          </View>

          <Text style={styles.sectionLabel}>{t('Department')}</Text>
          <View style={styles.pillRow}>
            {(showAllDepartments ? departments : departments?.slice(0, 6))?.map((dept: any, index: number) => {
              const deptId = dept?._id;
              // Check if selected - handle both string IDs and objects
              const isSelected = filters.job_sectors.some(
                (d: any) => (typeof d === 'string' ? d : d?._id) === deptId
              );
              return (
                <Pressable
                  key={deptId || dept?.title || dept || index}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  onPress={() => {
                    setFilters(prev => {
                      // Clean up any existing non-string values and ensure only IDs are stored
                      const cleanSectors = prev.job_sectors.filter(
                        (d: any) => typeof d === 'string' && d.trim() !== ''
                      );
                      
                      return {
                        ...prev,
                        job_sectors: isSelected
                          ? cleanSectors.filter((d: string) => d !== deptId)
                          : [...cleanSectors, deptId],
                      };
                    });
                  }}>
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected,
                    ]}>
                    {dept?.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {departments && departments.length > 6 && !showAllDepartments && (
            <TouchableOpacity
              onPress={() => setShowAllDepartments(true)}
              style={styles.showMoreContainer}>
              <Text style={styles.showMoreText}>{t('Show more')}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.inputWrapper}>
            <CustomTextInput
              value={filters.location}
              onChangeText={txt =>
                setFilters(prev => ({ ...prev, location: txt }))
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
              type="Employee"
              style={styles.btn}
              title={t('Apply Filter')}
              onPress={handleApplyFilter}
            />
          </View>
        </ScrollView>
      </BottomModal>

      <BottomModal
        visible={isSortModalVisible}
        backgroundColor={colors._F7F7F7}
        onClose={() => setIsSortModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.filterTitle}>Sort By</Text>

          <View style={styles.sortOptions}>
            {/* Newest */}
            <Pressable
              style={[
                styles.sortOption,
                sortBy === 'newest' && styles.sortOptionSelected,
              ]}
              onPress={() => {
                setSortBy('newest');
                setIsSortModalVisible(false);
              }}
            >
              <View style={styles.sortOptionContent}>
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === 'newest' && styles.sortOptionTextSelected,
                  ]}
                >
                  Newest Jobs
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.sortOption,
                sortBy === 'salary_high_low' && styles.sortOptionSelected,
              ]}
              onPress={() => {
                setSortBy('salary_high_low');
                setIsSortModalVisible(false);
              }}
            >
              <View style={styles.sortOptionContent}>
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === 'salary_high_low' && styles.sortOptionTextSelected,
                  ]}
                >
                  Salary: High to Low
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.sortOption,
                sortBy === 'salary_low_high' && styles.sortOptionSelected,
              ]}
              onPress={() => {
                setSortBy('salary_low_high');
                setIsSortModalVisible(false);
              }}
            >
              <View style={styles.sortOptionContent}>
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === 'salary_low_high' &&
                    styles.sortOptionTextSelected,
                  ]}
                >
                  Salary: Low to High
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.sortOption,
                sortBy === 'closest_location' && styles.sortOptionSelected,
              ]}
              onPress={() => {
                if (userLocation) {
                  setSortBy('closest_location');
                  setIsSortModalVisible(false);
                } else {
                  errorToast('Location not available. Please enable location services.');
                }
              }}
            >
              <View style={styles.sortOptionContent}>
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === 'closest_location' &&
                    styles.sortOptionTextSelected,
                  ]}
                >
                  Closest Location
                </Text>
              </View>
            </Pressable>

            {sortBy && (
              <Pressable
                style={styles.clearSortButton}
                onPress={() => {
                  setSortBy(null);
                  setIsSortModalVisible(false);
                }}
              >
                <Text style={styles.clearSortText}>Clear Sort</Text>
              </Pressable>
            )}
          </View>
        </View>
      </BottomModal>

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
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(12),
    gap: wp(8),
    overflow: 'visible',
  },
  sectionTitle: {
    ...commonFontStyle(500, 20, colors._0B3970),
  },
  tooltipIcon: {
    marginTop: hp(0),
  },
  scrollContainer: {
    paddingBottom: hp(30),
    paddingHorizontal: wp(25),
  },
  carouselWrapper: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: hp(12),
    width: '100%',
    gap: wp(6),
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
  modalScrollView: {
    flexGrow: 1,
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
    height: hp(6),
    width: wp(6),
    borderRadius: hp(3),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  carouselDotActive: {
    width: wp(17),
    backgroundColor: colors.white,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    marginTop: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(30),
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(400, 16, colors._0B3970),
    lineHeight: hp(24),
  },
  sortButton: {
    position: 'relative',
  },
  sortOptions: {
    marginTop: hp(20),
    gap: hp(12),
  },
  sortOption: {
    paddingVertical: hp(16),
    paddingHorizontal: wp(16),
    borderRadius: hp(12),
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: colors.white,
  },
  sortOptionSelected: {
    borderColor: colors.empPrimary,
    backgroundColor: '#F0F8FF',
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortOptionText: {
    ...commonFontStyle(500, 16, colors.black),
  },
  sortOptionTextSelected: {
    ...commonFontStyle(600, 16, colors.empPrimary),
  },
  checkIcon: {
    width: wp(20),
    height: hp(20),
    tintColor: colors.empPrimary,
  },
  clearSortButton: {
    marginTop: hp(12),
    paddingVertical: hp(14),
    alignItems: 'center',
    borderRadius: hp(12),
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: colors.white,
  },
  clearSortText: {
    ...commonFontStyle(500, 16, colors._7B7878),
  },
  sortButtonContainer: {
    padding: wp(3),
  },
  sortIconWrapper: {
    width: wp(24),
    height: wp(24),
    justifyContent: 'center',
    gap: hp(4),
  },
  sortLine: {
    height: hp(2.5),
    borderRadius: hp(1.5),
    backgroundColor: colors._0B3970,
  },
  sortLineTop: {
    width: wp(20),
    alignSelf: 'flex-start',
  },
  sortLineMiddle: {
    width: wp(16),
    alignSelf: 'flex-start',
  },
  sortLineBottom: {
    width: wp(12),
    alignSelf: 'flex-start',
  },
  loadingMoreContainer: {
    paddingVertical: hp(20),
    alignItems: 'center',
  },
  loadingMoreText: {
    ...commonFontStyle(400, 14, colors._7B7878),
  },
  showMoreContainer: {
    marginTop: hp(8),
    marginBottom: hp(10),
    alignItems: 'center',
  },
  showMoreText: {
    ...commonFontStyle(500, 16, colors._0B3970),
    textDecorationLine: 'underline',
  },
});
