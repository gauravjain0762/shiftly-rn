// companySlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface JobFormState {
  title: string;
  job_type: {label: string; value: string};
  area: {label: string; value: string};
  duration: {label: string; value: string};
  job_sector: {label: string; value: string};
  startDate: {label: string; value: string};
  contract: {label: string; value: string};
  salary: {label: string; value: string};
  currency: {label: string; value: string};
  position: {label: string; value: string};
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
}

interface PostFormState {
  title: string;
  description: string;
  isPostModalVisible: boolean;
  uploadedImages: any[];
  isPostUploading: false;
}

interface CompanyState {
  coPostSteps: number;
  jobForm: JobFormState;
  coPostJobSteps: number;
  postForm: PostFormState;
}

const initialState: CompanyState = {
  coPostJobSteps: 0,
  coPostSteps: 0,
  jobForm: {
    title: '',
    job_type: {label: 'Full Time', value: 'Full Time'},
    area: {label: 'Dubai Marina', value: 'Dubai Marina'},
    duration: {label: '1 Month', value: '1 Month'},
    job_sector: {label: 'Hospitality', value: 'Hospitality'},
    startDate: {label: 'Immediately', value: 'Immediately'},
    contract: {label: 'Full-time experience', value: 'Full-time experience'},
    salary: {label: '2,000 - 5,000', value: '2,000 - 5,000'},
    currency: {label: 'AED', value: 'AED'},
    position: {label: '1', value: '1'},
    describe: '',
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
  },
  postForm: {
    title: '',
    description: '',
    isPostModalVisible: false,
    uploadedImages: [],
    isPostUploading: false,
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
      state.jobForm = {...state.jobForm, ...action.payload};
    },
    resetJobFormState: state => {
      state.jobForm = initialState.jobForm;
    },
    setCoPostSteps: (state, action: PayloadAction<number>) => {
      state.coPostSteps = action.payload;
    },
    setPostFormState: (
      state,
      action: PayloadAction<Partial<PostFormState>>,
    ) => {
      state.postForm = {...state.postForm, ...action.payload};
    },
    resetPostFormState: state => {
      state.postForm = initialState.postForm;
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
} = companySlice.actions;

export const selectCoPostJobSteps = (state: RootState) =>
  state.company.coPostJobSteps;
export const selectCoPostSteps = (state: RootState) =>
  state.company.coPostSteps;

export const selectJobForm = (state: RootState) => state.company.jobForm;
export const selectPostForm = (state: RootState) => state.company.postForm;

export default companySlice.reducer;
