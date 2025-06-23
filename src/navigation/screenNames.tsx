export const SCREENS = {
  HomeScreen: "HomeScreen",
  LoginScreen: "LoginScreen",
  SplashScreen: "SplashScreen",
  WelcomeScreen: "WelcomeScreen",
};

export interface ScreenNames {
  [key: string]: string;
  HomeScreen: string;
  LoginScreen: string;
  SplashScreen: string;
  WelcomeScreen: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
