import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGE_URL} from '../../utils/commonFunction';
import {commonFontStyle, hp} from '../../theme/fonts';

type Props = {
  title?: string;
  image?: string;
};

const CustomPostCard = ({title, image}: Props) => {
  const resolvedImage =
    Array.isArray(image) && image.length > 0
      ? image[0] // first image from array
      : typeof image === 'string'
      ? image
      : null;

  return (
    <View style={styles.card}>
      <Image
        source={resolvedImage ? {uri: resolvedImage} : {uri: IMAGE_URL}}

        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  );
};

export default CustomPostCard;

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    height: hp(130),
    overflow: 'hidden',
    marginBottom: hp(16),
    borderRadius: hp(10),
    backgroundColor: colors.white,
  },
  image: {
    height: '70%',
    width: '100%',
    borderTopLeftRadius: hp(10),
    borderTopRightRadius: hp(10),
  },
  textContainer: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...commonFontStyle(600, 13, colors.black),
  },
});
