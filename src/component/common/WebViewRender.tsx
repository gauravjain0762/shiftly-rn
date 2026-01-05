import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

const WebViewRender = ({ url, onLoadEnd }: { url?: string; onLoadEnd?: any }) => {
  const injectedJavaScript = `
    (function() {
      const style = document.createElement('style');
      style.innerHTML = \`
        * {
          color: #0B3970 !important;
        }
        body {
          color: #0B3970 !important;
        }
        p, div, span, h1, h2, h3, h4, h5, h6, a, li, td, th {
          color: #0B3970 !important;
        }
      \`;
      document.head.appendChild(style);
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url ? url : 'https://www.google.com/' }}
        style={{ flex: 1 }}
        onLoadEnd={onLoadEnd}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        injectedJavaScript={injectedJavaScript}
        onError={(e) => console.log('WebView error:', e.nativeEvent)}
        onHttpError={(e) => console.log('HTTP error:', e.nativeEvent)}
      />
    </View>
  );
};

export default WebViewRender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal:wp(10)
  },
});
