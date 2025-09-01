import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Dimensions } from 'react-native';
import Animated, {
useAnimatedStyle,
interpolate,
Extrapolation,
SharedValue,
} from 'react-native-reanimated';

const { width: defaultSlideWidth } = Dimensions.get('window');

//Individual Dot Component
// Animation is driven by shared value `scrollX`.
type DotProps = {
index: number;
scrollX: SharedValue<number>;
slideWidth: number;
dotSize: number;
spacing: number;
dotColor: string;
inactiveDotColor?: string;
inactiveDotOpacity: number;
dotStyle?: StyleProp<ViewStyle>;
maxVisibleDotsForAnimation: number;
};

const Dot: React.FC<DotProps> = React.memo(({
index,
scrollX,
slideWidth,
dotSize,
spacing,
dotColor,
inactiveDotColor,
inactiveDotOpacity,
dotStyle,
maxVisibleDotsForAnimation,
}) => {
const animatedDotStyle = useAnimatedStyle(() => {
  'worklet';
  // Current page index based on scroll position (can be a float during scroll)
  const currentIndexFloat = scrollX.value / slideWidth;

  // Distance of this dot's index from the current effective page index
  const distance = Math.abs(index - currentIndexFloat);

  // Define the range over which dots will scale/fade.
  // For maxVisibleDotsForAnimation = 5, FADE_RANGE will be 2.
  // This means dots at distance 0, 1, 2 from the active dot will be in the transition.
  const FADE_RANGE = (maxVisibleDotsForAnimation - 1) / 4;
  // Ensure fade range is at least 0.5 to prevent division by zero or non-sensical interpolation
  // if maxVisibleDotsForAnimation is 1.
  const effectiveFadeRange = Math.max(0.5, FADE_RANGE);

  //you can add for example scaling of the active dots aswell here

  // Opacity Interpolation:
  // - At distance 0 (active dot): 1 (fully opaque)
  // - At distance effectiveFadeRange: inactiveDotOpacity
  const opacity = interpolate(
    distance,
    [0, effectiveFadeRange],
    [1, inactiveDotOpacity],
    Extrapolation.CLAMP
  );

  return {
    opacity,
  };
});

return (
  <Animated.View
    style={[
      styles.dotBase,
      {
        width: dotSize,
        height: dotSize,
        borderRadius: dotSize * 2,
        marginHorizontal: spacing / 2,
        backgroundColor: inactiveDotColor || dotColor,
      },
      dotStyle,
      animatedDotStyle,
    ]}
  />
);
});

type ScrollingPaginationDotsProps = {
count: any | number;
scrollX: SharedValue<number>;
dotColor: string; // Color for the active dot (at full opacity)
inactiveDotColor?: string; // Base color for dots; if not provided, dotColor is used
dotSize?: number;
spacing?: number;
slideWidth?: number; // Width of each slide in the FlatList
containerStyle?: StyleProp<ViewStyle>;
dotStyle?: StyleProp<ViewStyle>;
inactiveDotOpacity?: number; // Opacity of dots at the edge of the visible window
maxVisibleDots?: number; // Max dots to display in the container (ideally odd)
};

const ScrollingPaginationDots: React.FC<ScrollingPaginationDotsProps> = ({
count,
scrollX,
dotColor,
inactiveDotColor,
dotSize = 8,
spacing = 8,
slideWidth = defaultSlideWidth,
containerStyle,
dotStyle,
inactiveDotOpacity = 0.3,
maxVisibleDots = 5,
}) => {
// Ensure maxVisibleDots is odd for a visually centered active dot effect.
// If an even number is provided, increment to the next odd number.
const actualMaxVisibleDots = maxVisibleDots % 2 === 0 ? maxVisibleDots + 1 : maxVisibleDots;

// Calculate the width of the container needed to show `actualMaxVisibleDots`.
// This container will have `overflow: 'hidden'` to act as a viewport.
const numDotsInViewport = Math.min(count, actualMaxVisibleDots);
const viewportWidth = numDotsInViewport > 0
  ? (numDotsInViewport * dotSize) + (numDotsInViewport > 1 ? (numDotsInViewport - 1) * spacing : 0)
  : 0;

// This container will be translated horizontally to keep the active group of dots centered.
const animatedInnerContainerStyle = useAnimatedStyle(() => {
  'worklet';
  // If the total number of dots is less than or equal to what can be shown no translation is needed
  if (count <= actualMaxVisibleDots) {
    return { transform: [{ translateX: 0 }] };
  }

  const currentIndexFloat = scrollX.value / slideWidth;

  // Calculate the translation needed to center the currentIndexFloat
  const currentDotCenterOffset = (currentIndexFloat * (dotSize + spacing)) + (dotSize / 2);
  // The X offset where we want this dot to appear in the center
  const viewportCenter = viewportWidth / 2;
  
  let translateX = viewportCenter - currentDotCenterOffset;

  // Clamp the translation to prevent over-scrolling the dot strip.
  // Total width of all dots laid out:
  const totalDotStripWidth = (count * dotSize) + ((count - 1) * spacing);
  // Maximum positive translation (when first few dots are shown):
  const maxTranslateX = 0; // Or slightly positive if padding is desired at the start
  // Minimum negative translation (when last few dots are shown):
  const minTranslateX = viewportWidth - totalDotStripWidth - dotSize;

  translateX = Math.max(minTranslateX, Math.min(maxTranslateX, translateX));

  return {
    transform: [{ translateX }],
  };
});

if (count <= 0) {
  return <></>;
}

const isScrollable = count > actualMaxVisibleDots;

return (
  <View
    style={[
      styles.outerContainer,
      { width: viewportWidth }, // Fixed width for the viewport
      !isScrollable && { justifyContent: 'center' },
      containerStyle,
    ]}
  >
    <Animated.View
      style={[
        styles.dotsInnerContainer,
        isScrollable ? animatedInnerContainerStyle : {}, // Apply translation if scrollable
      ]}
    >
      {[...Array(count)].map((_, index) => (
        <Dot
          key={`dot-${index}`}
          index={index}
          scrollX={scrollX}
          slideWidth={slideWidth}
          dotSize={dotSize}
          spacing={spacing}
          dotColor={dotColor}
          inactiveDotColor={inactiveDotColor}
          inactiveDotOpacity={inactiveDotOpacity}
          dotStyle={dotStyle}
          maxVisibleDotsForAnimation={actualMaxVisibleDots}
        />
      ))}
    </Animated.View>
  </View>
);
};

const styles = StyleSheet.create({
outerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  overflow: 'hidden',   
},
dotsInnerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
dotBase: {
  borderRadius: 16
  // Base styles
},
});

export default ScrollingPaginationDots;
