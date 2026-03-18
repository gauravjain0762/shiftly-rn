import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../../theme/fonts';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const shimmerColors = ['#E1E9EE', '#F8FAFB', '#E1E9EE'];

const JobCardsSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, idx) => (
        <View key={`job-card-skeleton-${idx}`} style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.leftBlock}>
              <ShimmerPlaceholder style={styles.line1} shimmerColors={shimmerColors} />
              <ShimmerPlaceholder style={styles.line2} shimmerColors={shimmerColors} />
            </View>
            <ShimmerPlaceholder style={styles.icon} shimmerColors={shimmerColors} />
          </View>

          <ShimmerPlaceholder style={styles.title} shimmerColors={shimmerColors} />
          <ShimmerPlaceholder style={styles.desc} shimmerColors={shimmerColors} />

          <View style={styles.bottomRow}>
            <ShimmerPlaceholder style={styles.tag} shimmerColors={shimmerColors} />
            <ShimmerPlaceholder style={styles.time} shimmerColors={shimmerColors} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default JobCardsSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(30),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(12),
    padding: hp(16),
    marginBottom: hp(16),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(12),
  },
  leftBlock: {
    flex: 1,
    marginRight: wp(12),
  },
  line1: {
    width: '90%',
    height: hp(14),
    borderRadius: 4,
    marginBottom: hp(6),
  },
  line2: {
    width: '70%',
    height: hp(14),
    borderRadius: 4,
  },
  icon: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
  },
  title: {
    width: wp(200),
    height: hp(22),
    borderRadius: 4,
    marginBottom: hp(10),
  },
  desc: {
    width: wp(160),
    height: hp(16),
    borderRadius: 4,
    marginBottom: hp(14),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    width: wp(80),
    height: hp(24),
    borderRadius: hp(12),
  },
  time: {
    width: wp(120),
    height: hp(14),
    borderRadius: 4,
  },
});

