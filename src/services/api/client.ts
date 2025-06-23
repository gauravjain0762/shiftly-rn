import axios, {AxiosInstance, AxiosError} from 'axios';
import {API, API_TIMEOUT} from '../../utils/apiConstant';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API.BASE_URL,
  timeout: API_TIMEOUT.DEFAULT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export interface ApiError {
  status: number;
  data: any;
  message: string;
}

// Direct API call function with loading state management
export const apiCall = async <T = any>(config: {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  skipLoader?: boolean;
}): Promise<T> => {
  const {skipLoader, ...axiosConfig} = config;

  try {
    const response = await axiosInstance({
      ...axiosConfig,
      skipLoader,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const apiError: ApiError = {
      status: axiosError.response?.status || 500,
      data: axiosError.response?.data || null,
      message:
        (axiosError.response?.data as any)?.message ||
        axiosError.message ||
        'An unknown error occurred',
    };
    throw apiError;
  }
};

// export const hasActiveRequests = () =>
//   store.getState().loader.pendingRequests > 0;

export const createCancellableRequest = () => {
  const controller = new AbortController();
  const signal = controller.signal;

  return {
    signal,
    cancel: () => controller.abort(),
  };
};
