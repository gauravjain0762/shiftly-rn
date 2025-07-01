import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC, ReactNode} from 'react';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {navigationRef} from '../../navigation/RootContainer';
import { navigateTo } from '../../utils/commonFunction';
import { SCREENS } from '../../navigation/screenNames';

type props = {
  onBackPress?: () => void;
  title?: string;
  onPressNotifi?: () => void;
  containerStyle?: ViewStyle;
  isRight?: boolean;
  RightIcon?: ReactNode;
  RightIconStyle?: ViewStyle;
  titleStyle?: ViewStyle;
  leftStyle?: ViewStyle;
};

const BackHeader: FC<props> = ({
  onBackPress,
  onPressNotifi = () => {},
  title = 'My Activities',
  containerStyle,
  isRight = true,
  RightIcon,
  RightIconStyle,
  titleStyle,
  leftStyle,
}) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <TouchableOpacity
        style={[leftStyle]}
        onPress={() => (onBackPress ? onBackPress() : navigationRef?.goBack())}>
        <Image source={IMAGES.backArrow} style={styles.back} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      {isRight && !RightIcon ? (
        <TouchableOpacity
          style={[styles.bellIcon, RightIconStyle]}
          onPress={() => navigateTo(SCREENS.NotificationScreen)}>
          <Image source={IMAGES.notification} style={styles.bell} />
        </TouchableOpacity>
      ) : (
        RightIcon
      )}
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
