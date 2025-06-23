import {createApi} from '@reduxjs/toolkit/query/react';
import {API, HTTP_METHOD} from '../utils/apiConstant';
import {axiosBaseQuery} from '../services/api/baseQuery';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['GetDashboard'],
  endpoints: builder => ({
    // Get Explore challenges
    getDashboard: builder.query<any, any>({
      query: () => ({
        url: API.EntityProfileSelectAll,
        method: HTTP_METHOD.POST,
      }),
      providesTags: ['GetDashboard']
    }),
  }),
});

export const {
  useGetDashboardQuery,
} = dashboardApi;
