'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { useToaster } from '@/components/ui/toaster';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiDollarSign, 
  FiClock, 
  FiUsers, 
  FiTrendingUp,
  FiExternalLink,
  FiHeart,
  FiBookmark,
  FiInfo
} from 'react-icons/fi';
import { InternshipRecommendation, UserProfile } from '@/types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface RecommendationResultsProps {
  recommendations: InternshipRecommendation[];
  userProfile: UserProfile;
  currentLanguage: 'en' | 'hi';
  onApply: (internshipId: string) => void;
  onBack: () => void;
}

interface FitMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function FitMeter({ score, size = 'md' }: FitMeterProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const sizeMap = {
    sm: { w: 16, h: 16, text: 'xs' },
    md: { w: 20, h: 20, text: 'sm' },
    lg: { w: 24, h: 24, text: 'md' }
  };

  return (
    <Box position="relative" w={sizeMap[size].w} h={sizeMap[size].h}>
      <Progress
        value={score}
        colorScheme={getColor(score)}
        size="lg"
        borderRadius="full"
        bg="gray.100"
        sx={{
          '& > div': {
            borderRadius: 'full',
          }
        }}
      />
      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        fontSize={sizeMap[size].text}
        fontWeight="bold"
        color="gray.700"
      >
        {score}%
      </Text>
    </Box>
  );
}

function InternshipCard({ 
  internship, 
  currentLanguage, 
  onApply, 
  index 
}: { 
  internship: InternshipRecommendation; 
  currentLanguage: 'en' | 'hi'; 
  onApply: (id: string) => void;
  index: number;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const toast = useToaster();

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.create({
      title: isBookmarked 
        ? (currentLanguage === 'en' ? 'Removed from bookmarks' : 'बुकमार्क से हटाया गया')
        : (currentLanguage === 'en' ? 'Added to bookmarks' : 'बुकमार्क में जोड़ा गया'),
      status: 'success',
    });
  };

  const formatStipend = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: 'xl' }}
      size="lg"
      variant="elevated"
      cursor="pointer"
      onClick={() => setShowDetails(!showDetails)}
    >
      <CardBody p={6}>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <Flex justify="space-between" align="start">
            <VStack align="start" gap={2} flex={1}>
              <HStack>
                <Avatar size="sm" name={internship.company} src={internship.companyLogo} />
                <VStack align="start" gap={0}>
                  <Heading size="md" color="brand.600" noOfLines={1}>
                    {internship.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {internship.company}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            
            <VStack align="end" gap={2}>
              <FitMeter score={internship.matchScore || 75} size="md" />
              <Text fontSize="xs" color="gray.500">
                {currentLanguage === 'en' ? 'Fit Score' : 'फिट स्कोर'}
              </Text>
            </VStack>
          </Flex>

          {/* Key Details */}
          <SimpleGrid columns={3} gap={4}>
            <VStack gap={1}>
              <HStack color="green.500">
                <Icon as={FiDollarSign} />
                <Text fontSize="sm" fontWeight="semibold">
                  {formatStipend(internship.stipend)}
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {currentLanguage === 'en' ? 'Stipend' : 'वेतन'}
              </Text>
            </VStack>

            <VStack gap={1}>
              <HStack color="blue.500">
                <Icon as={FiMapPin} />
                <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
                  {internship.location}
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {currentLanguage === 'en' ? 'Location' : 'स्थान'}
              </Text>
            </VStack>

            <VStack gap={1}>
              <HStack color="purple.500">
                <Icon as={FiClock} />
                <Text fontSize="sm" fontWeight="semibold">
                  {internship.duration} {currentLanguage === 'en' ? 'months' : 'महीने'}
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {currentLanguage === 'en' ? 'Duration' : 'अवधि'}
              </Text>
            </VStack>
          </SimpleGrid>

          {/* Description */}
          <Text fontSize="sm" color="gray.700" noOfLines={showDetails ? undefined : 2}>
            {internship.description}
          </Text>

          {/* Skills Match */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.700">
              {currentLanguage === 'en' ? 'Matching Skills:' : 'मेल खाने वाले कौशल:'}
            </Text>
            <Flex wrap="wrap" gap={2}>
              {internship.requirements?.slice(0, showDetails ? undefined : 3).map((skill: string, idx: number) => (
                <Badge key={idx} colorScheme="brand" variant="subtle" fontSize="xs">
                  {skill}
                </Badge>
              ))}
              {!showDetails && (internship.requirements?.length || 0) > 3 && (
                <Badge variant="outline" fontSize="xs">
                  +{(internship.requirements?.length || 0) - 3} more
                </Badge>
              )}
            </Flex>
          </Box>

          {/* Why Recommended */}
          {showDetails && internship.whyRecommended && (
            <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.400">
              <HStack mb={2}>
                <Icon as={FiInfo} color="blue.500" />
                <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                  {currentLanguage === 'en' ? 'Why recommended for you:' : 'आपके लिए क्यों सुझाया गया:'}
                </Text>
              </HStack>
              <Text fontSize="sm" color="blue.600">
                {internship.whyRecommended}
              </Text>
            </Box>
          )}

          <Divider />

          {/* Action Buttons */}
          <HStack justify="space-between">
            <HStack gap={2}>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Icon as={FiBookmark} />}
                colorScheme={isBookmarked ? 'brand' : 'gray'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmark();
                }}
              >
                {isBookmarked 
                  ? (currentLanguage === 'en' ? 'Saved' : 'सेव किया गया')
                  : (currentLanguage === 'en' ? 'Save' : 'सेव करें')
                }
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
              >
                {showDetails 
                  ? (currentLanguage === 'en' ? 'Less Details' : 'कम विवरण')
                  : (currentLanguage === 'en' ? 'More Details' : 'अधिक विवरण')
                }
              </Button>
            </HStack>

            <Button
              colorScheme="brand"
              size="md"
              rightIcon={<Icon as={FiExternalLink} />}
              onClick={(e) => {
                e.stopPropagation();
                onApply(internship.id);
              }}
            >
              {currentLanguage === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}

