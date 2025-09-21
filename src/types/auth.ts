import { User } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  phoneNumber?: string | null;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  verifyOTP: (verificationId: string, otp: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  verificationId: string | null;
}

export interface PhoneAuthState {
  phoneNumber: string;
  verificationId: string | null;
  otpSent: boolean;
  otp: string;
  loading: boolean;
  error: string | null;
}

export interface GoogleAuthState {
  loading: boolean;
  error: string | null;
}
