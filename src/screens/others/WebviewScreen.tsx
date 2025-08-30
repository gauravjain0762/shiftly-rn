import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import WebViewRender from '../../component/common/WebViewRender';
import {BackHeader, LinearContainer} from '../../component';
import {useTranslation} from 'react-i18next';
import {hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';

const WebViewScreen = () => {
  const {t} = useTranslation();
  const {params} = useRoute<any>();
  const type = params?.type;
  return (
    <LinearContainer
      colors={
        type === 'employe' ? ['#0D468C', '#041326'] : ['#FFF8E6', '#F3E1B7']
      }>
      <BackHeader
        type={type}
        title={t(params?.title)}
        titleStyle={{
          right: '50%',
          alignSelf: 'center',
          color: type === 'employe' ? colors.white : colors.black,
        }}
        containerStyle={styles.header}
        isRight={false}
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
