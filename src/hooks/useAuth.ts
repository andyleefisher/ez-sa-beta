import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut 
} from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    checkRedirectResult();
    return unsubscribe;
  }, []);

  const handleGoogleAuth = async (isSignUp = false) => {
    setError(null);
    const provider = new GoogleAuthProvider();
    
    if (isSignUp) {
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    }

    try {
      // First try popup
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        try {
          // Fallback to redirect if popup is blocked
          setError('Popup was blocked. Redirecting...');
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          console.error('Redirect error:', redirectError);
          setError('Authentication failed. Please check your browser settings and try again.');
        }
      } else {
        console.error('Authentication error:', error);
        setError('Authentication failed. Please try again.');
      }
    }
  };

  const signInWithGoogle = () => handleGoogleAuth(false);
  const signUpWithGoogle = () => handleGoogleAuth(true);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Error signing out. Please try again.');
    }
  };

  return { 
    user, 
    loading, 
    error,
    setError, 
    signInWithGoogle, 
    signUpWithGoogle, 
    logout 
  };
};