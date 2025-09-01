import type {BaseQueryFn} from '@reduxjs/toolkit/query/react';
import type {AxiosError, AxiosRequestConfig} from 'axios';
import {ApiError, axiosInstance} from './client';
import {
  incrementPendingRequests,
  decrementPendingRequests,
} from '../../features/loaderSlice';
import {resetNavigation} from '../../utils/commonFunction';
import {clearAsync} from '../../utils/asyncStorage';
import {logouts} from '../../features/authSlice';
import {persistor} from '../../store';

import {SCREENS} from '../../navigation/screenNames';

export interface BaseQueryArgs {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  skipLoader?: boolean;
}

export const axiosBaseQuery: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  ApiError
> = async (args, api) => {
  const {dispatch, getState} = api;
  const {url, method, data, params, headers, skipLoader} = args;

  if (!skipLoader) {
    dispatch(incrementPendingRequests());
  }

  const token = (getState() as any).auth.authToken
    ? (getState() as any).auth.authToken
    : null;
  const authHeaders = token ? {Authorization: `Bearer ${token}`} : {};

  // console.log('getState()', getState());
  // console.log('authHeaders', authHeaders);
  if (params) {
    console.log('params--', params);
  }
  console.log('url--', url);

  try {
    const result = await axiosInstance.request({
      url,
      method,
      data,
      params,
      headers: {
        ...headers,
        ...authHeaders,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    } as AxiosRequestConfig);

    return {data: result.data};
  } catch (rawError) {
    const error = rawError as AxiosError;
    console.log('error', rawError);
    if (error.response?.status === 401) {
      console.log('401 Unauthorized error detected. Redirecting to login...');

      setTimeout(() => {
        clearAsync();

        dispatch({type: 'RESET_STORE'});
        dispatch(logouts());
        persistor.purge();
        resetNavigation(SCREENS.LoginScreen);
      }, 0);

      return {
        error: {
          status: 401,
          data: error.response?.data,
          message: 'Authentication failed. Please log in again.',
        } as ApiError,
      };
    }
    // if (
    //   error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
    //   !url.includes(API_ENDPOINTS.AUTH.LOGIN) &&
    //   !url.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
    // ) {
    //   try {
    //     const refreshToken = (getState() as any).auth.refreshToken;

    //     if (!refreshToken) {
    //       throw new Error('No refresh token available');
    //     }

    //     // Use the singleton manager to refresh the token
    //     await tokenRefreshManager.refreshToken(refreshToken);

    //     // After token is refreshed, retry the original request
    //     const newToken = (getState() as any).auth.accessToken;
    //     if (!newToken) {
    //       throw new Error('No access token after refresh');
    //     }

    //     console.log('Retrying original request with new token');
    //     const retryResult = await axiosInstance.request({
    //       url,
    //       method,
    //       data,
    //       params,
    //       headers: {
    //         ...headers,
    //         Authorization: `Bearer ${newToken}`,
    //       },
    //     } as AxiosRequestConfig);

    //     return {data: retryResult.data};
    //   } catch (refreshError) {
    //     //console.error('Token refresh or retry failed:', refreshError);
    //     dispatch(clearToken());
    //     return {
    //       error: {
    //         status: 401,
    //         data: null,
    //         message: 'Authentication failed. Please log in again.',
    //       } as ApiError,
    //     };
    //   }
    // }

    return {
      error: {
        status: error.response?.status || 500,
        data: error.response?.data,
        message: error.message,
      } as ApiError,
    };
  } finally {
    if (!skipLoader) {
      dispatch(decrementPendingRequests());
    }
  }
};
