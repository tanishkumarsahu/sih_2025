import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for the recommendation engine
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  return phoneRegex.test(phone);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Skill matching utility for recommendation algorithm
export function calculateSkillMatch(userSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 0;
  
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase().trim());
  const normalizedRequiredSkills = requiredSkills.map(skill => skill.toLowerCase().trim());
  
  const matches = normalizedRequiredSkills.filter(skill =>
    normalizedUserSkills.some(userSkill =>
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );
  
  return (matches.length / normalizedRequiredSkills.length) * 100;
}

// Education level matching
export function calculateEducationMatch(userEducation: string, requiredEducation: string): number {
  const educationHierarchy = {
    '10th pass': 1,
    '12th pass': 2,
    'diploma': 3,
    'bachelor': 4,
    'master': 5,
  };
  
  const getUserLevel = (education: string): number => {
    const normalized = education.toLowerCase();
    for (const [key, value] of Object.entries(educationHierarchy)) {
      if (normalized.includes(key)) return value;
    }
    return 0;
  };
  
  const userLevel = getUserLevel(userEducation);
  const requiredLevel = getUserLevel(requiredEducation);
  
  if (userLevel >= requiredLevel) return 100;
  if (userLevel === requiredLevel - 1) return 75;
  if (userLevel === requiredLevel - 2) return 50;
  return 25;
}

// Generate explanation for recommendation
export function generateRecommendationExplanation(
  matchScores: {
    educationMatch: number;
    skillsMatch: number;
    interestMatch: number;
    locationMatch: number;
  },
  language: 'en' | 'hi' = 'en'
): string {
  const { educationMatch, skillsMatch, interestMatch, locationMatch } = matchScores;
  
  const reasons: string[] = [];
  
  if (language === 'hi') {
    if (educationMatch >= 75) reasons.push('आपकी शिक्षा पूरी तरह मेल खाती है');
    if (skillsMatch >= 60) reasons.push('आपके कौशल अच्छी तरह मैच करते हैं');
    if (interestMatch >= 80) reasons.push('यह आपकी रुचि के क्षेत्र में है');
    if (locationMatch >= 70) reasons.push('आपके स्थान के पास है');
    
    return reasons.length > 0 
      ? `सुझाव दिया गया क्योंकि: ${reasons.join(', ')}`
      : 'आपकी प्रोफाइल के आधार पर सुझाव दिया गया';
  }
  
  if (educationMatch >= 75) reasons.push('perfect education match');
  if (skillsMatch >= 60) reasons.push('strong skills alignment');
  if (interestMatch >= 80) reasons.push('matches your interests');
  if (locationMatch >= 70) reasons.push('convenient location');
  
  return reasons.length > 0 
    ? `Recommended because of ${reasons.join(', ')}`
    : 'Recommended based on your profile';
}
