import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC, ReactNode, useCallback, useMemo} from 'react';
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
  imagePath?: {} | string;
  ContainerStyle?: ViewStyle;
  ChildrenStyle?: ViewStyle;
  IMG_HEIGHT?: number;
  children?: ReactNode;
  ImageChildren?: ReactNode;
};

const {width} = Dimensions.get('window');
const ParallaxContainer: FC<container> = ({
  children,
  imagePath = '',
  ContainerStyle,
  ChildrenStyle,
  IMG_HEIGHT = 300,
  ImageChildren,
}) => {
  const styles = useMemo(
    () => GetStyles(IMG_HEIGHT),
    [IMG_HEIGHT, ChildrenStyle, ContainerStyle],
  );
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const headerHeight = useSafeAreaInsets();
  const ImageBackGround = Animated.createAnimatedComponent(ImageBackground);

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  });

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
  });

  return (
    <View style={[styles.container, ContainerStyle]}>
      <Animated.View
        style={[styles.header, {height: headerHeight?.top}, headerStyle]}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        scrollEventThrottle={16}>
        <ImageBackGround
          source={
            imagePath || {
              uri: 'https://images.unsplash.com/photo-1750912228794-92ec92276a50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D',
            }
          }
          resizeMode={'cover'}
          style={[styles.image, imageAnimatedStyle]}>
          {ImageChildren}
        </ImageBackGround>
        <View style={[styles.container, ChildrenStyle]}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
};

export default ParallaxContainer;

const GetStyles = (IMG_HEIGHT: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      width: width,
      height: IMG_HEIGHT,
    },
    header: {
      backgroundColor: colors.white,
      zIndex: 111,
      position: 'absolute',
      top: 0,
      width: SCREEN_WIDTH,
    },
  });
