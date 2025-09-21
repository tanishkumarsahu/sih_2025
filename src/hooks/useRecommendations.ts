import { useState, useCallback } from 'react';
import { UserProfile, InternshipRecommendation, RecommendationRequest, RecommendationResponse } from '@/types';
import { recommendationsApi } from '@/services/api';

interface UseRecommendationsState {
  recommendations: InternshipRecommendation[];
  isLoading: boolean;
  error: string | null;
  metadata: RecommendationResponse['metadata'] | null;
}

interface UseRecommendationsReturn extends UseRecommendationsState {
  getRecommendations: (request: RecommendationRequest) => Promise<void>;
  clearRecommendations: () => void;
  clearError: () => void;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [state, setState] = useState<UseRecommendationsState>({
    recommendations: [],
    isLoading: false,
    error: null,
    metadata: null,
  });

  const getRecommendations = useCallback(async (request: RecommendationRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await recommendationsApi.getRecommendations(request);

      if (response.error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to get recommendations',
        }));
        return;
      }

      if (response.data) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          recommendations: response.data!.recommendations,
          metadata: response.data!.metadata,
          error: null,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    setState(prev => ({
      ...prev,
      recommendations: [],
      metadata: null,
      error: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    getRecommendations,
    clearRecommendations,
    clearError,
  };
}

// Hook for getting recommendations with profile
export function useProfileRecommendations() {
  const { getRecommendations, ...rest } = useRecommendations();

  const getRecommendationsForProfile = useCallback(
    async (profile: UserProfile, filters?: RecommendationRequest['filters']) => {
      const request: RecommendationRequest = {
        profile,
        filters,
        limit: 5,
      };
      
      await getRecommendations(request);
    },
    [getRecommendations]
  );

  return {
    ...rest,
    getRecommendationsForProfile,
  };
}
