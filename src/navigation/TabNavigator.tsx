/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {IMAGES} from '../assets/Images';
import FastImage from 'react-native-fast-image';
import {commonFontStyle, hp, wp} from '../theme/fonts';
import {colors} from '../theme/colors';
import {SCREENS} from './screenNames';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import JobsScreen from '../screens/employer/jobs/JobsScreen';
import HomeScreen from '../screens/employer/home/HomeScreen';
import AccountScreen from '../screens/employer/profile/AccountScreen';
import Messages from '../screens/employer/chat/Messages';
import PostsScreen from '../screens/employer/posts/PostsScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

const Tab = createBottomTabNavigator();

// Main App with Tab Navigation
export default function TabNavigator() {
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const isSingleDigitBadge = 2;
  userInfo?.unread_messages !== null &&
    Number(userInfo?.unread_messages) >= 0 &&
    Number(userInfo?.unread_messages) < 10;
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
              iconName = isFocused ? IMAGES.home_on : IMAGES.home;
              break;
            case SCREENS.PostsScreen:
              iconName = isFocused ? IMAGES.posts_on : IMAGES.posts;
              break;
            case SCREENS.JobsScreen:
              iconName = isFocused
                ? IMAGES.business_center_on
                : IMAGES.business_center;
              break;

            case SCREENS.ActivityScreen:
              iconName = isFocused ? IMAGES.chat_on : IMAGES.chat;
              break;
            case SCREENS.AccountScreen:
              iconName = isFocused ? IMAGES.profile_on : IMAGES.profile;
              break;
            default:
              iconName = IMAGES.user;
          }

          let labelName;
          switch (route.name) {
            case SCREENS.HomeScreen:
              labelName = 'Home';
              break;
            case SCREENS.PostsScreen:
              labelName = 'Posts';
              break;
            case SCREENS.JobsScreen:
              labelName = 'Jobs';
              break;

            case SCREENS.ActivityScreen:
              labelName = 'Messages';
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
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                navigation.navigate(route.name);
              }}
              style={[styles.tabButton]}>
              {SCREENS.ActivityScreen === route.name &&
                userInfo?.unread_messages > 0 && (
                  <View
                    style={[
                      styles.badge,
                      isSingleDigitBadge
                        ? styles.badgeSingleDigit
                        : styles.badgeMultiDigit,
                    ]}>
                    <Text style={styles.badgeText}>
                      {userInfo?.unread_messages}
                    </Text>
                  </View>
                )}
              <FastImage
                source={iconName}
                defaultSource={iconName}
                style={styles.image}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.labelText,
                  {
                    fontWeight: isFocused ? '600' : '400',
                  },
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
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={SCREENS.HomeScreen}
      tabBar={renderTabBar}>
      <Tab.Screen name={SCREENS.HomeScreen} component={HomeScreen} />
      <Tab.Screen name={SCREENS.PostsScreen} component={PostsScreen} />
      <Tab.Screen name={SCREENS.JobsScreen} component={JobsScreen} />
      <Tab.Screen name={SCREENS.ActivityScreen} component={Messages} />
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
    width: hp(30),
    height: hp(30),
    resizeMode: 'contain',
  },
  carImage: {
    width: hp(28),
    height: hp(28),
    resizeMode: 'contain',
  },
  labelText: {
    ...commonFontStyle(400, 13, colors._0B3970),
    marginTop: 10,
  },
  badge: {
    zIndex: 1,
    position: 'absolute',
    top: -2,
    right: -wp(4),
    backgroundColor: '#E53935',
    borderWidth: 1.5,
    borderColor: 'white',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 10,
  },
  badgeSingleDigit: {
    width: 16,
    height: 16,
    minWidth: 16,
    paddingHorizontal: 0,
    borderRadius: 8,
    right: 10,
    top: 0.5,
  },
  badgeMultiDigit: {
    minWidth: 20,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
  },
});
