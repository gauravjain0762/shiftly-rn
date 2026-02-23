import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  BackHeader,
  JobCard,
  LinearContainer,
} from '../../../component';
import { useGetFavouritesJobQuery, useLazyGetFavouritesJobQuery } from '../../../api/dashboardApi';
import { AppStyles } from '../../../theme/appStyles';
import { navigateTo } from '../../../utils/commonFunction';
import { SCREEN_NAMES } from '../../../navigation/screenNames';
import BaseText from '../../../component/common/BaseText';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoriteJobList = () => {
  const { data: getFavoriteJobs } = useGetFavouritesJobQuery({ page: 1 });
  const favJobList = getFavoriteJobs?.data?.jobs || [];
  
  const [fetchMoreJobs, { isFetching }] = useLazyGetFavouritesJobQuery();
  const [extraJobs, setExtraJobs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (getFavoriteJobs?.data) {
      const pagination = getFavoriteJobs?.data?.pagination;
      if (pagination) {
        setHasMore(pagination.current_page < pagination.total_pages);
      } else {
        setHasMore((favJobList?.length || 0) >= 10);
      }
    }
  }, [getFavoriteJobs, favJobList]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isFetching) return;
    
    const nextPage = currentPage + 1;
    try {
      const result = await fetchMoreJobs({ page: nextPage }).unwrap();
      const newJobs = result?.data?.jobs || [];
      
      if (newJobs.length > 0) {
        setExtraJobs(prev => [...prev, ...newJobs]);
        setCurrentPage(nextPage);
        
        const pagination = result?.data?.pagination;
        if (pagination) {
          setHasMore(pagination.current_page < pagination.total_pages);
        } else {
          setHasMore(newJobs.length >= 10);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Error loading more favorite jobs:', error);
      setHasMore(false);
    }
  }, [hasMore, isFetching, currentPage, fetchMoreJobs]);

  const displayJobs = [...favJobList, ...extraJobs];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <LinearContainer colors={[colors._F7F7F7, colors.white]} containerStyle={{ paddingBottom: hp(20) }}>
        <BackHeader
          isRight={false}
          title="Favorite Jobs"
          titleStyle={{ flex: 1 }}
          containerStyle={{ paddingHorizontal: wp(23), gap: wp(20), paddingTop: hp(20) }}
        />

        <FlatList
          data={displayJobs}
          style={AppStyles.flex}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <JobCard
                key={index}
                item={item}
                isShowFavIcon={false}
                onPress={() =>
                  navigateTo(SCREEN_NAMES.JobDetail, {
                    item: item,
                  })
                }
              />
            );
          }}
          keyExtractor={(item, index) => item?._id || index.toString()}
          contentContainerStyle={styles.scrollContainer}
          ItemSeparatorComponent={() => <View style={{ height: hp(28) }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BaseText style={styles.emptyText}>{'No jobs found'}</BaseText>
            </View>
          }
          ListFooterComponent={
            isFetching ? (
              <ActivityIndicator
                size="large"
                color={colors._0B3970}
                style={{marginVertical: hp(20)}}
              />
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </LinearContainer>
    </SafeAreaView>
  );
};

export default FavoriteJobList;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: '5%',
    paddingVertical: hp(20),
    paddingHorizontal: wp(25),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(500, 17, colors._0B3970),
  },
});
