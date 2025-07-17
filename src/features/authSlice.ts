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
  registerSuccessModal?: boolean
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
  registerSuccessModal:false
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
    'registerSuccessModal'
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
} = authSlice.actions;

export default authSlice.reducer;
