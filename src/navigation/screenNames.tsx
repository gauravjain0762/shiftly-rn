export const SCREENS = {
  HomeScreen: "HomeScreen",
  LoginScreen: "LoginScreen",
  SplashScreen: "SplashScreen",
};

export interface ScreenNames {
  [key: string]: string;
  HomeScreen: string;
  LoginScreen: string;
  SplashScreen: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
