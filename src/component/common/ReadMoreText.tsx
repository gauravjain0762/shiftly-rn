import React, { useEffect, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';

interface ReadMoreTextProps {
  text: string;
  numberOfLines?: number;
  fontSize?: number;
  textColor?: string;
  linkColor?: string;
  linkPressedColor?: string;
  fontWeight?: '400' | '500' | '600' | '700';
  linkFontWeight?: '400' | '500' | '600' | '700';
  seeMoreText?: string;
  seeLessText?: string;
  style?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text,
  numberOfLines = 3,
  fontSize = 16,
  textColor = colors._6A6A6A,
  linkColor = colors._0B3970,
  linkPressedColor = colors._0B3970,
  fontWeight = '400',
  linkFontWeight = '600',
  seeMoreText = 'Read more',
  seeLessText = 'See less',
  style,
  linkStyle,
  containerStyle,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [fullLines, setFullLines] = useState<Array<{ text: string }>>([]);
  const [isLinkPressed, setIsLinkPressed] = useState(false);

  const flattenedStyle = StyleSheet.flatten([
    {
      fontFamily: undefined,
      fontSize,
      fontWeight,
      color: textColor,
    },
    style,
  ]);

  const flattenedLinkStyle = StyleSheet.flatten([
    {
      fontWeight: linkFontWeight,
      color: linkColor,
      fontSize,
    },
    linkStyle,
  ]);

  useEffect(() => {
    setExpanded(false);
    setFullLines([]);
  }, [text]);

  const trimmed = text?.trim?.() ?? '';
  const showToggle = trimmed.length > 0 && fullLines.length > numberOfLines;
  const collapsedText = useMemo(() => {
    if (!showToggle) return text;

    const visible = fullLines
      .slice(0, numberOfLines)
      .map((line) => line.text)
      .join('')
      .replace(/\s+$/g, '');

    const reserve = `... ${seeMoreText}`;
    const reserveChars = Math.max(Math.ceil(reserve.length * 1.25), 8);
    const targetLength = Math.max(0, visible.length - reserveChars);

    return visible
      .slice(0, targetLength)
      .replace(/[\s,.;:!?-]+$/g, '');
  }, [showToggle, text, fullLines, numberOfLines, seeMoreText]);

  const handleLayoutMeasure = (
    e: NativeSyntheticEvent<TextLayoutEventData>,
  ) => {
    const lines = e.nativeEvent.lines || [];
    setFullLines(lines.map((line) => ({ text: line.text || '' })));
  };

  return (
    <View style={[styles.wrap, containerStyle]}>
      {/* Same typography & width as visible text; measures how many lines the full copy needs. */}
      <Text
        accessible={false}
        style={[flattenedStyle, styles.textFullWidth, styles.measure]}
        onTextLayout={handleLayoutMeasure}
      >
        {text}
      </Text>

      {expanded ? (
        <Text style={[flattenedStyle, styles.textFullWidth]}>
          {text}
          {showToggle ? (
            <Text
              style={[
                flattenedLinkStyle,
                isLinkPressed && { color: linkPressedColor },
              ]}
              onPress={() => setExpanded(false)}
              onPressIn={() => setIsLinkPressed(true)}
              onPressOut={() => setIsLinkPressed(false)}
              suppressHighlighting
            >
              {` ${seeLessText}`}
            </Text>
          ) : null}
        </Text>
      ) : (
        <Text style={[flattenedStyle, styles.textFullWidth]}>
          {showToggle ? (
            <>
              {collapsedText}
              <Text>{'... '}</Text>
              <Text
                style={[
                  flattenedLinkStyle,
                  isLinkPressed && { color: linkPressedColor },
                ]}
                onPress={() => setExpanded(true)}
                onPressIn={() => setIsLinkPressed(true)}
                onPressOut={() => setIsLinkPressed(false)}
                suppressHighlighting
              >
                {seeMoreText}
              </Text>
            </>
          ) : (
            text
          )}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  textFullWidth: {
    width: '100%',
  },
  measure: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
    width: '100%',
    left: 0,
    top: 0,
  },
});

export default ReadMoreText;
