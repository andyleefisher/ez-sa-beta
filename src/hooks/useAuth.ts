import { useState } from 'react';
import { DEV_USER } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export const useAuth = () => {
  const [user] = useState<User | null>(DEV_USER as any);
  const [loading] = useState(false);

  return { 
    user, 
    loading,
    signInWithGoogle: () => {},
    logout: () => {}
  };
};