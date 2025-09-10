import React from 'react';
import {StyleSheet, TextProps, TextStyle, View, ViewStyle} from 'react-native';

import BaseText from './BaseText';
import {commonFontStyle} from '../../theme/fonts';
import {colors} from '../../theme/colors';

type Props = {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
} & TextProps;

const NoDataText = ({text, style, textStyle, ...props}: Props) => {
  return (
    <View style={[styles.container, style]}>
      <BaseText style={[styles.text, textStyle]} text={text} {...props} />
    </View>
  );
};

export default NoDataText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    ...commonFontStyle(500, 16, colors.black),
  },
});
