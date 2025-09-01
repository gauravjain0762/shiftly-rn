import React from 'react';
import {StyleSheet, TextProps, TextStyle} from 'react-native';

import BaseText from './BaseText';
import {colors} from '../../theme/colors';
import {commonFontStyle, hp} from '../../theme/fonts';

type Props = {
  value: string;
  chars: number;
  style?: TextStyle;
  type?: 'company' | 'employee';
} & TextProps;

const CharLength = ({
  value,
  chars,
  style,
  type = 'company',
  ...props
}: Props) => {
  return (
    <BaseText
      style={[
        type === 'employee'
          ? styles.goldenCharacterCount
          : styles.characterCount,
        style,
      ]}
      {...props}>
      {`${value?.length}/${chars} Characters`}
    </BaseText>
  );
};

export default CharLength;

const styles = StyleSheet.create({
  characterCount: {
    marginTop: hp(15),
    alignSelf: 'flex-end',
    ...commonFontStyle(400, 16, colors._4A4A4A),
  },
  goldenCharacterCount: {
    marginTop: hp(15),
    alignSelf: 'flex-end',
    ...commonFontStyle(400, 16, colors._F4E2B8),
  },
});
