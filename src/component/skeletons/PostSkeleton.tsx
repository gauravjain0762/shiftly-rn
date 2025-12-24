import React from 'react';
import {hp, wp} from '../../theme/fonts';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {colors} from '../../theme/colors';

type Props = {
  backgroundColor?: string;
  highlightColor?: string;
};

const PostSkeleton = (props: Props) => {
  const background = props?.backgroundColor || colors._F7F7F7;
  const highlight = props?.highlightColor || '#ECECEC';

  return (
    <SkeletonPlaceholder
      borderRadius={4}
      highlightColor={highlight}
      backgroundColor={background}>
      {[1, 2, 3, 4].map((_, idx) => (
        <SkeletonPlaceholder.Item
          key={idx}
          flexDirection="column"
          marginBottom={hp(20)}
          padding={hp(16)}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            marginBottom={hp(12)}>
            <SkeletonPlaceholder.Item
              width={hp(50)}
              height={hp(50)}
              borderRadius={hp(25)}
            />

            <SkeletonPlaceholder.Item marginLeft={hp(12)}>
              <SkeletonPlaceholder.Item
                width={wp(40)}
                height={hp(16)}
                borderRadius={4}
                marginBottom={hp(6)}
              />
              <SkeletonPlaceholder.Item
                width={wp(60)}
                height={hp(14)}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            width={'95%'}
            height={hp(350)}
            alignSelf="center"
            borderRadius={hp(12)}
          />
        </SkeletonPlaceholder.Item>
      ))}
    </SkeletonPlaceholder>
  );
};

export default PostSkeleton;
