export const SCREENS = {
  //stack
  CoStack: 'CoStack',
  EmployeeStack: 'EmployeeStack',

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

  //company
  CoLogin: 'CoLogin',
  CoSignUp: 'CoSignUp',
  CreateAccount: 'CreateAccount',
  CompanyProfile: 'CompanyProfile',
  CoActivity: 'CoActivity',
  CoJob: 'CoJob',
  CoPost: 'CoPost',
  CoChat: 'CoChat',
  CoTabNavigator: 'CoTabNavigator',
  CoHome: 'CoHome',
  CoProfile: 'CoProfile',
  CoMessage: 'CoMessage',
  CoNotification: 'CoNotification',
  SuggestedEmployee: 'SuggestedEmployee',
  PostJob: 'PostJob',
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

  //company
  CoLogin: string;
  CoSignUp: string;
  CreateAccount: string;
  CompanyProfile: string;
  CoActivity: string;
  CoJob: string;
  CoPost: string;
  CoChat: string;
  CoTabNavigator: string;
  CoHome: string;
  CoProfile: string;
  CoMessage: string;
  CoNotification: string;
  SuggestedEmployee: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
