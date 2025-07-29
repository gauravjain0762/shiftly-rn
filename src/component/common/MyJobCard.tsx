import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';

type JobCardProps = {
  address: string;
  onPressShare?: () => void;
  jobDescription: string;
  totalApplicants?: number;
  jobType: string;
  title: string;
};

const MyJobCard = (props: JobCardProps) => {
  const {
    address,
    onPressShare,
    jobDescription,
    totalApplicants,
    jobType,
    title,
  } = props;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ width: '85%'}}>
          <Text style={styles.locationText}>{`${
            address || 'Palm Jumairah, dubai UAE'
          }`}</Text>
          <Text style={styles.titleText}>{`${
            title || 'Restaurant Manager'
          }`}</Text>
        </View>

        <Pressable onPress={onPressShare} style={styles.shareButton}>
          <Image source={IMAGES.share} style={styles.shareIcon} />
        </Pressable>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {`${
          jobDescription ||
          'We are looking for experienced restaurant manager to manage our newly opened branch in Palm Jumairah...'
        } `}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.applicantsText}>{`${
          totalApplicants || 52
        }  Applicants`}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{`${jobType || 'Full Time'}`}</Text>
        </View>
      </View>
    </View>
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
    borderRadius: hp(20),
    paddingVertical: hp(7),
    paddingHorizontal: wp(10),
    backgroundColor: colors._0B3970,
  },
  badgeText: {
    ...commonFontStyle(500, 10, colors.white),
  },
});
