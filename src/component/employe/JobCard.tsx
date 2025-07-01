import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';

type props = {
  item?: any;
  onPress?: () => void;
};

const JobCard: FC<props> = ({item, onPress = () => {}}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.jobCard}>
      <ImageBackground source={{uri: item?.image}} style={styles.jobImage}>
        <View style={styles.logo}>
          <Image
            resizeMode="contain"
            source={{uri: item?.logo}}
            style={styles.companyLogo}
          />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={IMAGES.share}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={IMAGES.hart}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{item?.company}</Text>
          </View>
          <Text style={styles.postedText}>{item?.posted}</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.jobTitle}>{item?.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Full Time</Text>
          </View>
        </View>
        <Text style={styles.jobDescription}>{item?.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: 'hidden',
  },
  jobImage: {
    width: '100%',
    height: hp(140),
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 12,
    gap: hp(6),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    resizeMode: 'contain',
    height: hp(34),
    width: '100%',
  },
  companyName: {
    ...commonFontStyle(400, 12, colors.black),
  },
  postedText: {
    ...commonFontStyle(400, 11, colors.black),
  },
  jobTitle: {
    ...commonFontStyle(600, 18, colors.black),
  },
  jobDescription: {
    ...commonFontStyle(400, 12, colors._656464),
    lineHeight: hp(18),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.black,
    paddingVertical: hp(6),
    paddingHorizontal: wp(14),
    borderRadius: 100,
  },
  badgeText: {
    ...commonFontStyle(500, 11, '#FFFFFF'),
  },
  actions: {
    gap: hp(7),
    alignSelf: 'flex-end',
    paddingBottom: hp(10),
    paddingRight: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: colors.white,
    padding: hp(8),
    borderRadius: 100,
  },
  logo: {
    backgroundColor: colors.white,
    borderRadius: 100,
    marginHorizontal: wp(20),
    marginBottom: hp(13),
    position: 'absolute',
    bottom: 0,
    width: wp(75),
    height: wp(75),
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: wp(18),
    height: wp(18),
  },
});
