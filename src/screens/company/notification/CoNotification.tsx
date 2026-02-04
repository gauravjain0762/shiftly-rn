import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import { BackHeader, LinearContainer } from '../../../component';
import { useTranslation } from 'react-i18next';
import { SCREEN_WIDTH, commonFontStyle, hp, wp } from '../../../theme/fonts';
import { IMAGES } from '../../../assets/Images';
import { colors } from '../../../theme/colors';
import BaseText from '../../../component/common/BaseText';
import { useGetCompanyNotificationQuery } from '../../../api/dashboardApi';
import { formatted } from '../../../utils/commonFunction';
import { useAppDispatch } from '../../../redux/hooks';
import { setHasUnreadNotification } from '../../../features/authSlice';

const CoNotification = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(1);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(false);

  useEffect(() => {
    dispatch(setHasUnreadNotification(false));
  }, []);

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

  const renderItem = ({ item, index }: any) => (
    <View key={index} style={styles.card}>
      <View style={styles.cardContent}>
        <View style={[styles.iconWrapper]}>
          <Image source={IMAGES.bell} style={styles.bell} />
        </View>
        <View style={{ flex: 1, gap: hp(5) }}>
          <BaseText style={styles.notificationTitle}>{item?.title}</BaseText>
          <BaseText style={styles.time}>{item?.message}</BaseText>
          <BaseText style={styles.time}>{formatted(item?.createdAt)}</BaseText>
        </View>
      </View>
    </View>
  );

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <BackHeader
        type="company"
        isRight={true}
        title={t('Notifications')}
        containerStyle={styles.header}
        RightIcon={<View style={{ width: 20 }} />}
      />

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
  iconWrapper: {
    backgroundColor: '#0D468C',
    // padding: 6,
    borderRadius: 20,
    marginRight: 12,
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bell: {
    width: wp(16),
    height: hp(16),
    resizeMode: 'contain',
    tintColor: colors.white,
  },
});
