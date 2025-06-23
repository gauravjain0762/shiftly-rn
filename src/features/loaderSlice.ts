import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

interface LoaderState {
  pendingRequests: number;
  loadingStates: Record<string, boolean>;
}

const initialState: LoaderState = {
  pendingRequests: 0,
  loadingStates: {},
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    incrementPendingRequests(state) {
      state.pendingRequests += 1;
    },
    decrementPendingRequests(state) {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
    setLoadingState(
      state,
      action: PayloadAction<{key: string; isLoading: boolean}>,
    ) {
      const {key, isLoading} = action.payload;
      state.loadingStates[key] = isLoading;
    },
    resetLoadingStates(state) {
      state.pendingRequests = 0;
      state.loadingStates = {};
    },
  },
});

export const {
  incrementPendingRequests,
  decrementPendingRequests,
  setLoadingState,
  resetLoadingStates,
} = loaderSlice.actions;

// Global loading: true when any RTKQ request is in flight
export const selectIsLoading = (state: RootState) =>
  state.loader.pendingRequests > 0;

// Per-feature loading flag
export const selectLoadingState =
  (key: string) =>
  (state: RootState): boolean =>
    state.loader.loadingStates[key] ?? false;

export default loaderSlice.reducer;
