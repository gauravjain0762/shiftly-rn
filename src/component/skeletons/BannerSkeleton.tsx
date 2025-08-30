import React from 'react';

import {View} from 'react-native';
import {colors} from '../../theme/colors';
import {hp, SCREEN_WIDTH, wp} from '../../theme/fonts';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type Props = {
  backgroundColor?: string;
};

const BannerSkeleton = (props: Props) => {
  return (
    <View>
      <SkeletonPlaceholder
        backgroundColor={props.backgroundColor}
        borderRadius={4}>
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
