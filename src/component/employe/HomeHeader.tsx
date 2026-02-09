import React, { FC } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import CustomImage from '../common/CustomImage';
import { commonFontStyle, hp, wp } from '../../theme/fonts';

type props = {
  onPressNotifi?: () => void;
  type?: 'company' | 'employe';
  onPressAvatar?: () => void;
  companyProfile?: any;
};

const getInitials = (name?: string) => {
  if (!name) return '?';

  const words = name.trim().split(' ').filter(Boolean);

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const HomeHeader: FC<props> = ({
  onPressNotifi = () => { },
  type = 'employe',
  onPressAvatar,
  companyProfile,
}) => {
  const { hasUnreadNotification } = useSelector((state: RootState) => state.auth);

  const imageUri =
    type === 'company'
      ? companyProfile?.logo
      : companyProfile?.picture;

  const hasValidImage =
    typeof imageUri === 'string' && imageUri.trim().length > 0 && !imageUri.includes('blank');

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressAvatar}
          style={styles.avatar}>

          {hasValidImage ? (
            <Image
              resizeMode="cover"
              source={{ uri: imageUri }}
              style={StyleSheet.absoluteFillObject}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(
                  type === 'company'
                    ? companyProfile?.company_name
                    : companyProfile?.name
                )}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.info}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.name}>
            {companyProfile?.company_name || companyProfile?.name || 'N/A'}
          </Text>

          <View style={styles.locationRow}>
            <CustomImage
              size={wp(18)}
              source={IMAGES.marker}
              tintColor={colors._0B3970}
            />
            <Text style={styles.location}>
              {type === 'company'
                ? `${companyProfile?.city}, ${companyProfile?.country}` || 'N/A'
                : companyProfile?.country || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.bellIcon}
        onPress={() => onPressNotifi && onPressNotifi()}>
        <View>
          <Image
            source={IMAGES.notification}
            style={styles.bell}
          />
          {hasUnreadNotification && <View style={styles.redDot} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp(60),
    height: wp(60),
    borderRadius: 100,
    overflow: 'hidden',
  },
  name: {
    ...commonFontStyle(700, 20, colors._0B3970),
  },
  location: {
    ...commonFontStyle(500, 15, colors._0B3970),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  bellIcon: {
    bottom: hp(8),
    marginLeft: 'auto',
  },
  bell: {
    width: wp(30),
    height: wp(30),
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  redDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(17),
  },
  info: {
    gap: hp(6),
    width: '67%',
  },
  avatarPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    backgroundColor: colors._0B3970,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: wp(22),
    fontWeight: '700',
  },
});
