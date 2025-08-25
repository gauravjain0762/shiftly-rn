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
  heartImage?: any;
  onPress?: () => void;
  onPressShare?: () => void;
  onPressFavorite?: () => void;
};

const JobCard: FC<props> = ({
  item,
  onPress = () => {},
  onPressFavorite,
  heartImage,
  onPressShare = () => {},
}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.jobCard}>
      <ImageBackground
        source={{uri: item?.company_id?.cover_images[0]}}
        style={styles.jobImage}>
        <View style={styles.logo}>
          <Image
            resizeMode="contain"
            style={styles.companyLogo}
            source={{uri: item?.company_id?.logo}}
          />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onPressShare} style={styles.iconButton}>
            <Image
              source={IMAGES.share}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressFavorite} style={styles.iconButton}>
            <Image
              resizeMode="contain"
              source={heartImage ? heartImage : IMAGES.hart}
              style={heartImage ? styles.iconFilled : styles.icon}
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
            <Text style={styles.badgeText}>{item?.job_type}</Text>
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
    width: wp(75),
    height: hp(75),
    borderRadius: hp(80),
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
    width: wp(40),
    height: wp(40),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    bottom: 0,
    width: wp(80),
    height: wp(80),
    borderRadius: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(20),
    backgroundColor: colors.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: wp(24),
    height: wp(24),
  },
  iconFilled: {
    width: wp(28),
    height: wp(28),
  },
});
