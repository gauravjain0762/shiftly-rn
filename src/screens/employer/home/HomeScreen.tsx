import React, { useEffect, useRef, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { userInfo, fcmToken, hasUnreadNotification }: any = useSelector((state: RootState) => state.auth);
  const { data: profileData, refetch: refetchProfile } = useGetEmployeeProfileQuery({});
  const [localUnreadCount, setLocalUnreadCount] = useState<number>(0);
  const prevUnreadFlagRef = useRef<boolean>(false);

  const {
    data: getJobs,
    isLoading: isLoadingJobs,
    isFetching: isFetchingJobs,
    refetch: refetchJobs
  } = useGetEmployeeJobsQuery({ page: currentPage });

  const { data: dashboardData, isLoading: isLoadingDashboard, refetch: refetchDashboard } = useGetEmployeeDashboardQuery({});

  const stats = dashboardData?.data?.stats;
  const recentJobs = dashboardData?.data?.recent_jobs || [];

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
      setLocalUnreadCount(Number(profileData?.data?.user?.unread_notifications ?? 0));
    }
  }, [profileData]);

  useEffect(() => {
    // Keep local unread in sync when Redux userInfo changes from other flows.
    if (!profileData?.data?.user) {
      setLocalUnreadCount(Number(userInfo?.unread_notifications ?? 0));
    }
  }, [userInfo?.unread_notifications, profileData?.data?.user]);

  useEffect(() => {
    // Instant update on incoming push while on Home.
    const prev = prevUnreadFlagRef.current;
    const curr = Boolean(hasUnreadNotification);
    if (!prev && curr) {
      setLocalUnreadCount(prevCount => prevCount + 1);
    }
    prevUnreadFlagRef.current = curr;
  }, [hasUnreadNotification]);

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      const syncUnreadFromProfile = async () => {
        const refreshed: any = await refetchProfile();
        const apiCount = Number(
          refreshed?.data?.data?.user?.unread_notifications ??
          refreshed?.data?.user?.unread_notifications ??
          0,
        );
        if (mounted) {
          setLocalUnreadCount(apiCount);
        }
      };
      syncUnreadFromProfile();
      return () => {
        mounted = false;
      };
    }, [refetchProfile]),
  );

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
    refetchProfile();
  };

  const renderHeader = () => {
    return (
      <View>
        <View style={styles.headerContainer}>
          <HomeHeader
            companyProfile={userInfo}
            onPressAvatar={() => navigateTo(SCREENS.ProfileScreen)}
            onPressNotifi={() => navigateTo(SCREENS.NotificationScreen)}
            unreadCount={localUnreadCount}
          />
        </View>

        <DashboardStats
          interviewCount={interviewCount}
          appliedCount={appliedCount}
          matchedCount={matchedCount}
          onPressInterview={() => navigateTo(SCREENS.MyJobs, { initialTab: 'Interviews' })}
          onPressApplied={() => navigateTo(SCREENS.MyJobs, { initialTab: 'Applied' })}
          onPressMatched={() => navigateTo(SCREENS.MyJobs, { initialTab: 'Matched' })}
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
