/* eslint-disable react/no-unstable-nested-components */
import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppDispatch } from '../redux/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import HomeScreen from '../screens/employer/home/HomeScreen';
import { colors } from '../theme/colors';
import { ScreenNames, SCREENS } from './screenNames';
import SplashScreen from '../screens/auth/Splash';
import EmployeeWelcomeScreen from '../screens/auth/EmployeeWelcomeScreen';
import CompanyWelcomeScreen from '../screens/auth/CompanyWelcomeScreen';
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
import CoSignUp from '../screens/company/auth/CoSignUp';
import CreateAccount from '../screens/company/auth/CreateAccount';
import CompanyProfile from '../screens/company/profile/CompanyProfile';
import ViewCompanyProfile from '../screens/company/profile/ViewCompanyProfile';
import CoTabNavigator from './CoTabNavigator';
import CoMessage from '../screens/company/chat/CoMessage';
import CoChat from '../screens/company/chat/CoChat';
import CoNotification from '../screens/company/notification/CoNotification';
import PostJob from '../screens/company/job/PostJob';
import SuggestedEmployee from '../screens/company/job/SuggestedEmployee';
import ForgotPassword from '../screens/company/auth/ForgotPassword';
import CoMyProfile from '../screens/company/profile/CoMyProfile';
import ChangePassword from '../screens/company/auth/ChangePassword';
import CoPost from '../screens/company/post/CoPost';
import CreatePost from '../screens/company/post/CreatePost';
import CoHome from '../screens/company/home/CoHome';
import CoJobDetails from '../screens/company/job/JobDetails';
import CoPostJobLocationScreen from '../screens/company/location/CoPostJobLocationScreen';
import CoProfileLocationScreen from '../screens/company/location/CoProfileLocationScreen';
import CoEditMyProfile from '../screens/company/auth/CoEditMyProfile';
import EmpChangePassword from '../screens/employer/auth/EmpChangePassword';
import EmpForgotPassword from '../screens/employer/auth/EmpForgotPassword';
import WebviewScreen from '../screens/others/WebviewScreen';
import AttachmentViewerScreen from '../screens/others/AttachmentViewerScreen';
import ProfileScreen from '../screens/employer/profile/ProfileScreen';
import EditAccountScreen from '../screens/employer/profile/EditAccount';
import SearchJob from '../screens/employer/jobs/SearchJob';
import FavoriteJobList from '../screens/employer/jobs/FavoriteJobList';
import CreateQuestion from '../screens/company/job/CreateQuestion';
import JobPreview from '../screens/company/job/JobPreview';
import PreviewPost from '../screens/company/post/PreviewPost';
import EmpLocation from '../component/employe/EmpLocation';
import JobInvitationScreen from '../screens/employer/jobs/JobInvitationScreen';
import EmployeeProfile from '../screens/company/job/EmployeeProfile';
import InterviewStatus from '../screens/company/job/InterviewStatus';
import MyJobs from '../screens/employer/jobs/MyJobs';
import CompletedInterviews from '../screens/company/job/CompletedInterviews';
import ActivityScreen from '../screens/employer/activity/ActivityScreen';
import useRole from '../hooks/useRole'; // Keep useRole as it's used in StackNavigator

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
const RootStack = createStackNavigator<any>();
const EmpStack = createStackNavigator<any>();
const CmpStack = createStackNavigator<any>();

