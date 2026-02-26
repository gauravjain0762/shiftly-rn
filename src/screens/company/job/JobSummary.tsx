import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BackHeader, LinearContainer } from '../../../component';
import JobListCard from '../../../component/common/JobListCard';
import { colors } from '../../../theme/colors';
import { hp, wp, commonFontStyle } from '../../../theme/fonts';
import { useGetCompanyJobsQuery } from '../../../api/dashboardApi';
import { navigateTo } from '../../../utils/commonFunction';
import { SCREENS } from '../../../navigation/screenNames';
import Share from 'react-native-share';

const tabs = ['Live Jobs', 'Closed Jobs'];

const JobSummary = () => {
  const route = useRoute<any>();
  const initialTab = route.params?.initialTab || 'Live Jobs';
  const [activeTab, setActiveTab] = useState<'Live Jobs' | 'Closed Jobs'>(initialTab);
  const [refreshing, setRefreshing] = useState(false);
  const [pageLive, setPageLive] = useState(1);
  const [pageClosed, setPageClosed] = useState(1);
  const [listLive, setListLive] = useState<any[]>([]);
  const [listClosed, setListClosed] = useState<any[]>([]);

  const liveJobsQuery = useGetCompanyJobsQuery(
    { page: pageLive, type: 'active' },
    { skip: activeTab !== 'Live Jobs' }
  );
  const closedJobsQuery = useGetCompanyJobsQuery(
    { page: pageClosed, type: 'expired' },
    { skip: activeTab !== 'Closed Jobs' }
  );

  const getActiveQuery = () => {
    return activeTab === 'Live Jobs' ? liveJobsQuery : closedJobsQuery;
  };

  const { isLoading, isFetching } = getActiveQuery();

  useEffect(() => {
    if (liveJobsQuery.data?.status) {
      const newList = liveJobsQuery.data?.data?.jobs || [];
      setListLive(pageLive === 1 ? newList : prev => {
        const existingIds = new Set(prev.map(item => item._id));
        const unique = newList.filter((item: any) => !existingIds.has(item._id));
        return unique.length ? [...prev, ...unique] : prev;
      });
    }
  }, [liveJobsQuery.data, pageLive]);

  useEffect(() => {
    if (closedJobsQuery.data?.status) {
      const newList = closedJobsQuery.data?.data?.jobs || [];
      setListClosed(pageClosed === 1 ? newList : prev => {
        const existingIds = new Set(prev.map(item => item._id));
        const unique = newList.filter((item: any) => !existingIds.has(item._id));
        return unique.length ? [...prev, ...unique] : prev;
      });
    }
  }, [closedJobsQuery.data, pageClosed]);

  const jobsList = activeTab === 'Live Jobs' ? listLive : listClosed;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === 'Live Jobs') {
      setPageLive(1);
      await liveJobsQuery.refetch();
    } else {
      setPageClosed(1);
      await closedJobsQuery.refetch();
    }
    setRefreshing(false);
  }, [activeTab, liveJobsQuery, closedJobsQuery]);

  const handleLoadMore = () => {
    const query = getActiveQuery();
    const pagination = query.data?.data?.pagination;
    const totalPages = pagination?.total_pages || 1;
    const currentPage = activeTab === 'Live Jobs' ? pageLive : pageClosed;
    if (!isFetching && currentPage < totalPages) {
      if (activeTab === 'Live Jobs') setPageLive(prev => prev + 1);
      else setPageClosed(prev => prev + 1);
    }
  };

  const handleShare = async (job: any) => {
    try {
      const message = `${job?.title || 'Job'}\n\n${job?.description || ''}`;
      await Share.open({ title: job?.title, message });
    } catch (err: any) {
      if (err?.message !== 'User did not share') return;
    }
  };

  const handlePressView = (item: any) => () =>
    navigateTo(SCREENS.SuggestedEmployee, {
      jobId: item?._id,
      jobData: { data: { job: item } },
      isFromJobCard: true,
    });

  const renderJobCard = ({ item }: { item: any }) => {
    const isClosed = activeTab === 'Closed Jobs';
    const closedDate = item?.closed_date || item?.expiry_date || item?.updatedAt;

    return (
      <JobListCard
        job={item}
        variant="company"
        dateFormat="short"
        onPress={handlePressView(item)}
        onPressView={handlePressView(item)}
        onShare={() => handleShare(item)}
        showClosedInfo={isClosed}
        closedDate={isClosed ? closedDate : undefined}
        statusBadge={
          isClosed ? { text: 'Closed', useImageBg: true, tintColor: '#ED494E' } : undefined
        }
      />
    );
  };

  const renderTab = (tab: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
    </TouchableOpacity>
  );

  const ListEmpty = () => {
    const query = getActiveQuery();
    const rawData = query.data?.data?.jobs || [];
    const isActuallyEmpty = query.isSuccess && (!Array.isArray(rawData) || rawData.length === 0);

    if ((isLoading || isFetching) && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors._0B3970} />
        </View>
      );
    }
    if (isActuallyEmpty) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No jobs found</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <LinearContainer colors={[colors.white, colors.white]}>
      <BackHeader title="Jobs" containerStyle={{ paddingHorizontal: wp(20), paddingTop: hp(12) }} />

      <View style={styles.tabsContainer}>
        {tabs.map(renderTab)}
      </View>

      <FlatList
        data={jobsList}
        renderItem={renderJobCard}
        keyExtractor={(item, index) => item?._id || index.toString()}
        contentContainerStyle={[
          styles.contentContainer,
          jobsList.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={ListEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          isFetching && jobsList.length > 0 ? (
            <ActivityIndicator size="small" color={colors._0B3970} style={{ marginVertical: hp(16) }} />
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </LinearContainer>
  );
};

export default JobSummary;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(20),
    marginBottom: hp(16),
    gap: wp(10),
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp(10),
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E2E6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: colors._0B3970,
    borderColor: colors._0B3970,
  },
  tabText: {
    ...commonFontStyle(500, 14, '#999'),
  },
  activeTabText: {
    color: colors.white,
  },
  contentContainer: {
    paddingHorizontal: wp(20),
    paddingBottom: hp(24),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(40),
  },
  emptyText: {
    ...commonFontStyle(500, 16, colors._656464),
  },
});
