import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';

import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import BaseText from '../../../component/common/BaseText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {BackHeader, LinearContainer} from '../../../component';
import NotificationCard from '../../../component/employe/NotificationCard';
import {useClearAllNotificationsMutation, useGetEmployeeNotificationsQuery, useMarkReadNotificationsMutation} from '../../../api/dashboardApi';
import {useFocusEffect} from '@react-navigation/native';
import {useAppDispatch} from '../../../redux/hooks';
import {setHasUnreadNotification} from '../../../features/authSlice';

const NotificationScreen = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>(1);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(false);
  const [markReadNotifications] = useMarkReadNotificationsMutation();
  const [clearAllNotifications, {isLoading: isClearing}] = useClearAllNotificationsMutation();

  useFocusEffect(
    useCallback(() => {
      markReadNotifications();
      dispatch(setHasUnreadNotification(false));
    }, []),
  );

  const {
    isLoading,
    isFetching,
    data: notificationsData,
    refetch,
  } = useGetEmployeeNotificationsQuery(
    {page},
    {refetchOnMountOrArgChange: true},
  );
  const notificationList = notificationsData?.data?.notifications || [];
  console.log("🔥 ~ NotificationScreen ~ notificationList:", notificationList)
  const pagination = notificationsData?.data?.pagination;

  useEffect(() => {
    if (notificationsData) {
      const newData = notificationList;
      setAllNotifications(prev =>
        pagination?.current_page === 1 ? newData : [...prev, ...newData],
      );
      setOnEndReachedCalled(false);
    }
  }, [notificationsData]);

  const onReached = () => {
    if (
      pagination?.current_page < pagination?.total_pages &&
      !onEndReachedCalled &&
      !isFetching
    ) {
      const nextPage = page + 1;
      console.log(' ~ onReached ~ nextPage:', nextPage);
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

  const handleClearAll = async () => {
    try {
      await clearAllNotifications().unwrap();
      setAllNotifications([]);
    } catch (error) {
      console.log('clearAllNotifications error:', error);
    }
  };

  return (
    <LinearContainer colors={[colors._F7F7F7, colors._F7F7F7]}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <View style={styles.topConrainer}>
          <BackHeader
            type="employe"
            isRight={true}
            title={'Notifications'}
            containerStyle={styles.header}
            RightIcon={
              allNotifications.length > 0 ? (
                <TouchableOpacity
                  onPress={handleClearAll}
                  disabled={isClearing}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <BaseText style={styles.clearAllText}>
                    {isClearing ? 'clearing...' : 'clear all'}
                  </BaseText>
                </TouchableOpacity>
              ) : (
                <View style={{width: wp(60)}} />
              )
            }
          />
        </View>
        {isLoading && page === 1 ? (
          <View style={AppStyles.centeredContainer}>
            <ActivityIndicator size={'large'} color={colors._D5D5D5} />
          </View>
        ) : (
          <FlatList
            style={AppStyles.flex}
            data={allNotifications}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.scrollContainer}
            renderItem={(item: any) => <NotificationCard {...item} />}
            ItemSeparatorComponent={() => <View style={{height: hp(22)}} />}
            showsVerticalScrollIndicator={false}
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
            onEndReached={onReached}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyContainer}>
                  <BaseText style={styles.emptyText}>
                    {'There is no notification available'}
                  </BaseText>
                </View>
              );
            }}
            ListFooterComponent={
              isFetching &&
              pagination?.current_page < pagination?.total_pages ? (
                <ActivityIndicator color={colors._D5D5D5} style={{marginVertical: hp(16)}} />
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </LinearContainer>
  );
};

export default NotificationScreen;

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
    paddingVertical: hp(18),
    // borderBottomWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    // paddingLeft: wp(13),
    marginBottom: hp(1),
  },

  scrollContainer: {
    flexGrow: 1,
    // paddingVertical: hp(22),
    paddingHorizontal: wp(25),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  clearAllText: {
    ...commonFontStyle(500, 15, colors._0B3970),
  },
});
