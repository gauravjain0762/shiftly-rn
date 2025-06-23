import {ThunkAction} from 'redux-thunk';
import {dispatchAction, RootState} from '../hooks';
import {AnyAction} from 'redux';
import {IS_LOADING} from '../actionTypes';
import {
  makeAPIRequest,
} from '../../utils/apiGlobal';
import {API, POST} from '../../utils/apiConstant';

export const onUserUserInfoInsert =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true);
    return makeAPIRequest({
      method: POST,
      url: API.UserInfoInsert,
      data: request?.data,
    })
      .then(async (response: any) => {
        if (request?.onSuccess) request?.onSuccess(response?.data);
      })
      .catch(error => {
        if (request?.onFailure) request?.onFailure(error?.response);
      });
  };

export const onUserEntityProfileInsert =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true);
    return makeAPIRequest({
      method: POST,
      url: API.EntityProfileInsert,
      data: request?.data,
    })
      .then(async (response: any) => {
        if (request?.onSuccess) request?.onSuccess(response?.data);
      })
      .catch(error => {
        if (request?.onFailure) request?.onFailure(error?.response);
      });
  };


  export const onGetEntityProfileSelectAll =
  ({
    data,
    params,
    onSuccess,
    onFailure,
  }: requestProps): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {

    return makeAPIRequest({
      method: POST,
      url: API.EntityProfileSelectAll,
    })
      .then(async (response: any) => {
        if (onSuccess) onSuccess(response?.data);
      })
      .catch(error => {
        if (onFailure) onFailure(error?.response);
      });
  };