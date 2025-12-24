import React from 'react';
import {ScrollView, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

const CreateQuestionSkeleton = () => {
  const questionPlaceholders = [1, 2, 3, 4];
  const background = '#E0E0E0';
  const highlight = '#F5F5F5';

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(35),
          paddingBottom: hp(40),
          gap: hp(20),
        }}>
        <SkeletonPlaceholder backgroundColor={background} highlightColor={highlight}>
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={hp(130)}
            borderRadius={wp(20)}
          />
        </SkeletonPlaceholder>

        <SkeletonPlaceholder backgroundColor={background} highlightColor={highlight}>
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={hp(48)}
            borderRadius={hp(30)}
          />
        </SkeletonPlaceholder>

        {questionPlaceholders.map(index => (
          <SkeletonPlaceholder
            key={index}
            backgroundColor={background}
            highlightColor={highlight}>
            <SkeletonPlaceholder.Item
              width={'100%'}
              height={hp(70)}
              borderRadius={wp(18)}
            />
          </SkeletonPlaceholder>
        ))}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: wp(35),
          paddingBottom: hp(40),
          paddingTop: hp(10),
        }}>
        <SkeletonPlaceholder backgroundColor={background} highlightColor={highlight}>
          <SkeletonPlaceholder.Item height={hp(56)} borderRadius={hp(28)} />
        </SkeletonPlaceholder>
      </View>
    </View>
  );
};

export default CreateQuestionSkeleton;
