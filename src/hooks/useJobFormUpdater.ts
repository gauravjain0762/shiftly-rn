import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setJobFormState } from '../features/companySlice';

export default function useJobFormUpdater() {
  const dispatch = useDispatch();

  const updateJobForm = useCallback((payload: Partial<any>) => {
    dispatch(setJobFormState(payload));
  }, [dispatch]);

  return {
    updateJobForm,
  };
}
