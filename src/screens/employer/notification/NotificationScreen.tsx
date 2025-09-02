import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import BaseText from '../../../component/common/BaseText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {BackHeader, LinearContainer} from '../../../component';
import NotificationCard from '../../../component/employe/NotificationCard';
import {useGetEmployeeNotificationsQuery} from '../../../api/dashboardApi';

const NotificationScreen = () => {
  const [page, setPage] = useState<number>(1);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(false);

  const {
    isLoading,
    isFetching,
    data: notificationsData,
  } = useGetEmployeeNotificationsQuery(
    {page},
    {refetchOnMountOrArgChange: true},
  );
  const notificationList = notificationsData?.data?.notifications || [];
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

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <View style={styles.topConrainer}>
          <BackHeader
            isRight={true}
            title={'Notifications'}
            containerStyle={styles.header}
            RightIcon={<View style={{width: 20}} />}
          />
        </View>
        {isLoading && page === 1 ? (
          <View style={AppStyles.centeredContainer}>
            <ActivityIndicator size={'large'} />
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
                <ActivityIndicator style={{marginVertical: hp(16)}} />
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
    ...commonFontStyle(400, 18, colors.white),
  },
});
