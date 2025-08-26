import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import ShareModal from '../employe/ShareModal';

type JobCardProps = {
  item?: any;
  onPressCard?: () => void;
  onPressShare?: () => void;
};

const MyJobCard = (props: JobCardProps) => {
  const {onPressShare, onPressCard, item} = props;

  return (
    <>
      <Pressable onPress={onPressCard} style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{width: '85%'}}>
            <Text style={styles.locationText}>{`${item?.address}`}</Text>
            <Text style={styles.titleText}>{`${item?.title}`}</Text>
          </View>

          <Pressable onPress={onPressShare} style={styles.shareButton}>
            <Image source={IMAGES.share} style={styles.shareIcon} />
          </Pressable>
        </View>

        <Text numberOfLines={2} style={styles.description}>
          {`${item?.description} `}
        </Text>

        <View style={styles.footerRow}>
          {item?.applicants?.length && (
            <Text
              style={
                styles.applicantsText
              }>{`${item?.applicants?.length}  Applicants`}</Text>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{`${
              item?.job_type || 'Full Time'
            }`}</Text>
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default MyJobCard;

const styles = StyleSheet.create({
  card: {
    padding: hp(22),
    borderRadius: hp(20),
    backgroundColor: colors.white,
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    ...commonFontStyle(400, 12, colors.black),
  },
  titleText: {
    marginTop: hp(4),
    ...commonFontStyle(600, 18, colors.black),
  },
  shareButton: {
    width: wp(40),
    height: hp(40),
    borderRadius: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._FAEED2,
  },
  shareIcon: {
    width: '50%',
    height: '50%',
  },
  description: {
    marginTop: hp(6),
    ...commonFontStyle(400, 12, colors._656464),
  },
  footerRow: {
    marginTop: hp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  applicantsText: {
    color: 'grey',
  },
  badge: {
    alignSelf: 'flex-end',
    borderRadius: hp(20),
    paddingVertical: hp(7),
    paddingHorizontal: wp(10),
    backgroundColor: colors._0B3970,
  },
  badgeText: {
    ...commonFontStyle(500, 10, colors.white),
  },
});
