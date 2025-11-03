/* eslint-disable react/no-unstable-nested-components */
import React, {FC, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useAppDispatch} from '../redux/hooks';
import {colors} from '../theme/colors';
import {Text} from 'react-native';
import HomeScreen from '../screens/employer/home/HomeScreen';
import {ScreenNames, SCREENS} from './screenNames';
import SplashScreen from '../screens/auth/Splash';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SelectRollScreen from '../screens/auth/SelectRollScreen';
import LoginScreen from '../screens/employer/auth/LoginScreen';
import SignUp from '../screens/employer/auth/SignUp';
import TabNavigator from './TabNavigator';
import JobDetail from '../screens/employer/jobs/JobDetail';
import ApplyJob from '../screens/employer/jobs/ApplyJob';
import Messages from '../screens/employer/chat/Messages';
import NotificationScreen from '../screens/employer/notification/NotificationScreen';
import AccountScreen from '../screens/employer/profile/AccountScreen';
import CreateProfileScreen from '../screens/employer/profile/CreateProfileScreen';
import Chat from '../screens/employer/chat/Chat';
import ViewProfileScreen from '../screens/employer/profile/ViewProfileScreen';
import CoLogin from '../screens/company/auth/CoLogin';
import useRole from '../hooks/useRole';
import CoSignUp from '../screens/company/auth/CoSignUp';
import CreateAccount from '../screens/company/auth/CreateAccount';
import CompanyProfile from '../screens/company/profile/CompanyProfile';
import CoTabNavigator from './CoTabNavigator';
import CoMessage from '../screens/company/chat/CoMessage';
import CoChat from '../screens/company/chat/CoChat';
import CoNotification from '../screens/company/notification/CoNotification';
import SuggestedEmployee from '../screens/company/job/SuggestedEmployee';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import PostJob from '../screens/company/job/PostJob';
import ForgotPassword from '../screens/company/auth/ForgotPassword';
import CoMyProfile from '../screens/company/profile/CoMyProfile';
import ChangePassword from '../screens/company/auth/ChangePassword';
import CoPost from '../screens/company/post/CoPost';
import CoHome from '../screens/company/home/CoHome';
import CoJobDetails from '../screens/company/job/JobDetails';
import LocationScreen from '../component/common/LocationScreen';
import CoEditMyProfile from '../screens/company/auth/CoEditMyProfile';
import EmpChangePassword from '../screens/employer/auth/EmpChangePassword';
import EmpForgotPassword from '../screens/employer/auth/EmpForgotPassword';
import WebviewScreen from '../screens/others/WebviewScreen';
import ProfileScreen from '../screens/employer/profile/ProfileScreen';
import CoProfile from '../screens/company/profile/CoProfile';
import EditAccountScreen from '../screens/employer/profile/EditAccount';
import SearchJob from '../screens/employer/jobs/SearchJob';
import FavoriteJobList from '../screens/employer/jobs/FavoriteJobList';

