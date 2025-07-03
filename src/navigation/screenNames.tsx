export const SCREENS = {
  HomeScreen: 'HomeScreen',
  LoginScreen: 'LoginScreen',
  SplashScreen: 'SplashScreen',
  WelcomeScreen: 'WelcomeScreen',
  SelectRollScreen: 'SelectRollScreen',
  SignUp: 'SignUp',
  TabNavigator: 'TabNavigator',
  ProfileScreen: 'ProfileScreen',
  ActivityScreen: 'ActivityScreen',
  NotificationScreen: 'NotificationScreen',
  AccountScreen: 'AccountScreen',
  JobsScreen: 'JobsScreen',
  JobDetail: 'JobDetail',
  ApplyJob: 'ApplyJob',
  Messages: 'Messages',
  CreateProfileScreen: 'CreateProfileScreen',
  EditProfileScreen: 'EditProfileScreen',
  Chat: 'Chat',
  ViewProfileScreen: 'ViewProfileScreen',
};

export interface ScreenNames {
  [key: string]: string;
  HomeScreen: string;
  LoginScreen: string;
  SplashScreen: string;
  WelcomeScreen: string;
  SelectRollScreen: string;
  SignUp: string;
  TabNavigator: string;
  JobsScreen: string;
  ActivityScreen: string;
  ProfileScreen: string;
  JobDetail: string;
  ApplyJob: string;
  Messages: string;
  NotificationScreen: string;
  AccountScreen: string;
  CreateProfileScreen: string;
  EditProfileScreen: string;
  Chat: string;
  ViewProfileScreen: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
