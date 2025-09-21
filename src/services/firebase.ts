import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, Internship, FeedbackData } from '@/types';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  INTERNSHIPS: 'internships',
  FEEDBACK: 'feedback',
  APPLICATIONS: 'applications',
} as const;

// User Profile Operations
export const userProfileService = {
  // Get user profile by ID
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  },

  // Create user profile
  async createProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
        ...profile,
        createdAt: now,
        updatedAt: now,
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  },

  // Delete user profile
  async deleteProfile(userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw new Error('Failed to delete user profile');
    }
  },
};

// Internship Operations
export const internshipService = {
  // Get all active internships
  async getAllInternships(): Promise<Internship[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.INTERNSHIPS),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Internship[];
    } catch (error) {
      console.error('Error getting internships:', error);
      throw new Error('Failed to get internships');
    }
  },

  // Get internship by ID
  async getInternshipById(id: string): Promise<Internship | null> {
    try {
      const docRef = doc(db, COLLECTIONS.INTERNSHIPS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        } as Internship;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting internship:', error);
      throw new Error('Failed to get internship');
    }
  },

  // Get internships by sector
  async getInternshipsBySector(sector: string): Promise<Internship[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.INTERNSHIPS),
        where('sector', '==', sector),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Internship[];
    } catch (error) {
      console.error('Error getting internships by sector:', error);
      throw new Error('Failed to get internships by sector');
    }
  },

  // Get internships by location
  async getInternshipsByLocation(state: string): Promise<Internship[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.INTERNSHIPS),
        where('state', '==', state),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Internship[];
    } catch (error) {
      console.error('Error getting internships by location:', error);
      throw new Error('Failed to get internships by location');
    }
  },

  // Create internship (admin only)
  async createInternship(internship: Omit<Internship, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.INTERNSHIPS), internship);
      return docRef.id;
    } catch (error) {
      console.error('Error creating internship:', error);
      throw new Error('Failed to create internship');
    }
  },

  // Update internship (admin only)
  async updateInternship(id: string, updates: Partial<Internship>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.INTERNSHIPS, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating internship:', error);
      throw new Error('Failed to update internship');
    }
  },
};

// Feedback Operations
export const feedbackService = {
  // Submit feedback
  async submitFeedback(feedback: Omit<FeedbackData, 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.FEEDBACK), {
        ...feedback,
        timestamp: new Date().toISOString(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback');
    }
  },

  // Get feedback for internship
  async getFeedbackForInternship(internshipId: string): Promise<FeedbackData[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.FEEDBACK),
        where('internshipId', '==', internshipId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as (FeedbackData & { id: string })[];
    } catch (error) {
      console.error('Error getting feedback:', error);
      throw new Error('Failed to get feedback');
    }
  },

  // Get user feedback
  async getUserFeedback(userId: string): Promise<FeedbackData[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.FEEDBACK),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as (FeedbackData & { id: string })[];
    } catch (error) {
      console.error('Error getting user feedback:', error);
      throw new Error('Failed to get user feedback');
    }
  },
};

// Application Operations
export const applicationService = {
  // Submit application
  async submitApplication(application: {
    userId: string;
    internshipId: string;
    applicationData: any;
  }): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.APPLICATIONS), {
        ...application,
        status: 'submitted',
        submittedAt: Timestamp.now(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw new Error('Failed to submit application');
    }
  },

  // Get user applications
  async getUserApplications(userId: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.APPLICATIONS),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        submittedAt: doc.data().submittedAt?.toDate(),
      }));
    } catch (error) {
      console.error('Error getting user applications:', error);
      throw new Error('Failed to get user applications');
    }
  },
};

// Development flag for using mock data vs Firebase
export const USE_FIREBASE = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';
