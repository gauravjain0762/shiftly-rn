import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BackHeader, HomeHeader, LinearContainer} from '../../../component';
import {wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';

const SuggestedEmployee = () => {
  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <View style={styles.header}>
        <BackHeader
          RightIconStyle={{tintColor: colors._0B3970}}
          type="company"
          title={'Suggested Employee'}
        />
      </View>
    </LinearContainer>
  );
};

export default SuggestedEmployee;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(25),
  },
});
