import { UserProfile, InternshipRecommendation } from '@/types';
import { RECOMMENDATION_WEIGHTS, DEFAULT_RECOMMENDATION_LIMIT } from '@/constants';
import { geminiService } from './gemini';

// Mock internship data for development
const mockInternships: Omit<InternshipRecommendation, 'matchScore' | 'explanation' | 'applyUrl' | 'reasonsForRecommendation'>[] = [
  {
    id: '1',
    title: 'Software Development Intern',
    company: 'TCS',
    description: 'Join our software development team to work on cutting-edge projects using modern technologies.',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    district: 'Mumbai',
    sector: 'Technology',
    stipend: 15000,
    duration: '6 months',
    requirements: ['Programming', 'Computer Science', 'Problem Solving'],
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    educationLevel: 'Bachelor\'s Degree',
    applicationDeadline: '2024-12-31',
    isActive: true,
    isRemote: false,
    companyLogo: '/logos/tcs.png',
    benefits: ['Health Insurance', 'Learning Opportunities', 'Mentorship'],
    whyRecommended: 'Perfect match for your computer science background and programming skills',
  },
  {
    id: '2',
    title: 'Digital Marketing Intern',
    company: 'Wipro',
    description: 'Learn digital marketing strategies and execute campaigns across multiple channels.',
    location: 'Bangalore, Karnataka',
    state: 'Karnataka',
    district: 'Bangalore',
    sector: 'Marketing',
    stipend: 12000,
    duration: '4 months',
    requirements: ['Digital Marketing', 'Communication', 'Analytics'],
    skills: ['SEO', 'Social Media', 'Google Analytics', 'Content Creation'],
    educationLevel: 'Bachelor\'s Degree',
    applicationDeadline: '2024-11-30',
    isActive: true,
    isRemote: true,
    companyLogo: '/logos/wipro.png',
    benefits: ['Flexible Hours', 'Remote Work', 'Certification'],
    whyRecommended: 'Good fit based on your interest in marketing and digital skills',
  },
  {
    id: '3',
    title: 'Finance Analyst Intern',
    company: 'HDFC Bank',
    description: 'Analyze financial data and support investment decisions in our finance team.',
    location: 'Delhi, Delhi',
    state: 'Delhi',
    district: 'New Delhi',
    sector: 'Finance',
    stipend: 18000,
    duration: '6 months',
    requirements: ['Finance', 'Analytics', 'Excel'],
    skills: ['Financial Analysis', 'Excel', 'PowerBI', 'SQL'],
    educationLevel: 'Bachelor\'s Degree',
    applicationDeadline: '2024-10-31',
    isActive: true,
    isRemote: false,
    companyLogo: '/logos/hdfc.png',
    benefits: ['Performance Bonus', 'Training Programs', 'Career Growth'],
    whyRecommended: 'Matches your commerce background and analytical skills',
  },
  {
    id: '4',
    title: 'UI/UX Design Intern',
    company: 'Infosys',
    description: 'Create user-centered designs and improve user experience across our products.',
    location: 'Pune, Maharashtra',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'Technology',
    stipend: 14000,
    duration: '5 months',
    requirements: ['Design', 'Creativity', 'User Research'],
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    educationLevel: 'Bachelor\'s Degree',
    applicationDeadline: '2024-12-15',
    isActive: true,
    isRemote: true,
    companyLogo: '/logos/infosys.png',
    benefits: ['Design Tools Access', 'Mentorship', 'Portfolio Development'],
    whyRecommended: 'Great opportunity to develop your design skills with industry experts',
  },
  {
    id: '5',
    title: 'Content Writing Intern',
    company: 'Zomato',
    description: 'Create engaging content for our platform and marketing campaigns.',
    location: 'Gurgaon, Haryana',
    state: 'Haryana',
    district: 'Gurgaon',
    sector: 'Media',
    stipend: 10000,
    duration: '3 months',
    requirements: ['Writing', 'Communication', 'Creativity'],
    skills: ['Content Writing', 'SEO Writing', 'Social Media', 'Research'],
    educationLevel: 'Bachelor\'s Degree',
    applicationDeadline: '2024-11-15',
    isActive: true,
    isRemote: true,
    companyLogo: '/logos/zomato.png',
    benefits: ['Flexible Schedule', 'Published Work', 'Industry Exposure'],
    whyRecommended: 'Perfect for developing your writing skills in a dynamic environment',
  },
];

