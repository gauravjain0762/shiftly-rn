import axios from "axios";
import { asyncKeys, clearAsync, getAsyncToken } from "./asyncStorage";
import { errorToast } from "./commonFunction";
import { dispatchAction } from "../redux/hooks";
import { IS_LOADING } from "../redux/actionTypes";
import { SCREENS } from "../navigation/screenNames";
import { API } from "./apiConstant";
import { navigationRef } from "../navigation/RootContainer";

interface makeAPIRequestProps {
  method?: any;
  url?: any;
  data?: any;
  headers?: any;
  params?: any;
}

export const makeAPIRequest = ({
  method,
  url,
  data,
  params,
  headers,
}: makeAPIRequestProps) =>
  new Promise((resolve, reject) => {
    const option = {
      method,
      baseURL: API.BASE_URL,
      url,
      data: data,
      headers: {
        Accept: "application/json",
        ...headers,
        "Content-Type": "application/json",
      },
      params: params,
    };
    axios(option)
      .then((response) => {
        console.log(
          "res--->",
          API.BASE_URL + url,
          data,
          params,
          response?.data
        );
        if (response.status === 200 || response.status === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        console.log(
          "err--->",
          API.BASE_URL + url,
          data,
          params,
          error,
          error?.response?.status
        );
        reject(error);
      });
  });

export const setAuthorization = async (authToken: any) => {
  // const token = await getAsyncToken();
  // if (authToken == "") {
  //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // } else {
  //   axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  // }
};

export const removeAuthorization = async () => {
  await clearAsync();
  delete axios.defaults.headers.common.Authorization;
};

export const handleSuccessRes = (
  res: any,
  request: any,
  dispatch: any,
  fun?: () => void
) => {
  if (res?.status === 200 || res?.status === 201) {
    dispatchAction(dispatch, IS_LOADING, false);
    if (res?.data.status) {
      if (fun) fun();
      if (request?.onSuccess) request?.onSuccess(res?.data);
    } else {
      if (request?.onFailure) request?.onFailure(res?.data);
      errorToast(res?.data?.message);
    }
  }
};

export const handleErrorRes = (
  err: any,
  request: any,
  dispatch: any,
  fun?: () => void
) => {
  if (err?.response?.status == 401) {
    dispatchAction(dispatch, IS_LOADING, false);
    // removeAuthorization();
    navigationRef.reset({
      index: 0,
      routes: [{ name: SCREENS.LoginScreen }],
    });
    errorToast("Please login again");
  } else {
    dispatchAction(dispatch, IS_LOADING, false);
    if (err?.response?.data?.errors) {
      errorToast(err?.response?.data?.message);
    } else if (err?.response?.data?.message) {
      errorToast(err?.response?.data?.message);
    } else if (err?.response?.data?.error) {
      errorToast(err?.response?.data?.error?.message);
    } else if (err?.message) {
      errorToast(err?.message);
    } else {
      errorToast("Something went wrong! Please try again");
    }
    if (fun) fun();
    if (request?.onFailure) request?.onFailure(err?.response);
  }
};
