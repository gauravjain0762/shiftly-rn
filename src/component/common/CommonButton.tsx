import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {colors} from '../../theme/colors';

type Props = {
  title: any;
  onPress?: () => void;
  btnStyle?: ViewStyle;
  leftImg?: any;
  textStyle?: TextStyle | any;
  imageStyle?: ImageStyle;
  disabled?: boolean;
  rightImgStyle?: ImageStyle;
  rightImg?: any;
} & TextProps;

const CommonButton = ({
  title,
  btnStyle,
  leftImg,
  textStyle,
  onPress = () => {},
  imageStyle,
  disabled = false,
  rightImg,
  rightImgStyle,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.buttonStyle, btnStyle]}>
      {leftImg && (
        <Image
          source={leftImg}
          style={[styles.imageStyle, imageStyle]}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.text, textStyle]}>{title}</Text>
      {rightImg && (
        <Image
          source={rightImg}
          style={[styles.imageStyle, rightImgStyle]}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  buttonStyle: {
    height: hp(52),
    backgroundColor: colors._F4E2B8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    gap: wp(20),
  },
  text: {
    ...commonFontStyle(700, 21, '#000000'),
  },
  imageStyle: {
    width: wp(20),
    height: wp(20),
  },
});
