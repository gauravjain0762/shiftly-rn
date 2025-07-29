import {useDispatch} from 'react-redux';
import { setJobFormState } from '../features/companySlice';

export default function useJobFormUpdater() {
  const dispatch = useDispatch();

  const updateJobForm = (payload: Partial<any>) => {
    dispatch(setJobFormState(payload));
  };

  return {
    updateJobForm,
  };
}
