import { z } from 'zod';
// Removed unused imports: EDUCATION_LEVELS, SECTORS, INDIAN_STATES

// User Profile Validation Schema - Made more flexible for form submission
export const UserProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  age: z.number().min(16, 'Age must be at least 16').max(100, 'Age must be less than 100').optional(),
  education: z.string().min(1, 'Education is required'),
  fieldOfStudy: z.string().optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  interests: z.array(z.string()).min(1, 'At least one interest is required').max(3, 'Maximum 3 interests allowed'),
  location: z.object({
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  experience: z.string().optional(),
  languagePreference: z.enum(['en', 'hi']),
  openToRemote: z.boolean().optional(),
  resume: z.instanceof(File).nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  accessibility: z.array(z.string()).optional(),
  preferences: z.object({
    remoteWork: z.boolean().optional(),
    maxDistance: z.number().optional(),
    minStipend: z.number().optional(),
  }).optional(),
});

// Internship Validation Schema
export const InternshipSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  description: z.string().min(1, 'Description is required'),
  detailedDescription: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  sector: z.string().min(1, 'Sector is required'),
  stipend: z.number().min(0, 'Stipend must be non-negative'),
  duration: z.string().min(1, 'Duration is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  educationLevel: z.string().min(1, 'Education level is required'),
  applicationDeadline: z.string().min(1, 'Application deadline is required'),
  isActive: z.boolean(),
  isRemote: z.boolean(),
  companyLogo: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  applicationProcess: z.string().optional(),
  inclusivityScore: z.number().min(0).max(100).optional(),
});

// Internship Recommendation Schema
export const InternshipRecommendationSchema = InternshipSchema.extend({
  matchScore: z.number().min(0).max(100),
  explanation: z.string().min(1, 'Explanation is required'),
  applyUrl: z.string().min(1, 'Apply URL is required'),
  whyRecommended: z.string().optional(),
  reasonsForRecommendation: z.object({
    educationMatch: z.number().min(0).max(100),
    skillsMatch: z.number().min(0).max(100),
    interestMatch: z.number().min(0).max(100),
    locationMatch: z.number().min(0).max(100),
    inclusivityMatch: z.number().min(0).max(100),
  }),
});

// Recommendation Request Schema
export const RecommendationRequestSchema = z.object({
  profile: UserProfileSchema,
  filters: z.object({
    sector: z.string().optional(),
    location: z.string().optional(),
    minStipend: z.number().min(0).optional(),
    maxDistance: z.number().min(0).optional(),
    remoteOnly: z.boolean().optional(),
  }).optional(),
  limit: z.number().min(1).max(20).optional(),
});

// Recommendation Response Schema
export const RecommendationResponseSchema = z.object({
  recommendations: z.array(InternshipRecommendationSchema),
  metadata: z.object({
    totalCount: z.number(),
    processingTime: z.number(),
    algorithmVersion: z.string(),
    filters: z.record(z.string(), z.unknown()).optional(),
  }),
});

// API Response Schema
export const ApiResponseSchema = z.object({
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  status: z.number(),
});

// Form Data Schema
export const FormDataSchema = z.object({
  education: z.string().min(1, 'Education is required'),
  specialization: z.string().optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  interests: z.array(z.string()).min(1, 'At least one interest is required').max(3, 'Maximum 3 interests allowed'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  language: z.enum(['en', 'hi']),
  experience: z.string().optional(),
  accessibility: z.array(z.string()).optional(),
});

// Feedback Data Schema
export const FeedbackDataSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  internshipId: z.string().min(1, 'Internship ID is required'),
  rating: z.number().min(1).max(5),
  relevanceScore: z.number().min(1).max(5),
  applied: z.boolean(),
  feedback: z.string().optional(),
  timestamp: z.string(),
});

// Helper function to safely parse age
export const parseAge = (value: string | number): number | undefined => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() === '') return undefined;
  
  const parsed = parseInt(value as string, 10);
  return isNaN(parsed) ? undefined : parsed;
};

// Type exports
export type UserProfileInput = z.infer<typeof UserProfileSchema>;
export type InternshipInput = z.infer<typeof InternshipSchema>;
export type InternshipRecommendationInput = z.infer<typeof InternshipRecommendationSchema>;
export type RecommendationRequestInput = z.infer<typeof RecommendationRequestSchema>;
export type RecommendationResponseInput = z.infer<typeof RecommendationResponseSchema>;
export type FormDataInput = z.infer<typeof FormDataSchema>;
export type FeedbackDataInput = z.infer<typeof FeedbackDataSchema>;
