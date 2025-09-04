// employeeSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

export interface EducationItem {
  education_id?: string;
  degree: string;
  university: string;
  startDate_month: string | null;
  startDate_year: string | null;
  endDate_month: string | null;
  endDate_year: string | null;
  country: string;
  province: string;
  isEditing?: boolean;
  isLocal?: boolean;
}

export interface ExperienceItem {
  experience_id?: string;
  preferred_position: string;
  title: string;
  company: string;
  department: string;
  country: string;
  job_start: {month: string; year: string};
  job_end: {month: string; year: string};
  jobStart_month: string;
  jobStart_year: string;
  jobEnd_month: string;
  jobEnd_year: string;
  still_working: boolean;
  experience_type: string;
  isEditing?: boolean;
  isLocal?: boolean;
}

export interface AboutMe {
  aboutMe: string;
  responsibilities: string;
  selectOne: string[];
  isOn: boolean;
  location: string;
  selectedLanguages: string[];
  languages: {name: string; level: string}[];
  proficiency: string;
  checkEnd: boolean;
  open_for_jobs: boolean;
}

interface AuthState {
  email: string;
  password: string;
}

export interface EmployeeState {
  activeStep: number;
  showModal: boolean;
  educationList: EducationItem[];
  originalEducation?: EducationItem;
  experienceList: ExperienceItem[];
  educationListEdit: EducationItem;
  experienceListEdit: ExperienceItem;
  aboutEdit: AboutMe;
  favoriteJobs: any[];
  isBannerLoaded: boolean;
  isSuccessModalVisible: boolean;
  auth: AuthState;
}

const initialState: EmployeeState = {
  activeStep: 1,
  showModal: false,
  educationList: [],
  experienceList: [],
  educationListEdit: {
    degree: '',
    university: '',
    startDate_month: '',
    endDate_month: '',
    endDate_year: '',
    startDate_year: '',
    country: '',
    province: '',
    education_id: '',
    isEditing: false,
    isLocal: true,
  },
  experienceListEdit: {
    experience_id: '',
    preferred_position: '',
    title: '',
    company: '',
    department: '',
    country: '',
    jobStart_month: '',
    jobStart_year: '',
    jobEnd_month: '',
    jobEnd_year: '',
    still_working: false,
    experience_type: '',
    isEditing: false,
    isLocal: true,
    job_start: {
      month: '',
      year: ''
    },
    job_end: {
      month: '',
      year: ''
    }
  },
  aboutEdit: {
    aboutMe: '',
    responsibilities: '',
    selectOne: [],
    isOn: false,
    location: '',
    selectedLanguages: [],
    languages: [
      {
        name: '',
        level: '',
      },
    ],
    proficiency: '',
    checkEnd: false,
    open_for_jobs: false,
  },
  favoriteJobs: [],
  isBannerLoaded: false,
  isSuccessModalVisible: false,
  auth: {
    email: __DEV__ ? 'bilal@devicebee.com' : '',
    password: __DEV__ ? '12345678' : '',
  },
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setEducationList: (state, action: PayloadAction<EducationItem[]>) => {
      state.educationList = action.payload;
    },
    addEducation: (state, action: PayloadAction<EducationItem>) => {
      state.educationList.push(action.payload);
    },
    removeEducation: (state, action: PayloadAction<number>) => {
      state.educationList = state.educationList.filter(
        (_, i) => i !== action.payload,
      );
    },
    setExperienceList: (state, action: PayloadAction<ExperienceItem[]>) => {
      state.experienceList = action.payload;
    },
    addExperience: (state, action: PayloadAction<ExperienceItem>) => {
      state.experienceList.push(action.payload);
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      state.experienceList = state.experienceList.filter(
        (_, i) => i !== action.payload,
      );
    },
    setEducationListEdit: (state, action: PayloadAction<EducationItem>) => {
      state.educationListEdit = action.payload;
    },
    setExperienceListEdit: (state, action: PayloadAction<ExperienceItem>) => {
      state.experienceListEdit = action.payload;
    },
    setAboutEdit: (state, action: PayloadAction<AboutMe>) => {
      state.aboutEdit = action.payload;
    },
    setFavoriteJobs: (state, action: PayloadAction<string[]>) => {
      state.favoriteJobs = action.payload;
    },
    setIsBannerLoaded: (state, action: PayloadAction<boolean>) => {
      state.isBannerLoaded = action.payload;
    },
    setIsSuccessModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isSuccessModalVisible = action.payload;
    },
    setAuthData: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.auth = {
        ...state.auth,
        ...action.payload,
      };
    },
    resetEmployeeState: () => initialState,
  },
});

export const {
  setActiveStep,
  setShowModal,
  setEducationList,
  addEducation,
  removeEducation,
  setExperienceList,
  addExperience,
  removeExperience,
  setEducationListEdit,
  setExperienceListEdit,
  setAboutEdit,
  resetEmployeeState,
  setFavoriteJobs,
  setIsBannerLoaded,
  setIsSuccessModalVisible,
  setAuthData,
} = employeeSlice.actions;

export const selectEmployeeState = (state: RootState): EmployeeState =>
  state.employee;

export default employeeSlice.reducer;
