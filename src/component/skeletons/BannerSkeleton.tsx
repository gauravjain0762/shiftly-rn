import React from 'react';

import {hp, SCREEN_WIDTH, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';

const BannerSkeleton = () => {
  return (
    <View>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item
          alignSelf="center"
          marginBottom={hp(10)}
          borderRadius={hp(20)}
          padding={hp(22)}
          backgroundColor={colors.white}
          width={SCREEN_WIDTH - wp(40)}
          height={hp(200)}
        />
      </SkeletonPlaceholder>
    </View>
  );
};

export default BannerSkeleton;
