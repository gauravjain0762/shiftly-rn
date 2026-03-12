import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { BackHeader, LinearContainer } from '../../../component';
import { useTranslation } from 'react-i18next';
import { SCREEN_WIDTH, commonFontStyle, hp, wp } from '../../../theme/fonts';
import { IMAGES } from '../../../assets/Images';
import { colors } from '../../../theme/colors';
import BaseText from '../../../component/common/BaseText';
import { useClearAllNotificationsMutation, useGetCompanyNotificationQuery, useMarkReadNotificationsMutation } from '../../../api/dashboardApi';
import { useFocusEffect } from '@react-navigation/native';
import { formatted, navigateTo } from '../../../utils/commonFunction';
import { useAppDispatch } from '../../../redux/hooks';
import { setHasUnreadNotification } from '../../../features/authSlice';
import { AppStyles } from '../../../theme/appStyles';
import { SCREENS } from '../../../navigation/screenNames';

const CoNotification = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(1);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(false);

  const [markReadNotifications] = useMarkReadNotificationsMutation();
  const [clearAllNotifications, {isLoading: isClearing}] = useClearAllNotificationsMutation();

  useFocusEffect(
    useCallback(() => {
      markReadNotifications({notification_id: 'all'});
      dispatch(setHasUnreadNotification(false));
    }, []),
  );

  const {
    data: notificationsData,
    isFetching,
    isLoading,
  } = useGetCompanyNotificationQuery({ page }, { refetchOnMountOrArgChange: true });

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

  const handleClearAll = async () => {
    try {
      await markReadNotifications({notification_id: 'all'}).unwrap();
      await clearAllNotifications().unwrap();
      setAllNotifications([]);
      dispatch(setHasUnreadNotification(false));
    } catch (error) {
      console.log('clearAllNotifications error:', error);
    }
  };

  const onReached = () => {
    if (
      pagination?.current_page < pagination?.total_pages &&
      !onEndReachedCalled &&
      !isFetching
    ) {
      const nextPage = page + 1;
      setOnEndReachedCalled(true);
      setPage(nextPage);
    }
  };

  const handleNotificationPress = async (item: any) => {
    const notifType = item?.data?.type || item?.type;
    if (notifType === 'interview') {
      const notificationId = item?._id;
      try {
        if (notificationId) {
          await markReadNotifications({ notification_id: notificationId }).unwrap();
        }
      } catch (e) {
        console.log('markReadNotifications error:', e);
      }
    }
    if (notifType === 'chat') {
      navigateTo(SCREENS.CoChat, { data: { chat_id: item?.data?.id } });
    } else if (notifType === 'interview') {
      const jobId = item?.data?.job_id || item?.data?.id;
      if (jobId) {
        navigateTo(SCREENS.SuggestedEmployee, { jobId });
      }
    }
  };

  const renderItem = ({ item, index }: any) => {
    const notifType = item?.data?.type || item?.type;
    const isRead = !!item?.isRead;
    const showUnreadDot = !isRead;
    return (
      <TouchableOpacity
        key={index}
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handleNotificationPress(item)}>
        <View style={styles.cardContent}>
          <View style={[styles.iconWrapper]}>
            <Image source={IMAGES.bell} style={styles.bell} />
            {showUnreadDot && <View style={styles.readDot} />}
          </View>
          <View style={{ flex: 1, gap: hp(5) }}>
            <BaseText style={styles.notificationTitle}>{item?.title}</BaseText>
            <BaseText style={styles.time}>{item?.message}</BaseText>
            <View style={styles.rowBetween}>
              <BaseText style={styles.time}>{formatted(item?.createdAt)}</BaseText>
              {notifType === 'interview' && (
                <Pressable
                  onPress={() => handleNotificationPress(item)}
                  style={styles.viewInvitationBtn}>
                  <BaseText style={styles.viewInvitationText}>
                    {t('View Invitation')}
                  </BaseText>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <BackHeader
        type="company"
        isRight={false}
        title={t('Notifications')}
        containerStyle={styles.header}
      />

      {allNotifications.length > 0 && (
        <TouchableOpacity
          onPress={handleClearAll}
          disabled={isClearing}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearAllButton}>
          <BaseText style={styles.clearAllText}>
            {isClearing ? 'clearing...' : 'clear all'}
          </BaseText>
        </TouchableOpacity>
      )}

      {isLoading ? (
        <View style={AppStyles.centeredContainer}>
          <ActivityIndicator size={'large'} color={colors._D5D5D5} />
        </View>
      ) : (
        <FlatList
          data={allNotifications}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <BaseText style={styles.emptyText}>
                  {t('There is no notification available')}
                </BaseText>
              </View>
            );
          }}
          onEndReached={onReached}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() =>
            isFetching && pagination?.current_page < pagination?.total_pages ? (
              <ActivityIndicator color={colors._D5D5D5} style={{ marginVertical: 10 }} />
            ) : null
          }
        />
      )}
    </LinearContainer>
  );
};

export default CoNotification;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(35),
    paddingTop: hp(26),
  },
  title: {
    marginRight: 'auto',
    marginLeft: wp(((SCREEN_WIDTH - 70) / 2) * 0.5),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: hp(10),
    paddingBottom: hp(20),
    paddingHorizontal: wp(26),
  },
  card: {
    borderRadius: 18,
    padding: wp(16),
    marginBottom: hp(16),
    borderWidth: 1.5,
    borderColor: '#F7F7F7',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: wp(40),
    height: wp(40),
    resizeMode: 'contain',
    marginRight: wp(16),
  },
  notificationTitle: {
    marginBottom: hp(2),
    ...commonFontStyle(500, 17, colors._3B3939),
  },
  time: {
    ...commonFontStyle(400, 16, colors._464646),
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
  clearAllButton: {
    alignSelf: 'flex-end',
    marginTop: hp(8),
    marginRight: wp(26),
  },
  iconWrapper: {
    backgroundColor: '#0D468C',
    borderRadius: 20,
    marginRight: 12,
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  bell: {
    width: wp(16),
    height: hp(16),
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  readDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#E53935',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewInvitationBtn: {
    backgroundColor: colors._0B3970,
    paddingHorizontal: wp(10),
    paddingVertical: hp(8),
    borderRadius: hp(20),
  },
  viewInvitationText: {
    ...commonFontStyle(500, 13, colors.white),
  },
});
