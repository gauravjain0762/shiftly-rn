import {createApi} from '@reduxjs/toolkit/query/react';
import {API, HTTP_METHOD} from '../utils/apiConstant';
import {axiosBaseQuery} from '../services/api/baseQuery';
import {errorToast} from '../utils/commonFunction';
import {setAsyncUserInfo} from '../utils/asyncStorage';
import {
  setBusinessType,
  setCompanyProfileAllData,
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
    'GetFacilities',
    'GetEmployeeJobs',
    'GetEmployeeJobDetails',
    'GetEmployeeSkills',
    'EmployeeApplyJob',
    'GetEmployeePost',
    'GetCompanyJobDetails',
    'AddUpdateEducation',
  ],
  endpoints: builder => ({
    //  -------   Company    --------
    // Get Explore challenges
    getCompanyJobs: builder.query<any, any>({
      query: params => ({
        url: API.getCompanyJobs,
        method: HTTP_METHOD.GET,
        params: params,
      }),
      providesTags: ['GetJobs'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'GetJobs >>> datadata');
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
    getFacilities: builder.query<any, any>({
      query: () => ({
        url: API.getFacilities,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: ['GetFacilities'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'getFacilities');
          // dispatch(setBusinessType(data?.data?.types));
        } catch (error) {
          console.log('getFacilities Error', error);
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
            dispatch(setCompanyProfileAllData(data?.data?.company));
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
    getCompanyJobDetails: builder.query<any, any>({
      query: job_id => {
        const jobId = job_id ? `?job_id=${job_id}` : '';

        return {
          url: `${API.getCompanyJobDetails}${jobId}`,
          method: HTTP_METHOD.GET,
          skipLoader: true,
        };
      },
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('getCompanyJobDetails Error', error);
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
    getEmployeeJobs: builder.query<
      any,
      {
        job_types?: string;
        salary_from?: number;
        salary_to?: number;
        location?: string;
      }
    >({
      query: ({job_types, salary_from, salary_to, location}) => {
        const params = new URLSearchParams();

        if (job_types) params.append('job_types', job_types);
        if (salary_from) params.append('salary_from', salary_from.toString());
        if (salary_to) params.append('salary_to', salary_to.toString());
        if (location) params.append('location', location);

        return {
          url: `${API.getEmployeeJobs}?${params.toString()}`,
          method: HTTP_METHOD.GET,
          skipLoader: true,
        };
      },
      providesTags: ['GetEmployeeJobs'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'GetEmployeeJobs datadata >>>>>>>');
        } catch (error) {
          console.log('Guest Login Error', error);
        }
      },
    }),
    getEmployeeJobDetails: builder.query<any, any>({
      query: job_id => {
        const queryParam = job_id ? `?job_id=${job_id}` : '';
        return {
          url: `${API.getEmployeeJobDetails}${queryParam}`,
          method: HTTP_METHOD.GET,
          skipLoader: true,
        };
      },
      providesTags: ['GetEmployeeJobDetails'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'GetEmployeeJobDetails datadata >>>>>>>');
        } catch (error) {
          console.log('Guest Login Error', error);
        }
      },
    }),
    getEmployeeSkills: builder.query<any, any>({
      query: () => {
        console.log('GET Employee Skills URL >>>>>>.:', API.getEmployeeSkills);
        return {
          url: API.getEmployeeSkills,
          method: HTTP_METHOD.GET,
          skipLoader: true,
          headers: {},
        };
      },
      providesTags: ['GetEmployeeSkills'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'getEmployeeSkills datadata >>>>>>>');
        } catch (error) {
          console.log('getEmployeeSkills Error', error);
        }
      },
    }),
    employeeApplyJob: builder.mutation<any, any>({
      query: credentials => {
        console.log('GET Employee Skills URL >>>>>>.:', API.getEmployeeSkills);
        return {
          url: API.employeeApplyJob,
          method: HTTP_METHOD.POST,
          skipLoader: true,
          data: credentials,
        };
      },
      invalidatesTags: ['EmployeeApplyJob'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'employeeApplyJob datadata >>>>>>>');
        } catch (error) {
          console.error('employeeApplyJob Error', error);
        }
      },
    }),
    getEmployeePosts: builder.query<any, any>({
      query: () => ({
        url: API.getEmployeePosts,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: ['GetEmployeePost'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('getEmployeePosts Error', error);
        }
      },
    }),
    addUpdateEducation: builder.mutation<any, any>({
      query: credentials => ({
        url: API.addUpdateEducation,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: true,
      }),
      invalidatesTags: ['AddUpdateEducation'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('AddUpdateEducation Error', error);
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
  useGetFacilitiesQuery,
  useLazyGetEmployeeJobsQuery,
  useGetEmployeeJobDetailsQuery,
  useGetEmployeeSkillsQuery,
  useEmployeeApplyJobMutation,
  useGetEmployeePostsQuery,
  useGetCompanyJobDetailsQuery,
  useAddUpdateEducationMutation,
} = dashboardApi;
