import React from 'react';
import { View, StyleSheet } from 'react-native';
import { hp, wp, SCREEN_WIDTH } from '../../theme/fonts';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const MyJobsSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        backgroundColor="#E1E9EE"
        highlightColor="#F8FAFB"
        borderRadius={4}
      >
        {/* Header */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingVertical={hp(24)}
          marginTop={hp(50)}
          paddingHorizontal={wp(25)}
        >
          <SkeletonPlaceholder.Item
            width={wp(120)}
            height={hp(22)}
            borderRadius={4}
            backgroundColor="#E1E9EE"
          />
          <SkeletonPlaceholder.Item
            flexDirection="row"
            gap={wp(18)}
          >
            <SkeletonPlaceholder.Item
              width={wp(26)}
              height={wp(26)}
              borderRadius={4}
              backgroundColor="#E1E9EE"
            />
            <SkeletonPlaceholder.Item
              width={wp(26)}
              height={wp(26)}
              borderRadius={4}
              backgroundColor="#E1E9EE"
            />
            <SkeletonPlaceholder.Item
              width={wp(26)}
              height={wp(26)}
              borderRadius={4}
              backgroundColor="#E1E9EE"
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        {/* Banner/Carousel */}
        <SkeletonPlaceholder.Item
          marginTop={hp(16)}
          marginHorizontal={wp(16)}
          width={SCREEN_WIDTH - wp(32)}
          height={hp(180)}
          borderRadius={12}
          backgroundColor="#E1E9EE"
        />

        {/* Section Title */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          alignSelf='center'
          paddingVertical={hp(12)}
          paddingHorizontal={wp(25)}
          gap={wp(8)}
        >
          <SkeletonPlaceholder.Item
            width={wp(200)}
            height={hp(20)}
            borderRadius={4}
            backgroundColor="#E1E9EE"
          />
          <SkeletonPlaceholder.Item
            width={wp(18)}
            height={wp(18)}
            borderRadius={wp(9)}
            backgroundColor="#E1E9EE"
          />
        </SkeletonPlaceholder.Item>

        {/* Job Cards */}
        {[1, 2].map((_, idx) => (
          <SkeletonPlaceholder.Item
            key={`skeleton-${idx}`}
            flexDirection="column"
            alignItems="flex-start"
            marginBottom={hp(28)}
            marginHorizontal={wp(25)}
            borderRadius={hp(12)}
            padding={hp(20)}
            backgroundColor="#FFFFFF"
          >
            {/* Header row with logo and icons */}
            <SkeletonPlaceholder.Item
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-start"
              width="100%"
              marginBottom={hp(16)}
            >
              {/* Logo */}
              <SkeletonPlaceholder.Item
                width={wp(70)}
                height={hp(70)}
                borderRadius={hp(35)}
                backgroundColor="#E1E9EE"
              />

              {/* Share and Heart icons */}
              <SkeletonPlaceholder.Item
                flexDirection="column"
                alignItems="flex-end"
                gap={hp(12)}
              >
                <SkeletonPlaceholder.Item
                  width={wp(44)}
                  height={hp(44)}
                  borderRadius={hp(22)}
                  backgroundColor="#E1E9EE"
                />
                <SkeletonPlaceholder.Item
                  width={wp(44)}
                  height={hp(44)}
                  borderRadius={hp(22)}
                  backgroundColor="#E1E9EE"
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            {/* Location and Posted time row */}
            <SkeletonPlaceholder.Item
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              marginBottom={hp(8)}
            >
              <SkeletonPlaceholder.Item
                width={wp(100)}
                height={hp(14)}
                borderRadius={4}
                backgroundColor="#E1E9EE"
              />
              <SkeletonPlaceholder.Item
                width={wp(110)}
                height={hp(14)}
                borderRadius={4}
                backgroundColor="#E1E9EE"
              />
            </SkeletonPlaceholder.Item>

            {/* Job Title */}
            <SkeletonPlaceholder.Item
              width={wp(180)}
              height={hp(24)}
              borderRadius={4}
              backgroundColor="#E1E9EE"
              marginBottom={hp(10)}
            />

            {/* Job Description - Line 1 */}
            <SkeletonPlaceholder.Item
              width="100%"
              height={hp(14)}
              borderRadius={4}
              backgroundColor="#E1E9EE"
              marginBottom={hp(6)}
            />

            {/* Job Description - Line 2 */}
            <SkeletonPlaceholder.Item
              width="70%"
              height={hp(14)}
              borderRadius={4}
              backgroundColor="#E1E9EE"
              marginBottom={hp(8)}
            />

            {/* Show More */}
            <SkeletonPlaceholder.Item
              width={wp(90)}
              height={hp(16)}
              borderRadius={4}
              backgroundColor="#E1E9EE"
              marginBottom={hp(16)}
            />

            {/* Salary range */}
            <SkeletonPlaceholder.Item
              width={wp(240)}
              height={hp(18)}
              borderRadius={4}
              backgroundColor="#E1E9EE"
            />
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder>
    </View>
  );
};

export default MyJobsSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});