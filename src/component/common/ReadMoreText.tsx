import React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import SeeMore from 'react-native-see-more-inline';
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
  seeMoreText = ' more',
  seeLessText = ' see less',
  style,
  linkStyle,
  containerStyle,
}) => {
  return (
    <View style={containerStyle}>
      {/* @ts-ignore - library types are incomplete, children prop is supported */}
      <SeeMore
        numberOfLines={numberOfLines}
        style={[
          {
            fontFamily: undefined,
            fontSize,
            fontWeight,
            color: textColor,
          },
          style,
        ]}
        linkColor={linkColor}
        linkPressedColor={linkPressedColor}
        linkStyle={[
          {
            fontWeight: linkFontWeight,
            color: linkColor,
            fontSize,
          },
          linkStyle,
        ]}
        seeMoreText={seeMoreText}
        seeLessText={seeLessText}
      >
        {text}
      </SeeMore>
    </View>
  );
};

export default ReadMoreText;
