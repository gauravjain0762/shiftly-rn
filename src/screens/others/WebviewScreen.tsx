import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BackHeader} from '../../component';
import {hp, wp} from '../../theme/fonts';
import {useTranslation} from 'react-i18next';

const WebviewScreen = () => {
  const {t} = useTranslation();
  const {params} = useRoute<any>();
  const URL = params?.link as {link: string | any} | any;
  const title = params?.title as string;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView style={{flex: 1}}>
      <BackHeader
        type="company"
        title={t(title)}
        titleStyle={{alignSelf: 'center', right: '20%'}}
        containerStyle={styles.header}
      />
      {isLoading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'large'} />
        </View>
      )}
      <WebView
        source={URL ? {uri: URL} : {uri: 'https://google.com/'}}
        style={styles.main}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
        onLoadEnd={() => {
          setIsLoading(false);
        }}
      />
    </SafeAreaView>
  );
};

export default WebviewScreen;

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
