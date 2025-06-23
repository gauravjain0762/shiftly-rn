import { ThunkAction } from "redux-thunk";
import { dispatchAction, RootState } from "../hooks";
import { AnyAction } from "redux";
import { IS_LOADING, SET_APP_THEME } from "../actionTypes";
import {
  handleErrorRes,
  handleSuccessRes,
  makeAPIRequest,
} from "../../utils/apiGlobal";
import { API, POST } from "../../utils/apiConstant";

export const setDarkTheme =
  (data: boolean): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    // AsyncStorage.setItem(asyncKeys.is_dark_theme, JSON.stringify(data));
    dispatch({
      type: SET_APP_THEME,
      payload: data,
    });
  };
