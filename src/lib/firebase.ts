import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Connect to emulators in development (only if explicitly enabled)
if (process.env.NODE_ENV === 'development' && 
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' && 
    typeof window !== 'undefined') {
  // Only connect to emulators once
  let isEmulatorConnected = false;
  try {
    // Check if emulator is already connected by attempting to connect
    if (!isEmulatorConnected) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      isEmulatorConnected = true;
    }
  } catch (error) {
    // Emulator already connected or not available
    console.warn('Firebase Auth emulator connection failed:', error);
  }
  
  // Connect Firestore emulator
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.warn('Firestore emulator connection failed:', error);
  }
}

export default app;
