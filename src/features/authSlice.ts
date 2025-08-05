import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';

interface AppState {
  isLoading: boolean;
  loginModal: boolean;
  guestLogin: boolean;
  getAppData?: Record<string, any>;
  language: string;
  fcmToken?: string | any;
  authToken?: string | any;
  userInfo?: Record<string, any>;
  businessType?: any[];
  companyRegisterForm?: any;
  companyRegistrationStep?: number;
  companyRegisterData?: any;
  registerSuccessModal?: boolean;
  companyProfileData?: any;
  companyServices?: any[];
  companyProfileAllData?: any[];
  services: any[];
  skills: any[];
  forgotPasswordSteps: number;
  changePasswordSteps: number;
}

const initialState: AppState = {
  isLoading: false,
  loginModal: false,
  getAppData: {},
  language: 'en',
  fcmToken: null,
  authToken: null,
  userInfo: {},
  guestLogin: false,
  businessType: [],
  companyRegisterForm: {},
  companyRegistrationStep: 1,
  companyRegisterData: {
    business_type_id: '',
    company_name: '',
    name: '',
    email: '',
    password: '',
    phone_code: '971',
    phone: '',
  },
  registerSuccessModal: false,
  companyProfileData: {
    website: '',
    company_size: '',
    address: '',
    lat: 0,
    lng: 0,
    about: '',
    mission: '',
    values: '',
    services: [],
    logo: {},
    cover_images: {},
  },
  companyServices: [],
  companyProfileAllData: [],
  services: [],
  skills: [],
  forgotPasswordSteps: 1,
  changePasswordSteps: 1,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLoginModal: (state, action: PayloadAction<boolean>) => {
      state.loginModal = action.payload;
    },
    setGuestLogin: (state, action: PayloadAction<boolean>) => {
      state.guestLogin = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string | undefined>) => {
      state.authToken = action.payload;
    },
    setFcmToken: (state, action: PayloadAction<string | undefined>) => {
      state.fcmToken = action.payload;
    },
    setLanguages: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setGetAppData: (state, action: PayloadAction<any>) => {
      state.getAppData = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    setBusinessType: (state, action: PayloadAction<any>) => {
      state.businessType = action.payload;
    },
    setCompanyRegisterForm: (state, action: PayloadAction<any>) => {
      state.companyRegisterForm = action.payload;
    },
    setCompanyRegistrationStep: (state, action: PayloadAction<number>) => {
      state.companyRegistrationStep = action.payload;
    },
    setCompanyRegisterData: (
      state,
      action: PayloadAction<Partial<AppState['companyRegisterData']>>,
    ) => {
      state.companyRegisterData = {
        ...state.companyRegisterData,
        ...action.payload,
      };
    },
    setRegisterSuccessModal: (state, action: PayloadAction<boolean>) => {
      state.registerSuccessModal = action.payload;
    },
    setCompanyProfileData: (
      state,
      action: PayloadAction<Partial<AppState['companyProfileData']>>,
    ) => {
      state.companyProfileData = {
        ...state.companyProfileData,
        ...action.payload,
      };
    },
    setCompanyServices: (state, action: PayloadAction<any[]>) => {
      state.companyServices = action.payload;
    },
    setCompanyProfileAllData: (state, action: PayloadAction<any[]>) => {
      state.companyProfileAllData = action.payload;
    },
    setSkills: (state, action: PayloadAction<any[]>) => {
      state.skills = action.payload;
    },
    setForgotPasswordSteps: (state, action: PayloadAction<number>) => {
      state.forgotPasswordSteps = action.payload;
    },
    setChangePasswordSteps: (state, action: PayloadAction<number>) => {
      state.changePasswordSteps = action.payload;
    },
    logouts: () => initialState,
  },
});

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  // Only persist these fields
  whitelist: [
    'loginModal',
    'language',
    'isLoading',
    'authToken',
    'fcmToken',
    'userInfo',
    'guestLogin',
    'businessType',
    'companyRegisterForm',
    'companyRegistrationStep',
    'companyRegisterData',
    'registerSuccessModal',
    'companyProfileData',
    'companyServices',
    'companyProfileAllData',
  ],
};

export const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authSlice.reducer,
);

export const {
  setIsLoading,
  setLoginModal,
  setAuthToken,
  setFcmToken,
  setLanguages,
  logouts,
  setGetAppData,
  setUserInfo,
  setGuestLogin,
  setBusinessType,
  setCompanyRegisterForm,
  setCompanyRegistrationStep,
  setCompanyRegisterData,
  setRegisterSuccessModal,
  setCompanyProfileData,
  setCompanyServices,
  setCompanyProfileAllData,
  setSkills,
  setForgotPasswordSteps,
  setChangePasswordSteps,
} = authSlice.actions;

export default authSlice.reducer;
