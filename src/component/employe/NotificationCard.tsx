import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {IMAGES} from '../../assets/Images';
import {colors} from '../../theme/colors';

type props = {
  onPress: () => void;
  item?: any;
};

const NotificationCard: FC<props> = ({onPress = () => {}, item}) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, item.highlight && styles.starIcon]}>
        <Image
          source={item.highlight ? IMAGES.star : IMAGES.mark1}
          style={{width1: 15, height: 12, resizeMode: 'contain'}}
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.message}>{item.text}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors._0B3970,
    borderRadius: 20,
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors._104686,
    padding: wp(13),
    // justifyContent: 'space-between',
  },
  time: {
    ...commonFontStyle(500, 16, colors.white),
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
    backgroundColor: '#F4E2B8',
    // padding: 6,
    borderRadius: 20,
    marginRight: 12,
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    backgroundColor: '#FFC325', // yellow background for star icon
  },
  textWrapper: {
    flex: 1,
  },
  message: {
    ...commonFontStyle(500, 16, '#F4E2B8'),
    marginBottom: 8,
    lineHeight:25
  },
});
