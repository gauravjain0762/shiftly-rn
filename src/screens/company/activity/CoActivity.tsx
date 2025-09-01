import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {LinearContainer} from '../../../component';
import BaseText from '../../../component/common/BaseText';

const CoActivity = () => {
  return (
    <LinearContainer
      colors={['#FFF8E6', '#F3E1B7']}
      containerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <BaseText>{'No Activity found'}</BaseText>
    </LinearContainer>
  );
};

export default CoActivity;

const styles = StyleSheet.create({});