const EmployeeStack = () => {
  const authToken = useSelector((state: RootState) => state.auth?.authToken);
  const isAuthenticated = !!authToken;

  const initialRouteName = isAuthenticated
    ? SCREENS.TabNavigator
    : SCREENS.LoginScreen;

  return (
    <EmpStack.Navigator initialRouteName={initialRouteName}>
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.TabNavigator}
        component={TabNavigator}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.LoginScreen}
        component={LoginScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.HomeScreen}
        component={HomeScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.SignUp}
        component={SignUp}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.JobDetail}
        component={JobDetail}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.ApplyJob}
        component={ApplyJob}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.Messages}
        component={Messages}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.NotificationScreen}
        component={NotificationScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.AccountScreen}
        component={AccountScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CreateProfileScreen}
        component={CreateProfileScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.Chat}
        component={Chat}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.ViewProfileScreen}
        component={ViewProfileScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.EmpChangePassword}
        component={EmpChangePassword}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.EmpForgotPassword}
        component={EmpForgotPassword}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.ProfileScreen}
        component={ProfileScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.EditAccount}
        component={EditAccountScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.SearchJob}
        component={SearchJob}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.FavoriteJobList}
        component={FavoriteJobList}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.EmpLocation}
        component={EmpLocation}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.JobInvitationScreen}
        component={JobInvitationScreen}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CompanyProfile}
        component={CompanyProfile}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.ViewCompanyProfile}
        component={ViewCompanyProfile}
      />
      <EmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.MyJobs}
        component={MyJobs}
      />
    </EmpStack.Navigator>
  );
};

const CoStack = () => {
  const authToken = useSelector((state: RootState) => state.auth?.authToken);
  const isAuthenticated = !!authToken;

  const initialRouteName = isAuthenticated
    ? SCREENS.CoTabNavigator
    : SCREENS.CoLogin;

  return (
    <CmpStack.Navigator initialRouteName={initialRouteName}>
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoTabNavigator}
        component={CoTabNavigator}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoLogin}
        component={CoLogin}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoSignUp}
        component={CoSignUp}
      />

      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CreateAccount}
        component={CreateAccount}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CompanyProfile}
        component={CompanyProfile}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoMessage}
        component={CoMessage}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoChat}
        component={CoChat}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoNotification}
        component={CoNotification}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.PostJob}
        component={PostJob}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoMyProfile}
        component={CoMyProfile}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.ForgotPassword}
        component={ForgotPassword}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.ChangePassword}
        component={ChangePassword}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoPost}
        component={CoPost}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CreatePost}
        component={CreatePost}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoHome}
        component={CoHome}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoEditMyProfile}
        component={CoEditMyProfile}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.SuggestedEmployee}
        component={SuggestedEmployee}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoJobDetails}
        component={CoJobDetails}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.JobDetail}
        component={JobDetail}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CreateQuestion}
        component={CreateQuestion}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.JobPreview}
        component={JobPreview}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.PreviewPost}
        component={PreviewPost}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.InterviewStatus}
        component={InterviewStatus}
      />
      <CmpStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CompletedInterviews}
        component={CompletedInterviews}
      />
    </CmpStack.Navigator>
  );
};

const StackNavigator: FC = () => {
  const dispatch = useAppDispatch();
  const { role } = useRole();
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
  //       let err = `FCm token get error${ error } `;
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

  return (
    <RootStack.Navigator
      initialRouteName={SCREENS.SplashScreen}
      screenOptions={{ headerShown: false }}>
      <RootStack.Screen name={SCREENS.SplashScreen} component={SplashScreen} />
      <RootStack.Screen
        name={SCREENS.CreateProfileScreen}
        component={CreateProfileScreen}
      />
      <RootStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CreateQuestion}
        component={CreateQuestion}
      />
      <RootStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.EmployeeProfile}
        component={EmployeeProfile}
      />
      <RootStack.Screen
        name={SCREENS.SelectRollScreen}
        component={SelectRollScreen}
      />
      <RootStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.EmployeeWelcomeScreen}
        component={EmployeeWelcomeScreen}
      />
      <RootStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CompanyWelcomeScreen}
        component={CompanyWelcomeScreen}
      />
      <RootStack.Screen name={SCREENS.EmployeeStack} component={EmployeeStack} />
      <RootStack.Screen name={SCREENS.CoStack} component={CoStack} />
      <RootStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoPostJobLocationScreen}
        component={CoPostJobLocationScreen}
      />
      <RootStack.Screen
        options={({ navigation }) => ({ headerShown: false })}
        name={SCREENS.CoProfileLocationScreen}
        component={CoProfileLocationScreen}
      />
      <RootStack.Screen name={SCREENS.WebviewScreen} component={WebviewScreen} />
      <RootStack.Screen
        name={SCREENS.AttachmentViewerScreen}
        component={AttachmentViewerScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};
export default StackNavigator;
