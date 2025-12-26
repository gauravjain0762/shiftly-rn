import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { IMAGES } from '../../assets/Images';

interface TooltipProps {
  message: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: ViewStyle;
  position?: 'top' | 'bottom';
  tooltipBoxStyle?: ViewStyle;
  visible?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  message,
  containerStyle,
  textStyle,
  iconStyle,
  position = 'top',
  tooltipBoxStyle,
  visible: visibleProp
}) => {
  const [visible, setVisible] = useState(false);
  const isVisible = visibleProp !== undefined ? visibleProp : visible;

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setVisible(!visible)}
        style={[styles.iconContainer, iconStyle]}>
        <Image source={IMAGES.info} style={styles.icon} tintColor={colors._7B7878} />
      </TouchableOpacity>

      {isVisible && (
        <View
          style={[
            styles.tooltipBox,
            position === 'bottom' ? { top: hp(28) } : { bottom: hp(28), right: '50%' },
            tooltipBoxStyle
          ]}>
          <Text
            style={[styles.tooltipText, textStyle]}
            numberOfLines={0}
            ellipsizeMode="clip">
            {message}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Tooltip;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: wp(5),
  },
  icon: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
  },
  tooltipBox: {
    position: 'absolute',
    backgroundColor: '#F6E2B8',
    paddingVertical: hp(8),
    paddingHorizontal: wp(10),
    borderRadius: 8,
    width: wp(250),
    zIndex: 10,
    borderWidth: hp(1),
    borderColor: colors._D9D9D9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  tooltipText: {
    ...commonFontStyle(500, 12, colors._4F4F4F),
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: hp(18),
  },
});
