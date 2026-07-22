import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '@/lib/api';

export function useApiAuthSync() {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);
}
