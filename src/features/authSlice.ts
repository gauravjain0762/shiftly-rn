import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';

interface AppState {
  isLoading: boolean;
  loginModal: boolean;
  flashModal: boolean;
  getAppData?: Record<string, any>;
}

const initialState: AppState = {
  isLoading: false,
  loginModal: false,
  flashModal: false,
  getAppData: {},
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
    setFlashModal: (state, action: PayloadAction<boolean>) => {
      state.flashModal = action.payload;
    },
    setGetAppData: (state, action: PayloadAction<any>) => {
      state.getAppData = action.payload;
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
    'flashModal',

    
    
  ],
};

export const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authSlice.reducer,
);

export const {
  setIsLoading,
  setLoginModal,
  setFlashModal,
  logouts,
  setGetAppData,
} = authSlice.actions;

export default authSlice.reducer;
