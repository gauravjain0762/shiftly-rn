import React, { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';

import { commonFontStyle } from '../../theme/fonts';
import BaseText from './BaseText';
import { colors } from '../../theme/colors';

const MORE_SUFFIX = '...more';
// Average character width as fraction of fontSize (proportional font heuristic).
// 0.5 = more chars per line so truncated text fills the last line; "...more" stays inline.
const CHAR_WIDTH_RATIO = 0.5;

interface Props {
  style?: StyleProp<TextStyle>;
  description: string;
  maxLines?: number;
  showStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  onShowLess?: () => void;
  /** Font size used for description (default 16). Needed for dynamic chars-per-line. */
  fontSize?: number;
}

/**
 * ExpandableText - inline "...more" / "Show Less" without native module dependencies.
 * Uses measured container width to compute chars per line dynamically (no fixed constant).
 * Truncation reserves space for "...more" on the last line so it stays inline.
 */
const ExpandableText: React.FC<Props> = ({
  description,
  maxLines = 5,
  showStyle,
  descriptionStyle,
  onShowLess,
  fontSize = 16,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) setContainerWidth(width);
  };

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

  const truncateLength = useMemo(() => {
    if (containerWidth <= 0) return maxLines * 42 - 5; // fallback until measured
    const charWidth = fontSize * CHAR_WIDTH_RATIO;
    const charsPerLine = Math.floor(containerWidth / charWidth);
    return Math.max(1, maxLines * charsPerLine - MORE_SUFFIX.length);
  }, [containerWidth, maxLines, fontSize]);

  const truncatedText = (() => {
    if (!shouldShowButton || showMore || description.length <= truncateLength)
      return null;
    const raw = description.slice(0, truncateLength).trim();
    const cutChar = description[truncateLength];
    const cutMidWord = cutChar && /[a-zA-Z0-9]/.test(cutChar);
    if (cutMidWord) {
      const lastSpace = raw.lastIndexOf(' ');
      const charsLost = raw.length - lastSpace;
      if (lastSpace > 0 && charsLost <= 8) return raw.slice(0, lastSpace);
    }
    return raw;
  })();

  return (
    <View onLayout={onContainerLayout}>
      <BaseText
        style={[descriptionStyle, { position: 'absolute', opacity: 0, height: 0 }]}
        onTextLayout={onTextLayout}>
        {description}
      </BaseText>

      {truncatedText !== null ? (
        <BaseText style={descriptionStyle}>
          {truncatedText}
          <Text
            onPress={toggleShowMore}
            style={[styles.inlineMoreText, showStyle]}
            suppressHighlighting={true}>
            {MORE_SUFFIX}
          </Text>
        </BaseText>
      ) : (
        <BaseText style={descriptionStyle} numberOfLines={showMore ? undefined : maxLines}>
          {description}
          {shouldShowButton && showMore && (
            <Text
              onPress={toggleShowMore}
              style={[styles.inlineLessText, showStyle]}
              suppressHighlighting={true}>
              {' '}Show Less
            </Text>
          )}
        </BaseText>
      )}
    </View>
  );
};

export default ExpandableText;

const styles = StyleSheet.create({
  inlineMoreText: {
    ...commonFontStyle(500, 16, colors.empPrimary),
  },
  inlineLessText: {
    ...commonFontStyle(500, 16, colors.empPrimary),
  },
});
