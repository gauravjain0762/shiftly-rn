// employeeSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

export interface EducationItem {
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
  country: string;
  province: string;
}

export interface ExperienceItem {
  preferred: string;
  title: string;
  company: string;
  department: string;
  country: string;
  month: string;
  year: string;
  checkEnd: boolean;
}

export interface AboutMe {
  aboutMe: string;
  responsibilities: string;
  selectOne: string[];
  isOn: boolean;
  location: string;
  selectedLanguages: string[];
  proficiency: string;
  checkEnd: boolean;
}

export interface EmployeeState {
  activeStep: number;
  showModal: boolean;
  educationList: EducationItem[];
  experienceList: ExperienceItem[];
  educationListEdit: EducationItem;
  experienceListEdit: ExperienceItem;
  aboutEdit: AboutMe;
}

const initialState: EmployeeState = {
  activeStep: 1,
  showModal: false,
  educationList: [],
  experienceList: [],
  educationListEdit: {
    degree: '',
    university: '',
    startDate: '',
    endDate: '',
    country: '',
    province: '',
  },
  experienceListEdit: {
    preferred: '',
    title: '',
    company: '',
    department: '',
    country: '',
    month: '',
    year: '',
    checkEnd: false,
  },
  aboutEdit: {
    aboutMe: '',
    responsibilities: '',
    selectOne: [],
    isOn: false,
    location: '',
    selectedLanguages: [],
    proficiency: '',
    checkEnd: false,
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
} = employeeSlice.actions;

export const selectEmployeeState = (state: RootState): EmployeeState =>
  state.employee;

export default employeeSlice.reducer;
