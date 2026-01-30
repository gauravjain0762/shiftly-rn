import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';
import FastImage, { FastImageProps, ImageStyle } from 'react-native-fast-image';
import { colors } from '../../theme/colors';
import { hp, wp } from '../../theme/fonts';
import { IMAGES } from '../../assets/Images';

interface Props {
  onPress?: () => void;
  source?: any;
  size?: number | string | any;
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
  onLoadStart?: () => void;
  onLoad?: () => void;
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
  // Ensure we always have a valid source for FastImage
  // If both uri and source are null/undefined, use logoText as fallback
  const imageSource = uri
    ? { uri: uri }
    : typeof source === 'string'
      ? { uri: source }
      : (source || IMAGES.logoText);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}
      ref={viewRef}
      disabled={onPress ? disabled : true}
      style={{
        ...containerStyle,

        ...(isBackGround ? styles.btnContainer : {}),

        ...(bgColor ? { backgroundColor: bgColor } : {}),
      }}>
      <FastImage
        resizeMode={resizeMode}
        source={imageSource}
        tintColor={tintColor}
        defaultSource={IMAGES.logoText}
        style={[{ width: size, height: size }, imageStyle]}
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
