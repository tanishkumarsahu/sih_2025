import { UserProfile, RecommendationRequest, RecommendationResponse, ApiResponse } from '@/types';
import { API_ENDPOINTS } from '@/constants';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: undefined,
        error: data.error || 'An error occurred',
        message: data.message,
        status: response.status,
      };
    }

    return {
      data,
      error: undefined,
      message: data.message,
      status: response.status,
    };
  } catch (error) {
    return {
      data: undefined,
      error: error instanceof Error ? error.message : 'Network error',
      message: 'Failed to make API request',
      status: 500,
    };
  }
}

// Recommendations API
export const recommendationsApi = {
  // Get personalized recommendations
  getRecommendations: async (request: RecommendationRequest): Promise<ApiResponse<RecommendationResponse>> => {
    return apiRequest<RecommendationResponse>(API_ENDPOINTS.RECOMMENDATIONS, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // Get API info
  getInfo: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest<Record<string, unknown>>(API_ENDPOINTS.RECOMMENDATIONS, {
      method: 'GET',
    });
  },
};

// Internships API
export const internshipsApi = {
  // Get all internships
  getAll: async (): Promise<ApiResponse<unknown[]>> => {
    return apiRequest<unknown[]>(API_ENDPOINTS.INTERNSHIPS, {
      method: 'GET',
    });
  },

  // Get internship by ID
  getById: async (id: string): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest<Record<string, unknown>>(`${API_ENDPOINTS.INTERNSHIPS}/${id}`, {
      method: 'GET',
    });
  },

  // Create new internship
  create: async (internship: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest<Record<string, unknown>>(API_ENDPOINTS.INTERNSHIPS, {
      method: 'POST',
      body: JSON.stringify(internship),
    });
  },

  // Update internship
  update: async (id: string, internship: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest<Record<string, unknown>>(`${API_ENDPOINTS.INTERNSHIPS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(internship),
    });
  },

  // Delete internship
  delete: async (id: string): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiRequest<Record<string, unknown>>(`${API_ENDPOINTS.INTERNSHIPS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Profile API
export const profileApi = {
  // Get user profile
  get: async (userId: string): Promise<ApiResponse<UserProfile>> => {
    return apiRequest<UserProfile>(`${API_ENDPOINTS.PROFILE}/${userId}`, {
      method: 'GET',
    });
  },

  // Update user profile
  update: async (userId: string, profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    return apiRequest<UserProfile>(`${API_ENDPOINTS.PROFILE}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  // Create user profile
  create: async (profile: UserProfile): Promise<ApiResponse<UserProfile>> => {
    return apiRequest<UserProfile>(API_ENDPOINTS.PROFILE, {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },
};

// Export all APIs
export const api = {
  recommendations: recommendationsApi,
  internships: internshipsApi,
  profile: profileApi,
};
