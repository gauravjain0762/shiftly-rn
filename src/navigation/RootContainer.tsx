import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, {FC, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import StackNavigator from './StackNavigator';
import {StatusBar, useColorScheme} from 'react-native';
import {Loader} from '../component';
import {darkThemeColors, colors} from '../theme/colors';
import {setDarkTheme} from '../redux/service/CommonServices';
import useRole from '../hooks/useRole';
import Splash from '../screens/auth/Splash';
import {useSelector} from 'react-redux';
import {selectIsLoading} from '../features/loaderSlice';

export const navigationRef = createNavigationContainerRef();

let DarkThemeColors = {
  colors: {
    ...darkThemeColors,
  },
  isDark: true,
};

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
  const theme = useColorScheme();
  const dispatch = useAppDispatch();
  const {role, loading} = useRole();

  // useEffect(() => {
  //   dispatch(setDarkTheme(theme == 'dark' ? true : false));
  // }, [theme]);

  return (
    <NavigationContainer theme={DefaultThemeColor} ref={navigationRef}>
      {/* <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} /> */}
      <StackNavigator />
      {isLoading && <Loader />}
    </NavigationContainer>
  );
};
export default RootContainer;
