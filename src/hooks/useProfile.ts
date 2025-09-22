import { useState, useCallback, useEffect } from 'react';
import { UserProfile } from '@/types';
import { profileApi } from '@/services/api';
import { userProfileService } from '@/services/firebase';
import { UserProfileSchema } from '@/lib/validations';
import { useAuth } from './useAuth';

interface UseProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

interface UseProfileReturn extends UseProfileState {
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  createProfile: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
  validateProfile: (profile: Partial<UserProfile>) => { isValid: boolean; errors: string[] };
}

export function useProfile(): UseProfileReturn {
  const { user } = useAuth();
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    isLoading: false,
    error: null,
    isSaving: false,
  });

  // Load profile when user changes
  useEffect(() => {
    if (user?.uid) {
      refreshProfile();
    } else {
      setState(prev => ({ ...prev, profile: null }));
    }
  }, [user?.uid]);

  const refreshProfile = useCallback(async () => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Try Firebase first, fallback to API
      let profile: UserProfile | null = null;
      
      try {
        profile = await userProfileService.getProfile(user.uid);
      } catch (firebaseError) {
        console.warn('Firebase profile fetch failed, trying API:', firebaseError);
        const response = await profileApi.get(user.uid);
        if (response.data) {
          profile = response.data;
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        profile,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load profile',
      }));
    }
  }, [user?.uid]);

  const createProfile = useCallback(async (profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      // Validate profile data
      const validation = validateProfile(profileData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const profileWithId = { ...profileData, id: user.uid };

      // Try Firebase first, fallback to API
      try {
        await userProfileService.createProfile(profileData);
      } catch (firebaseError) {
        console.warn('Firebase profile creation failed, trying API:', firebaseError);
        const response = await profileApi.create(profileWithId);
        if (response.error) {
          throw new Error(response.error);
        }
      }

      setState(prev => ({
        ...prev,
        isSaving: false,
        profile: profileWithId,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to create profile',
      }));
      throw error;
    }
  }, [user?.uid]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.uid || !state.profile) {
      throw new Error('User not authenticated or profile not loaded');
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      // Validate updates
      const updatedProfile = { ...state.profile, ...updates };
      const validation = validateProfile(updatedProfile);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Try Firebase first, fallback to API
      try {
        await userProfileService.updateProfile(user.uid, updates);
      } catch (firebaseError) {
        console.warn('Firebase profile update failed, trying API:', firebaseError);
        const response = await profileApi.update(user.uid, updates);
        if (response.error) {
          throw new Error(response.error);
        }
      }

      setState(prev => ({
        ...prev,
        isSaving: false,
        profile: updatedProfile,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      }));
      throw error;
    }
  }, [user?.uid, state.profile]);

  const validateProfile = useCallback((profile: Partial<UserProfile>) => {
    try {
      UserProfileSchema.parse(profile);
      return { isValid: true, errors: [] };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors)) {
        const errors = error.errors.map((err: { path: string[]; message: string }) => `${err.path.join('.')}: ${err.message}`);
        return { isValid: false, errors };
      }
      return { isValid: false, errors: ['Invalid profile data'] };
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    updateProfile,
    createProfile,
    refreshProfile,
    clearError,
    validateProfile,
  };
}

// Hook for form validation
export function useProfileValidation() {
  const validateField = useCallback((field: keyof UserProfile, value: unknown) => {
    try {
      const fieldSchema = UserProfileSchema.shape[field];
      if (fieldSchema) {
        fieldSchema.parse(value);
        return { isValid: true, error: null };
      }
      return { isValid: true, error: null };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors) && error.errors[0] && typeof error.errors[0] === 'object' && 'message' in error.errors[0]) {
        return { isValid: false, error: error.errors[0].message as string };
      }
      return { isValid: false, error: 'Invalid value' };
    }
  }, []);

  const validateAge = useCallback((ageInput: string | number) => {
    if (typeof ageInput === 'string' && ageInput.trim() === '') {
      return { isValid: true, value: undefined, error: null };
    }
    
    const age = typeof ageInput === 'number' ? ageInput : parseInt(ageInput, 10);
    
    if (isNaN(age)) {
      return { isValid: false, value: undefined, error: 'Please enter a valid age' };
    }
    
    if (age < 16 || age > 100) {
      return { isValid: false, value: age, error: 'Age must be between 16 and 100' };
    }
    
    return { isValid: true, value: age, error: null };
  }, []);

  return {
    validateField,
    validateAge,
  };
}
