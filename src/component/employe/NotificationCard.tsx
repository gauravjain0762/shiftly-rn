import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import BaseText from '../common/BaseText';
import {formatted} from '../../utils/commonFunction';

type props = {
  onPress: () => void;
  item?: any;
};

const NotificationCard: FC<props> = ({
  item,
}: any) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, styles.starIcon]}>
        <Image
          source={IMAGES.bell}
          style={{width: wp(16), height: hp(16), resizeMode: 'contain', tintColor: colors._0B3970}}
        />
      </View>
      <View style={{flex: 1, gap: hp(5)}}>
        {/* <BaseText style={styles.notificationTitle}>{index + 1}</BaseText> */}
        <BaseText style={styles.notificationTitle}>{item?.title}</BaseText>
        <BaseText style={styles.message}>{item?.message}</BaseText>
        <BaseText style={styles.time}>{formatted(item?.created_at)}</BaseText>
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
