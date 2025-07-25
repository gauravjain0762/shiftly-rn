import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';

const MyJobCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.locationText}>Palm Jumairah, dubai UAE</Text>
          <Text style={styles.titleText}>Restaurant Manager</Text>
        </View>

        <Pressable style={styles.shareButton}>
          <Image source={IMAGES.share} style={styles.shareIcon} />
        </Pressable>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        We are looking for experienced restaurant manager to manage our newly
        opened branch in Palm Jumairah...
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.applicantsText}>52 Applicants</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Full Time</Text>
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
