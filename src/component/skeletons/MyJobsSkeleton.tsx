import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { hp, wp } from '../../theme/fonts';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MyJobsSkeleton = () => {
  const shimmerColors = ['#E1E9EE', '#F8FAFB', '#E1E9EE'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShimmerPlaceholder
            style={styles.backIcon}
            shimmerColors={shimmerColors}
          />
          <ShimmerPlaceholder
            style={styles.headerTitle}
            shimmerColors={shimmerColors}
          />
        </View>
        <View style={styles.headerRight}>
          <ShimmerPlaceholder
            style={styles.postJobButton}
            shimmerColors={shimmerColors}
          />
          <ShimmerPlaceholder
            style={styles.filterIcon}
            shimmerColors={shimmerColors}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {[1, 2, 3, 4].map((_, idx) => (
          <View key={`skeleton-${idx}`} style={styles.jobCard}>
            <View style={styles.jobCardTop}>
              <View style={styles.locationContainer}>
                <ShimmerPlaceholder
                  style={styles.locationLine1}
                  shimmerColors={shimmerColors}
                />
                <ShimmerPlaceholder
                  style={styles.locationLine2}
                  shimmerColors={shimmerColors}
                />
              </View>
              <ShimmerPlaceholder
                style={styles.shareIcon}
                shimmerColors={shimmerColors}
              />
            </View>

            <ShimmerPlaceholder
              style={styles.jobTitle}
              shimmerColors={shimmerColors}
            />

            <ShimmerPlaceholder
              style={styles.jobDescription}
              shimmerColors={shimmerColors}
            />

            <View style={styles.jobCardBottom}>
              <ShimmerPlaceholder
                style={styles.jobTypeTag}
                shimmerColors={shimmerColors}
              />
              <ShimmerPlaceholder
                style={styles.postedTime}
                shimmerColors={shimmerColors}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyJobsSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: hp(16),
    paddingTop: hp(20),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(24),
    height: hp(24),
    borderRadius: 4,
    marginRight: wp(12),
  },
  headerTitle: {
    width: wp(100),
    height: hp(24),
    borderRadius: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postJobButton: {
    width: wp(100),
    height: hp(36),
    borderRadius: hp(18),
    marginRight: wp(12),
  },
  filterIcon: {
    width: wp(24),
    height: hp(24),
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(20),
    paddingBottom: hp(20),
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(12),
    padding: hp(16),
    marginBottom: hp(16),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  jobCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(12),
  },
  locationContainer: {
    flex: 1,
    marginRight: wp(12),
  },
  locationLine1: {
    width: '90%',
    height: hp(14),
    borderRadius: 4,
    marginBottom: hp(4),
  },
  locationLine2: {
    width: '70%',
    height: hp(14),
    borderRadius: 4,
  },
  shareIcon: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
  },
  jobTitle: {
    width: wp(180),
    height: hp(22),
    borderRadius: 4,
    marginBottom: hp(8),
  },
  jobDescription: {
    width: wp(140),
    height: hp(16),
    borderRadius: 4,
    marginBottom: hp(12),
  },
  jobCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTypeTag: {
    width: wp(80),
    height: hp(24),
    borderRadius: hp(12),
  },
  postedTime: {
    width: wp(120),
    height: hp(14),
    borderRadius: 4,
  },
});
