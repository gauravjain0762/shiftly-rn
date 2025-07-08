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
import CoHome from '../screens/company/home/CoHome';
import CoJob from '../screens/company/job/CoJob';
import CoPost from '../screens/company/post/CoPost';
import CoActivity from '../screens/company/activity/CoActivity';
import CompanyProfile from '../screens/company/profile/CompanyProfile';
import CoProfile from '../screens/company/profile/CoProfile';

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
            case SCREENS.CoHome:
              iconName = isFocused ? IMAGES.home_on : IMAGES.home_off;
              break;
            case SCREENS.CoJob:
              iconName = isFocused ? IMAGES.Jobs_on : IMAGES.Jobs_off;
              break;
            case SCREENS.CoPost:
              iconName = isFocused ? IMAGES.postFill : IMAGES.postFill;
              break;

            case SCREENS.CoActivity:
              iconName = isFocused ? IMAGES.Activity_on : IMAGES.Activity_off;
              break;
            case SCREENS.CoProfile:
              iconName = isFocused ? IMAGES.user_on : IMAGES.user_off;
              break;
            default:
              iconName = IMAGES.user;
          }

          let labelName;
          switch (route.name) {
            case SCREENS.CoHome:
              labelName = 'Home';
              break;
            case SCREENS.CoJob:
              labelName = 'Jobs';
              break;
            case SCREENS.CoPost:
              labelName = 'Post';
              break;
            case SCREENS.CoActivity:
              labelName = 'Activity';
              break;
            case SCREENS.CoProfile:
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
              {route.name == SCREENS.CoPost ? (
                <FastImage
                  source={iconName}
                  defaultSource={iconName}
                  style={styles.carImage}
                  resizeMode="contain"
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
    </View>
  );
};

// Main App with Tab Navigation
export default function CoTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={SCREENS.CoHome}
      tabBar={(props: any) => <CustomTabBar {...props} />}>
      <Tab.Screen name={SCREENS.CoHome} component={CoHome} />
      <Tab.Screen name={SCREENS.CoJob} component={CoJob} />
      <Tab.Screen name={SCREENS.CoPost} component={CoPost} />
      <Tab.Screen name={SCREENS.CoActivity} component={CoActivity} />
      <Tab.Screen name={SCREENS.CoProfile} component={CoProfile} />
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
    backgroundColor: colors._F3E1B7,
    // paddingVertical: Platform.OS == 'ios' ? 0 : hp(0),
    width: '100%',
    paddingVertical: 12,
    paddingBottom: 16,
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
