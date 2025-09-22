// Core types for the Internship Recommendation Engine

export interface UserProfile {
  id?: string;
  name?: string;
  age?: number;
  education: string;
  fieldOfStudy?: string;
  skills: string[];
  interests: string[];
  location: {
    state: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  experience?: string;
  languagePreference: 'en' | 'hi';
  openToRemote?: boolean;
  resume?: File | null;
  createdAt?: Date;
  updatedAt?: Date;
  accessibility?: string[];
  preferences?: {
    remoteWork?: boolean;
    maxDistance?: number;
    minStipend?: number;
  };
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  detailedDescription?: string;
  location: string;
  state: string;
  district: string;
  sector: string;
  stipend: number;
  duration: string;
  requirements: string[];
  skills: string[];
  educationLevel: string;
  applicationDeadline: string;
  isActive: boolean;
  isRemote: boolean;
  companyLogo?: string;
  benefits?: string[];
  applicationProcess?: string;
  inclusivityScore?: number;
}

export interface InternshipRecommendation extends Internship {
  matchScore: number;
  explanation: string;
  applyUrl: string;
  whyRecommended?: string;
  reasonsForRecommendation: {
    educationMatch: number;
    skillsMatch: number;
    interestMatch: number;
    locationMatch: number;
    inclusivityMatch: number;
  };
}

export interface RecommendationRequest {
  profile: UserProfile;
  filters?: {
    sector?: string;
    location?: string;
    minStipend?: number;
    maxDistance?: number;
    remoteOnly?: boolean;
  };
  limit?: number;
}

export interface RecommendationResponse {
  recommendations: InternshipRecommendation[];
  metadata: {
    totalCount: number;
    processingTime: number;
    algorithmVersion: string;
    filters?: any;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface FeedbackData {
  userId: string;
  internshipId: string;
  rating: number; // 1-5 stars
  relevanceScore: number; // 1-5
  applied: boolean;
  feedback?: string;
  timestamp: string;
}

// UI Component Props Types
export interface LanguageContextType {
  currentLanguage: 'en' | 'hi';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export interface FormData {
  education: string;
  specialization: string;
  skills: string[];
  interests: string[];
  state: string;
  district: string;
  language: 'en' | 'hi';
  experience?: string;
  accessibility?: string[];
}

// Constants
export const EDUCATION_LEVELS = [
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
] as const;

export const SECTORS = [
  'Technology',
  'Finance',
  'Marketing',
  'Manufacturing',
  'Healthcare',
  'Education',
  'Government',
  'Non-Profit',
  'Media',
  'Retail',
] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
] as const;

export type EducationLevel = typeof EDUCATION_LEVELS[number];
export type Sector = typeof SECTORS[number];
export type IndianState = typeof INDIAN_STATES[number];
