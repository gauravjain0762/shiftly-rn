import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import React, { FC, ReactNode, useState, useCallback } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { colors } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomImage from './CustomImage';
import { IMAGES } from '../../assets/Images';
import { hp, wp } from '../../theme/fonts';

type SimpleCarouselProps = {
  imagePath?: string | { uri: string } | (string | { uri: string })[];
  ContainerStyle?: ViewStyle;
  ChildrenStyle?: ViewStyle;
  IMG_HEIGHT?: number;
  IMG_WIDTH?: number;
  children?: ReactNode;
  ImageChildren?: ReactNode;
  showLoader?: boolean;
  loaderColor?: string;
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    alignSelf: 'center',
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
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

const SimpleImage: FC<{
  source: any;
  style: any;
  children: ReactNode;
  showLoader: boolean;
  loaderColor: string;
}> = ({ source, style, children, showLoader, loaderColor }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const hasValidSource = source && (
    typeof source === 'string' ||
    typeof source === 'number' ||
    (typeof source === 'object' && source.uri)
  );

  const finalSource = !hasValidSource || hasError ? IMAGES.logoText : source;

  return (
    <CustomImage
      source={finalSource}
      imageStyle={style}
      containerStyle={styles.imageContainer}
      resizeMode={hasValidSource ? 'cover' : 'contain'}
      props={{
        onError: () => {
          setHasError(true);
          setIsLoading(false);
        },
        onLoad: () => setIsLoading(false),
      }}>
      {children}
    </CustomImage>
  );
};

const PaginationDots: FC<{ data: any[]; currentIndex: number }> = ({
  data,
  currentIndex,
}) => {
  if (data.length <= 1) return null;

  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === currentIndex && styles.activeDot]}
        />
      ))}
    </View>
  );
};

const SimpleCarousel: FC<SimpleCarouselProps> = ({
  children,
  imagePath = '',
  ContainerStyle,
  ChildrenStyle,
  IMG_HEIGHT = 250,
  IMG_WIDTH,
  ImageChildren,
  showLoader = true,
  loaderColor = colors._D5D5D5,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const normalizedImages = Array.isArray(imagePath) ? imagePath : [imagePath];

  // Filter out invalid/empty images
  const validImages = normalizedImages.filter(item => {
    if (!item) return false;
    if (typeof item === 'string' && item.trim() !== '') return true;
    if (typeof item === 'number') return true;
    if (typeof item === 'object' && item.uri && item.uri.trim() !== '') return true;
    return false;
  });

  const hasValidImages = validImages.length > 0;
  const hasMultipleImages = validImages.length > 1;
  const imageWidth = IMG_WIDTH || width;

  const renderCarouselItem = useCallback(
    ({ item }: { item: any }) => {
      const hasValidSource = item && (
        typeof item === 'string' ||
        typeof item === 'number' ||
        (typeof item === 'object' && item.uri)
      );
      const source = hasValidSource
        ? item
        : {
          uri: 'https://sky.devicebee.com/Shiftly/public/uploads/blank.png',
        };

      return (
        <SimpleImage
          source={source}
          style={{ width: imageWidth, height: IMG_HEIGHT }}
          showLoader={showLoader && hasValidSource}
          loaderColor={loaderColor}>
          {ImageChildren}
        </SimpleImage>
      );
    },
    [imageWidth, IMG_HEIGHT, ImageChildren, showLoader, loaderColor],
  );

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, ContainerStyle]}>
      <View style={[styles.imageContainer, { width: imageWidth }]}>
        {hasValidImages ? (
          <>
            <Carousel
              width={imageWidth}
              height={IMG_HEIGHT}
              data={validImages}
              scrollAnimationDuration={300}
              onSnapToItem={setCurrentImageIndex}
              renderItem={renderCarouselItem}
              loop={hasMultipleImages}
              autoPlay={hasMultipleImages}
              autoPlayInterval={3000}
              pagingEnabled={hasMultipleImages}
              snapEnabled={hasMultipleImages}
              enabled={hasMultipleImages}
            />

            <PaginationDots
              data={validImages}
              currentIndex={currentImageIndex}
            />
          </>
        ) : (
          <CustomImage
            size={150}
            source={IMAGES.newlogo}
            imageStyle={{ width: 150, height: 150 }}
            resizeMode="contain">
            {ImageChildren}
          </CustomImage>
        )}
      </View>

      <View style={[styles.container, ChildrenStyle]}>{children}</View>
    </SafeAreaView>
  );
};

export default SimpleCarousel;
