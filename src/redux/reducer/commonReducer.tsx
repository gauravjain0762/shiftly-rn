import {
  IS_LOADING,
  SET_APP_THEME,
  SET_FCM_TOKEN,
  USER_LOGOUT,
} from "../actionTypes";

const initialState = {
  isLoading: false,
  isDarkTheme: false,
  fcmToken: undefined,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case IS_LOADING: {
      return { ...state, isLoading: action.payload };
    }
    case SET_APP_THEME: {
      return { ...state, isDarkTheme: action.payload };
    }
    case SET_FCM_TOKEN: {
      return { ...state, fcmToken: action?.payload };
    }
    default:
      return state;
  }
}
