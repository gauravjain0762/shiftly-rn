import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { BackHeader, LinearContainer } from '../../../component';
import BaseText from '../../../component/common/BaseText';
import { hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';

const CoActivity = () => {
  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      <View style={styles.headerContainer}>
        <BackHeader
          title={'My Activity'}
          type="company"
          isRight={false}
          containerStyle={styles.header}
        />
      </View>
      <View style={styles.contentContainer}>
        <BaseText>{'No Activity found'}</BaseText>
      </View>
    </LinearContainer>
  );
};

export default CoActivity;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start',
    gap: wp(20),
    paddingTop: hp(18),
  },
  headerContainer: {
    paddingHorizontal: wp(22),
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: hp(25),
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
