import React, { useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { ActivitiesCard, BackHeader, LinearContainer } from '../../../component';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { useTranslation } from 'react-i18next';
import { AppStyles } from '../../../theme/appStyles';
import NoDataText from '../../../component/common/NoDataText';
import { useGetActivitiesQuery, useLazyGetActivitiesQuery } from '../../../api/dashboardApi';

const ActivityScreen = () => {
  const { t } = useTranslation();
  const { data: activitiesData, isLoading, refetch } = useGetActivitiesQuery({ page: 1 });
  const activities = activitiesData?.data?.activities || [];
  
  const [fetchMoreActivities, { isFetching }] = useLazyGetActivitiesQuery();
  const [extraActivities, setExtraActivities] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (activitiesData?.data) {
      const pagination = activitiesData?.data?.pagination;
      if (pagination) {
        setHasMore(pagination.current_page < pagination.total_pages);
      } else {
        setHasMore((activities?.length || 0) >= 10);
      }
    }
  }, [activitiesData, activities]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isFetching) return;
    
    const nextPage = currentPage + 1;
    try {
      const result = await fetchMoreActivities({ page: nextPage }).unwrap();
      const newActivities = result?.data?.activities || [];
      
      if (newActivities.length > 0) {
        setExtraActivities(prev => [...prev, ...newActivities]);
        setCurrentPage(nextPage);
        
        const pagination = result?.data?.pagination;
        if (pagination) {
          setHasMore(pagination.current_page < pagination.total_pages);
        } else {
          setHasMore(newActivities.length >= 10);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Error loading more activities:', error);
      setHasMore(false);
    }
  }, [hasMore, isFetching, currentPage, fetchMoreActivities]);

  const displayActivities = [...activities, ...extraActivities];

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <View style={styles.topConrainer}>
        <BackHeader
          title={t('My Activities')}
          containerStyle={styles.header}
          titleStyle={styles.headerTitle}
        />
      </View>

      <FlatList
        data={displayActivities}
        style={AppStyles.flex}
        keyExtractor={(item, index) => item?._id || index.toString()}
        contentContainerStyle={styles.scrollContainer}
        renderItem={(item: any) => <ActivitiesCard {...item} />}
        ItemSeparatorComponent={() => <View style={{ height: hp(22) }} />}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={() => {
          return (
            <View style={styles.emptyContainer}>
              <NoDataText
                text="You don't have any activity yet."
                textStyle={{ color: colors._0B3970 }}
              />
            </View>
          );
        }}
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
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tab: {
    backgroundColor: colors.white,
    paddingVertical: hp(14),
    borderRadius: 10,
    alignItems: 'center',
    marginTop: hp(22),
  },
  activeTabText: {
    ...commonFontStyle(700, 20, colors._0B3B75),
  },
  topConrainer: {
    paddingHorizontal: wp(25),
    paddingTop: hp(18),
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    paddingLeft: wp(13),
  },
  activitiesTitle: {
    ...commonFontStyle(700, 20, colors.white),
    marginTop: hp(22),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: hp(22),
    paddingHorizontal: wp(25),
  },
  headerTitle: {
    ...commonFontStyle(600, 22, colors._0B3970),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
