import {
  Image,
  ImageStyle,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC, ReactNode} from 'react';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {navigationRef} from '../../navigation/RootContainer';
import {navigateTo} from '../../utils/commonFunction';
import {SCREENS} from '../../navigation/screenNames';
import BaseText from '../common/BaseText';

type props = {
  onBackPress?: () => void;
  title?: string;
  onPressNotifi?: () => void;
  containerStyle?: ViewStyle;
  isRight?: boolean;
  RightIcon?: ReactNode;
  RightIconStyle?: ImageStyle;
  titleStyle?: TextStyle;
  leftStyle?: ViewStyle;
  type?: 'company' | 'employe';
  alignBackAndTitleTogether?: boolean;
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
  type = 'employe',
}) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <TouchableOpacity
        style={[leftStyle]}
        onPress={() => (onBackPress ? onBackPress() : navigationRef?.goBack())}>
        <Image
          source={IMAGES.backArrow}
          style={[
            styles.back,
            {tintColor: type == 'employe' ? colors._0B3970 : colors._0B3970},
          ]}
        />
      </TouchableOpacity>
      <BaseText
        style={[
          styles.headerTitle,
          {color: type == 'employe' ? colors.white : colors._0B3970},
          titleStyle,
        ]}>
        {title}
      </BaseText>
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
    ...commonFontStyle(600, 22, colors.white),
  },
  back: {
    width: wp(21),
    height: wp(21),
    resizeMode: 'contain',
  },
});
