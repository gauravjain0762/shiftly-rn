import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import ScrollingPaginationDots from './ScrollingPaginationDots';

const {width, height} = Dimensions.get('window');

// Define the structure of a single onboarding item
export type OnboardingDataItem = {
  id: string;
  title: string;
  description: string;
  lottieAnim: string;
};

// Define the props for the reusable component
type OnboardingProps = {
  data: OnboardingDataItem[];
  onComplete: () => void;
};

const Onboarding: React.FC<OnboardingProps> = ({data, onComplete}) => {
  const flatListRef = useRef<FlatList<OnboardingDataItem>>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update current index based on viewable items
  const viewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: Array<{index: number | null}>}) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  // Reanimated scroll handler
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  // Handle "Next" or "Get Started" button press
  const onNextPress = () => {
    if (currentIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({index: currentIndex + 1});
    } else {
      onComplete();
    }
  };

  const renderItem = ({item}: {item: OnboardingDataItem}) => {
    return (
      <View style={[styles.slide, {width}]}>
        <Image resizeMode="contain" source={IMAGES.logog} style={styles.logo} />
        <Image
          source={IMAGES.login_bg}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          {
            "Find your next role in Dubai's top hotels, beach clubs, &restaurants.Let's get you hired! Start your Shiftly journey"
          }
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.bgColor}]}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Standard throttle for reanimated
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        <ScrollingPaginationDots
          scrollX={scrollX}
          count={data.length}
          slideWidth={width}
          dotColor={'red'}
          inactiveDotColor={colors._DADADA}
          dotSize={10}
          spacing={12}
          inactiveDotOpacity={0.3}
          maxVisibleDots={5}
          dotStyle={styles.activeDot}
        />
        {/* Dots */}
        {/* <View style={styles.dots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp(20),
  },
  slide: {
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
    // marginBottom: 64,
  },
  paginationContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 39,
    width: '100%',
  },
  paginationDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  nextButton: {
    alignSelf: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: width * 0.5,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  logo: {
    height: 60,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  illustration: {
    width: '100%',
    height: 220,
  },
  title: {
    marginTop: 20,
    ...commonFontStyle(500, 14, colors.white),
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 29,
    marginBottom: 10,
    marginHorizontal: 28,
    ...commonFontStyle(600, 17, colors._DADADA),
  },

  dots: {
    flexDirection: 'row',
    marginVertical: 41,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: colors._DADADA,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors._F4E2B8,
  },
});

export default Onboarding;
