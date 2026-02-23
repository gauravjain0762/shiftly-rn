/* eslint-disable react/no-unstable-nested-components */
import {View, Animated, Easing, LogBox} from 'react-native';
import React, {useRef} from 'react';
import {Provider} from 'react-redux';
import {KeyboardProvider} from 'react-native-keyboard-controller';
// import store from './src/redux';
import Toast from 'react-native-toast-message';
import RootContainer from './src/navigation/RootContainer';
import ToastComponent from './src/component/common/ToastComponent';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/store';
import 'react-native-get-random-values';

type Props = {};
LogBox.ignoreAllLogs();

const App = ({}: Props) => {
  const lineAnim = useRef(new Animated.Value(1)).current;

  const startLineAnimation = () => {
    // Reset the animation value to 1 before starting it
    lineAnim.setValue(1);

    Animated.timing(lineAnim, {
      toValue: 0,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false, // width anim can't use native driver
    }).start();
  };

  const toastConfig = {
    success: ({text1}: any) => (
      <ToastComponent type="success" text1={text1} lineAnim={lineAnim} />
    ),
    error: ({text1}: any) => (
      <ToastComponent type="error" text1={text1} lineAnim={lineAnim} />
    ),
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <KeyboardProvider>
          <View style={{flex: 1}}>
            <RootContainer />
            <Toast
              config={toastConfig}
              position="bottom"
              topOffset={0}
              visibilityTime={2000}
              onShow={() => {
                startLineAnimation();
              }}
            />
          </View>
        </KeyboardProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
