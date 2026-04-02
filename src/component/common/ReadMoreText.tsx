import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
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

/** Ignore line layout until the row has a real width (avoids FlatList / nav timing bugs). */
const MIN_LAYOUT_WIDTH = 24;

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
  const [layoutWidth, setLayoutWidth] = useState(0);
  const layoutWidthRef = useRef(0);
  const [fullLines, setFullLines] = useState<Array<{ text: string }>>([]);
  const [lineLayoutReady, setLineLayoutReady] = useState(false);
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
    setLineLayoutReady(false);
  }, [text]);

  useEffect(() => {
    setFullLines([]);
    setLineLayoutReady(false);
  }, [layoutWidth]);

  const trimmed = text?.trim?.() ?? '';
  const showToggle =
    trimmed.length > 0 && lineLayoutReady && fullLines.length > numberOfLines;

  const collapsedText = useMemo(() => {
    if (!showToggle) {
      return text;
    }

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

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    layoutWidthRef.current = w;
    setLayoutWidth(w);
  };

  const handleLayoutMeasure = (
    e: NativeSyntheticEvent<TextLayoutEventData>,
  ) => {
    if (layoutWidthRef.current < MIN_LAYOUT_WIDTH) {
      return;
    }
    const lines = e.nativeEvent.lines || [];
    setFullLines(lines.map((line) => ({ text: line.text || '' })));
    setLineLayoutReady(true);
  };

  const renderMeasureText = () => (
    <Text
      key={`measure-${layoutWidth}-${String(text).length}`}
      accessible={false}
      style={[flattenedStyle, styles.textFullWidth, styles.measure]}
      onTextLayout={handleLayoutMeasure}
    >
      {text}
    </Text>
  );

  return (
    <View
      style={[styles.wrap, containerStyle]}
      onLayout={handleContainerLayout}
      collapsable={false}
    >
      {renderMeasureText()}

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
      ) : !lineLayoutReady ? (
        <Text
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
          style={[flattenedStyle, styles.textFullWidth]}
        >
          {text}
        </Text>
      ) : showToggle ? (
        <Text style={[flattenedStyle, styles.textFullWidth]}>
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
        </Text>
      ) : (
        <Text style={[flattenedStyle, styles.textFullWidth]}>{text}</Text>
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
