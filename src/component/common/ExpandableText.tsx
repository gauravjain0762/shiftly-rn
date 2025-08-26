import React, {useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';

import {commonFontStyle, hp, wp} from '../../theme/fonts';
import BaseText from './BaseText';
import {colors} from '../../theme/colors';

interface Props {
  style?: StyleProp<TextStyle>;
  description: string;
  maxLines?: number;
  showStyle?: StyleProp<TextStyle>;
}

const ExpandableText: React.FC<Props> = ({
  description,
  style,
  maxLines = 5,
  showStyle,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [textLayoutComplete, setTextLayoutComplete] = useState(false);

  const toggleShowMore = () => {
    setShowMore(prev => !prev);
  };

  const onTextLayout = (e: any) => {
    if (!textLayoutComplete) {
      const totalLines = e.nativeEvent.lines.length;
      setShouldShowButton(totalLines > maxLines);
      setTextLayoutComplete(true);
    }
  };

  return (
    <View>
      {!textLayoutComplete && (
        <BaseText
          onTextLayout={onTextLayout}
          style={[
            style,
            {
              position: 'absolute',
              opacity: 0,
              top: -1000,
              left: 0,
              right: 0,
            },
          ]}>
          {description}
        </BaseText>
      )}

      <BaseText
        style={style}
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
