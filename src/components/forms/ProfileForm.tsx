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
  Progress,
  FormControl,
  FormLabel,
  Select,
  RadioGroup,
  Radio,
  Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiBook, 
  FiTool, 
  FiHeart, 
  FiMapPin,
  FiArrowRight,
  FiArrowLeft,
  FiCheck
} from 'react-icons/fi';
import { UserProfile } from '@/types';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

/**
 * Enhanced ProfileForm with step-by-step wizard interface
 * 
 * Use this form when you need:
 * - Multi-step form experience with progress indicators
 * - More detailed form validation
 * - Enhanced user experience with step navigation
 * 
 * For simpler use cases, consider using SimpleProfileForm instead.
 */
interface ProfileFormProps {
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

const skillCategories = {
  en: [
    { category: 'Technical', skills: ['Programming', 'Data Analysis', 'Web Development', 'Mobile Apps', 'Digital Marketing'] },
    { category: 'Business', skills: ['Sales', 'Marketing', 'Finance', 'Operations', 'Customer Service'] },
    { category: 'Creative', skills: ['Design', 'Writing', 'Photography', 'Video Editing', 'Art'] },
    { category: 'Communication', skills: ['Public Speaking', 'Writing', 'Languages', 'Presentation', 'Teaching'] },
  ],
  hi: [
    { category: 'तकनीकी', skills: ['प्रोग्रामिंग', 'डेटा विश्लेषण', 'वेब डेवलपमेंट', 'मोबाइल ऐप्स', 'डिजिटल मार्केटिंग'] },
    { category: 'व्यवसाय', skills: ['बिक्री', 'मार्केटिंग', 'वित्त', 'संचालन', 'ग्राहक सेवा'] },
    { category: 'रचनात्मक', skills: ['डिज़ाइन', 'लेखन', 'फोटोग्राफी', 'वीडियो संपादन', 'कला'] },
    { category: 'संचार', skills: ['सार्वजनिक भाषण', 'लेखन', 'भाषाएं', 'प्रस्तुति', 'शिक्षण'] },
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

export function ProfileForm({ onComplete, currentLanguage }: ProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    skills: [],
    interests: [],
    languagePreference: currentLanguage,
    location: { state: '', city: '' },
  });

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

  const handleNext = () => {
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

  const updateProfile = (field: string, value: unknown) => {
    setProfile(prev => ({ ...prev, [field]: value }));
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
          <VStack gap={6} w="full">
            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                {currentLanguage === 'en' ? 'Full Name' : 'पूरा नाम'}
              </FormLabel>
              <Input
                size="lg"
                placeholder={currentLanguage === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                value={profile.name || ''}
                onChange={(e) => updateProfile('name', e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                {currentLanguage === 'en' ? 'Age' : 'आयु'}
              </FormLabel>
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
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                {currentLanguage === 'en' ? 'Language Preference' : 'भाषा प्राथमिकता'}
              </FormLabel>
              <RadioGroup
                value={profile.languagePreference}
                onChange={(value) => updateProfile('languagePreference', value)}
              >
                <Stack direction="row" gap={6}>
                  <Radio value="hi" size="lg">हिंदी</Radio>
                  <Radio value="en" size="lg">English</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </VStack>
        );

      case 'education':
        return (
          <VStack gap={6} w="full">
            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                {currentLanguage === 'en' ? 'Education Level' : 'शिक्षा स्तर'}
              </FormLabel>
              <Select
                size="lg"
                placeholder={currentLanguage === 'en' ? 'Select your education level' : 'अपना शिक्षा स्तर चुनें'}
                value={profile.education || ''}
                onChange={(e) => updateProfile('education', e.target.value)}
              >
                {educationLevels[currentLanguage].map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                {currentLanguage === 'en' ? 'Field of Study' : 'अध्ययन क्षेत्र'}
              </FormLabel>
              <Input
                size="lg"
                placeholder={currentLanguage === 'en' ? 'e.g., Computer Science, Commerce' : 'जैसे, कंप्यूटर साइंस, वाणिज्य'}
                value={profile.fieldOfStudy || ''}
                onChange={(e) => updateProfile('fieldOfStudy', e.target.value)}
              />
            </FormControl>
          </VStack>
        );

      case 'skills':
        return (
          <VStack gap={6} w="full">
            <Text fontSize="lg" textAlign="center" color="gray.600">
              {currentLanguage === 'en' 
                ? 'Select skills that match your abilities' 
                : 'अपनी क्षमताओं से मेल खाने वाले कौशल चुनें'}
            </Text>
            
            {skillCategories[currentLanguage].map((category) => (
              <Box key={category.category} w="full">
                <Heading size="md" mb={3} color="brand.600">
                  {category.category}
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
                  {category.skills.map((skill) => (
                    <Button
                      key={skill}
                      variant={profile.skills?.includes(skill) ? 'solid' : 'outline'}
                      colorScheme={profile.skills?.includes(skill) ? 'brand' : 'gray'}
                      size="md"
                      onClick={() => toggleSkill(skill)}
                      leftIcon={profile.skills?.includes(skill) ? <Icon as={FiCheck} /> : undefined}
                    >
                      {skill}
                    </Button>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        );

      case 'interests':
        return (
          <VStack gap={6} w="full">
            <Text fontSize="lg" textAlign="center" color="gray.600">
              {currentLanguage === 'en' 
                ? 'Choose up to 3 sectors that interest you' 
                : 'अपनी रुचि के अधिकतम 3 क्षेत्र चुनें'}
            </Text>
            
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={4} w="full">
              {interestSectors[currentLanguage].map((sector) => (
                <MotionBox
                  key={sector.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={profile.interests?.includes(sector.value) ? 'solid' : 'outline'}
                    colorScheme={profile.interests?.includes(sector.value) ? 'brand' : 'gray'}
                    size="lg"
                    h="80px"
                    w="full"
                    flexDirection="column"
                    onClick={() => toggleInterest(sector.value)}
                    isDisabled={!profile.interests?.includes(sector.value) && (profile.interests?.length || 0) >= 3}
                  >
                    <Text fontSize="2xl" mb={1}>{sector.icon}</Text>
                    <Text fontSize="sm">{sector.label}</Text>
                  </Button>
                </MotionBox>
              ))}
            </SimpleGrid>
            
            <Text fontSize="sm" color="gray.500">
              {currentLanguage === 'en' 
                ? `Selected: ${profile.interests?.length || 0}/3` 
                : `चयनित: ${profile.interests?.length || 0}/3`}
            </Text>
          </VStack>
        );

      case 'location':
        return (
          <VStack gap={6} w="full">
            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                {currentLanguage === 'en' ? 'State' : 'राज्य'}
              </FormLabel>
              <Input
                size="lg"
                placeholder={currentLanguage === 'en' ? 'Enter your state' : 'अपना राज्य दर्ज करें'}
                value={profile.location?.state || ''}
                onChange={(e) => updateProfile('location', { ...(profile.location || { state: '', city: '' }), state: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                {currentLanguage === 'en' ? 'City' : 'शहर'}
              </FormLabel>
              <Input
                size="lg"
                placeholder={currentLanguage === 'en' ? 'Enter your city' : 'अपना शहर दर्ज करें'}
                value={profile.location?.city || ''}
                onChange={(e) => updateProfile('location', { ...(profile.location || { state: '', city: '' }), city: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                <HStack>
                  <Checkbox
                    isChecked={profile.openToRemote || false}
                    onChange={(e) => updateProfile('openToRemote', e.target.checked)}
                  />
                  <Text>{currentLanguage === 'en' ? 'Open to remote work' : 'रिमोट वर्क के लिए तैयार'}</Text>
                </HStack>
              </FormLabel>
            </FormControl>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxW="4xl" py={8}>
      <MotionVStack
        gap={8}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Header */}
        <Box w="full">
          <HStack justify="space-between" mb={4}>
            <Heading size="lg" color="brand.600">
              {steps[currentStep].title}
            </Heading>
            <Badge colorScheme="brand" fontSize="sm" px={3} py={1}>
              {currentStep + 1} / {steps.length}
            </Badge>
          </HStack>
          
          <Progress value={progress} colorScheme="brand" size="lg" borderRadius="full" />
          
          <HStack justify="center" mt={6} gap={4}>
            {steps.map((step, index) => (
              <VStack key={step.id} gap={2}>
                <Box
                  w={12}
                  h={12}
                  borderRadius="full"
                  bg={index <= currentStep ? 'brand.500' : 'gray.200'}
                  color={index <= currentStep ? 'white' : 'gray.500'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={step.icon} boxSize={5} />
                </Box>
                <Text fontSize="xs" textAlign="center" maxW="16">
                  {step.title}
                </Text>
              </VStack>
            ))}
          </HStack>
        </Box>

        {/* Step Content */}
        <MotionBox
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          w="full"
          minH="400px"
          p={8}
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
        >
          {renderStepContent()}
        </MotionBox>

        {/* Navigation Buttons */}
        <HStack justify="space-between" w="full" pt={4}>
          <Button
            leftIcon={<Icon as={FiArrowLeft} />}
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            isDisabled={currentStep === 0}
          >
            {currentLanguage === 'en' ? 'Previous' : 'पिछला'}
          </Button>

          <Button
            rightIcon={<Icon as={currentStep === steps.length - 1 ? FiCheck : FiArrowRight} />}
            colorScheme="brand"
            size="lg"
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 
              ? (currentLanguage === 'en' ? 'Get Recommendations' : 'सिफारिशें प्राप्त करें')
              : (currentLanguage === 'en' ? 'Next' : 'अगला')
            }
          </Button>
        </HStack>
      </MotionVStack>
    </Container>
  );
}
