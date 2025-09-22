// Constants for the Internship Recommendation Engine

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

export const SKILL_CATEGORIES = {
  technical: ['Programming', 'Data Analysis', 'Web Development', 'Mobile Apps', 'Digital Marketing'],
  business: ['Sales', 'Marketing', 'Finance', 'Operations', 'Customer Service'],
  creative: ['Design', 'Writing', 'Photography', 'Video Editing', 'Art'],
  communication: ['Public Speaking', 'Writing', 'Languages', 'Presentation', 'Teaching'],
} as const;

export const INTEREST_SECTORS = [
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { value: 'retail', label: 'Retail', icon: '🛍️' },
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { value: 'media', label: 'Media', icon: '📺' },
] as const;

// API Configuration
export const API_ENDPOINTS = {
  RECOMMENDATIONS: '/api/recommendations',
  INTERNSHIPS: '/api/internships',
  PROFILE: '/api/profile',
} as const;

// Recommendation Algorithm Constants
export const RECOMMENDATION_WEIGHTS = {
  EDUCATION_MATCH: 0.35,
  SKILLS_MATCH: 0.25,
  INTEREST_MATCH: 0.20,
  LOCATION_MATCH: 0.15,
  INCLUSIVITY_MATCH: 0.05,
} as const;

export const DEFAULT_RECOMMENDATION_LIMIT = 5;
export const MAX_INTERESTS_SELECTION = 3;

export type EducationLevel = typeof EDUCATION_LEVELS[number];
export type Sector = typeof SECTORS[number];
export type IndianState = typeof INDIAN_STATES[number];

// Re-export field of study categories
export * from './fieldOfStudy';
