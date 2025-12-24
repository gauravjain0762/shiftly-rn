/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IMAGES} from '../assets/Images';
import FastImage from 'react-native-fast-image';
import {commonFontStyle, hp, wp} from '../theme/fonts';
import {colors} from '../theme/colors';
import {SCREENS} from './screenNames';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import JobsScreen from '../screens/employer/jobs/JobsScreen';
import HomeScreen from '../screens/employer/home/HomeScreen';
import ActivityScreen from '../screens/employer/activity/ActivityScreen';
import AccountScreen from '../screens/employer/profile/AccountScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({state, navigation}: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {paddingBottom: insets.bottom || hp(10)},
      ]}>
        {state.routes.map((route: any, index: any) => {
          const isFocused = state.index === index;

          let iconName;
          switch (route.name) {
            case SCREENS.HomeScreen:
              iconName = isFocused ? IMAGES.home_on : IMAGES.home_off;
              break;
            case SCREENS.JobsScreen:
              iconName = isFocused ? IMAGES.Jobs_on : IMAGES.Jobs_off;
              break;

            case SCREENS.ActivityScreen:
              iconName = isFocused ? IMAGES.Activity_on : IMAGES.Activity_off;
              break;
            case SCREENS.AccountScreen:
              iconName = isFocused ? IMAGES.user_on : IMAGES.user_off;
              break;
            default:
              iconName = IMAGES.user;
          }

          let labelName;
          switch (route.name) {
            case SCREENS.HomeScreen:
              labelName = 'Home';
              break;
            case SCREENS.JobsScreen:
              labelName = 'Jobs';
              break;

            case SCREENS.ActivityScreen:
              labelName = 'Activity';
              break;
            case SCREENS.AccountScreen:
              labelName = 'Profile';
              break;
            default:
              labelName = IMAGES.user;
          }

          return (
            <TouchableOpacity
              key={route.name}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.tabButton]}>
              {route.name == SCREENS.ActivityScreen ? (
                <FastImage
                  source={iconName}
                  defaultSource={iconName}
                  style={styles.carImage}
                  resizeMode="contain"
                  tintColor={isFocused ? colors._0B3970 : '#4A4A4AA8'}
                />
              ) : (
                <FastImage
                  source={iconName}
                  defaultSource={iconName}
                  style={styles.image}
                  resizeMode="contain"
                  tintColor={isFocused ? colors._0B3970 : '#4A4A4AA8'}
                />
              )}
              <Text
                style={[
                  styles.labelText,
                  {color: isFocused ? colors._0B3970 : '#4A4A4AA8'},
                ]}>
                {labelName}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

// Main App with Tab Navigation
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={SCREENS.HomeScreen}
      tabBar={(props: any) => <CustomTabBar {...props} />}>
      <Tab.Screen name={SCREENS.HomeScreen} component={HomeScreen} />
      <Tab.Screen name={SCREENS.JobsScreen} component={JobsScreen} />
      <Tab.Screen name={SCREENS.ActivityScreen} component={ActivityScreen} />
      <Tab.Screen name={SCREENS.AccountScreen} component={AccountScreen} />
    </Tab.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarContainer: {
    borderTopWidth: 1,
    paddingTop: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors._F3E1B7,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tabButton: {
    width: wp(65),
    height: hp(65),
    borderRadius: 60,
    // backgroundColor: colors._181818,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: hp(28),
    height: hp(28),
    resizeMode: 'contain',
  },
  carImage: {
    width: hp(28),
    height: hp(28),
    resizeMode: 'contain',
  },
  labelText: {
    ...commonFontStyle(400, 13, '#727D8A'),
    marginTop: 10,
  },
});