export function RecommendationResults({ 
  recommendations, 
  userProfile, 
  currentLanguage, 
  onApply,
  onBack 
}: RecommendationResultsProps) {
  const toast = useToaster();

  const handleApply = (internshipId: string) => {
    toast.create({
      title: currentLanguage === 'en' ? 'Application Started' : 'आवेदन शुरू किया गया',
      description: currentLanguage === 'en' 
        ? 'Redirecting to application form...' 
        : 'आवेदन फॉर्म पर रीडायरेक्ट कर रहे हैं...',
      status: 'success',
    });
    onApply(internshipId);
  };

  return (
    <Container maxW="6xl" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <VStack gap={6} mb={8}>
          <VStack gap={2} textAlign="center">
            <Heading size="xl" color="brand.600">
              {currentLanguage === 'en' 
                ? 'Your Personalized Recommendations' 
                : 'आपकी व्यक्तिगत सिफारिशें'}
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              {currentLanguage === 'en'
                ? `Based on your profile, we found ${recommendations.length} internships that match your skills and interests.`
                : `आपकी प्रोफाइल के आधार पर, हमें ${recommendations.length} इंटर्नशिप मिली हैं जो आपके कौशल और रुचियों से मेल खाती हैं।`}
            </Text>
          </VStack>

          {/* Summary Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={6} w="full" maxW="2xl">
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                {recommendations.length}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {currentLanguage === 'en' ? 'Recommendations' : 'सिफारिशें'}
              </Text>
            </VStack>
            
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {Math.round(recommendations.reduce((acc, r) => acc + (r.matchScore || 0), 0) / recommendations.length)}%
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {currentLanguage === 'en' ? 'Avg. Match' : 'औसत मैच'}
              </Text>
            </VStack>
            
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                {Math.round(recommendations.reduce((acc, r) => acc + r.stipend, 0) / recommendations.length / 1000)}K
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {currentLanguage === 'en' ? 'Avg. Stipend' : 'औसत वेतन'}
              </Text>
            </VStack>
            
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {new Set(recommendations.map(r => r.location)).size}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {currentLanguage === 'en' ? 'Locations' : 'स्थान'}
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>

        {/* Recommendations Grid */}
        <VStack gap={6}>
          {recommendations.map((internship, index) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              currentLanguage={currentLanguage}
              onApply={handleApply}
              index={index}
            />
          ))}
        </VStack>

        {/* Footer Actions */}
        <HStack justify="center" pt={8} gap={4}>
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
          >
            {currentLanguage === 'en' ? 'Modify Profile' : 'प्रोफाइल संशोधित करें'}
          </Button>
          
          <Button
            colorScheme="brand"
            size="lg"
            rightIcon={<Icon as={FiTrendingUp} />}
          >
            {currentLanguage === 'en' ? 'Get More Recommendations' : 'और सिफारिशें प्राप्त करें'}
          </Button>
        </HStack>
      </MotionBox>
    </Container>
  );
}
