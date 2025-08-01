import {createApi} from '@reduxjs/toolkit/query/react';
import {API, HTTP_METHOD} from '../utils/apiConstant';
import {axiosBaseQuery} from '../services/api/baseQuery';
import {errorToast} from '../utils/commonFunction';
import {setAsyncUserInfo} from '../utils/asyncStorage';
import {
  setBusinessType,
  setCompanyServices,
  setSkills,
  setUserInfo,
} from '../features/authSlice';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'GetDashboard',
    'CreatePost',
    'GetPost',
    'GetProfile',
    'CreateProfile',
    'GetJobs',
    'CreateJob',
    'GetSuggestedEmployees',
  ],
  endpoints: builder => ({
    //  -------   Company    --------
    // Get Explore challenges
    getCompanyJobs: builder.query<any, any>({
      query: () => ({
        url: API.getCompanyJobs,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ['GetJobs'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'GetJobs >>> datadata');
          // dispatch(setBusinessType(data?.data?.types));
        } catch (error) {
          console.log('GetJobs Error', error);
        }
      },
    }),
    getSuggestedEmployees: builder.query<any, any>({
      query: skills => {
        const queryParam = skills?.length ? `?skills=${skills.join(',')}` : '';
        return {
          url: `${API.getSuggestedEmployees}${queryParam}`,
          method: HTTP_METHOD.GET,
        };
      },
      providesTags: ['GetSuggestedEmployees'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'GetSuggestedEmployees >>> datadata');
        } catch (error) {
          console.log('GetJobs Error', error);
        }
      },
    }),
    getCompanyPosts: builder.query<any, any>({
      query: () => ({
        url: API.getCompanyPosts,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: ['GetPost'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
          // dispatch(setBusinessType(data?.data?.types));
        } catch (error) {
          console.log('getCompanyPosts Error', error);
        }
      },
    }),
    getBusinessTypes: builder.query<any, any>({
      query: () => ({
        url: API.getBusinessTypes,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: ['GetPost'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'Business Types');
          dispatch(setBusinessType(data?.data?.types));
        } catch (error) {
          console.log('Business Types Error', error);
        }
      },
    }),
    createCompanyPost: builder.mutation<any, any>({
      query: credentials => ({
        url: API.createCompanyPost,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['CreatePost', 'GetPost'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadatadatadatadata');
          if (data?.status) {
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
    createCompanyProfile: builder.mutation<any, any>({
      query: credentials => ({
        url: API.updateCompanyProfile,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['CreateProfile'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadatadatadatadata');
          if (data?.status) {
            dispatch(setUserInfo(data?.data?.user))
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Update Profile Error', error);
        }
      },
    }),
    getServices: builder.query<any, any>({
      query: () => ({
        url: API.getServices,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
          dispatch(setCompanyServices(data?.data?.services));
        } catch (error) {
          console.log('Guest Login Error', error);
        }
      },
    }),
    getSkills: builder.query<any, any>({
      query: () => ({
        url: API.getSkills,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
          dispatch(setSkills(data?.data?.skills));
        } catch (error) {
          console.log('Guest Login Error', error);
        }
      },
    }),

    //  -------   Employee   --------
    // getEmployeeDashboard
    getEmployeeProfile: builder.query<any, any>({
      query: () => ({
        url: API.getProfile,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: ['GetProfile'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
          dispatch(setUserInfo(data.data?.user));
          await setAsyncUserInfo(data.data?.user);
        } catch (error) {
          console.log('Guest Login Error', error);
        }
      },
    }),
  }),
});

export const {
  useGetCompanyJobsQuery,
  useGetCompanyPostsQuery,
  useCreateCompanyPostMutation,
  useGetEmployeeProfileQuery,
  useGetServicesQuery,
  useCreateCompanyProfileMutation,
  useGetSkillsQuery,
  useGetBusinessTypesQuery,
  useGetSuggestedEmployeesQuery,
} = dashboardApi;
