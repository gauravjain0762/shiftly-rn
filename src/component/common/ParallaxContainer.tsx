import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  ViewStyle,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {FC, ReactNode, useMemo, useCallback, useState} from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import {colors} from '../../theme/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SCREEN_WIDTH} from '../../theme/fonts';

type container = {
  imagePath?: string | {uri: string} | (string | {uri: string})[];
  ContainerStyle?: ViewStyle;
  ChildrenStyle?: ViewStyle;
  IMG_HEIGHT?: number;
  children?: ReactNode;
  ImageChildren?: ReactNode;
  showLoader?: boolean;
  loaderColor?: string;
};

const {width} = Dimensions.get('window');

// Static styles to prevent re-creation
const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.white,
    zIndex: 111,
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
  },
  imageContainer: {
    position: 'relative',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
    zIndex: 1,
  },
});

// Individual image component with its own loading state
const ParallaxImage: FC<{
  source: any;
  style: any;
  animatedStyle: any;
  children: ReactNode;
  showLoader: boolean;
  loaderColor: string;
}> = ({source, style, animatedStyle, children, showLoader, loaderColor}) => {
  const [isLoading, setIsLoading] = useState(true);
  const ImageBackGround = Animated.createAnimatedComponent(ImageBackground);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoadError = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Auto-hide loader after 5s if image hangs
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const hasValidSource =
    source && (typeof source === 'string' || (source.uri && source.uri !== ''));

  if (!hasValidSource) return null;

  return (
    <View style={staticStyles.imageContainer}>
      <ImageBackGround
        source={source}
        resizeMode="cover"
        style={[style, animatedStyle]}
        onLoadEnd={handleLoadEnd}
        onError={handleLoadError}>
        {children}
      </ImageBackGround>

      {showLoader && isLoading && (
        <View style={[staticStyles.loaderContainer, style]}>
          <ActivityIndicator size="large" color={loaderColor} />
        </View>
      )}
    </View>
  );
};

const ParallaxContainer: FC<container> = ({
  children,
  imagePath = '',
  ContainerStyle,
  ChildrenStyle,
  IMG_HEIGHT = 300,
  ImageChildren,
  showLoader = true,
  loaderColor = colors._0B3970,
}) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const headerHeight = useSafeAreaInsets();

  // Memoize the image style
  const imageStyle = useMemo(
    () => ({
      width: width,
      height: IMG_HEIGHT,
    }),
    [IMG_HEIGHT],
  );

  // Memoize the normalized images array
  const normalizedImages = useMemo(() => {
    return Array.isArray(imagePath) ? imagePath : [imagePath];
  }, [imagePath]);

  // Memoize the header style animation
  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, [IMG_HEIGHT]);

  // Memoize the image animation style
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  }, [IMG_HEIGHT]);

  // Memoize the render item function
  const renderImageItem = useCallback(
    ({item, index}: {item: any; index: number}) => {
      // Check if we have a valid image source
      const hasValidSource =
        item &&
        (typeof item === 'string' || (typeof item === 'object' && item.uri));
      const fallbackSource = {
        uri: 'https://images.unsplash.com/photo-1750912228794-92ec92276a50?w=900',
      };

      return (
        <ParallaxImage
          source={hasValidSource ? item : fallbackSource}
          style={imageStyle}
          animatedStyle={imageAnimatedStyle}
          showLoader={showLoader && hasValidSource}
          loaderColor={loaderColor}>
          {ImageChildren}
        </ParallaxImage>
      );
    },
    [imageStyle, imageAnimatedStyle, ImageChildren, showLoader, loaderColor],
  );

  // Memoize keyExtractor
  const keyExtractor = useCallback((item: any, index: number) => {
    return `image-${index}`;
  }, []);

  return (
    <View style={[staticStyles.container, ContainerStyle]}>
      <Animated.View
        style={[staticStyles.header, {height: headerHeight?.top}, headerStyle]}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        scrollEventThrottle={16}>
        <FlatList
          data={normalizedImages}
          horizontal
          pagingEnabled
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={keyExtractor}
          renderItem={renderImageItem}
        />

        <View style={[staticStyles.container, ChildrenStyle]}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
};

export default ParallaxContainer;
