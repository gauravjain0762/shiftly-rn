import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import StackNavigator from './StackNavigator';
import { Loader } from '../component';
import { colors } from '../theme/colors';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '../features/loaderSlice';
import {
  onBackgroundNotificationPress,
  onMessage,
  onNotificationPress,
  openAppNotificationEvent,
  requestNotificationUserPermission,
} from '../hooks/notificationHandler';
import { Linking } from 'react-native';
import Splash from "react-native-splash-screen";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGetAppDataQuery } from '../api/dashboardApi';

export const navigationRef = createNavigationContainerRef();

let DefaultThemeColor = {
  colors: {
    ...colors,
  },
  isDark: false,
};

const RootContainer: FC = () => {
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useAppDispatch();

  // Fetch app data on app initialization - available in all screens and flows
  useGetAppDataQuery();

  useEffect(() => {
    requestNotificationUserPermission(dispatch);
    onMessage();
    onBackgroundNotificationPress();
    openAppNotificationEvent();
    onNotificationPress();
  }, [dispatch]);

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url !== null) {
        console.log('url---', url);
        let id = url.split('//')[1];
        if (id.length > 0) {
        }
      }
    });
  }, []);

  const linking = {
    prefixes: ['https://sky.devicebee.com', 'shiftly://'],
    config: {
      screens: {
        EmployeeStack: {
          screens: {
            JobDetail: 'job/:jobId',
          },
        },
      },
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer
        onReady={() => Splash.hide()}
        linking={linking}
        theme={DefaultThemeColor as any}
        ref={navigationRef}>
        {/* <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} /> */}
        <StackNavigator />
        {isLoading && <Loader />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default RootContainer;
