import React, {useRef} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {IMAGES} from '../../assets/Images';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import ScrollingPaginationDots from './ScrollingPaginationDots';

const {width} = Dimensions.get('window');

export type OnboardingDataItem = {
  id: string;
  title: string;
  description?: string;
  lottieAnim?: string;
};

type OnboardingProps = {
  onComplete?: () => void;
  data?: OnboardingDataItem[];
  role?: 'company' | 'employee';
};

const Onboarding: React.FC<OnboardingProps> = ({data, role}) => {
  const flatListRef = useRef<FlatList<OnboardingDataItem>>(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  const renderItem = ({item}: {item: OnboardingDataItem}) => {
    return (
      <View style={[styles.slide, {width}]}>
        <Image
          resizeMode="contain"
          source={IMAGES.newlogo}
          style={styles.logo}
        />
        <ImageBackground
          source={IMAGES.login_bg}
          style={styles.illustration}
          resizeMode="contain">
          <View style={styles.innerImages}>
            <Image source={IMAGES.login_bg1} />
            <Image source={IMAGES.login_bg2} />
          </View>
        </ImageBackground>
        <Text style={styles.subtitle}>
          {
            "Find your next role in Dubai's top hotels, beach clubs, &restaurants.Let's get you hired! Start your Shiftly journey"
          }
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, {}]}>
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
        scrollEventThrottle={16}
      />

      <View
        style={[
          styles.paginationContainer,
          {bottom: role === 'company' ? '12%' : '6%'},
        ]}>
        <ScrollingPaginationDots
          scrollX={scrollX}
          count={data?.length}
          slideWidth={width}
          dotColor={'red'}
          inactiveDotColor={colors._DADADA}
          dotSize={10}
          spacing={12}
          inactiveDotOpacity={0.3}
          maxVisibleDots={5}
          dotStyle={styles.activeDot}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp(24),
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: wp(20),
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: hp(10),
  },
  paginationContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  paginationDot: {
    width: wp(10),
    height: hp(10),
    borderRadius: hp(5),
    marginHorizontal: wp(8),
  },
  nextButton: {
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    minWidth: width * 0.5,
    paddingVertical: hp(15),
    paddingHorizontal: wp(40),
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    marginBottom: hp(12),
    resizeMode: 'contain',
  },
  illustration: {
    width: '100%',
    height: hp(200),
  },
  innerImages: {
    gap: '30%',
    left: '22%',
    bottom: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
  },
  title: {
    marginTop: hp(20),
    ...commonFontStyle(500, 14, colors.white),
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 30,
    marginTop: hp(29),
    marginBottom: hp(10),
    ...commonFontStyle(600, 17, colors._DADADA),
  },
  dots: {
    flexDirection: 'row',
    marginVertical: hp(34),
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