export type RootStackParamList = {
  HomeScreen: undefined;
};
const headerStyleTransparent = {
  headerStyle: {
    backgroundColor: colors.white,
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitleStyle: {
    // ...commonFontStyle(i18n.language, 500, 19, colors.black),
  },
  headerTitleAlign: 'center',
  // ...TransitionPresets.SlideFromRightIOS,
};
const Stack = createStackNavigator<ScreenNames>();

const StackNavigator: FC = () => {
  const dispatch = useAppDispatch();
  const {role} = useRole();
  const authToken = useSelector((state: RootState) => state.auth?.authToken);

  const isAuthenticated = !!authToken;

  // useEffect(() => {
  //   messaging().setAutoInitEnabled(true);
  //   setNotification();
  // }, []);
  // const setNotification = async () => {
  //   let authStatus = await firebase.messaging().hasPermission();

  //   if (authStatus !== firebase.messaging.AuthorizationStatus.AUTHORIZED) {
  //     requestPermission();
  //   }

  //   if (authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED) {
  //     getToken();
  //   }
  // };
  // const requestPermission = () => {
  //   messaging()
  //     .requestPermission({
  //       alert: true,
  //       announcement: false,
  //       badge: true,
  //       carPlay: true,
  //       provisional: false,
  //       sound: true,
  //     })
  //     .then(() => {
  //       getToken();
  //     })
  //     .catch(error => {
  //       console.log('error', error);
  //     });
  // };
  // const getToken = async () => {
  //   messaging()
  //     .getToken()
  //     .then(fcmToken => {
  //       if (fcmToken) {
  //         console.log('fcm--', fcmToken);
  //         dispatchAction(dispatch, SET_FCM_TOKEN, fcmToken);
  //       } else {
  //         console.log('[FCMService] User does not have a device token');
  //       }
  //     })
  //     .catch(error => {
  //       let err = `FCm token get error${error}`;
  //       console.log(err);
  //     });
  // };
  //   const checkNotification = (remoteMessage: any) => {};
  // useEffect(() => {
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     if (remoteMessage) {
  //       console.log(
  //         'Notification caused app to open from background state:',
  //         remoteMessage.notification,
  //       );
  //       checkNotification(remoteMessage);
  //     }
  //   });
  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       console.log('getInitialNotification', remoteMessage);
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit state:',
  //           remoteMessage.notification,
  //         );
  //       }
  //       checkNotification(remoteMessage);
  //     });
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Message handled in the background!', remoteMessage);
  //     checkNotification(remoteMessage);
  //   });
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('A new FCM message arrived!', remoteMessage);
  //     checkNotification(remoteMessage);
  //     onDisplayNotification(remoteMessage);
  //   });
  //   return unsubscribe;
  // }, []);
  // async function onDisplayNotification(message: any) {
  //   // Request permissions (required for iOS)
  //   await notifee.requestPermission();

  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //     importance: AndroidImportance.HIGH,
  //   });
  //   notifee.displayNotification({
  //     title: message.notification.title,
  //     body: message.notification.body,
  //     android: {
  //       channelId,
  //       smallIcon: 'ic_stat_name',
  //       sound: 'noti.mp3',
  //     },
  //     ios: {
  //       sound: 'noti.wav',
  //     },
  //   });
  // }
  const EmployeeStack = () => {
    const initialRoute = isAuthenticated
      ? SCREENS.TabNavigator
      : SCREENS.LoginScreen;

    return (
      <Stack.Navigator initialRouteName={initialRoute}>
        {/* Employer */}

        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.TabNavigator}
          component={TabNavigator}
        />

        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.LoginScreen}
          component={LoginScreen}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.HomeScreen}
          component={HomeScreen}
        />

        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.SignUp}
          component={SignUp}
        />

        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.JobDetail}
          component={JobDetail}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.ApplyJob}
          component={ApplyJob}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.Messages}
          component={Messages}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.NotificationScreen}
          component={NotificationScreen}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.AccountScreen}
          component={AccountScreen}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CreateProfileScreen}
          component={CreateProfileScreen}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.Chat}
          component={Chat}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.ViewProfileScreen}
          component={ViewProfileScreen}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.EmpChangePassword}
          component={EmpChangePassword}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.EmpForgotPassword}
          component={EmpForgotPassword}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.ProfileScreen}
          component={ProfileScreen}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.EditAccount}
          component={EditAccountScreen}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.SearchJob}
          component={SearchJob}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.FavoriteJobList}
          component={FavoriteJobList}
        />
      </Stack.Navigator>
    );
  };

  const CoStack = () => {
    const initialRoute = isAuthenticated
      ? SCREENS.CoTabNavigator
      : SCREENS.CoLogin;

    return (
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoTabNavigator}
          component={CoTabNavigator}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoLogin}
          component={CoLogin}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoSignUp}
          component={CoSignUp}
        />

        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CreateAccount}
          component={CreateAccount}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CompanyProfile}
          component={CompanyProfile}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoMessage}
          component={CoMessage}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoChat}
          component={CoChat}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoNotification}
          component={CoNotification}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.SuggestedEmployee}
          component={SuggestedEmployee}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.PostJob}
          component={PostJob}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoMyProfile}
          component={CoMyProfile}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.ForgotPassword}
          component={ForgotPassword}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.ChangePassword}
          component={ChangePassword}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoPost}
          component={CoPost}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoHome}
          component={CoHome}
        />
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name={SCREENS.CoEditMyProfile}
          component={CoEditMyProfile}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Stack.Navigator
      initialRouteName={SCREENS.SplashScreen}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={SCREENS.SplashScreen} component={SplashScreen} />
      <Stack.Screen
        name={SCREENS.CreateProfileScreen}
        component={CreateProfileScreen}
      />
      <Stack.Screen name={SCREENS.CoJobDetails} component={CoJobDetails} />
      <Stack.Screen name={SCREENS.CoChat} component={CoChat} />
      <Stack.Screen
        name={SCREENS.SelectRollScreen}
        component={SelectRollScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({headerShown: false})}
        name={SCREENS.WelcomeScreen}
        component={WelcomeScreen}
      />
      <Stack.Screen name={SCREENS.EmployeeStack} component={EmployeeStack} />
      <Stack.Screen name={SCREENS.CoStack} component={CoStack} />
      <Stack.Screen name={SCREENS.LocationScreen} component={LocationScreen} />
      <Stack.Screen name={SCREENS.WebviewScreen} component={WebviewScreen} />
      <Stack.Screen
        options={({navigation}) => ({headerShown: false})}
        name={SCREENS.CoMessage}
        component={CoMessage}
      />
      <Stack.Screen
        options={({navigation}) => ({headerShown: false})}
        name={SCREENS.PostJob}
        component={PostJob}
      />
    </Stack.Navigator>
  );
};
export default StackNavigator;