// Calculate recommendation score based on user profile
export async function calculateRecommendations(profile: UserProfile): Promise<InternshipRecommendation[]> {
  const startTime = Date.now();
  
  // Filter and score internships based on profile
  const scoredInternships = mockInternships.map(internship => {
    let totalScore = 0;
    const reasons = {
      educationMatch: 0,
      skillsMatch: 0,
      interestMatch: 0,
      locationMatch: 0,
      inclusivityMatch: 0,
    };
    
    // Education match (35% weight)
    let educationScore = 0;
    if (profile.education.toLowerCase().includes('computer') && 
        internship.sector === 'Technology') {
      educationScore = 100;
    } else if (profile.education.toLowerCase().includes('commerce') && 
               internship.sector === 'Finance') {
      educationScore = 100;
    } else if (profile.education.toLowerCase().includes('graduate')) {
      educationScore = 70;
    } else {
      educationScore = 40; // Base score for any education
    }
    reasons.educationMatch = educationScore;
    totalScore += educationScore * RECOMMENDATION_WEIGHTS.EDUCATION_MATCH;
    
    // Skills overlap (25% weight)
    const userSkills = profile.skills.map(s => s.toLowerCase());
    const internshipSkills = [...internship.requirements, ...internship.skills].map(s => s.toLowerCase());
    const skillMatches = userSkills.filter(skill => 
      internshipSkills.some(reqSkill => 
        reqSkill.includes(skill) || skill.includes(reqSkill)
      )
    ).length;
    const skillsScore = Math.min((skillMatches / Math.max(userSkills.length, 1)) * 100, 100);
    reasons.skillsMatch = skillsScore;
    totalScore += skillsScore * RECOMMENDATION_WEIGHTS.SKILLS_MATCH;
    
    // Interest match (20% weight)
    let interestScore = 0;
    if (profile.interests.some(interest => 
        internship.sector.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(internship.sector.toLowerCase())
    )) {
      interestScore = 100;
    } else {
      interestScore = 30; // Base score
    }
    reasons.interestMatch = interestScore;
    totalScore += interestScore * RECOMMENDATION_WEIGHTS.INTEREST_MATCH;
    
    // Location proximity (15% weight)
    let locationScore = 0;
    if (internship.isRemote && profile.openToRemote) {
      locationScore = 100;
    } else if (internship.state === profile.location.state) {
      locationScore = 100;
    } else {
      locationScore = 40; // Different state
    }
    reasons.locationMatch = locationScore;
    totalScore += locationScore * RECOMMENDATION_WEIGHTS.LOCATION_MATCH;
    
    // Company inclusivity (5% weight)
    const inclusivityScore = internship.inclusivityScore || 80; // Default score
    reasons.inclusivityMatch = inclusivityScore;
    totalScore += inclusivityScore * RECOMMENDATION_WEIGHTS.INCLUSIVITY_MATCH;
    
    // Generate explanation
    const explanation = generateExplanation(profile, internship, reasons);
    
    return {
      ...internship,
      matchScore: Math.min(Math.round(totalScore), 100),
      explanation,
      applyUrl: `/apply/${internship.id}`,
      reasonsForRecommendation: reasons,
    } as InternshipRecommendation;
  });
  
  // Sort by match score and get top results
  const topRecommendations = scoredInternships
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, DEFAULT_RECOMMENDATION_LIMIT);

  // Enhance with Gemini AI if available
  try {
    const enhancedRecommendations = await geminiService.enhanceRecommendations(profile, topRecommendations);
    return enhancedRecommendations;
  } catch (error) {
    console.error('Gemini enhancement failed, using base recommendations:', error);
    return topRecommendations;
  }
}

// Generate explanation for why an internship is recommended
function generateExplanation(
  profile: UserProfile, 
  internship: Omit<InternshipRecommendation, 'matchScore' | 'explanation' | 'applyUrl' | 'reasonsForRecommendation'>,
  reasons: any
): string {
  const explanations = [];
  
  if (reasons.educationMatch > 80) {
    explanations.push(`Your ${profile.education} background aligns well with this ${internship.sector} role`);
  }
  
  if (reasons.skillsMatch > 60) {
    explanations.push('Your skills match several requirements for this position');
  }
  
  if (reasons.interestMatch > 80) {
    explanations.push(`This matches your interest in ${internship.sector.toLowerCase()}`);
  }
  
  if (reasons.locationMatch > 80) {
    if (internship.isRemote) {
      explanations.push('This remote position offers flexibility');
    } else {
      explanations.push('The location is convenient for you');
    }
  }
  
  if (explanations.length === 0) {
    explanations.push('This internship offers good learning opportunities');
  }
  
  return explanations.join('. ') + '.';
}

// Get internship by ID (for detailed view)
export function getInternshipById(id: string): InternshipRecommendation | null {
  const internship = mockInternships.find(i => i.id === id);
  if (!internship) return null;
  
  // Return with default values for recommendation fields
  return {
    ...internship,
    matchScore: 0,
    explanation: '',
    applyUrl: `/apply/${id}`,
    reasonsForRecommendation: {
      educationMatch: 0,
      skillsMatch: 0,
      interestMatch: 0,
      locationMatch: 0,
      inclusivityMatch: 0,
    },
  };
}

// Filter internships based on criteria
export function filterInternships(
  internships: InternshipRecommendation[],
  filters: {
    sector?: string;
    location?: string;
    minStipend?: number;
    maxDistance?: number;
    remoteOnly?: boolean;
  }
): InternshipRecommendation[] {
  return internships.filter(internship => {
    if (filters.sector && internship.sector !== filters.sector) {
      return false;
    }
    
    if (filters.location && !internship.location.includes(filters.location)) {
      return false;
    }
    
    if (filters.minStipend && internship.stipend < filters.minStipend) {
      return false;
    }
    
    if (filters.remoteOnly && !internship.isRemote) {
      return false;
    }
    
    return true;
  });
}
