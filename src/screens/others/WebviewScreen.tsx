import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import WebViewRender from '../../component/common/WebViewRender';
import {BackHeader, LinearContainer} from '../../component';
import {useTranslation} from 'react-i18next';
import {hp, wp} from '../../theme/fonts';

const WebViewScreen = () => {
  const {t} = useTranslation();
  const {params} = useRoute<any>();
  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <BackHeader
        type="company"
        title={t(params?.title)}
        titleStyle={{alignSelf: 'center', right: '20%'}}
        containerStyle={styles.header}
      />
      <View style={{flex: 1}}>
        <WebViewRender url={params?.link} />
      </View>
    </LinearContainer>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  header: {
    paddingTop: hp(24),
    marginBottom: hp(28),
    paddingHorizontal: wp(35),
  },
});
