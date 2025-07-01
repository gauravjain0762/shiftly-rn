import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {LinearContainer} from '../../../component';
import {IMAGES} from '../../../assets/Images';
import {wp} from '../../../theme/fonts';
import {useRoute} from '@react-navigation/native';

const Chat = () => {
  const {params} = useRoute();
  const data = params?.data;
  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View>
        <Image source={IMAGES.backArrow} style={styles.back} />
        <View>
          <Text>{data?.title}</Text>
          <Text>{data?.title}</Text>
        </View>
      </View>
    </LinearContainer>
  );
};

export default Chat;

const styles = StyleSheet.create({
  back: {
    width: wp(21),
    height: wp(21),
    resizeMode: 'contain',
  },
});
