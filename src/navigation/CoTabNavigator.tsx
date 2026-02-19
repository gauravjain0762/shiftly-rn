/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { IMAGES } from '../assets/Images';
import FastImage from 'react-native-fast-image';
import { colors } from '../theme/colors';
import { commonFontStyle, hp, wp } from '../theme/fonts';
import { SCREENS } from './screenNames';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CoHome from '../screens/company/home/CoHome';
import CoJob from '../screens/company/job/CoJob';
import CoPost from '../screens/company/post/CoPost';
import CoProfile from '../screens/company/profile/CoProfile';
import CoMessage from '../screens/company/chat/CoMessage';

const Tab = createBottomTabNavigator();

// Custom Tab Bar Component
const CustomTabBar = ({ state, navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: insets.bottom || hp(10) },
      ]}>
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
            iconName = isFocused ? IMAGES.posts : IMAGES.posts;
            break;

          case SCREENS.CoActivity:
            iconName = isFocused ? IMAGES.chat2 : IMAGES.chat2;
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
            labelName = 'Posts';
            break;
          case SCREENS.CoActivity:
            labelName = 'Messages';
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
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              navigation.navigate(route.name);
            }}
            style={[styles.tabButton]}>
            <FastImage
              source={iconName}
              defaultSource={iconName}
              style={styles.image}
              resizeMode="contain"
              tintColor={isFocused ? colors._0B3970 : '#4A4A4AA8'}
            />
            <Text
              style={[
                styles.labelText,
                { color: isFocused ? colors._0B3970 : '#4A4A4AA8' },
              ]}>
              {labelName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const renderTabBar = (props: any) => <CustomTabBar {...props} />;

// Main App with Tab Navigation
export default function CoTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      initialRouteName={SCREENS.CoHome}
      tabBar={renderTabBar}>
      <Tab.Screen name={SCREENS.CoHome} component={CoHome} />
      <Tab.Screen name={SCREENS.CoJob} component={CoJob} />
      <Tab.Screen name={SCREENS.CoPost} component={CoPost} />
      <Tab.Screen name={SCREENS.CoActivity} component={CoMessage} />
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
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors._181818,
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
