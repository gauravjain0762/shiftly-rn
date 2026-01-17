import {
  configureStore,
  combineReducers,
  AnyAction,
  Middleware,
} from '@reduxjs/toolkit';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {setupListeners} from '@reduxjs/toolkit/query';

// Persisted reducer from your slice
import {persistedAuthReducer} from '../features/authSlice';
import loaderReducer from '../features/loaderSlice';
import companyReducer from '../features/companySlice';
import employeeReducer from '../features/employeeSlice';

// Custom middleware
import {loadingMiddleware} from './middleware/loadingMiddleware';
import {authApi} from '../api/authApi';
import {dashboardApi} from '../api/dashboardApi';

// 1) Root‐reducer, with a reset action handler
const appReducer = combineReducers({
  auth: persistedAuthReducer, // ← use the persisted reducer here
  loader: loaderReducer,
  company: companyReducer,
  employee: employeeReducer,
  [authApi.reducerPath]: authApi.reducer, // RTK Query for cached data all HTTP requests
  [dashboardApi.reducerPath]: dashboardApi.reducer, // RTK Query for cached data all HTTP requests

  // Add other reducers here
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return appReducer(state, action);
};

// 2) Analytics middleware (tight types)
const analyticsMiddleware: Middleware =
  ({}) =>
  (next: any) =>
  (action: any) => {
    if (
      action.type === 'auth/setToken' ||
      action.type === 'auth/clearToken' ||
      action.type.endsWith('/fulfilled') ||
      action.type.endsWith('/rejected')
    ) {
      if (__DEV__) {
        console.log('[ANALYTICS]', action.type);
      }
    }
    return next(action);
  };

// 3) Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: {warnAfter: 300}, // dev-only
    })
      .concat(authApi.middleware) // RTK Query
      .concat(dashboardApi.middleware) // RTK Query

      .concat(loadingMiddleware) // your loader counter
      .concat(analyticsMiddleware), // logging
  devTools: __DEV__,
});

// setStoreInstance(store);

// 4) Persistor & listeners
export const persistor = persistStore(store);
setupListeners(store.dispatch);

// 5) Types & reset helper
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const resetStore = async () => {
  await persistor.purge();
  store.dispatch({type: 'RESET_STORE'});
  await persistor.persist();
};
