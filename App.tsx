import { StyleSheet, Text, View, SafeAreaView, Animated, Easing } from 'react-native';
import React, { useRef } from 'react';
import { Provider } from 'react-redux';
// import store from './src/redux';
import Toast from 'react-native-toast-message';
import { colors } from './src/theme/colors';
import { hp, commonFontStyle, SCREEN_WIDTH } from './src/theme/fonts';
import StackNavigator from './src/navigation/StackNavigator';
import RootContainer from './src/navigation/RootContainer';
import ToastComponent from './src/component/common/ToastComponent';
import {PersistGate} from 'redux-persist/integration/react';
import { persistor, store } from './src/store';
import "react-native-get-random-values"

type Props = {};

const App = (props: Props) => {
  
  const lineAnim = useRef(new Animated.Value(1)).current;

  const startLineAnimation = () => {
    // Reset the animation value to 1 before starting it
    lineAnim.setValue(1);

    Animated.timing(lineAnim, {
      toValue: 0,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false, // width anim can't use native driver
    }).start();
  };

  const toastConfig = {
    success: ({text1, ...rest}: any) => (
      <ToastComponent type="success" text1={text1} lineAnim={lineAnim} />
    ),
    error: ({text1, ...rest}: any) => (
      <ToastComponent type="error" text1={text1} lineAnim={lineAnim} />
    ),
  };

  return (
    <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
      <View style={{ flex: 1 }}>
        <RootContainer />
        <Toast
            config={toastConfig}
            position="bottom"
            topOffset={0}
            visibilityTime={3000}
            onShow={() => {
              startLineAnimation(); // Reset and trigger the animation
            }}
          />
      </View>
      </PersistGate>
      </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  toastStyle: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: SCREEN_WIDTH,
  },
  textStyleToastSuccess: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: SCREEN_WIDTH,
  },
  textStyleToast: {
    ...commonFontStyle(500, 14, colors.white),
    textAlign: 'center'
  },
});
