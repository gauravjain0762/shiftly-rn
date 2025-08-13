import React from 'react';
import {StyleSheet} from 'react-native';

import {useRoute} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';

const WebviewScreen = () => {
  const {params} = useRoute<any>();
  const URL = params?.link as {link: string | any} | any;

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        source={URL ? {uri: URL} : {uri: 'https://google.com/'}}
        style={styles.main}
      />
    </SafeAreaView>
  );
};

export default WebviewScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
