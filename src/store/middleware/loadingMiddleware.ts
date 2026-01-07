import {isPending, isFulfilled, isRejected, Middleware} from '@reduxjs/toolkit';
import {
  incrementPendingRequests,
  decrementPendingRequests,
} from '../../features/loaderSlice';

const apiReducerPaths = ['authApi'];

export const loadingMiddleware: Middleware = api => next => action => {
  const {type, meta} = action as any;
  const isRtkQuery =
    apiReducerPaths.some(path => type.startsWith(`${path}/`)) &&
    // skipLoader support: check both meta.arg.skipLoader and the query result
    !(meta as any)?.arg?.skipLoader;

  if (isRtkQuery) {
    if (isPending(action)) {
      api.dispatch(incrementPendingRequests());
    } else if (isFulfilled(action) || isRejected(action)) {
      api.dispatch(decrementPendingRequests());
    }
  }

  return next(action);
};
