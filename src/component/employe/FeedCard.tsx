import React, { FC, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { IMAGES } from '../../assets/Images';
import { colors } from '../../theme/colors';
import { getTimeAgo } from '../../utils/commonFunction';
import ExpandableText from '../common/ExpandableText';
import CustomImage from '../common/CustomImage';

type card = {
  onPressCard?: () => void;
  onPressLike?: () => void;
  onPressLogo?: () => void;
  isLiked?: boolean;
  item?: any;
};

const FeedCard: FC<card> = ({
  onPressCard = () => { },
  onPressLike = () => { },
  onPressLogo = () => { },
  isLiked = false,
  item
}) => {
  const hasImage = item?.images?.length > 0;
  const [imageLoading, setImageLoading] = useState(hasImage);
  const [localLiked, setLocalLiked] = useState(isLiked);

  const handleLike = () => {
    setLocalLiked(!localLiked);
    onPressLike();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPressCard()}
      style={styles.card}>
      <View style={styles.cardHeader}>
        <CustomImage
          onPress={onPressLogo}
          resizeMode="cover"
          source={IMAGES.logoImg}
          uri={item?.company_id?.logo}
          containerStyle={styles.logo}
          imageStyle={{ height: '100%', width: '100%' }}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressLogo}
          style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.hotelName}>
            {item?.company_id?.company_name || 'N/A'}
          </Text>
          <Text style={styles.walkIn}>
            <Text style={{ color: colors._A3A3A3 }}>
              {getTimeAgo(item?.createdAt)}
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLike}
          style={styles.actionButton}
        >
          <CustomImage
            size={wp(26)}
            resizeMode={!localLiked ? "cover" : "contain"}
            source={localLiked ? IMAGES.like : IMAGES.hart}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.vacancy}>{item?.title || 'N/A'}</Text>

      {hasImage && (
        <View style={styles.banner}>
          <View style={styles.post}>
            {imageLoading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors._D5D5D5} />
              </View>
            )}
            <Image
              style={styles.post}
              resizeMode={'cover'}
              source={{ uri: item?.images[0] }}
              onLoad={() => setImageLoading(false)}
              onLoadStart={() => hasImage && setImageLoading(true)}
            />
          </View>
        </View>
      )}

      <ExpandableText
        maxLines={3}
        descriptionStyle={styles.description}
        description={item?.description || 'N/A'}
      />

    </TouchableOpacity>
  );
};

export default FeedCard;

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  description: {
    lineHeight: hp(20),
    paddingVertical: hp(15),
    paddingHorizontal: wp(14),
    ...commonFontStyle(400, 16, colors._6A6A6A),
  },
  card: {
    backgroundColor: '#F4F3F3',
    borderRadius: 10,
  },
  cardHeader: {
    gap: wp(10),
    padding: wp(10),
    marginBottom: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: wp(56),
    height: wp(56),
    borderRadius: 100,
    overflow: 'hidden',
  },
  hotelName: {
    ...commonFontStyle(700, 18, colors._2F2F2F),
  },
  walkIn: {
    ...commonFontStyle(400, 15, colors._2F2F2F),
    marginTop: hp(6),
  },
  heartIcon: {
    marginLeft: 'auto',
  },
  vacancy: {
    ...commonFontStyle(600, 17, colors._1F1F1F),
    marginBottom: 8,
    paddingHorizontal: wp(14),
  },
  post: {
    width: '100%',
    height: hp(230),
    overflow: 'hidden',
    position: 'relative',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  like: {
    width: wp(26),
    height: wp(26),
  },
  follow: {
    ...commonFontStyle(500, 15, colors.white),
    paddingHorizontal: wp(15),
    paddingVertical: hp(10),
  },
  followBtn: {
    backgroundColor: colors._0B3970,
    borderRadius: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: wp(14),
    paddingVertical: hp(12),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: hp(4),
  },
  actionButton: {
    gap: wp(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
  },
  actionIcon: {
    width: wp(26),
    height: wp(24),
    tintColor: colors._6A6A6A,
  },
  actionText: {
    ...commonFontStyle(500, 15, colors._6A6A6A),
  },
  likedText: {
    color: '#FF4458',
  },
  savedText: {
    color: colors._0B3970,
  },
});