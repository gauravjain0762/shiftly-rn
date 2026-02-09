import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { HomeHeader, LinearContainer } from '../../../component';
import { hp, wp, commonFontStyle } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import {
  useGetEmployeeJobsQuery,
  useGetEmployeeProfileQuery,
  useGetActivitiesQuery
} from '../../../api/dashboardApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  setUserInfo,
} from '../../../features/authSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { connectSocket } from '../../../hooks/socketManager';
import DashboardStats from '../../../component/employe/DashboardStats';
import RecentJobCard from '../../../component/employe/RecentJobCard';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { userInfo }: any = useSelector((state: RootState) => state.auth);
  const { data: profileData } = useGetEmployeeProfileQuery({});

  // Fetch Jobs
  const {
    data: getJobs,
    isLoading: isLoadingJobs,
    isFetching: isFetchingJobs,
    refetch: refetchJobs
  } = useGetEmployeeJobsQuery({ page: currentPage });

  const jobs = getJobs?.data?.jobs || [];
  const totalPages = getJobs?.data?.pagination?.total_pages ?? 1;

  // Fetch Stats - Using getActivities for now as it seemed most relevant from previous context
  // or we might need to map specific fields if getDashboard is not correct for employees.
  // Based on apiConstant, getDashboard is company side. getActivities is employee side.
  // Let's see what getActivities returns or just use placeholders if data is missing.
  const { data: activitiesData } = useGetActivitiesQuery({});

  // Dummy stats if API doesn't provide them directly
  const interviewCount = activitiesData?.data?.interview_requests || 25;
  const appliedCount = activitiesData?.data?.applied_jobs || 21;
  const matchedCount = activitiesData?.data?.matched_jobs || 11;


  useEffect(() => {
    if (userInfo?._id) {
      connectSocket(userInfo?._id, 'user');
    }
  }, [userInfo]);

  useEffect(() => {
    if (profileData) {
      dispatch(setUserInfo(profileData?.data?.user));
    }
  }, [profileData]);

  const handleLoadMore = () => {
    if (!isFetchingJobs && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    refetchJobs();
  };

  const renderHeader = () => {
    return (
      <View>
        <View style={styles.headerContainer}>
          <HomeHeader
            companyProfile={userInfo}
            onPressAvatar={() => navigateTo(SCREENS.ProfileScreen)}
            onPressNotifi={() => navigateTo(SCREENS.NotificationScreen)}
          />
        </View>

        <DashboardStats
          interviewCount={interviewCount}
          appliedCount={appliedCount}
          matchedCount={matchedCount}
          onPressInterview={() => { }}
          onPressApplied={() => { }}
          onPressMatched={() => { }}
        />

        <Text style={styles.sectionTitle}>Recent Jobs</Text>
      </View>
    );
  };

  return (
    <LinearContainer colors={[colors.white, colors.white]}>
      <FlatList
        data={jobs}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item, index) => item?._id || index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RecentJobCard
            item={item}
            onPress={() => navigateTo(SCREENS.JobDetail, { role: 'employee', job_id: item?._id })}
            onPressView={() => navigateTo(SCREENS.JobDetail, { role: 'employee', job_id: item?._id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        refreshing={isFetchingJobs && currentPage === 1}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingJobs && currentPage > 1 ? (
            <ActivityIndicator size="large" color={colors._0B3970} />
          ) : null
        }
        ListEmptyComponent={
          !isLoadingJobs ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No jobs found</Text>
          ) : null
        }
      />
    </LinearContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp(20),
    paddingBottom: hp(20),
  },
  headerContainer: {
    marginTop: hp(20),
  },
  sectionTitle: {
    ...commonFontStyle(700, 18, colors.black),
    marginTop: hp(24),
    marginBottom: hp(16),
  }
});
