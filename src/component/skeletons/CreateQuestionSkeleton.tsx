import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { hp, wp } from '../../theme/fonts';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CreateQuestionSkeleton = () => {
  const questionPlaceholders = [1, 2, 3, 4];

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Top Header Card Shimmer */}
        <ShimmerPlaceholder
          style={styles.headerCard}
        />

        {/* Action Button/Search Shimmer */}
        <ShimmerPlaceholder
          style={styles.searchBar}
        />

        {/* Question List Shimmer */}
        {questionPlaceholders.map(index => (
          <ShimmerPlaceholder
            key={index}
            style={styles.questionCard}
          />
        ))}
      </ScrollView>

      {/* Bottom Action Button Shimmer */}
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
    paddingHorizontal: wp(35),
    paddingBottom: hp(40),
    gap: hp(20),
  },
  headerCard: {
    width: '100%',
    height: hp(130),
    borderRadius: wp(20),
  },
  searchBar: {
    width: '100%',
    height: hp(48),
    borderRadius: hp(30),
  },
  questionCard: {
    width: '100%',
    height: hp(70),
    borderRadius: wp(18),
  },
  bottomButtonContainer: {
    paddingHorizontal: wp(35),
    paddingBottom: hp(40),
    paddingTop: hp(10),
  },
  bottomButton: {
    width: '100%',
    height: hp(56),
    borderRadius: hp(28),
  },
});

export default CreateQuestionSkeleton;
