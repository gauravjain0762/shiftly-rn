import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import FastImage, {FastImageProps, ImageStyle} from 'react-native-fast-image';
import { colors } from '../../theme/colors';
import { hp, wp } from '../../theme/fonts';
// import {getFontSize} from '../responsiveFn';
// import {Colors} from '../../constants/Colors';

interface Props {
  onPress?: () => void;
  source?: any;
  size?: number;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  tintColor?: any | undefined;
  uri?: string;
  disabled?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  props?: FastImageProps;
  isBackGround?: boolean;
  bgColor?: string;
  viewRef?: any;
  children?: any;
}

const CustomImage = ({
  onPress,
  source,
  size,
  containerStyle,
  imageStyle,
  tintColor = undefined,
  uri,
  disabled = false,
  resizeMode = 'contain',
  isBackGround = false,
  bgColor,
  viewRef,
  children,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}
      ref={viewRef}
      disabled={onPress ? disabled : true}
      style={{
        ...containerStyle,

        ...(isBackGround ? styles.btnContainer : {}),

        ...(bgColor ? {backgroundColor: bgColor} : {}),
      }}>
      <FastImage
        source={uri ? {uri: uri} : source}
        defaultSource={source ? source : undefined}
        style={[{width: size, height: size}, imageStyle]}
        resizeMode={resizeMode}
        tintColor={uri ? undefined : tintColor}
        {...props}>
        {children}
      </FastImage>
    </TouchableOpacity>
  );
};

export default CustomImage;

const styles = StyleSheet.create({
  btnContainer: {
    height: hp(2),
    width: wp(2),
    borderRadius: 50,
    backgroundColor: colors._041326,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
