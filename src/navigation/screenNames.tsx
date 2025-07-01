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
  JobsScreen: 'JobsScreen',
  JobDetail: 'JobDetail',
  ApplyJob: 'ApplyJob',
  Messages: 'Messages',
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
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
