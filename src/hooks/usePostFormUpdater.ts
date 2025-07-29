import {useDispatch} from 'react-redux';
import {setPostFormState} from '../features/companySlice';

export default function usePostFormUpdater() {
  const dispatch = useDispatch();

  const updatePostForm = (payload: Partial<any>) => {
    dispatch(setPostFormState(payload));
  };

  return {
    updatePostForm,
  };
}
