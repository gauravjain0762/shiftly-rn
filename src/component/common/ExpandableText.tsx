import React, { useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';

import { commonFontStyle, hp, wp } from '../../theme/fonts';
import BaseText from './BaseText';
import { colors } from '../../theme/colors';

interface Props {
  style?: StyleProp<TextStyle>;
  description: string;
  maxLines?: number;
  showStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  onShowLess?: () => void;
}

const ExpandableText: React.FC<Props> = ({
  description,
  style,
  maxLines = 5,
  showStyle,
  descriptionStyle,
  onShowLess,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);

  const toggleShowMore = () => {
    if (showMore && onShowLess) {
      onShowLess();
    }
    setShowMore(prev => !prev);
  };

  const onTextLayout = (e: any) => {
    try {
      if (e?.nativeEvent?.lines) {
        const totalLines = e.nativeEvent.lines.length;
        if (totalLines > maxLines) {
          setShouldShowButton(true);
        }
      }
    } catch (error) {
      console.warn('ExpandableText onTextLayout error:', error);
    }
  };

  return (
    <View>
      <BaseText
        style={[descriptionStyle, { position: 'absolute', opacity: 0, height: 0 }]}
        onTextLayout={onTextLayout}>
        {description}
      </BaseText>

      <BaseText
        style={descriptionStyle}
        ellipsizeMode="tail"
        numberOfLines={showMore ? undefined : maxLines}>
        {description}
      </BaseText>

      {shouldShowButton && (
        <TouchableOpacity activeOpacity={0.8} onPress={toggleShowMore}>
          <Text style={[styles.showText, showStyle]}>
            {showMore ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ExpandableText;

const styles = StyleSheet.create({
  showText: {
    paddingBottom: hp(8),
    paddingHorizontal: wp(15),
    ...commonFontStyle(500, 16, colors.empPrimary),
  },
});