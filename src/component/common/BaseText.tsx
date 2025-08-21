import React from 'react';
import {StyleProp, StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import {commonFontStyle} from '../../theme/fonts';
import {colors} from '../../theme/colors';

interface CommonTextProps extends TextProps {
  children?: React.ReactNode;
  text?: string | any;
  style?: StyleProp<TextStyle>;
}

const BaseText = ({text, children, style, ...rest}: CommonTextProps) => {
  const {t} = useTranslation();

  return (
    <Text style={[styles.commonText, style]} {...rest}>
      {text ? t(text) : null}
      {children}
    </Text>
  );
};

export default BaseText;

const styles = StyleSheet.create({
  commonText: {
    ...commonFontStyle(500, 14, colors.black),
  },
});
