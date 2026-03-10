import React, { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';

import { commonFontStyle } from '../../theme/fonts';
import BaseText from './BaseText';
import { colors } from '../../theme/colors';

const MORE_SUFFIX = ' more';
const SHOW_LESS_LABEL = 'Show less';
// Reserve space so " more" fits on the last line.
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

  // Fallback: if text is long enough, always show "more" button
  // ~40 chars per line is a reasonable estimate for most screens
  React.useEffect(() => {
    const estimatedCharsPerLine = 40;
    const estimatedMaxChars = maxLines * estimatedCharsPerLine;
    if (description && description.length > estimatedMaxChars) {
      setShouldShowButton(true);
    }
  }, [description, maxLines]);

  const truncateLength = useMemo(() => {
    if (containerWidth <= 0) return maxLines * 42 - 8; // fallback until measured
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
    <View onLayout={onContainerLayout} collapsable={false} style={styles.container}>
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
            suppressHighlighting
            style={[styles.inlineMore, showStyle]}
          >
            {MORE_SUFFIX}
          </Text>
        </BaseText>
      ) : (
        <View style={styles.block}>
          <BaseText style={descriptionStyle} numberOfLines={showMore ? undefined : maxLines}>
            {description}
          </BaseText>
          {shouldShowButton && (
            <Pressable
              onPress={toggleShowMore}
              hitSlop={{ top: 14, bottom: 14, left: 12, right: 12 }}
              style={({ pressed }) => [styles.linkTouchable, pressed && styles.pressedOpacity]}
            >
              <Text style={[styles.lessLink, showStyle]}>
                {showMore ? SHOW_LESS_LABEL : 'more'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default ExpandableText;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  block: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  inlineMore: {
    ...commonFontStyle(600, 16, colors._0B3970),
  },
  linkTouchable: {
    marginTop: 4,
    paddingVertical: 2,
    paddingRight: 4,
  },
  lessLink: {
    ...commonFontStyle(600, 15, colors._0B3970),
    marginTop: 4,
  },
  pressedOpacity: {
    opacity: 0.7,
  },
});
