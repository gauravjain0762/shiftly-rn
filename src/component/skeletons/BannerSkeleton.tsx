import React from 'react';

import {View} from 'react-native';
import {colors} from '../../theme/colors';
import {hp, SCREEN_WIDTH, wp} from '../../theme/fonts';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type Props = {
  backgroundColor?: string;
  highlightColor?: string;
};

const BannerSkeleton = (props: Props) => {
  const background = props?.backgroundColor || '#E0E0E0';
  const highlight = props?.highlightColor || '#F5F5F5';
  return (
    <View>
      <SkeletonPlaceholder
        backgroundColor={background}
        highlightColor={highlight}
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
