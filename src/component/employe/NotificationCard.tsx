import React, { FC } from 'react';
import { Image, Pressable, StyleSheet, View, TouchableOpacity } from 'react-native';

import BaseText from '../common/BaseText';
import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import { SCREENS } from '../../navigation/screenNames';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { formatDateTime, formatted, navigateTo } from '../../utils/commonFunction';
import { useGetEmployeeJobDetailsQuery, useMarkReadNotificationsMutation } from '../../api/dashboardApi';

type props = {
  onPress: () => void;
  item?: any;
};

const NotificationCard: FC<props> = ({ item }: any) => {
  console.log("🔥 ~ NotificationCard ~ item:", item)
  const notifType = item?.data?.type || item?.type;
  const isRead = !!item?.isRead;
  const showUnreadDot = !isRead;

  const interviewJobId = notifType === 'interview' ? item?.data?.id : undefined;
  const { data: jobDetail } = useGetEmployeeJobDetailsQuery(interviewJobId, {
    skip: notifType !== 'interview' || !interviewJobId,
  } as any);

  const [markReadNotifications] = useMarkReadNotificationsMutation();

  const handlePress = async () => {
    const notificationId = item?._id;
    try {
      if (notificationId) {
        await markReadNotifications({ notification_id: notificationId }).unwrap();
      }
    } catch (e) {
      console.log('markReadNotifications error:', e);
    }

    const type = (notifType ?? '').toString().toLowerCase();

    if (type === 'interview') {
      navigateTo(SCREENS.JobInvitationScreen, {
        link: item?.data?.interview_link,
        jobDetail: jobDetail?.data,
      });
      return;
    }

    if (type === 'chat' || type === 'message') {
      const chatId =
        item?.data?.chat_id ||
        item?.data?.chatId ||
        item?.data?.chat?._id ||
        item?.data?.chat?.chat_id ||
        item?.data?.id;

      if (chatId) {
        navigateTo(SCREENS.Chat, {
          data: {
            ...(typeof item?.data?.chat === 'object' ? item.data.chat : {}),
            chat_id: chatId,
            company_name:
              item?.data?.company_name ||
              item?.data?.company?.company_name ||
              item?.data?.chat?.company_name ||
              item?.data?.chat?.company_id?.company_name,
            job_id: item?.data?.job_id || item?.data?.chat?.job_id,
            job_title: item?.data?.job_title || item?.data?.chat?.job_title,
            created_at: item?.data?.created_at || item?.createdAt,
          },
        });
      }
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handlePress}>
      <View style={[styles.iconWrapper, styles.starIcon]}>
        <Image
          source={IMAGES.bell}
          style={{ width: wp(16), height: hp(16), resizeMode: 'contain', tintColor: colors._0B3970 }}
        />
        {showUnreadDot && <View style={styles.readDot} />}
      </View>
      <View style={{ flex: 1, gap: hp(5) }}>
        {/* <BaseText style={styles.notificationTitle}>{index + 1}</BaseText> */}
        <BaseText style={styles.notificationTitle}>{item?.title}</BaseText>
        <BaseText style={styles.message}>{item?.message}</BaseText>

        <BaseText style={styles.time}>{formatDateTime(item?.createdAt)}</BaseText>
        {notifType === 'interview' && (
          <View style={{ alignItems: 'flex-end', marginTop: hp(6) }}>
            <Pressable
              onPress={handlePress}
              style={{
                backgroundColor: colors._0B3970,
                paddingHorizontal: wp(14),
                paddingVertical: hp(8),
                borderRadius: hp(20),
              }}>
              <BaseText style={{ ...commonFontStyle(500, 13, colors.white) }}>
                {'View Invitation'}
              </BaseText>
            </Pressable>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: 'row',
    borderWidth: 1.2,
    borderColor: '#E0D7C8',
    padding: wp(13),
    // justifyContent: 'space-between',
  },
  time: {
    ...commonFontStyle(500, 16, colors._7B7878),
  },
  tagWrapper: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: wp(12),
    paddingVertical: hp(10),
  },
  tagText: {
    ...commonFontStyle(600, 12, '#003C8F'),
  },

  iconWrapper: {
    backgroundColor: '#EEF2F7',
    borderRadius: 20,
    marginRight: 12,
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    backgroundColor: '#EEF2F7',
  },
  textWrapper: {
    flex: 1,
  },
  notificationTitle: {
    marginBottom: hp(2),
    ...commonFontStyle(500, 17, colors._0B3970),
  },
  message: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
    marginBottom: 8,
    lineHeight: 25,
  },
  readDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#E53935',
  },
});
