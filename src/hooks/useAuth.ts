'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useFirebaseAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  return { user, loading, error };
};

// Re-export the context hook for convenience
export { useAuthContext as useAuth };
