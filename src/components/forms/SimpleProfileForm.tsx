'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  SimpleGrid,
  Icon,
  Badge,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedText, AnimatedButtonText } from '@/components/ui/AnimatedText';
import { 
  FiUser, 
  FiBook, 
  FiTool, 
  FiHeart, 
  FiMapPin, 
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiStar
} from 'react-icons/fi';
import { UserProfile } from '@/types';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

/**
 * SimpleProfileForm with animated text and streamlined interface
 * 
 * Use this form when you need:
 * - Quick profile creation with minimal steps
 * - Animated text transitions for language switching
 * - Streamlined user experience
 * 
 * For more detailed step-by-step experience, use ProfileForm instead.
 */
interface SimpleProfileFormProps {
  onComplete: (profile: UserProfile) => void;
  currentLanguage: 'en' | 'hi';
}

const educationLevels = {
  en: [
    { value: '10th', label: '10th Pass' },
    { value: '12th', label: '12th Pass' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'postgraduate', label: 'Post Graduate' },
  ],
  hi: [
    { value: '10th', label: '10वीं पास' },
    { value: '12th', label: '12वीं पास' },
    { value: 'diploma', label: 'डिप्लोमा' },
    { value: 'graduate', label: 'स्नातक' },
    { value: 'postgraduate', label: 'स्नातकोत्तर' },
  ]
};

const skillOptions = {
  en: ['Programming', 'Data Analysis', 'Web Development', 'Mobile Apps', 'Digital Marketing', 'Sales', 'Marketing', 'Finance', 'Operations', 'Customer Service', 'Design', 'Writing', 'Photography', 'Video Editing', 'Art'],
  hi: ['प्रोग्रामिंग', 'डेटा विश्लेषण', 'वेब डेवलपमेंट', 'मोबाइल ऐप्स', 'डिजिटल मार्केटिंग', 'बिक्री', 'मार्केटिंग', 'वित्त', 'संचालन', 'ग्राहक सेवा', 'डिज़ाइन', 'लेखन', 'फोटोग्राफी', 'वीडियो संपादन', 'कला']
};

const fieldOfStudyOptions = {
  en: [
    'Computer Science', 'Information Technology', 'Electronics', 'Mechanical Engineering',
    'Civil Engineering', 'Business Administration', 'Commerce', 'Economics', 'Finance',
    'Marketing', 'Arts', 'Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English Literature', 'Psychology', 'Sociology', 'Political Science', 'History',
    'Geography', 'Philosophy', 'Law', 'Medicine', 'Nursing', 'Pharmacy', 'Architecture',
    'Design', 'Mass Communication', 'Journalism', 'Hotel Management', 'Agriculture',
    'Biotechnology', 'Environmental Science', 'Others'
  ],
  hi: [
    'कंप्यूटर साइंस', 'सूचना प्रौद्योगिकी', 'इलेक्ट्रॉनिक्स', 'मैकेनिकल इंजीनियरिंग',
    'सिविल इंजीनियरिंग', 'व्यवसाय प्रशासन', 'वाणिज्य', 'अर्थशास्त्र', 'वित्त',
    'मार्केटिंग', 'कला', 'विज्ञान', 'गणित', 'भौतिकी', 'रसायन', 'जीव विज्ञान',
    'अंग्रेजी साहित्य', 'मनोविज्ञान', 'समाजशास्त्र', 'राजनीति विज्ञान', 'इतिहास',
    'भूगोल', 'दर्शन', 'कानून', 'चिकित्सा', 'नर्सिंग', 'फार्मेसी', 'वास्तुकला',
    'डिज़ाइन', 'मास कम्युनिकेशन', 'पत्रकारिता', 'होटल प्रबंधन', 'कृषि',
    'बायोटेक्नोलॉजी', 'पर्यावरण विज्ञान', 'अन्य'
  ]
};

