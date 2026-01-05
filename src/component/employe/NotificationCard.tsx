import React, { FC } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import BaseText from '../common/BaseText';
import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import { SCREENS } from '../../navigation/screenNames';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { formatted, navigateTo } from '../../utils/commonFunction';
import { useGetEmployeeJobDetailsQuery } from '../../api/dashboardApi';

type props = {
  onPress: () => void;
  item?: any;
};

const NotificationCard: FC<props> = ({
  item,
}: any) => {
  const { data: jobDetail } = useGetEmployeeJobDetailsQuery(
    item?.data?.id,
  );
  console.log(">>>>>>>>>> ~ NotificationCard ~ jobDetail:", jobDetail)

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, styles.starIcon]}>
        <Image
          source={IMAGES.bell}
          style={{ width: wp(16), height: hp(16), resizeMode: 'contain', tintColor: colors._0B3970 }}
        />
      </View>
      <View style={{ flex: 1, gap: hp(5) }}>
        {/* <BaseText style={styles.notificationTitle}>{index + 1}</BaseText> */}
        <BaseText style={styles.notificationTitle}>{item?.title}</BaseText>
        <BaseText style={styles.message}>{item?.message}</BaseText>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <BaseText style={styles.time}>{formatted(item?.createdAt)}</BaseText>
          <Pressable
            onPress={() => {
              navigateTo(SCREENS.JobInvitationScreen, {
                link: item?.data?.interview_link,
                jobDetail: jobDetail?.data,
              });
            }}
            style={{
              backgroundColor: colors._0B3970, paddingHorizontal: wp(10), paddingVertical: hp(8),
              borderRadius: hp(20)
            }}>
            <BaseText style={{ ...commonFontStyle(500, 13, colors.white) }}>{'View Invitation'}</BaseText>
          </Pressable>
        </View>
      </View>
    </View>
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
    // padding: 6,
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
});
