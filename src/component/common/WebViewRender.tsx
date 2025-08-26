import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

const WebViewRender = ({url}:any) => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: url ?url :'https://www.google.com/' }} style={{ flex: 1 }} />
    </View>
  )
}

export default WebViewRender

const styles = StyleSheet.create({
    container:{
        flex:1,
        // marginHorizontal:wp(10)
    }
})