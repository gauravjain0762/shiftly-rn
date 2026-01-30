import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { hp, wp } from '../../theme/fonts';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const SuggestedEmployeeSkeleton = () => {
  const employeePlaceholders = [1, 2, 3];

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Top Case Study Card Shimmer */}
        <ShimmerPlaceholder
          style={styles.caseStudyCard}
          shimmerColors={['#EBEBEB', '#F5F5F5', '#EBEBEB']}
        />

        {/* Info Rows Shimmer */}
        <View style={styles.infoRowContainer}>
          {[1, 2].map(index => (
            <View key={index} style={styles.infoRow}>
              <ShimmerPlaceholder style={styles.avatarCircle} />
              <ShimmerPlaceholder style={styles.infoLine} />
            </View>
          ))}
        </View>

        {/* Subtitle/Action Row Shimmer */}
        <View style={styles.actionRow}>
          <ShimmerPlaceholder style={styles.subtitleLine} />
          <ShimmerPlaceholder style={styles.smallBadge} />
        </View>

        {/* Employee List Shimmer */}
        {employeePlaceholders.map(index => (
          <View key={index} style={styles.employeeCard}>
            <ShimmerPlaceholder style={styles.employeeAvatar} />
            <View style={styles.employeeTextContent}>
              <ShimmerPlaceholder style={styles.employeeName} />
              <ShimmerPlaceholder style={styles.employeeRole} />
              <ShimmerPlaceholder style={styles.employeeLocation} />
            </View>
            <ShimmerPlaceholder style={styles.inviteButton} />
          </View>
        ))}
      </ScrollView>

      {/* Bottom Button Shimmer */}
      <View style={styles.bottomButtonContainer}>
        <ShimmerPlaceholder style={styles.bottomButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(25),
    paddingBottom: hp(100),
    gap: hp(20),
  },
  caseStudyCard: {
    width: '100%',
    height: hp(130),
    borderRadius: wp(18),
  },
  infoRowContainer: {
    gap: hp(10),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(10),
  },
  avatarCircle: {
    width: wp(60),
    height: hp(60),
    borderRadius: hp(30),
  },
  infoLine: {
    width: wp(220),
    height: hp(18),
    borderRadius: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitleLine: {
    width: wp(160),
    height: hp(20),
    borderRadius: 8,
  },
  smallBadge: {
    width: wp(120),
    height: hp(34),
    borderRadius: hp(20),
  },
  employeeCard: {
    width: '100%',
    borderRadius: wp(18),
    padding: hp(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: wp(15),
  },
  employeeAvatar: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(18),
  },
  employeeTextContent: {
    flex: 1,
    gap: hp(6),
  },
  employeeName: {
    width: '70%',
    height: hp(16),
    borderRadius: 6,
  },
  employeeRole: {
    width: '50%',
    height: hp(14),
    borderRadius: 6,
  },
  employeeLocation: {
    width: '40%',
    height: hp(12),
    borderRadius: 6,
  },
  inviteButton: {
    width: wp(70),
    height: hp(32),
    borderRadius: hp(18),
  },
  bottomButtonContainer: {
    paddingHorizontal: wp(25),
    paddingBottom: hp(40),
    paddingTop: hp(10),
    backgroundColor: 'transparent',
  },
  bottomButton: {
    width: '100%',
    height: hp(55),
    borderRadius: hp(28),
  },
});

export default SuggestedEmployeeSkeleton;
