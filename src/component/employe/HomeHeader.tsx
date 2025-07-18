import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {IMAGES} from '../../assets/Images';
import {navigateTo} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import {colors} from '../../theme/colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

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
        <TouchableOpacity onPress={() => onPressAvatar && onPressAvatar()}>
          <Image
            source={
              userInfo?.picture ? {uri: userInfo?.picture} : IMAGES.avatar
            } // Replace with actual image
            style={styles.avatar}
            resizeMode="cover"
          />
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
});
