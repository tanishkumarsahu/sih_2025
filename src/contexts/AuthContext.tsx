'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AuthContextType, AuthUser } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Initialize reCAPTCHA verifier
  const initializeRecaptcha = () => {
    if (!recaptchaVerifier && typeof window !== 'undefined') {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
        },
      });
      setRecaptchaVerifier(verifier);
      return verifier;
    }
    return recaptchaVerifier;
  };

  // Sign in with phone number
  const signInWithPhone = async (phoneNumber: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Ensure phone number is in international format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const verifier = initializeRecaptcha();
      if (!verifier) {
        throw new Error('Failed to initialize reCAPTCHA');
      }

      const confirmationResult: ConfirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        verifier
      );
      
      setVerificationId(confirmationResult.verificationId);
    } catch (err: any) {
      console.error('Phone sign-in error:', err);
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (verificationId: string, otp: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);
      
      // Save user data to Firestore
      await saveUserToFirestore(result.user);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError('Invalid OTP. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      // Save user data to Firestore
      await saveUserToFirestore(result.user);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Save user data to Firestore
  const saveUserToFirestore = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        lastSignIn: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!userSnap.exists()) {
        // New user
        await setDoc(userRef, {
          ...userData,
          createdAt: new Date().toISOString(),
          profileCompleted: false,
        });
      } else {
        // Existing user - update last sign in
        await setDoc(userRef, userData, { merge: true });
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      setVerificationId(null);
      setError(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user as AuthUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [recaptchaVerifier]);

  const value: AuthContextType = {
    user,
    loading,
    signInWithPhone,
    verifyOTP,
    signInWithGoogle,
    signOut,
    error,
    verificationId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* reCAPTCHA container - hidden */}
      <div id="recaptcha-container" style={{ display: 'none' }} />
    </AuthContext.Provider>
  );
};
