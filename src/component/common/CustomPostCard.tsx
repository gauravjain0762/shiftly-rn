import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import CustomImage from './CustomImage';

type Props = {
  title?: string;
  image?: string | string[];
};

const CustomPostCard = ({ title, image }: Props) => {
  const resolvedImage =
    Array.isArray(image) && image.length > 0
      ? image[0]
      : typeof image === 'string'
        ? image
        : null;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <CustomImage
          uri={resolvedImage || undefined}
          containerStyle={styles.image}
          imageStyle={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={2}>{title}</Text>
      </View>
    </View>
  );
};

export default CustomPostCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: hp(12),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E2E6F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: hp(140),
    width: '100%',
    backgroundColor: colors._F7F7F7,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  textContainer: {
    padding: hp(10),
    justifyContent: 'center',
    minHeight: hp(45),
  },
  text: {
    ...commonFontStyle(600, 14, colors.black),
  },
});
