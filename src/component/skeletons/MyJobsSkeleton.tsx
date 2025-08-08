import React from 'react';
import {StyleSheet} from 'react-native';

import {hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const MyJobsSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      {[1, 2, 3, 4].map((_, idx) => (
        <SkeletonPlaceholder.Item
          key={idx}
          flexDirection="column"
          alignItems="flex-start"
          marginBottom={hp(10)}
          borderRadius={hp(20)}
          padding={hp(22)}
          backgroundColor={colors.white}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            width="100%">
            <SkeletonPlaceholder.Item width="75%">
              <SkeletonPlaceholder.Item
                width={wp(120)}
                height={hp(12)}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                marginTop={hp(4)}
                width={wp(180)}
                height={hp(18)}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              width={wp(40)}
              height={hp(40)}
              borderRadius={hp(40)}
            />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            marginTop={hp(6)}
            width="100%"
            height={hp(28)}
            borderRadius={4}
          />

          <SkeletonPlaceholder.Item
            marginTop={hp(30)}
            flexDirection="row"
            justifyContent="space-between"
            width="100%">
            <SkeletonPlaceholder.Item
              width={wp(80)}
              height={hp(12)}
              borderRadius={4}
            />

            <SkeletonPlaceholder.Item
              width={wp(60)}
              height={hp(22)}
              borderRadius={hp(20)}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      ))}
    </SkeletonPlaceholder>
  );
};

export default MyJobsSkeleton;

const styles = StyleSheet.create({});
