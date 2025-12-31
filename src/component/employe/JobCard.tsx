import React, { FC } from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import ExpandableText from '../common/ExpandableText';
import FastImage from 'react-native-fast-image';
import { getTimeAgo } from '../../utils/commonFunction';
import RNFS from 'react-native-fs';

type props = {
  item?: any;
  heartImage?: any;
  onPress?: () => void;
  // onPressShare?: () => void;
  onPressFavorite?: () => void;
  isShowFavIcon?: boolean;
};

const downloadImage = async (url: string) => {
  const filePath = `${RNFS.CachesDirectoryPath}/job_${Date.now()}.jpg`;

  await RNFS.downloadFile({
    fromUrl: url,
    toFile: filePath,
  }).promise;

  return `file://${filePath}`;
};

const JobCard: FC<props> = ({
  item,
  onPress = () => { },
  onPressFavorite,
  heartImage,
  // onPressShare = () => { },
  isShowFavIcon = true,
}) => {
  const isCoverImage = item?.company_id?.cover_images?.length > 0;
  const coverImageUri = item?.company_id?.cover_images?.[0];
  const logoUri = item?.company_id?.logo;

  const handleShare = async () => {
    try {
      const title = item?.title || 'Job Opportunity';
      const area = item?.area || '';
      const description = item?.description || '';
      const salary =
        item?.monthly_salary_from || item?.monthly_salary_to
          ? `Salary: AED ${item?.monthly_salary_from?.toLocaleString()} - ${item?.monthly_salary_to?.toLocaleString()}`
          : '';

      const message = `${title}
  ${area}
  
  ${description}
  
  ${salary}`;

      let imagePath;

      if (coverImageUri) {
        imagePath = await downloadImage(coverImageUri);
      }

      await Share.open({
        title: title,
        message: `${title}
      ${area}
      
      ${description}
      
      ${salary}`,
      });
      
    } catch (err) {
      console.log('❌ Share error:', err);
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.jobCard}>
      {/* Cover Image Section */}
      <View style={styles.coverImageContainer}>
        {isCoverImage && coverImageUri ? (
          <FastImage
            source={{ uri: coverImageUri }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderCover} />
        )}

        {/* Company Logo - Overlapping */}
        <View style={styles.logo}>
          {logoUri ? (
            <FastImage
              source={{ uri: logoUri }}
              style={styles.companyLogoImage}
              resizeMode="cover"
            />
          ) : (
            <FastImage
              source={IMAGES.logoText}
              style={styles.companyLogoImage}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Action Buttons */}
        <View
          style={[
            styles.actions,
            { marginTop: !isShowFavIcon ? hp(80) : hp(50) },
          ]}>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <FastImage
              source={IMAGES.share}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
          {isShowFavIcon && (
            <TouchableOpacity
              onPress={onPressFavorite}
              style={styles.iconButton}>
              <FastImage
                resizeMode="contain"
                source={heartImage ? IMAGES.like : IMAGES.hart}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <View style={styles.companyInfo}>
          <Text style={[styles.companyName, {}]} numberOfLines={1}>
            {item?.area?.slice(0, 30)}
          </Text>
          <Text style={[styles.companyName]}>
            {`Posted ${getTimeAgo(item?.createdAt)} ago`}
          </Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.jobTitle}>{item?.title}</Text>
          {item?.job_type && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item?.job_type}</Text>
            </View>
          )}
        </View>

        <ExpandableText
          maxLines={2}
          description={item?.description}
          descriptionStyle={styles.jobDescription}
          showStyle={{ paddingHorizontal: 0, fontSize: 15 }}
        />

        {(item?.monthly_salary_from || item?.monthly_salary_to) && (
          <View style={styles.salaryContainer}>
            <Text style={styles.salaryLabel}>Salary range: </Text>
            <Text style={styles.salaryAmount}>
              AED {item?.monthly_salary_from?.toLocaleString()} - {item?.monthly_salary_to?.toLocaleString()}
            </Text>
          </View>
        )}
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
  coverImageContainer: {
    height: hp(140),
    width: '100%',
    position: 'relative',
    backgroundColor: colors._EFEFEF,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: colors._EFEFEF,
  },
  cardContent: {
    gap: hp(2),
    padding: hp(12),
    backgroundColor: colors.white,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyName: {
    ...commonFontStyle(400, 13, colors.black),
  },
  jobTitle: {
    ...commonFontStyle(600, 18, colors.black),
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
  },
  salaryLabel: {
    ...commonFontStyle(500, 14, colors._656464),
  },
  salaryAmount: {
    ...commonFontStyle(700, 13, colors.empPrimary),
  },
  jobDescription: {
    ...commonFontStyle(400, 13, colors._656464),
    lineHeight: hp(18),
    paddingHorizontal: 0,
  },
  badge: {
    backgroundColor: colors.empPrimary,
    paddingVertical: hp(6),
    paddingHorizontal: wp(14),
    borderRadius: 100,
  },
  badgeText: {
    ...commonFontStyle(500, 11, '#FFFFFF'),
  },
  actions: {
    gap: hp(7),
    position: 'absolute',
    right: wp(10),
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: colors.white,
    width: wp(36),
    height: wp(36),
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
    width: wp(55),
    height: wp(55),
    bottom: hp(10),
    borderRadius: 100,
    position: 'absolute',
    left: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  companyLogoImage: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    marginTop: hp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: wp(22),
    height: wp(22),
  },
});