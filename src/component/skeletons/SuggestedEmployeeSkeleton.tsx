import React from 'react';
import {ScrollView, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

const SuggestedEmployeeSkeleton = () => {
  const employeePlaceholders = [1, 2, 3];
  const background = '#E0E0E0';
  const highlight = '#F5F5F5';

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(25),
          paddingBottom: hp(100),
          gap: hp(20),
        }}>
        <SkeletonPlaceholder backgroundColor={background} highlightColor={highlight}>
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={hp(130)}
            borderRadius={wp(18)}
          />
        </SkeletonPlaceholder>

        <SkeletonPlaceholder backgroundColor={background} highlightColor={highlight}>
          {[1, 2].map(index => (
            <SkeletonPlaceholder.Item
              key={index}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingVertical={hp(10)}>
              <SkeletonPlaceholder.Item width={wp(60)} height={hp(60)} borderRadius={hp(30)} />
              <SkeletonPlaceholder.Item width={wp(220)} height={hp(18)} borderRadius={8} />
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder>

        <SkeletonPlaceholder backgroundColor={background} highlightColor={highlight}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <SkeletonPlaceholder.Item width={wp(160)} height={hp(20)} borderRadius={8} />
            <SkeletonPlaceholder.Item width={wp(120)} height={hp(34)} borderRadius={hp(20)} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>

        {employeePlaceholders.map(index => (
          <SkeletonPlaceholder
            key={index}
            backgroundColor={background}
            highlightColor={highlight}>
            <SkeletonPlaceholder.Item
              width={'100%'}
              borderRadius={wp(18)}
              padding={hp(16)}
              flexDirection="row"
              alignItems="center">
              <SkeletonPlaceholder.Item
                width={wp(60)}
                height={wp(60)}
                borderRadius={wp(18)}
              />
              <SkeletonPlaceholder.Item marginLeft={wp(15)} flex={1}>
                <SkeletonPlaceholder.Item
                  width={'70%'}
                  height={hp(16)}
                  borderRadius={6}
                  marginBottom={hp(6)}
                />
                <SkeletonPlaceholder.Item
                  width={'50%'}
                  height={hp(14)}
                  borderRadius={6}
                  marginBottom={hp(6)}
                />
                <SkeletonPlaceholder.Item
                  width={'40%'}
                  height={hp(12)}
                  borderRadius={6}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={wp(70)}
                height={hp(32)}
                borderRadius={hp(18)}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ))}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: wp(25),
          paddingBottom: hp(40),
          paddingTop: hp(10),
          backgroundColor: 'transparent',
        }}>
        <SkeletonPlaceholder backgroundColor={background} highlightColor={highlight}>
          <SkeletonPlaceholder.Item height={hp(55)} borderRadius={hp(28)} />
        </SkeletonPlaceholder>
      </View>
    </View>
  );
};

export default SuggestedEmployeeSkeleton;
