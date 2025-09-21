'use client';

import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { SimpleProfileForm } from '@/components/forms/SimpleProfileForm';
import { SimpleRecommendationResults } from '@/components/results/SimpleRecommendationResults';
import { UserProfile, InternshipRecommendation } from '@/types';

export default function ProfilePage() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<InternshipRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileComplete = async (profile: UserProfile) => {
    console.log('Profile data being sent:', profile);
    
    // Ensure required fields are present with defaults
    const completeProfile: UserProfile = {
      ...profile,
      id: profile.id || 'temp-' + Date.now(),
      name: profile.name || 'User',
      languagePreference: profile.languagePreference || currentLanguage,
      location: {
        ...profile.location,
        state: profile.location?.state || '',
        city: profile.location?.city || '',
      },
      skills: profile.skills || [],
      interests: profile.interests || [],
      education: profile.education || '',
    };
    
    console.log('Complete profile data:', completeProfile);
    setUserProfile(completeProfile);
    setIsLoading(true);

    try {
      // Call the recommendations API
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile: completeProfile }),
      });

      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        setRecommendations(data.recommendations || []);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        
        // Show user-friendly error message
        alert(`Error: ${errorData.error}\nDetails: ${errorData.details?.join(', ') || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (internshipId: string) => {
    // Redirect to application form or external link
    window.open(`/apply/${internshipId}`, '_blank');
  };

  const handleBack = () => {
    setUserProfile(null);
    setRecommendations([]);
  };

  if (isLoading) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg="linear-gradient(135deg, #3182ce 0%, #2c5282 100%)"
      >
        <Box textAlign="center" color="white">
          <Box 
            w={16} 
            h={16} 
            border="4px solid rgba(255,255,255,0.3)"
            borderTop="4px solid white"
            borderRadius="50%"
            animation="spin 1s linear infinite"
            mx="auto"
            mb={4}
          />
          <Box fontSize="lg" fontWeight="semibold">
            {currentLanguage === 'en' 
              ? 'Finding your perfect internships...' 
              : 'आपकी सही इंटर्नशिप खोजी जा रही है...'}
          </Box>
        </Box>
      </Box>
    );
  }

  if (userProfile && recommendations.length > 0) {
    return (
      <Box bg="gray.50" minH="100vh">
        <SimpleRecommendationResults
          recommendations={recommendations}
          userProfile={userProfile}
          currentLanguage={currentLanguage}
          onApply={handleApply}
          onBack={handleBack}
        />
      </Box>
    );
  }

  return (
    <Box bg="linear-gradient(135deg, #3182ce 0%, #2c5282 100%)" minH="100vh">
      <SimpleProfileForm
        onComplete={handleProfileComplete}
        currentLanguage={currentLanguage}
      />
    </Box>
  );
}