const interestSectors = {
  en: [
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
    { value: 'retail', label: 'Retail', icon: '🛍️' },
    { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
    { value: 'media', label: 'Media', icon: '📺' },
  ],
  hi: [
    { value: 'technology', label: 'प्रौद्योगिकी', icon: '💻' },
    { value: 'healthcare', label: 'स्वास्थ्य सेवा', icon: '🏥' },
    { value: 'finance', label: 'वित्त', icon: '💰' },
    { value: 'education', label: 'शिक्षा', icon: '📚' },
    { value: 'manufacturing', label: 'विनिर्माण', icon: '🏭' },
    { value: 'retail', label: 'खुदरा', icon: '🛍️' },
    { value: 'agriculture', label: 'कृषि', icon: '🌾' },
    { value: 'media', label: 'मीडिया', icon: '📺' },
  ]
};

export function SimpleProfileForm({ onComplete, currentLanguage }: SimpleProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    skills: [],
    interests: [],
    languagePreference: currentLanguage,
    location: { state: '', city: '' },
  });
  const [showCustomField, setShowCustomField] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { 
      id: 'basic', 
      title: currentLanguage === 'en' ? 'Basic Information' : 'बुनियादी जानकारी',
      icon: FiUser 
    },
    { 
      id: 'education', 
      title: currentLanguage === 'en' ? 'Education' : 'शिक्षा',
      icon: FiBook 
    },
    { 
      id: 'skills', 
      title: currentLanguage === 'en' ? 'Skills' : 'कौशल',
      icon: FiTool 
    },
    { 
      id: 'interests', 
      title: currentLanguage === 'en' ? 'Interests' : 'रुचियां',
      icon: FiHeart 
    },
    { 
      id: 'location', 
      title: currentLanguage === 'en' ? 'Location' : 'स्थान',
      icon: FiMapPin 
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (steps[currentStep].id) {
      case 'basic':
        if (!profile.name?.trim()) {
          newErrors.name = currentLanguage === 'en' ? 'Name is required' : 'नाम आवश्यक है';
        }
        if (!profile.age || profile.age < 16 || profile.age > 35) {
          newErrors.age = currentLanguage === 'en' ? 'Age must be between 16-35' : 'आयु 16-35 के बीच होनी चाहिए';
        }
        break;
      case 'education':
        if (!profile.education) {
          newErrors.education = currentLanguage === 'en' ? 'Education level is required' : 'शिक्षा स्तर आवश्यक है';
        }
        if (!profile.fieldOfStudy?.trim()) {
          newErrors.fieldOfStudy = currentLanguage === 'en' ? 'Field of study is required' : 'अध्ययन क्षेत्र आवश्यक है';
        }
        break;
      case 'skills':
        if (!profile.skills?.length) {
          newErrors.skills = currentLanguage === 'en' ? 'At least one skill is required' : 'कम से कम एक कौशल आवश्यक है';
        }
        break;
      case 'interests':
        if (!profile.interests?.length) {
          newErrors.interests = currentLanguage === 'en' ? 'At least one interest is required' : 'कम से कम एक रुचि आवश्यक है';
        }
        break;
      case 'location':
        if (!profile.location?.state?.trim()) {
          newErrors.state = currentLanguage === 'en' ? 'State is required' : 'राज्य आवश्यक है';
        }
        if (!profile.location?.city?.trim()) {
          newErrors.city = currentLanguage === 'en' ? 'City is required' : 'शहर आवश्यक है';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile as UserProfile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = profile.skills || [];
    if (currentSkills.includes(skill)) {
      updateProfile('skills', currentSkills.filter(s => s !== skill));
    } else {
      updateProfile('skills', [...currentSkills, skill]);
    }
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = profile.interests || [];
    if (currentInterests.includes(interest)) {
      updateProfile('interests', currentInterests.filter(i => i !== interest));
    } else if (currentInterests.length < 3) {
      updateProfile('interests', [...currentInterests, interest]);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return (
          <VStack gap={8} w="full" align="stretch">
            <Box w="full">
              <AnimatedText
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                mb={3}
                color="gray.900"
                letterSpacing="tight"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'Full Name' : 'पूरा नाम'}
              </AnimatedText>
              <Input
                size="lg"
                placeholder={currentLanguage === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                value={profile.name || ''}
                onChange={(e) => updateProfile('name', e.target.value)}
                bg="gray.50"
                color="gray.900"
                borderColor={errors.name ? 'red.500' : 'gray.300'}
                borderWidth="2px"
                borderRadius="xl"
                _placeholder={{ color: "gray.500" }}
                _hover={{ borderColor: "gray.400", bg: "white" }}
                _focus={{
                  borderColor: "orange.500",
                  boxShadow: "0 0 0 3px rgba(255, 153, 51, 0.1)",
                  bg: "white"
                }}
                transition="all 0.2s"
                fontWeight="medium"
              />
              {errors.name && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.name}
                </Text>
              )}
            </Box>

            <Box w="full">
              <AnimatedText
                fontSize="lg"
                fontWeight="semibold"
                mb={2}
                color="gray.800"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'Age' : 'आयु'}
              </AnimatedText>
              <Input
                type="number"
                size="lg"
                placeholder={currentLanguage === 'en' ? 'Enter your age' : 'अपनी आयु दर्ज करें'}
                value={profile.age || ''}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (value === '') {
                    updateProfile('age', undefined);
                  } else {
                    const age = parseInt(value, 10);
                    updateProfile('age', isNaN(age) ? undefined : age);
                  }
                }}
                bg="gray.50"
                color="gray.900"
                borderColor={errors.age ? 'red.500' : 'gray.300'}
                borderWidth="2px"
                borderRadius="xl"
                _placeholder={{ color: "gray.500" }}
                _hover={{ borderColor: "gray.400", bg: "white" }}
                _focus={{
                  borderColor: "orange.500",
                  boxShadow: "0 0 0 3px rgba(255, 153, 51, 0.1)",
                  bg: "white"
                }}
                transition="all 0.2s"
                fontWeight="medium"
              />
              {errors.age && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.age}
                </Text>
              )}
            </Box>

            <Box w="full">
              <AnimatedText
                fontSize="lg"
                fontWeight="semibold"
                mb={3}
                color="gray.800"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'Language Preference' : 'भाषा प्राथमिकता'}
              </AnimatedText>
              <HStack gap={4}>
                <Button
                  variant={profile.languagePreference === 'hi' ? 'solid' : 'outline'}
                  onClick={() => updateProfile('languagePreference', 'hi')}
                  size="lg"
                  color={profile.languagePreference === 'hi' ? 'white' : 'gray.800'}
                  borderColor={profile.languagePreference === 'hi' ? 'orange.500' : 'gray.400'}
                  borderWidth="2px"
                  bg={profile.languagePreference === 'hi' ? 'orange.500' : 'white'}
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    borderColor: profile.languagePreference === 'hi' ? 'orange.600' : 'gray.500',
                    bg: profile.languagePreference === 'hi' ? 'orange.600' : 'gray.50'
                  }}
                  transition="all 0.2s ease"
                  fontWeight="semibold"
                >
                  हिंदी
                </Button>
                <Button
                  variant={profile.languagePreference === 'en' ? 'solid' : 'outline'}
                  onClick={() => updateProfile('languagePreference', 'en')}
                  size="lg"
                  color={profile.languagePreference === 'en' ? 'white' : 'gray.800'}
                  borderColor={profile.languagePreference === 'en' ? 'orange.500' : 'gray.400'}
                  borderWidth="2px"
                  bg={profile.languagePreference === 'en' ? 'orange.500' : 'white'}
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    borderColor: profile.languagePreference === 'en' ? 'orange.600' : 'gray.500',
                    bg: profile.languagePreference === 'en' ? 'orange.600' : 'gray.50'
                  }}
                  transition="all 0.2s ease"
                  fontWeight="semibold"
                >
                  English
                </Button>
              </HStack>
            </Box>
          </VStack>
        );

      case 'education':
        return (
          <VStack gap={6} w="full">
            <Box w="full">
              <AnimatedText
                fontSize="lg"
                fontWeight="semibold"
                mb={3}
                color="gray.800"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'Education Level' : 'शिक्षा स्तर'}
              </AnimatedText>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                {educationLevels[currentLanguage].map((level) => (
                  <Button
                    key={level.value}
                    variant={profile.education === level.value ? 'solid' : 'outline'}
                    size="lg"
                    onClick={() => updateProfile('education', level.value)}
                    bg={profile.education === level.value ? 'orange.500' : 'white'}
                    color={profile.education === level.value ? 'white' : 'gray.800'}
                    borderColor={profile.education === level.value ? 'orange.500' : 'gray.400'}
                    borderWidth="2px"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      bg: profile.education === level.value ? 'orange.600' : 'gray.50',
                      borderColor: profile.education === level.value ? 'orange.600' : 'gray.500'
                    }}
                    transition="all 0.2s ease"
                    fontWeight="semibold"
                  >
                    {level.label}
                  </Button>
                ))}
              </SimpleGrid>
              {errors.education && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.education}
                </Text>
              )}
            </Box>

            <Box w="full">
              <AnimatedText
                fontSize="lg"
                fontWeight="semibold"
                mb={3}
                color="gray.800"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'Field of Study' : 'अध्ययन क्षेत्र'}
              </AnimatedText>
              
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={2} mb={4}>
                {fieldOfStudyOptions[currentLanguage].map((field) => (
                  <Button
                    key={field}
                    variant={profile.fieldOfStudy === field ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (field === (currentLanguage === 'en' ? 'Others' : 'अन्य')) {
                        setShowCustomField(true);
                        updateProfile('fieldOfStudy', '');
                      } else {
                        setShowCustomField(false);
                        updateProfile('fieldOfStudy', field);
                      }
                    }}
                    bg={profile.fieldOfStudy === field ? 'orange.500' : 'white'}
                    color={profile.fieldOfStudy === field ? 'white' : 'gray.700'}
                    borderColor={profile.fieldOfStudy === field ? 'orange.500' : 'gray.300'}
                    borderWidth="1px"
                    fontSize="xs"
                    h="auto"
                    py={2}
                    px={3}
                    _hover={{
                      bg: profile.fieldOfStudy === field ? 'orange.600' : 'gray.50',
                      borderColor: profile.fieldOfStudy === field ? 'orange.600' : 'gray.400'
                    }}
                    transition="all 0.2s ease"
                    fontWeight="medium"
                  >
                    {field}
                  </Button>
                ))}
              </SimpleGrid>

              {showCustomField && (
                <Input
                  size="lg"
                  placeholder={currentLanguage === 'en' ? 'Enter your field of study' : 'अपना अध्ययन क्षेत्र दर्ज करें'}
                  value={profile.fieldOfStudy || ''}
                  onChange={(e) => updateProfile('fieldOfStudy', e.target.value)}
                  bg="gray.50"
                  color="gray.900"
                  borderColor={errors.fieldOfStudy ? 'red.500' : 'gray.300'}
                  borderWidth="2px"
                  borderRadius="xl"
                  _placeholder={{ color: "gray.500" }}
                  _hover={{ borderColor: "gray.400", bg: "white" }}
                  _focus={{
                    borderColor: "orange.500",
                    boxShadow: "0 0 0 3px rgba(255, 153, 51, 0.1)",
                    bg: "white"
                  }}
                  transition="all 0.2s"
                  fontWeight="medium"
                />
              )}
              
              {errors.fieldOfStudy && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.fieldOfStudy}
                </Text>
              )}
            </Box>
          </VStack>
        );

      case 'skills':
        return (
          <VStack gap={6} w="full">
            <AnimatedText
              fontSize="lg"
              textAlign="center"
              color="gray.700"
              fontWeight="medium"
              animationKey={currentLanguage}
              duration={0.3}
            >
              {currentLanguage === 'en' 
                ? 'Select skills that match your abilities' 
                : 'अपनी क्षमताओं से मेल खाने वाले कौशल चुनें'}
            </AnimatedText>
            
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={3} w="full">
              {skillOptions[currentLanguage].map((skill) => (
                <Button
                  key={skill}
                  variant={profile.skills?.includes(skill) ? 'solid' : 'outline'}
                  size="md"
                  onClick={() => toggleSkill(skill)}
                  bg={profile.skills?.includes(skill) ? 'orange.500' : 'white'}
                  color={profile.skills?.includes(skill) ? 'white' : 'gray.800'}
                  borderColor={profile.skills?.includes(skill) ? 'orange.500' : 'gray.400'}
                  borderWidth="2px"
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    bg: profile.skills?.includes(skill) ? 'orange.600' : 'gray.50',
                    borderColor: profile.skills?.includes(skill) ? 'orange.600' : 'gray.500'
                  }}
                  transition="all 0.2s ease"
                  fontWeight="medium"
                >
                  {profile.skills?.includes(skill) && <Icon as={FiCheck} mr={2} />}
                  {skill}
                </Button>
              ))}
            </SimpleGrid>
            {errors.skills && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.skills}
              </Text>
            )}
          </VStack>
        );

      case 'interests':
        return (
          <VStack gap={6} w="full">
            <AnimatedText
              fontSize="lg"
              textAlign="center"
              color="gray.700"
              fontWeight="medium"
              animationKey={currentLanguage}
              duration={0.3}
            >
              {currentLanguage === 'en' 
                ? 'Choose up to 3 sectors that interest you' 
                : 'अपनी रुचि के अधिकतम 3 क्षेत्र चुनें'}
            </AnimatedText>
            
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={4} w="full">
              {interestSectors[currentLanguage].map((sector) => (
                <MotionBox
                  key={sector.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={profile.interests?.includes(sector.value) ? 'solid' : 'outline'}
                    size="lg"
                    h="80px"
                    w="full"
                    flexDirection="column"
                    onClick={() => toggleInterest(sector.value)}
                    disabled={!profile.interests?.includes(sector.value) && (profile.interests?.length || 0) >= 3}
                    bg={profile.interests?.includes(sector.value) ? 'orange.500' : 'white'}
                    color={profile.interests?.includes(sector.value) ? 'white' : 'gray.800'}
                    borderColor={profile.interests?.includes(sector.value) ? 'orange.500' : 'gray.400'}
                    borderWidth="2px"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      bg: profile.interests?.includes(sector.value) ? 'orange.600' : 'gray.50',
                      borderColor: profile.interests?.includes(sector.value) ? 'orange.600' : 'gray.500'
                    }}
                    _disabled={{
                      opacity: 0.5,
                      cursor: "not-allowed",
                      transform: "none",
                      bg: "gray.100",
                      color: "gray.500"
                    }}
                    transition="all 0.2s ease"
                    fontWeight="medium"
                  >
                    <Text fontSize="2xl" mb={1}>{sector.icon}</Text>
                    <Text fontSize="sm">{sector.label}</Text>
                  </Button>
                </MotionBox>
              ))}
            </SimpleGrid>
            
            <VStack gap={2}>
              <AnimatedText
                fontSize="sm"
                color="gray.500"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' 
                  ? `Selected: ${profile.interests?.length || 0}/3` 
                  : `चयनित: ${profile.interests?.length || 0}/3`}
              </AnimatedText>
              {errors.interests && (
                <Text color="red.500" fontSize="sm">
                  {errors.interests}
                </Text>
              )}
            </VStack>
          </VStack>
        );

      case 'location':
        return (
          <VStack gap={6} w="full">
            <Box w="full">
              <AnimatedText
                fontSize="lg"
                fontWeight="semibold"
                mb={2}
                color="gray.800"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'State' : 'राज्य'}
              </AnimatedText>
              <Input
                size="lg"
                placeholder={currentLanguage === 'en' ? 'Enter your state' : 'अपना राज्य दर्ज करें'}
                value={profile.location?.state || ''}
                onChange={(e) => updateProfile('location', { ...(profile.location || { state: '', city: '' }), state: e.target.value })}
                bg="gray.50"
                color="gray.900"
                borderColor={errors.state ? 'red.500' : 'gray.300'}
                borderWidth="2px"
                borderRadius="xl"
                _placeholder={{ color: "gray.500" }}
                _hover={{ borderColor: "gray.400", bg: "white" }}
                _focus={{
                  borderColor: "orange.500",
                  boxShadow: "0 0 0 3px rgba(255, 153, 51, 0.1)",
                  bg: "white"
                }}
                transition="all 0.2s"
                fontWeight="medium"
              />
              {errors.state && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.state}
                </Text>
              )}
            </Box>

            <Box w="full">
              <AnimatedText
                fontSize="lg"
                fontWeight="semibold"
                mb={2}
                color="gray.800"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'City' : 'शहर'}
              </AnimatedText>
              <Input
                size="lg"
                placeholder={currentLanguage === 'en' ? 'Enter your city' : 'अपना शहर दर्ज करें'}
                value={profile.location?.city || ''}
                onChange={(e) => updateProfile('location', { ...(profile.location || { state: '', city: '' }), city: e.target.value })}
                bg="gray.50"
                color="gray.900"
                borderColor={errors.city ? 'red.500' : 'gray.300'}
                borderWidth="2px"
                borderRadius="xl"
                _placeholder={{ color: "gray.500" }}
                _hover={{ borderColor: "gray.400", bg: "white" }}
                _focus={{
                  borderColor: "orange.500",
                  boxShadow: "0 0 0 3px rgba(255, 153, 51, 0.1)",
                  bg: "white"
                }}
                transition="all 0.2s"
                fontWeight="medium"
              />
              {errors.city && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.city}
                </Text>
              )}
            </Box>

            <Box w="full">
              <HStack>
                <Button
                  variant={profile.openToRemote ? 'solid' : 'outline'}
                  onClick={() => updateProfile('openToRemote', !profile.openToRemote)}
                  size="lg"
                  bg={profile.openToRemote ? 'orange.500' : 'white'}
                  color={profile.openToRemote ? 'white' : 'gray.800'}
                  borderColor={profile.openToRemote ? 'orange.500' : 'gray.400'}
                  borderWidth="2px"
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    bg: profile.openToRemote ? 'orange.600' : 'gray.50',
                    borderColor: profile.openToRemote ? 'orange.600' : 'gray.500'
                  }}
                  transition="all 0.2s ease"
                  fontWeight="semibold"
                >
                  {profile.openToRemote && <Icon as={FiCheck} mr={2} />}
                  <AnimatedButtonText animationKey={currentLanguage}>
                    {currentLanguage === 'en' ? 'Open to remote work' : 'रिमोट वर्क के लिए तैयार'}
                  </AnimatedButtonText>
                </Button>
              </HStack>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg="linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: 'rgba(0, 47, 108, 0.85)',
        zIndex: 0
      }}
    >
      <Container maxW="6xl" py={8} position="relative" zIndex={1}>
        <MotionVStack
          gap={8}
          w="full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
        {/* Government Header */}
        <VStack gap={6} w="full" textAlign="center" mb={8}>
          <VStack gap={2}>
            <Icon as={FiStar} boxSize={12} color="#FFD700" />
            <Heading 
              size={{ base: "lg", md: "xl" }} 
              color="white" 
              textAlign="center"
              fontWeight="bold"
              letterSpacing="wide"
            >
              प्रधानमंत्री इंटर्नशिप योजना
            </Heading>
            <Text color="rgba(255,255,255,0.9)" fontSize="lg" fontWeight="medium">
              PM Internship Scheme - Profile Registration
            </Text>
          </VStack>
          
          <Box bg="white" borderRadius="xl" w="full" maxW="2xl" boxShadow="lg" p={6}>
            <VStack gap={4}>
              <HStack justify="space-between" w="full">
                <Text fontSize="lg" fontWeight="bold" color="blue.800">
                  {steps[currentStep].title}
                </Text>
                <Badge 
                  colorScheme="orange" 
                  fontSize="sm" 
                  px={3} 
                  py={1}
                  borderRadius="full"
                >
                  Step {currentStep + 1} of {steps.length}
                </Badge>
              </HStack>
              <Box w="full" bg="gray.200" borderRadius="full" h={3}>
                <Box 
                  w={`${progress}%`} 
                  bg="orange.500" 
                  borderRadius="full" 
                  h={3}
                  transition="width 0.5s ease"
                />
              </Box>
            </VStack>
          </Box>
        </VStack>

        {/* Step Content */}
        <MotionBox
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          w="full"
          maxW="4xl"
          mx="auto"
        >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="0 20px 40px rgba(0,0,0,0.1)"
            border="3px solid"
            borderColor="orange.400"
            position="relative"
            overflow="hidden"
            p={{ base: 6, md: 8 }}
            pt={10}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              bg: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
              zIndex: 1
            }}
          >
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <HStack justify="space-between" w="full" mt={8} pt={6} borderTop="1px solid" borderColor="gray.200">
              <Button
                variant="outline"
                size={{ base: "md", md: "lg" }}
                onClick={handlePrevious}
                disabled={currentStep === 0}
                borderColor="gray.400"
                color="gray.700"
                borderWidth="2px"
                _hover={{
                  borderColor: "gray.600",
                  color: "gray.800",
                  bg: "gray.50"
                }}
                _disabled={{ 
                  opacity: 0.4,
                  color: "gray.400",
                  borderColor: "gray.300"
                }}
              >
                <Icon as={FiArrowLeft} mr={2} />
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentLanguage === 'en' ? 'Previous' : 'पिछला'}
                </AnimatedButtonText>
              </Button>

              <Button
                size={{ base: "md", md: "lg" }}
                onClick={handleNext}
                bg="linear-gradient(135deg, #FF9933 0%, #FF6600 100%)"
                color="white"
                _hover={{ 
                  bg: "linear-gradient(135deg, #FF6600 0%, #FF4400 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(255, 102, 0, 0.3)"
                }}
                fontWeight="bold"
                px={8}
              >
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentStep === steps.length - 1 
                    ? (currentLanguage === 'en' ? 'Submit Application' : 'आवेदन जमा करें')
                    : (currentLanguage === 'en' ? 'Next Step' : 'अगला कदम')
                  }
                </AnimatedButtonText>
                <Icon as={currentStep === steps.length - 1 ? FiCheck : FiArrowRight} ml={2} />
              </Button>
            </HStack>
          </Box>
        </MotionBox>

        </MotionVStack>
      </Container>
    </Box>
  );
}
