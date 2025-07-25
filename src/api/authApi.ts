import {createApi} from '@reduxjs/toolkit/query/react';
import {API, HTTP_METHOD} from '../utils/apiConstant';
import {axiosBaseQuery} from '../services/api/baseQuery';
import {setAsyncToken, setAsyncUserInfo} from '../utils/asyncStorage';
import {errorToast, navigateTo} from '../utils/commonFunction';
import {
  setAuthToken,
  setBusinessType,
  setGuestLogin,
  setServices,
  setUserInfo,
} from '../features/authSlice';
import {SCREENS} from '../navigation/screenNames';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Auth', 'getBusiness'],
  endpoints: builder => ({
    //  -------   Company    --------
    companyLogin: builder.mutation<any, any>({
      query: credentials => ({
        url: API.CompanyLogin,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadatadatadatadata');
          if (data?.status) {
            if (data?.data?.auth_token) {
              await setAsyncToken(data?.data?.auth_token);
              dispatch(setAuthToken(data.data?.auth_token));
              dispatch(setUserInfo(data.data?.company));
              await setAsyncUserInfo(data.data?.company);
              dispatch(setGuestLogin(false));
              navigateTo(SCREENS.CoTabNavigator);
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
    companySignUp: builder.mutation<any, any>({
      query: credentials => ({
        url: API.CompanySignup,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
            if (data.data?.company) {
              dispatch(setUserInfo(data.data?.company));
              await setAsyncUserInfo(data.data?.company);
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
    getProfile: builder.query<any, void>({
      query: () => ({
        url: API.getCompanyProfile,
        method: HTTP_METHOD.GET,
        skipLoader: false,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status && data.data?.company) {
            dispatch(setUserInfo(data.data.company));
            await setAsyncUserInfo(data.data.company);
          } else {
            errorToast(data?.message || 'Something went wrong.');
          }
        } catch (error) {
          console.log('Get Profile Error', error);
        }
      },
    }),
    createJob: builder.mutation<any, any>({
      query: params => {
        console.log('🔥🔥🔥 ~ params:', params);
        return {
          url: API.createCompanyJob,
          method: HTTP_METHOD.POST,
          data: params,
          skipLoader: false,
        };
      },
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
            if (data?.data) {
              console.log('Create Job Data', data);
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.error('Create Job Error', error);
        }
      },
    }),
    // getServices: builder.query<any, void>({
    //   query: () => ({
    //     url: API.getServices,
    //     method: HTTP_METHOD.GET,
    //     skipLoader: false,
    //   }),
    //   async onQueryStarted(_, {dispatch, queryFulfilled}) {
    //     try {
    //       const {data} = await queryFulfilled;
    //       if (data?.status && data.data?.services) {
    //         dispatch(setServices(data?.data?.services));
    //       } else {
    //         errorToast(data?.message || 'Something went wrong.');
    //       }
    //     } catch (error) {
    //       console.log('Get Profile Error', error);
    //     }
    //   },
    // }),

    companyOTPVerify: builder.mutation<any, any>({
      query: credentials => ({
        url: API.companyOTPVerify,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
            if (data?.data?.auth_token) {
              await setAsyncToken(data?.data?.auth_token);
              dispatch(setAuthToken(data.data?.auth_token));
              dispatch(setUserInfo(data.data?.company));
              await setAsyncUserInfo(data.data?.company);
              dispatch(setGuestLogin(false));
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
    CompanyLogout: builder.mutation<any, any>({
      query: credentials => ({
        url: API.CompanyLogout,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
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
    getBusinessTypes: builder.query<any, any>({
      query: () => ({
        url: API.getBusinessTypes,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
          dispatch(setBusinessType(data?.data?.types));
        } catch (error) {
          console.log('Guest Login Error', error);
        }
      },
    }),

    //  -------   Employee   --------
    employeeLogin: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeLogin,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadatadatadatadata');
          if (data?.status) {
            if (data?.data?.auth_token) {
              await setAsyncToken(data?.data?.auth_token);
              dispatch(setAuthToken(data.data?.auth_token));
              dispatch(setUserInfo(data.data?.user));
              await setAsyncUserInfo(data.data?.user);
              dispatch(setGuestLogin(false));
              navigateTo(SCREENS.TabNavigator);
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
    employeeSignUp: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeSignup,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
            if (data.data?.company) {
              dispatch(setUserInfo(data.data?.company));
              await setAsyncUserInfo(data.data?.company);
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
    employeeOTPVerify: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeOTPVerify,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
            if (data?.data?.auth_token) {
              await setAsyncToken(data?.data?.auth_token);
              dispatch(setAuthToken(data.data?.auth_token));
              dispatch(setUserInfo(data.data?.company));
              await setAsyncUserInfo(data.data?.company);
              dispatch(setGuestLogin(false));
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
    employeeLogout: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeLogout,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
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
  }),
});

export const {
  useCompanyLoginMutation,
  useCompanyLogoutMutation,
  useGetBusinessTypesQuery,
  useCompanySignUpMutation,
  useCompanyOTPVerifyMutation,
  useEmployeeLoginMutation,
  useEmployeeLogoutMutation,
  useGetProfileQuery,
  useCreateJobMutation,
} = authApi;
