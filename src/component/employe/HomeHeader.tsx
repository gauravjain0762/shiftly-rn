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

const HomeHeader: FC<props> = ({
  onPressNotifi = () => { },
  type = 'employe',
  onPressAvatar,
  companyProfile,
}) => {
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
              source={{ uri: imageUri }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
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
            style={[
              styles.name,
              { color: type == 'company' ? colors._0B3970 : colors._0B3970 },
            ]}>
            {companyProfile?.company_name || companyProfile?.name || 'N/A'}
          </Text>

          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: wp(6) }}>
            <CustomImage
              size={wp(18)}
              source={IMAGES.marker}
              tintColor={type == 'company' ? colors.empPrimary : colors._0B3970}
            />
            <Text
              style={[
                styles.location,
                { color: type == 'company' ? colors._0B3970 : colors._0B3970 },
              ]}>
              {companyProfile?.location || companyProfile?.address || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.bellIcon}
        onPress={() => onPressNotifi && onPressNotifi()}>
        <Image
          source={IMAGES.notification}
          style={[
            styles.bell,
            { tintColor: type == 'company' ? colors._0B3970 : colors._0B3970 },
          ]}
        />
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
    ...commonFontStyle(700, 20, '#FFFFFF'),
  },
  location: {
    ...commonFontStyle(500, 15, '#DDEBFF'),
  },
  bellIcon: {
    bottom: hp(8),
    marginLeft: 'auto',
  },
  bell: {
    width: wp(30),
    height: wp(30),
    resizeMode: 'contain',
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
