import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {IMAGES} from '../../assets/Images';

type props = {
  onPressNotifi?: () => void;
};

const HomeHeader: FC<props> = ({onPressNotifi = () => {}}) => {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <Image
          source={IMAGES.avatar} // Replace with actual image
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name}>Faf Tinna Thomas</Text>
          <Text style={styles.location}>Dubai, UAE</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bellIcon} onPress={() => onPressNotifi()}>
        <Image source={IMAGES.notification} style={styles.bell} />
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
