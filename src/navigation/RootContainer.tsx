import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import {useAppDispatch} from '../redux/hooks';
import StackNavigator from './StackNavigator';
import {Loader} from '../component';
import {colors} from '../theme/colors';
import {useSelector} from 'react-redux';
import {selectIsLoading} from '../features/loaderSlice';
import {
  onBackgroundNotificationPress,
  onMessage,
  onNotificationPress,
  openAppNotificationEvent,
  requestNotificationUserPermission,
} from '../hooks/notificationHandler';

export const navigationRef = createNavigationContainerRef();

let DefaultThemeColor = {
  colors: {
    ...colors,
  },
  isDark: false,
};

const RootContainer: FC = () => {
  // const {isLoading} = useAppSelector(state => state.common);
  // const {isDarkTheme} = useAppSelector(state => state.common);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(setDarkTheme(theme == 'dark' ? true : false));
  // }, [theme]);

  useEffect(() => {
    requestNotificationUserPermission(dispatch);
    onMessage();
    onBackgroundNotificationPress();
    openAppNotificationEvent();
    onNotificationPress();
  }, [dispatch]);

  return (
    <NavigationContainer theme={DefaultThemeColor as any} ref={navigationRef}>
      {/* <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} /> */}
      <StackNavigator />
      {isLoading && <Loader />}
    </NavigationContainer>
  );
};
export default RootContainer;
