import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC} from 'react';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

type props = {
  onBackPress?: () => void;
  title?: string;
  onPressNotifi?: () => void;
  containerStyle?: ViewStyle;
};

const BackHeader: FC<props> = ({
  onBackPress = () => {},
  onPressNotifi = () => {},
  title = 'My Activities',
  containerStyle,
}) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <TouchableOpacity onPress={() => onBackPress()}>
        <Image source={IMAGES.backArrow} style={styles.back} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.bellIcon} onPress={() => onPressNotifi()}>
        <Image source={IMAGES.notification} style={styles.bell} />
      </TouchableOpacity>
    </View>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  bellIcon: {},
  bell: {
    width: wp(30),
    height: wp(30),
    resizeMode: 'contain',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  headerTitle: {
    ...commonFontStyle(400, 20, colors.white),
  },
  back: {
    width: wp(21),
    height: wp(21),
    resizeMode: 'contain',
  },
});
