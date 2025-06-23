import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import StackNavigator from './StackNavigator';
import {StatusBar, useColorScheme} from 'react-native';
import {Loader} from '../component';
import {darkThemeColors, colors} from '../theme/colors';
import {setDarkTheme} from '../redux/service/CommonServices';

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
  const theme = useColorScheme();
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(setDarkTheme(theme == 'dark' ? true : false));
  // }, [theme]);

  return (
    <NavigationContainer
      theme={DefaultThemeColor}
      ref={navigationRef}>
      {/* <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} /> */}
      <StackNavigator />
      {/* {isLoading && <Loader />} */}
    </NavigationContainer>
  );
};
export default RootContainer;
