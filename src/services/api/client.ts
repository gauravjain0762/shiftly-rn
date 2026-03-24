import axios, {AxiosInstance} from 'axios';
import {API, API_TIMEOUT} from '../../utils/apiConstant';

declare module 'axios' {
  export interface AxiosRequestConfig<D = any> {
    skipLoader?: boolean;
  }
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API.BASE_URL,
  timeout: API_TIMEOUT.DEFAULT,
  headers: {
    Accept: 'application/json',
    Language: 'en',
    'Content-Type': 'application/json',
  },
});

// RN: default Content-Type: application/json overrides FormData. Clear it so platform sets multipart/form-data + boundary.
// axiosInstance.interceptors.request.use(config => {
//   if (config.data instanceof FormData) {
//     delete (config.headers as any)['Content-Type'];
//   }
//   return config;
// });

export interface ApiError {
  status: number;
  data: any;
  message: string;
}