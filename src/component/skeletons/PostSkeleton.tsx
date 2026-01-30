import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { hp, wp } from '../../theme/fonts';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

type Props = {
  backgroundColor?: string;
  highlightColor?: string;
};

const PostSkeleton = (props: Props) => {
  const shimmerColors = ['#E1E9EE', '#F8FAFB', '#E1E9EE'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {[1, 2, 3, 4].map((_, idx) => (
        <View key={`post-skeleton-${idx}`} style={styles.postCard}>
          <View style={styles.header}>
            <ShimmerPlaceholder
              style={styles.avatar}
              shimmerColors={shimmerColors}
            />
            <View style={styles.headerText}>
              <ShimmerPlaceholder
                style={styles.name}
                shimmerColors={shimmerColors}
              />
              <ShimmerPlaceholder
                style={styles.time}
                shimmerColors={shimmerColors}
              />
            </View>
          </View>
          <ShimmerPlaceholder
            style={styles.contentBody}
            shimmerColors={shimmerColors}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postCard: {
    padding: hp(16),
    marginBottom: hp(12),
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  avatar: {
    width: hp(50),
    height: hp(50),
    borderRadius: hp(25),
  },
  headerText: {
    marginLeft: hp(12),
    gap: hp(6),
  },
  name: {
    width: wp(100),
    height: hp(16),
    borderRadius: 4,
  },
  time: {
    width: wp(150),
    height: hp(14),
    borderRadius: 4,
  },
  contentBody: {
    width: '100%',
    height: hp(350),
    borderRadius: hp(12),
    alignSelf: 'center',
  },
});

export default PostSkeleton;
