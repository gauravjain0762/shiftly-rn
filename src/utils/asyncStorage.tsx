import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncKeys = {
  // clear in logout time
  token: '@token',
  user_info: '@user_info',
  location: '@location',
  language: '@language',
};

export const clearAsync = async () => {
  await AsyncStorage.multiRemove([asyncKeys.token, asyncKeys.user_info]);
};

export const setAsyncToken = async (token: string) => {
  await AsyncStorage.setItem(asyncKeys.token, JSON.stringify(token));
};

export const setAsyncLanguage = async (value: any) => {
  await AsyncStorage.setItem(asyncKeys.language, JSON.stringify(value));
};

export const getAsyncLanguage = async () => {
  const value = await AsyncStorage.getItem(asyncKeys.language);
  if (value) {
    return JSON.parse(value);
  } else {
    return 'en';
  }
};

export const getAsyncToken = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.token);
  if (token) {
    return JSON.parse(token);
  } else {
    return null;
  }
};

export const setAsyncUserInfo = async (user: any) => {
  await AsyncStorage.setItem(asyncKeys.user_info, JSON.stringify(user));
};

export const getAsyncUserInfo = async () => {
  const userInfo = await AsyncStorage.getItem(asyncKeys.user_info);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
};

export const setAsyncLocation = async (location: any) => {
  await AsyncStorage.setItem(asyncKeys.location, JSON.stringify(location));
};

export const getAsyncUserLocation = async () => {
  const location = await AsyncStorage.getItem(asyncKeys.location);
  if (location) {
    return JSON.parse(location);
  } else {
    return null;
  }
};
