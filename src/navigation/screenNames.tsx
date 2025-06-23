export const SCREENS = {
  HomeScreen: "HomeScreen",
  LoginScreen: "LoginScreen",
  SplashScreen: "SplashScreen",
  WelcomeScreen: "WelcomeScreen",
  SelectRollScreen: "SelectRollScreen",
};

export interface ScreenNames {
  [key: string]: string;
  HomeScreen: string;
  LoginScreen: string;
  SplashScreen: string;
  WelcomeScreen: string;
  SelectRollScreen: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
