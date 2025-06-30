/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IMAGES} from '../assets/Images';
import FastImage from 'react-native-fast-image';
import {colors} from '../theme/colors';
import {commonFontStyle, hp, wp} from '../theme/fonts';
import {SCREENS} from './screenNames';
import {useAppSelector} from '../redux/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import JobsScreen from '../screens/employer/jobs/JobsScreen';
import ProfileScreen from '../screens/employer/profile/ProfileScreen';
import HomeScreen from '../screens/employer/home/HomeScreen';
import ActivityScreen from '../screens/employer/activity/ActivityScreen';

const Tab = createBottomTabNavigator();

// Custom Tab Bar Component
const CustomTabBar = ({state, navigation}: any) => {
  return (
    <View>
      <View style={[styles.tabBarContainer]}>
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
            case SCREENS.ProfileScreen:
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
            case SCREENS.ProfileScreen:
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
                  tintColor={isFocused ? '#F4E2B8' : '#727D8A'}
                />
              ) : (
                <FastImage
                  source={iconName}
                  defaultSource={iconName}
                  style={styles.image}
                  resizeMode="contain"
                  tintColor={isFocused ? '#F4E2B8' : '#727D8A'}
                />
              )}
              <Text
                style={[
                  styles.labelText,
                  {color: isFocused ? '#F4E2B8' : '#727D8A'},
                ]}>
                {labelName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
      <Tab.Screen name={SCREENS.ProfileScreen} component={ProfileScreen} />
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
    flexDirection: 'row',
    gap: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: '#041326',
    // paddingVertical: Platform.OS == 'ios' ? 0 : hp(0),
    width: '100%',
    paddingVertical: 12,
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
    ...commonFontStyle(400, 10, '#727D8A'),
    marginTop: 10,
  },
});
