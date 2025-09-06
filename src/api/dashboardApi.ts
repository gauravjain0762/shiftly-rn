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
    'GetCompanyProfile',
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
    'AddUpdateExperience',
    'AddRemoveFavourite',
    'GetFavouriteJob',
  ],
  endpoints: builder => ({
    //  -------   Company    --------
    // Get Explore challenges
    getCompanyJobs: builder.query<any, any>({
      query: params => ({
        url: API.getCompanyJobs,
        method: HTTP_METHOD.GET,
        params: params,
        skipLoader: true,
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
      providesTags: ['GetPost', 'GetCompanyProfile'],
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
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'multipart/form-data',
        },
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
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['CreateProfile', 'GetCompanyProfile'],
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
    getProfile: builder.query<any, void>({
      query: () => ({
        url: API.getCompanyProfile,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: ['GetCompanyProfile'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status && data.data?.company) {
            console.log(data, 'datadatadatadata');
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
          console.log('getSkills Error', error);
        }
      },
    }),
    editCompanyJob: builder.mutation<any, any>({
      query: credentials => ({
        url: API.editCompanyJob,
        method: HTTP_METHOD.POST,
        skipLoader: true,
        data: credentials,
      }),
      invalidatesTags: ['GetJobs'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('EditCompanyJob Error', error);
        }
      },
    }),
    getCompanyChats: builder.query<any, any>({
      query: () => ({
        url: API.getCompanyChats,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'getCompanyChats datadata');
        } catch (error) {
          console.log('getCompanyChats Error', error);
        }
      },
    }),
    getCompanyChatMessages: builder.query<any, any>({
      query: chatId => {
        const queryParam = chatId ? `?chat_id=${chatId}` : '';

        return {
          url: `${API.getCompanyChatMessages}${queryParam}`,
          method: HTTP_METHOD.GET,
          skipLoader: true,
        };
      },
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('getCompanyChatMessages Error', error);
        }
      },
    }),
    sendCompanyMessage: builder.mutation<any, any>({
      query: credentials => ({
        url: API.sendCompanyMessage,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: true,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'multipart/form-data',
        },
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('sendCompanyMessage Error', error);
        }
      },
    }),
    getCompanyNotification: builder.query<any, any>({
      query: params => ({
        url: API.getCompanyNotifications,
        method: HTTP_METHOD.GET,
        skipLoader: true,
        params: params,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('getCompanyNotification Error', error);
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
          console.log(data, '>>>>>>>> GetProfile datadata');
        } catch (error) {
          console.log('Guest Login Error', error);
        }
      },
    }),
    empUpdateProfile: builder.mutation<any, any>({
      query: credentials => {
        return {
          url: API.empUpdateProfile,
          method: HTTP_METHOD.POST,
          data: credentials,
          skipLoader: false,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Type': 'multipart/form-data',
          },
        };
      },
      invalidatesTags: ['GetProfile'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          if (data?.status) {
          } else {
            dispatch(setUserInfo(data?.data?.user));
            errorToast(data?.message);
          }
        } catch (error) {
          console.log('updateProfile Error', error);
        }
      },
    }),
    getEmployeeJobs: builder.query<any, any>({
      query: ({job_types, salary_from, salary_to, location, job_sectors}) => {
        const params = new URLSearchParams();

        if (job_types) params.append('job_types', job_types);
        if (salary_from) params.append('salary_from', salary_from.toString());
        if (salary_to) params.append('salary_to', salary_to.toString());
        if (location) params.append('location', location);
        if (job_sectors) params.append('job_sectors', job_sectors);

        return {
          url: `${API.getEmployeeJobs}?${params.toString()}`,
          method: HTTP_METHOD.GET,
          skipLoader: true,
        };
      },
      providesTags: ['GetEmployeeJobs'],
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
        return {
          url: API.employeeApplyJob,
          method: HTTP_METHOD.POST,
          skipLoader: false,
          data: credentials,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Type': 'multipart/form-data',
          },
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
    addUpdateExperience: builder.mutation<any, any>({
      query: credentials => ({
        url: API.addUpdateExperience,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: true,
      }),
      invalidatesTags: ['AddUpdateExperience'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('AddUpdateExperience Error', error);
        }
      },
    }),
    addRemoveFavourite: builder.mutation<any, any>({
      query: credentials => ({
        url: API.addRemoveFavourite,
        method: HTTP_METHOD.POST,
        data: credentials,
        skipLoader: true,
      }),
      invalidatesTags: ['AddRemoveFavourite'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('AddRemoveFavourite Error', error);
        }
      },
    }),
    getFavouritesJob: builder.query<any, any>({
      query: () => ({
        url: API.getFavouritesJob,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: ['GetFavouriteJob'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('GetFavouriteJob Error', error);
        }
      },
    }),
    addShortlistEmployee: builder.mutation<any, any>({
      query: credentials => ({
        url: API.addShortlistEmployee,
        method: HTTP_METHOD.POST,
        skipLoader: true,
        data: credentials,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('addShortlistEmployee Error', error);
        }
      },
    }),
    updateAboutMe: builder.mutation<any, any>({
      query: credentials => ({
        url: API.updateAboutMe,
        method: HTTP_METHOD.POST,
        skipLoader: true,
        data: credentials,
      }),
      invalidatesTags: ['GetProfile'],
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('updateAboutMe Error', error);
        }
      },
    }),
    getEducations: builder.query<any, any>({
      query: () => ({
        url: API.getEducations,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('getEducations Error', error);
        }
      },
    }),
    getExperiences: builder.query<any, any>({
      query: () => ({
        url: API.getExperiences,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('getExperiences Error', error);
        }
      },
    }),
    getFilterData: builder.query<any, any>({
      query: () => ({
        url: API.getFilterData,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
    }),
    employeeGetChats: builder.query<any, any>({
      query: () => ({
        url: API.employeeGetChats,
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('employeeGetChats Error', error);
        }
      },
    }),
    employeeGetChatMessages: builder.query<any, any>({
      query: chatId => {
        const queryParam = chatId ? `?chat_id=${chatId}` : '';
        return {
          url: `${API.employeeGetChatMessages}${queryParam}`,
          method: HTTP_METHOD.GET,
          skipLoader: true,
        };
      },
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('employeeGetChatMessages Error', error);
        }
      },
    }),
    employeeSendMessage: builder.mutation<any, any>({
      query: credentials => ({
        url: API.employeeSendMessage,
        method: HTTP_METHOD.POST,
        skipLoader: true,
        data: credentials,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'multipart/form-data',
        },
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log(data, 'datadata');
        } catch (error) {
          console.log('employeeSendMessage Error', error);
        }
      },
    }),
    getEmployeeNotifications: builder.query<any, any>({
      query: params => {
        return {
          url: API.getEmployeeNotifications,
          method: HTTP_METHOD.GET,
          params: params,
          skipLoader: true,
        };
      },
    }),
    removeEducation: builder.mutation<any, any>({
      query: params => {
        return {
          url: `${API.removeEducation}/${params}`,
          method: HTTP_METHOD.DELETE,
          skipLoader: true,
        };
      },
    }),
    removeExperience: builder.mutation<any, any>({
      query: params => {
        return {
          url: `${API.removeExperience}/${params}`,
          method: HTTP_METHOD.DELETE,
          skipLoader: true,
        };
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
  useAddUpdateExperienceMutation,
  useAddRemoveFavouriteMutation,
  useGetFavouritesJobQuery,
  useAddShortlistEmployeeMutation,
  useEditCompanyJobMutation,
  useUpdateAboutMeMutation,
  useGetEmployeeJobsQuery,
  useGetEducationsQuery,
  useGetExperiencesQuery,
  useEmployeeGetChatsQuery,
  useEmployeeGetChatMessagesQuery,
  useEmployeeSendMessageMutation,
  useGetCompanyChatsQuery,
  useGetCompanyChatMessagesQuery,
  useSendCompanyMessageMutation,
  useGetProfileQuery,
  useLazyEmployeeGetChatMessagesQuery,
  useLazyGetCompanyChatMessagesQuery,
  useGetCompanyNotificationQuery,
  useGetEmployeeNotificationsQuery,
  useRemoveEducationMutation,
  useRemoveExperienceMutation,
  useGetFilterDataQuery,
  useEmpUpdateProfileMutation,
} = dashboardApi;
