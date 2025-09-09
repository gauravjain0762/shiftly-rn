import React, {FC} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {RootState} from '../../store';
import {useSelector} from 'react-redux';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CustomImage from '../common/CustomImage';

type props = {
  onPressNotifi?: () => void;
  type?: 'company' | 'employe';
  onPressAvatar?: () => void;
  companyProfile?: any;
};

const HomeHeader: FC<props> = ({
  onPressNotifi = () => {},
  type = 'employe',
  onPressAvatar,
  companyProfile,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        {companyProfile?.logo ? (
          <CustomImage
            uri={
              type === 'company' ? companyProfile.logo : companyProfile?.picture
            }
            imageStyle={{height: '100%', width: '100%'}}
            containerStyle={styles.avatar}
            resizeMode="stretch"
            onPress={onPressAvatar}
          />
        ) : companyProfile?.picture ? (
          <CustomImage
            uri={companyProfile.picture}
            imageStyle={{height: '100%', width: '100%'}}
            containerStyle={styles.avatar}
            resizeMode="stretch"
            onPress={onPressAvatar}
          />
        ) : null}

        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              {color: type == 'company' ? colors._0B3970 : colors.white},
            ]}>
            {companyProfile?.name || ''}
          </Text>
          <Text
            style={[
              styles.location,
              {color: type == 'company' ? colors._0B3970 : colors.white},
            ]}>
            {companyProfile?.location}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.bellIcon}
        onPress={() => onPressNotifi && onPressNotifi()}>
        <Image
          source={IMAGES.notification}
          style={[
            styles.bell,
            {tintColor: type == 'company' ? colors._0B3970 : colors.white},
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
    gap: hp(4),
    width: '70%',
  },
  avatarPlaceholder: {
    width: wp(60),
    height: wp(60),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
});
