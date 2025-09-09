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
import ExpandableText from '../common/ExpandableText';
import CustomImage from '../common/CustomImage';
import FastImage from 'react-native-fast-image';

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
      <CustomImage
        uri={item?.company_id?.cover_images[0]}
        imageStyle={{width: '100%', height: '100%'}}
        // resizeMode="cover"
        containerStyle={styles.jobImage}>
        <View style={styles.logo}>
          <CustomImage
            resizeMode="stretch"
            uri={item?.company_id?.logo}
            source={IMAGES.dummy_cover}
            containerStyle={styles.companyLogo}
            imageStyle={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onPressShare} style={styles.iconButton}>
            <FastImage
              source={IMAGES.share}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressFavorite} style={styles.iconButton}>
            <FastImage
              resizeMode="contain"
              source={heartImage ? IMAGES.like : IMAGES.hart}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </CustomImage>

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
        <ExpandableText
          description={item?.description}
          showStyle={{paddingHorizontal: 0, fontSize: 15}}
          descriptionStyle={styles.jobDescription}
        />
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  jobCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: colors._EFEFEF,
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
    overflow: 'hidden',
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
    paddingHorizontal: 0,
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
    paddingRight: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(8),
  },
  iconButton: {
    backgroundColor: colors.white,
    width: wp(40),
    height: wp(40),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  logo: {
    width: wp(80),
    height: wp(80),
    bottom: hp(10),
    borderRadius: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(20),
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
