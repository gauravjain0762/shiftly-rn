import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { getPostedTime, getExpiryDays } from '../../utils/commonFunction';

type JobCardProps = {
  item?: any;
  onPressCard?: () => void;
  onPressShare?: () => void;
};

const downloadImage = async (url: string) => {
  const filePath = `${RNFS.CachesDirectoryPath}/job_${Date.now()}.jpg`;

  await RNFS.downloadFile({
    fromUrl: url,
    toFile: filePath,
  }).promise;

  return `file://${filePath}`;
};

import { getCurrencySymbol } from '../../utils/currencySymbols';

const MyJobCard = (props: JobCardProps) => {
  const { onPressCard, item } = props;

  const coverImages = (() => {
    const coverImgs = item?.company_id?.cover_images;
    const logo = item?.company_id?.logo;

    if (coverImgs && Array.isArray(coverImgs) && coverImgs.length > 0) {
      const validCoverImages = coverImgs.filter(img => img && typeof img === 'string' && img.trim() !== '');
      if (validCoverImages.length > 0) {
        return validCoverImages;
      }
    }

    if (logo && typeof logo === 'string' && logo.trim() !== '') {
      return [logo];
    }
    return [IMAGES.logoText];
  })();

  const handleShare = async () => {
    try {
      const title = item?.title || 'Job Opportunity';
      const area = item?.address || item?.area || '';
      const description = item?.description || '';
      const salary =
        item?.monthly_salary_from || item?.monthly_salary_to
          ? `Salary: ${getCurrencySymbol(item?.currency)}${item?.monthly_salary_from?.toLocaleString()} - ${item?.monthly_salary_to?.toLocaleString()}`
          : '';

      const shareUrl = item?.share_url || '';
      const shareUrlText = shareUrl ? `\n\n${shareUrl}` : '';

      const message = `${title}
${area}

${description}

${salary}${shareUrlText}`;

      const shareOptions: any = {
        title: title,
        message: message,
        url: shareUrl,
      };

      const coverImageUri = coverImages && coverImages.length > 0 && typeof coverImages[0] === 'string'
        ? coverImages[0]
        : (item?.company_id?.logo && typeof item.company_id.logo === 'string'
          ? item.company_id.logo
          : null);

      if (coverImageUri && typeof coverImageUri === 'string') {
        try {
          const imagePath = await downloadImage(coverImageUri);
          shareOptions.url = imagePath;
          shareOptions.type = 'image/jpeg';
        } catch (imageError) {
          console.log('❌ Image download error:', imageError);
        }
      }

      await Share.open(shareOptions);

    } catch (err: any) {
      if (err?.message !== 'User did not share') {
        console.log('❌ Share error:', err);
      }
    }
  };

  return (
    <>
      <Pressable onPress={onPressCard} style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ width: '85%' }}>
            <Text style={styles.locationText}>{`${item?.address}`}</Text>
            <Text style={styles.titleText}>{`${item?.title}`}</Text>
          </View>

          <Pressable onPress={handleShare} style={styles.shareButton}>
            <Image source={IMAGES.share} style={styles.shareIcon} />
          </Pressable>
        </View>

        <Text numberOfLines={2} style={styles.description}>
          {`${item?.description} `}
        </Text>

        {(item?.monthly_salary_from || item?.monthly_salary_to) && (
          <View style={styles.salaryContainer}>
            <Text style={styles.salaryText}>
              {`${item?.currency?.toUpperCase()} `}
              {item?.currency?.toUpperCase() === 'AED' ? (
                <Image source={IMAGES.currency} style={styles.currencyImage} />
              ) : (
                getCurrencySymbol(item?.currency)
              )}
              {` ${item?.monthly_salary_from?.toLocaleString()} - ${item?.monthly_salary_to?.toLocaleString()}`}
            </Text>
          </View>
        )}

        <View style={styles.footerRow}>
          {!!item?.applicants?.length && (
            <Text
              style={
                styles.applicantsText
              }>{`${item?.applicants?.length}  Applicants`}</Text>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{`${item?.contract_type || 'N/A'
              }`}</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            {item?.expiry_date && (
              <Text style={styles.expiryText}>
                {getExpiryDays(item.expiry_date)}
              </Text>
            )}
            <Text style={{ ...commonFontStyle(400, 14, colors.greyOpacity) }}>
              {`Posted ${getPostedTime(item?.createdAt)}`}
            </Text>
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
    borderWidth: 1,
    borderColor: colors._D9D9D9,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 3,
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
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
    marginTop: hp(12),
  },
  salaryText: {
    ...commonFontStyle(600, 14, colors.black),
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyImage: {
    width: wp(14),
    height: hp(11),
    resizeMode: 'contain',
    marginHorizontal: wp(2),
    tintColor: colors.empPrimary,
  },
  expiryText: {
    ...commonFontStyle(500, 12, colors._EE4444),
    marginBottom: hp(2),
  },
});
