// companySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface JobFormState {
  title: string;
  contract_type: { label: string; value: string };
  area: { label: string; value: string };
  duration: { label: string; value: string };
  job_sector: { label: string; value: string } | null;
  startDate: { label: string; value: string };
  contract: { label: string; value: string };
  salary: { label: string; value: string };
  currency: { label: string; value: string };
  position: { label: string; value: string };
  describe: string;
  selected: any[];
  jobSkills: string[];
  skillId: string[];
  requirements: string[];
  requirementText: string;
  isSelected: boolean;
  isSuccessModalVisible: boolean;
  isModalVisible: boolean;
  selectedEmp: [];
  canApply: boolean;
  editMode: boolean;
  job_id: string;
  invite_users: string[];
  expiry_date: any | string;
  education: { label: string; value: string } | null;
  experience: { label: string; value: string } | null;
  certification: { label: string; value: string } | null;
  language: { label: string; value: string } | null;
  other_requirements: { label: string; value: string } | null;
}

interface PostFormState {
  title: string;
  description: string;
  isPostModalVisible: boolean;
  uploadedImages: any[];
  isPostUploading: false;
  postEditMode: boolean;
  postId: string;
}

interface AuthState {
  email: string;
  password: string;
}

interface CompanyState {
  coPostSteps: number;
  jobForm: JobFormState;
  coPostJobSteps: number;
  postForm: PostFormState;
  filters: FiltersState;
  auth: AuthState;
}

interface FiltersState {
  job_types: string | null;
  salary_from: number;
  salary_to: number;
  location: string;
}

const initialState: CompanyState = {
  coPostJobSteps: 0,
  coPostSteps: 1,
  jobForm: {
    title: '',
    contract_type: { label: 'Full Time', value: 'Full Time' },
    area: { label: '', value: '' },
    duration: { label: '1 Month', value: '1 Month' },
    job_sector: null,
    startDate: { label: 'Immediately', value: 'Immediately' },
    contract: { label: '', value: '' },
    salary: { label: '2,000 - 5,000', value: '2,000 - 5,000' },
    currency: { label: 'AED', value: 'AED' },
    position: { label: '1', value: '1' },
    describe: __DEV__ ? 'Testing Testing' : '',
    selected: [],
    jobSkills: [],
    skillId: [],
    requirements: [],
    requirementText: '',
    isSelected: false,
    isSuccessModalVisible: false,
    isModalVisible: false,
    selectedEmp: [],
    canApply: true,
    editMode: false,
    job_id: '',
    invite_users: [],
    expiry_date: '',
    education: null,
    experience: null,
    certification: null,
    language: null,
    other_requirements: null,
  },
  postForm: {
    title: '',
    description: '',
    isPostModalVisible: false,
    uploadedImages: [],
    isPostUploading: false,
    postEditMode: false,
    postId: '',
  },
  filters: {
    job_types: null,
    salary_from: 1000,
    salary_to: 50000,
    location: '',
  },
  auth: {
    email: __DEV__ ? 'company@devicebee.com' : '',
    password: __DEV__ ? '123456' : '',
  },
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCoPostJobSteps: (state, action: PayloadAction<number>) => {
      state.coPostJobSteps = action.payload;
    },
    setJobFormState: (state, action: PayloadAction<Partial<JobFormState>>) => {
      state.jobForm = { ...state.jobForm, ...action.payload };
    },
    resetJobFormState: state => {
      state.jobForm = initialState.jobForm;
    },
    setCoPostSteps: (
      state,
      action: PayloadAction<number | ((prev: number) => number)>,
    ) => {
      if (typeof action.payload === 'function') {
        state.coPostSteps = (action.payload as (prev: number) => number)(
          state.coPostSteps,
        );
      } else {
        state.coPostSteps = action.payload;
      }
    },
    setPostFormState: (
      state,
      action: PayloadAction<Partial<PostFormState>>,
    ) => {
      state.postForm = { ...state.postForm, ...action.payload };
    },
    incrementCoPostSteps: state => {
      state.coPostSteps += 1;
    },
    resetPostFormState: state => {
      state.postForm = initialState.postForm;
    },
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: state => {
      state.filters = initialState.filters;
    },
    setAuthData: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.auth = {
        ...state.auth,
        ...action.payload,
      };
    },
  },
});

export const {
  setCoPostSteps,
  setJobFormState,
  setPostFormState,
  setCoPostJobSteps,
  resetJobFormState,
  resetPostFormState,
  incrementCoPostSteps,
  resetFilters,
  setAuthData,
  setFilters,
} = companySlice.actions;

export const selectCoPostJobSteps = (state: RootState) =>
  state.company.coPostJobSteps;
export const selectCoPostSteps = (state: RootState) =>
  state.company.coPostSteps;

export const selectJobForm = (state: RootState) => state.company.jobForm;
export const selectPostForm = (state: RootState) => state.company.postForm;

export default companySlice.reducer;
