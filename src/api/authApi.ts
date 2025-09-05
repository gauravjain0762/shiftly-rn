import {createApi} from '@reduxjs/toolkit/query/react';
import {API, HTTP_METHOD} from '../utils/apiConstant';
import {axiosBaseQuery} from '../services/api/baseQuery';
import {setAsyncToken, setAsyncUserInfo} from '../utils/asyncStorage';
import {errorToast, navigateTo, resetNavigation} from '../utils/commonFunction';
import {
  setAuthToken,
  setBusinessType,
  setGuestLogin,
  setUserInfo,
} from '../features/authSlice';
import {SCREENS} from '../navigation/screenNames';
import {dashboardApi} from './dashboardApi';
import {navigationRef} from '../navigation/RootContainer';
import {CommonActions} from '@react-navigation/native';

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
              resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('company login Error', error);
        }
      },
    }),
    companyGoogleSignIn: builder.mutation<any, any>({
      query: credentials => ({
        url: API.companyGoogleSignIn,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          // console.log(data, 'datadatadatadatadata');

          if (data?.status) {
            console.log('data?.data?.authtoken >>>>>>', data?.data?.auth_token);
            // await setAsyncToken(data?.data?.auth_token);
            dispatch(setAuthToken(data.data?.auth_token));
            dispatch(setUserInfo(data.data?.company));
            await setAsyncUserInfo(data.data?.company);
            dispatch(setGuestLogin(false));
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('companyGoogleSignIn Error', error);
        }
      },
    }),
    companyAppleSignIn: builder.mutation<any, any>({
      query: credentials => ({
        url: API.companyAppleSignIn,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadatadatadatadata');

          if (data?.data?.company?.status) {
            await setAsyncToken(data?.data?.auth_token);
            dispatch(setAuthToken(data.data?.auth_token));
            dispatch(setUserInfo(data.data?.company));
            await setAsyncUserInfo(data.data?.company);
            dispatch(setGuestLogin(false));
            resetNavigation(SCREENS.CoStack, SCREENS.CoTabNavigator);
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('companyAppleSignIn Error', error);
        }
      },
    }),
    companySignUp: builder.mutation<any, any>({
      query: credentials => ({
        url: API.CompanySignup,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'multipart/form-data',
        },
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
    createJob: builder.mutation<any, any>({
      query: params => {
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
              // Invalidate company jobs so lists refetch instantly
              // dispatch(
              //   dashboardApi.util.invalidateTags([
              //     'GetJobs',
              //     'GetEmployeeJobs',
              //   ]),
              // );
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

    companyForgotPassword: builder.mutation<any, any>({
      query: credentials => ({
        url: API.companyForgotPassword,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
            await setAsyncToken(data?.data?.auth_token);
            dispatch(setAuthToken(data.data?.auth_token));
            dispatch(setUserInfo(data.data?.user));
            await setAsyncUserInfo(data.data?.user);
            dispatch(setGuestLogin(false));
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
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
              console.log('🔥🔥🔥 ~ onQueryStarted ~ data:', data);
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
    CompanyResendOTP: builder.mutation<any, any>({
      query: credentials => ({
        url: API.CompanyResendOTP,
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
              dispatch(setUserInfo(data.data?.user));
              await setAsyncUserInfo(data.data?.user);
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
    companyChangePassword: builder.mutation<any, any>({
      query: credentials => ({
        url: API.companyResetPassword,
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
              console.log('🔥🔥🔥 ~ onQueryStarted ~ data:', data);
              await setAsyncToken(data?.data?.auth_token);
              dispatch(setAuthToken(data.data?.auth_token));
              dispatch(setUserInfo(data.data?.user));
              await setAsyncUserInfo(data.data?.user);
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
    companyResetPassword: builder.mutation<any, any>({
      query: credentials => ({
        url: API.companyChangePassword,
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
              console.log('🔥🔥🔥 ~ onQueryStarted ~ data:', data);
              await setAsyncToken(data?.data?.auth_token);
              dispatch(setAuthToken(data.data?.auth_token));
              dispatch(setUserInfo(data.data?.user));
              await setAsyncUserInfo(data.data?.user);
              dispatch(setGuestLogin(false));
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('companyResetPassword Error', error);
        }
      },
    }),
    companyDeleteAccount: builder.mutation<any, any>({
      query: () => ({
        url: API.companyDeleteAccount,
        method: HTTP_METHOD.POST,
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
          console.log('companyDeleteAccount Error', error);
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
          console.log('CompanyLogout Error', error);
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
        // skipLoader: false,
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
              resetNavigation(SCREENS.EmployeeStack, SCREENS.TabNavigator);
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('Verify OTP Error', error);
        }
      },
    }),
    employeeGoogleSignIn: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeGoogleSignIn,
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
            await setAsyncToken(data?.data?.auth_token);
            dispatch(setAuthToken(data.data?.auth_token));
            dispatch(setUserInfo(data.data?.user));
            await setAsyncUserInfo(data.data?.user);
            dispatch(setGuestLogin(false));
            navigationRef.current?.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: SCREENS.EmployeeStack,
                    state: {
                      index: 0,
                      routes: [{name: SCREENS.TabNavigator}],
                    },
                  },
                ],
              }),
            );
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('employeeGoogleSignIn Error', error);
        }
      },
    }),
    employeeAppleSignIn: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeAppleSignIn,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadatadatadatadata');
          if (data?.data?.user?.status) {
            await setAsyncToken(data?.data?.auth_token);
            dispatch(setAuthToken(data.data?.auth_token));
            dispatch(setUserInfo(data.data?.user));
            await setAsyncUserInfo(data.data?.user);
            dispatch(setGuestLogin(false));
            navigationRef.current?.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: SCREENS.EmployeeStack,
                    state: {
                      index: 0,
                      routes: [{name: SCREENS.TabNavigator}],
                    },
                  },
                ],
              }),
            );
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('employeeAppleSignIn Error', error);
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
      query: credentials => {
        console.log('API.employeeOTPVerify', API.employeeOTPVerify);
        return {
          url: API.employeeOTPVerify,
          method: HTTP_METHOD.POST,
          data: credentials,
          skipLoader: false,
        };
      },
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
            if (data?.data?.auth_token) {
              await setAsyncToken(data?.data?.auth_token);
              dispatch(setAuthToken(data.data?.auth_token));
              dispatch(setUserInfo(data.data?.user));
              await setAsyncUserInfo(data.data?.user);
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
          console.log('employeeLogout Error', error);
        }
      },
    }),
    employeeChangePassword: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeChangePassword,
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
          console.log('employeeChangePassword Error', error);
        }
      },
    }),
    employeeDeleteAccount: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeDeleteAccount,
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
          console.log('employeeDeleteAccount Error', error);
        }
      },
    }),
    employeeForgotPassword: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeForgotPassword,
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
          console.log('employeeForgotPassword Error', error);
        }
      },
    }),
    employeeResendOTP: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeResendOTP,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: false,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('employeeResendOTP Error', error);
        }
      },
    }),
    employeeResetPassword: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeResetPassword,
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
              console.log('🔥🔥🔥 ~ onQueryStarted ~ data:', data);
              await setAsyncToken(data?.data?.auth_token);
              dispatch(setAuthToken(data.data?.auth_token));
              dispatch(setUserInfo(data.data?.user));
              await setAsyncUserInfo(data.data?.user);
              dispatch(setGuestLogin(false));
            }
          } else {
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('employeeResetPassword Error', error);
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
  useCreateJobMutation,
  useCompanyForgotPasswordMutation,
  useCompanyChangePasswordMutation,
  useCompanyResendOTPMutation,
  useCompanyResetPasswordMutation,
  useCompanyDeleteAccountMutation,
  useEmployeeChangePasswordMutation,
  useEmployeeDeleteAccountMutation,
  useEmployeeForgotPasswordMutation,
  useEmployeeOTPVerifyMutation,
  useEmployeeResendOTPMutation,
  useEmployeeResetPasswordMutation,
  useEmployeeSignUpMutation,
  useCompanyGoogleSignInMutation,
  useEmployeeGoogleSignInMutation,
  useCompanyAppleSignInMutation,
  useEmployeeAppleSignInMutation,
} = authApi;
