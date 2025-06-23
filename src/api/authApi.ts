import {createApi} from '@reduxjs/toolkit/query/react';
import {API, HTTP_METHOD} from '../utils/apiConstant';
import {axiosBaseQuery} from '../services/api/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Auth'],
  endpoints: builder => ({
    // UserInfoInsert
    userInfoInsert: builder.mutation<any, any>({
      query: credentials => ({
        url: API.UserInfoInsert,
        method: HTTP_METHOD.POST,
        data: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

     // EntityProfileInsert
     entityProfileInsert: builder.mutation<any, any>({
      query: credentials => ({
        url: API.EntityProfileInsert,
        method: HTTP_METHOD.POST,
        data: credentials
      }),
      invalidatesTags: ['Auth'],
    }),

  }),
});

export const {
  useUserInfoInsertMutation,
  useEntityProfileInsertMutation,
} = authApi;
