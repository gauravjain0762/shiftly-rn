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
  useGetEmployeeDashboardQuery,
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

  const {
    data: getJobs,
    isLoading: isLoadingJobs,
    isFetching: isFetchingJobs,
    refetch: refetchJobs
  } = useGetEmployeeJobsQuery({ page: currentPage });

  const { data: dashboardData, isLoading: isLoadingDashboard, refetch: refetchDashboard } = useGetEmployeeDashboardQuery({});

  const stats = dashboardData?.data?.stats;
  const recentJobs = dashboardData?.data?.recent_matched_jobs || [];

  const interviewCount = stats?.interview_requests || 0;
  const appliedCount = stats?.applied_jobs || 0;
  const matchedCount = stats?.matched_jobs || 0;

  const totalPages = getJobs?.data?.pagination?.total_pages ?? 1;

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
    refetchDashboard();
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
          onPressInterview={() => navigateTo(SCREENS.MyJobs, { initialTab: 'Interviews' })}
          onPressApplied={() => navigateTo(SCREENS.MyJobs, { initialTab: 'Applied Jobs' })}
          onPressMatched={() => navigateTo(SCREENS.MyJobs, { initialTab: 'Matched Jobs' })}
        />

        <Text style={styles.sectionTitle}>Recent Jobs</Text>
      </View>
    );
  };

  return (
    <LinearContainer colors={[colors.white, colors.white]}>
      <FlatList
        data={recentJobs.length > 0 ? recentJobs : getJobs?.data?.jobs || []}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item, index) => item?._id || index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <RecentJobCard
              item={item}
              onPress={() => navigateTo(SCREENS.JobDetail, { role: 'employee', jobId: item?._id, is_applied: item?.is_applied })}
              onPressView={() => navigateTo(SCREENS.JobDetail, { role: 'employee', jobId: item?._id, is_applied: item?.is_applied })}
            />
          );
        }}
        ListHeaderComponent={renderHeader}
        refreshing={(isFetchingJobs || isLoadingDashboard) && currentPage === 1}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingJobs && currentPage > 1 ? (
            <ActivityIndicator size="large" color={colors._0B3970} />
          ) : null
        }
        ListEmptyComponent={
          !isLoadingJobs && !isLoadingDashboard ? (
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
