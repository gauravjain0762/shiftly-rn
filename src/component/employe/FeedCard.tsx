import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {IMAGES} from '../../assets/Images';
import {colors} from '../../theme/colors';
import {getImageUrl, getTimeAgo} from '../../utils/commonFunction';

type card = {
  onPressCard?: () => void;
  isFollow?: boolean;
  item?: any;
};

const FeedCard: FC<card> = ({
  onPressCard = () => {},
  item,
  isFollow = false,
}) => {
  return (
    <TouchableOpacity onPress={() => onPressCard()} style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={
            item?.company_id?.logo ? {uri: item?.company_id?.logo} : IMAGES.logo
          }
          style={styles.logo}
        />
        <View>
          <Text style={styles.hotelName}>{item?.company_id?.company_name}</Text>
          <Text style={styles.walkIn}>
            Walk-in Interview ·{' '}
            <Text style={{color: colors._A3A3A3}}>
              {getTimeAgo(item?.createdAt)}
            </Text>
          </Text>
        </View>
        {/* {isFollow ? (
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.follow}>{'Follow'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.heartIcon}>
            <Image
              source={IMAGES.like}
              resizeMode="contain"
              style={styles.like}
            />
          </TouchableOpacity>
        )} */}
      </View>

      <Text style={styles.vacancy}>{item?.title}</Text>

      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={
            item?.images?.length > 0 ? {uri: item?.images[0]} : IMAGES.post
          }
          resizeMode="cover"
          style={styles.post}
        />
      </View>

      <Text numberOfLines={3} style={styles.description}>
        {item?.description}
      </Text>
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
    ...commonFontStyle(400, 16, colors._6A6A6A),
    padding: wp(14),
    lineHeight: hp(27),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: wp(12),
    padding: wp(14),
  },
  logo: {
    width: wp(56),
    height: wp(56),
    borderRadius: 100,
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
    ...commonFontStyle(600, 19, colors._1F1F1F),
    marginBottom: 8,
    paddingHorizontal: wp(14),
  },
  post: {width: '100%', height: hp(230)},
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
});
