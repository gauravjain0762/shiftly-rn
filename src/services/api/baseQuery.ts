import type {BaseQueryFn} from '@reduxjs/toolkit/query/react';
import type {AxiosError, AxiosRequestConfig} from 'axios';
import {ApiError, axiosInstance} from './client';
import {
  incrementPendingRequests,
  decrementPendingRequests,
} from '../../features/loaderSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {resetNavigation} from '../../utils/commonFunction';
import {clearAsync} from '../../utils/asyncStorage';
import {logouts} from '../../features/authSlice';
import {persistor} from '../../store';

import {SCREENS} from '../../navigation/screenNames';
import {shouldHandle401, scheduleGuardReset} from '../../utils/redirect401Guard';

const ROLE_STORAGE_KEY = 'userRole';

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
  const baseUrl = (axiosInstance.defaults.baseURL || '').replace(/\/+$/, '');
  const requestPath = (url || '').startsWith('/') ? url : `/${url || ''}`;
  const fullUrl = `${baseUrl}${requestPath}`;

  const formatPayloadForLog = (payload: any) => {
    if (payload instanceof FormData) {
      return {
        type: 'FormData',
        parts: (payload as any)?._parts ?? 'unavailable',
      };
    }
    return payload;
  };

  if (!skipLoader) {
    dispatch(incrementPendingRequests());
  }

  const token = (getState() as any).auth.authToken
    ? (getState() as any).auth.authToken
    : null;
  const authHeaders = token ? {Authorization: `Bearer ${token}`} : {};

  console.log('API REQUEST', {
    method,
    url: fullUrl,
    path: url,
    params: params ?? null,
    data: formatPayloadForLog(data),
    authHeaders: authHeaders,
  });

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

    console.log('API RESPONSE', {
      method,
      url: fullUrl,
      status: result?.status,
      data: result?.data,
    });

    return {data: result.data};
  } catch (rawError) {
    const error = rawError as AxiosError;
    console.log('API ERROR', {
      method,
      url: fullUrl,
      status: error?.response?.status ?? 'NO_STATUS',
      message: error?.message,
      responseData: error?.response?.data ?? null,
      requestData: formatPayloadForLog(data),
      requestParams: params ?? null,
    });
    if (error.response?.status === 401) {
      if (shouldHandle401()) {
        console.log('401 Unauthorized error detected. Redirecting to login...');
        setTimeout(async () => {
          try {
            const role = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
            clearAsync();
            dispatch({type: 'RESET_STORE'});
            dispatch(logouts());
            persistor.purge();
            if (role === 'company') {
              resetNavigation(SCREENS.CoStack, SCREENS.CoLogin);
            } else {
              resetNavigation(SCREENS.EmployeeStack, SCREENS.LoginScreen);
            }
          } finally {
            scheduleGuardReset();
          }
        }, 0);
      }

      return {
        error: {
          status: 401,
          data: error.response?.data,
          message: 'Authentication failed. Please log in again.',
        } as ApiError,
      };
    }

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
