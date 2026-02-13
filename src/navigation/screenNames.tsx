export const SCREENS = {
  //stack
  CoStack: 'CoStack',
  EmployeeStack: 'EmployeeStack',

  HomeScreen: 'HomeScreen',
  LoginScreen: 'LoginScreen',
  SplashScreen: 'SplashScreen',
  WelcomeScreen: 'WelcomeScreen',
  EmployeeWelcomeScreen: 'EmployeeWelcomeScreen',
  CompanyWelcomeScreen: 'CompanyWelcomeScreen',
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
  WebviewScreen: 'WebviewScreen',
  EditAccount: 'EditAccount',
  SearchJob: 'SearchJob',
  FavoriteJobList: 'FavoriteJobList',
  JobInvitationScreen: 'JobInvitationScreen',
  PostsScreen: 'PostsScreen',
  MyJobs: 'MyJobs',

  //company
  CoLogin: 'CoLogin',
  CoSignUp: 'CoSignUp',
  CreateAccount: 'CreateAccount',
  CompanyProfile: 'CompanyProfile',
  CoActivity: 'CoActivity',
  CoJob: 'CoJob',
  CoPost: 'CoPost',
  CreatePost: 'CreatePost',
  CoChat: 'CoChat',
  CoTabNavigator: 'CoTabNavigator',
  CoHome: 'CoHome',
  CoProfile: 'CoProfile',
  CoMessage: 'CoMessage',
  CoNotification: 'CoNotification',
  SuggestedEmployee: 'SuggestedEmployee',
  PostJob: 'PostJob',
  ForgotPassword: 'Forgot Password',
  CoMyProfile: 'CoMyProfile',
  ChangePassword: 'ChangePassword',
  CoJobDetails: 'CoJobDetails',
  CoPostJobLocationScreen: 'CoPostJobLocationScreen',
  CoProfileLocationScreen: 'CoProfileLocationScreen',
  CoEditMyProfile: 'CoEditMyProfile',
  CreateQuestion: 'CreateQuestion',
  JobPreview: 'JobPreview',
  PreviewPost: 'PreviewPost',
  EmpChangePassword: 'EmpChangePassword',
  EmpProfile: 'EmpProfile',
  EmpForgotPassword: 'EmpForgotPassword',
  EmpLocation: 'EmpLocation',
  EmployeeProfile: 'EmployeeProfile',
  InterviewStatus: 'InterviewStatus',
  ViewCompanyProfile: 'ViewCompanyProfile',
};

export interface ScreenNames {
  [key: string]: string;
  HomeScreen: string;
  LoginScreen: string;
  SplashScreen: string;
  WelcomeScreen: string;
  EmployeeWelcomeScreen: string;
  CompanyWelcomeScreen: string;
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
  EmpChangePassword: string;
  EmpProfile: string;
  EmpForgotPassword: string;
  EditAccount: string;
  SearchJob: string;
  PostsScreen: string;
  MyJobs: string;

  //company
  CoLogin: string;
  CoSignUp: string;
  CreateAccount: string;
  CompanyProfile: string;
  CoActivity: string;
  CoJob: string;
  CoPost: string;
  CreatePost: string;
  CoChat: string;
  CoTabNavigator: string;
  CoHome: string;
  CoProfile: string;
  CoMessage: string;
  CoNotification: string;
  SuggestedEmployee: string;
  CoMyProfile: string;
  ChangePassword: string;
  CoJobDetails: string;
  CoPostJobLocationScreen: string;
  CoProfileLocationScreen: string;
  CoEditMyProfile: string;
  CreateQuestion: string;
  EmployeeProfile: string;
  InterviewStatus: string;
  ViewCompanyProfile: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
