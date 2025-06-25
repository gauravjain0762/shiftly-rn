export const SCREENS = {
  HomeScreen: 'HomeScreen',
  LoginScreen: 'LoginScreen',
  SplashScreen: 'SplashScreen',
  WelcomeScreen: 'WelcomeScreen',
  SelectRollScreen: 'SelectRollScreen',
  SignUp: 'SignUp',
};

export interface ScreenNames {
  [key: string]: string;
  HomeScreen: string;
  LoginScreen: string;
  SplashScreen: string;
  WelcomeScreen: string;
  SelectRollScreen: string;
  SignUp: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
