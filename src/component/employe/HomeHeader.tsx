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
import ImageWithLoader from '../common/ImageWithLoader';

type props = {
  onPressNotifi?: () => void;
  type?: 'company' | 'employe';
  onPressAvatar?: () => void;
};

const HomeHeader: FC<props> = ({
  onPressNotifi = () => {},
  type = 'employe',
  onPressAvatar,
}) => {
  const {userInfo} = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onPressAvatar}>
          {userInfo?.logo ? (
            <ImageWithLoader
              source={{uri: userInfo.logo}}
              style={styles.avatar}
              loaderSize="small"
              loaderColor={colors._0B3970}
              placeholder={
                <View style={styles.avatarPlaceholder}>
                  <ActivityIndicator size="small" color={colors._0B3970} />
                </View>
              }
            />
          ) : userInfo?.picture ? (
            <ImageWithLoader
              source={{uri: userInfo.picture}}
              style={styles.avatar}
              loaderSize="small"
              loaderColor={colors._0B3970}
              placeholder={
                <View style={styles.avatarPlaceholder}>
                  <ActivityIndicator size="small" color={colors._0B3970} />
                </View>
              }
            />
          ) : (
            <Image source={IMAGES.avatar} style={styles.avatar} />
          )}
        </TouchableOpacity>

        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              {color: type == 'company' ? colors._0B3970 : colors.white},
            ]}>
            {userInfo?.name ?? 'Faf Tinna Thomas'}
          </Text>
          <Text
            style={[
              styles.location,
              {color: type == 'company' ? colors._0B3970 : colors.white},
            ]}>
            {userInfo?.country ?? 'Dubai, UAE'}
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
    justifyContent: 'space-between',
    gap: wp(17),
  },
  info: {
    gap: hp(4),
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
