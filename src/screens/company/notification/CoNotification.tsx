import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {BackHeader, LinearContainer} from '../../../component';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH, commonFontStyle, hp, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import BaseText from '../../../component/common/BaseText';
import {
  useCompanyClearAllNotificationsMutation,
  useLazyGetCompanyNotificationQuery,
  useLazyGetCompanyChatsQuery,
  useCompanyMarkReadNotificationsMutation,
} from '../../../api/dashboardApi';
import {useFocusEffect} from '@react-navigation/native';
import {
  formatDateTime,
  formatted,
  navigateTo,
} from '../../../utils/commonFunction';
import {useAppDispatch} from '../../../redux/hooks';
import {setHasUnreadNotification} from '../../../features/authSlice';
import {AppStyles} from '../../../theme/appStyles';
import {SCREENS} from '../../../navigation/screenNames';

const CoNotification = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [companyMarkReadNotifications] =
    useCompanyMarkReadNotificationsMutation();
  const [getCompanyChats] = useLazyGetCompanyChatsQuery();
  const [companyClearAllNotifications, {isLoading: isClearing}] =
    useCompanyClearAllNotificationsMutation();
  const [getNotifications, {isLoading}] = useLazyGetCompanyNotificationQuery();

  useFocusEffect(
    useCallback(() => {
      dispatch(setHasUnreadNotification(false));
    }, [dispatch]),
  );
  console.log(allNotifications, 'allNotificationsallNotifications');

  const fetchNotifications = async (pageNum: number, append: boolean) => {
    if (pageNum > 1) setIsFetchingMore(true);
    try {
      const res = await getNotifications({
        page: pageNum,
        per_page: 10,
      }).unwrap();
      const list = res?.data?.notifications || [];
      const pagination = res?.data?.pagination;
      setAllNotifications(prev => (append ? [...prev, ...list] : list));
      setHasMore(
        (pagination?.current_page ?? 1) < (pagination?.total_pages ?? 1),
      );
      setPage(pageNum);
    } catch (e) {
      console.log('🔥 [Company] notifications fetch error:', e);
    } finally {
      setIsFetchingMore(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, false);
  }, []);

  const handleClearAll = async () => {
    try {
      const clearResponse = await companyClearAllNotifications().unwrap();
      console.log(
        '🔥 [Company] clearAllNotifications API response:',
        JSON.stringify(clearResponse, null, 2),
      );
      setAllNotifications([]);
      setPage(1);
      setHasMore(false);
      dispatch(setHasUnreadNotification(false));
    } catch (error) {
      console.log('🔥 [Company] clearAllNotifications error:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNotifications(1, false);
  };

  const handleEndReached = () => {
    if (!isFetchingMore && !isLoading && hasMore) {
      fetchNotifications(page + 1, true);
    }
  };

  const handleNotificationPress = async (item: any) => {
    const notifType = (item?.data?.type || item?.type || '')
      .toString()
      .toLowerCase();
    const notificationId = item?._id;

    try {
      if (notificationId) {
        console.log('[Company] companyMarkReadNotifications - params:', {
          notification_id: notificationId,
        });
        const result = await companyMarkReadNotifications({
          notification_id: notificationId,
        }).unwrap();
        console.log(
          '[Company] companyMarkReadNotifications - response:',
          result,
        );
        setAllNotifications(prev =>
          prev.map(n => (n._id === notificationId ? {...n, is_read: true} : n)),
        );
      }
    } catch (e) {
      console.log('[Company] markReadNotifications error:', e);
    }

    const isChatNotification =
      notifType === 'chat' ||
      notifType === 'message' ||
      notifType === 'chat_message';

    const firstData = item?.data || {};

    const chatId =
      firstData?.id ||
      firstData?._id ||
      firstData?.chat_id ||
      firstData?.chatId ||
      item?.chat_id ||
      item?.chatId ||
      null;

    const employeeData = firstData?.user_id || firstData?.employee_id || null;
    const employeeId =
      firstData?.user_id?._id ||
      firstData?.user_id ||
      firstData?.employee_id?._id ||
      firstData?.employee_id ||
      null;

    const dataType = (firstData?.type || '').toString().toLowerCase();
    const isChatFromData = dataType === 'chat';
    const jobId = firstData?.type;

    if (isChatNotification || isChatFromData) {
      navigateTo(SCREENS.CoChat, {
        data: {
          chat_id: chatId,
          _id: chatId,
          user_id: employeeData || (employeeId ? {_id: employeeId} : undefined),
        },
        isFromJobDetail: false,
      });
    } else if (
      jobId === 'job' ||
      notifType === 'interview' ||
      notifType.includes('interview')
    ) {
      // interview_completed
      navigateTo(SCREENS.SuggestedEmployee, {
        jobId: firstData?.id,
        invitationStatus:
          firstData?.status || firstData?.invitation_status || item?.status,
      });
    } else if (firstData?.type === 'post') {
      navigateTo(SCREENS.ShowPost, {post: firstData?.post_data});
    }
  };

  const HighlightMessage = ({message}: any) => {
    // Split text by quotes
    const parts = message.split(/(".*?")/g);

    return (
      <BaseText style={styles.time}>
        {parts.map((part, index) => {
          // Check if part is inside quotes
          if (part.startsWith('"') && part.endsWith('"')) {
            return (
              <BaseText
                key={index}
                style={[
                  styles.time,
                  {...commonFontStyle(600, 16, colors._0B3970)},
                ]}>
                {part}
              </BaseText>
            );
          }
          return (
            <BaseText key={index} style={styles.time}>
              {part}
            </BaseText>
          );
        })}
      </BaseText>
    );
  };
  const renderItem = ({item, index}: any) => {
    const notifType = item?.data?.type || item?.type;
    const isRead = Boolean(item?.is_read);
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
          <View style={{flex: 1, gap: hp(5)}}>
            <BaseText style={styles.notificationTitle}>{item?.title}</BaseText>
            {/* <BaseText style={styles.time}>{item?.message}</BaseText> */}
            <HighlightMessage message={item?.message} />
            <View style={styles.rowBetween}>
              <BaseText style={styles.time}>
                {formatDateTime(item?.createdAt)}
              </BaseText>
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
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
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
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          contentContainerStyle={styles.scrollContainer}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={() =>
            isFetchingMore ? (
              <ActivityIndicator
                size="small"
                color={colors._D5D5D5}
                style={{marginVertical: hp(16)}}
              />
            ) : null
          }
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <BaseText style={styles.emptyText}>
                  {t('There is no notification available')}
                </BaseText>
              </View>
            );
          }}
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
