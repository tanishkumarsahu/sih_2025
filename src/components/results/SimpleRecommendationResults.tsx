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
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiClock, 
  FiUsers, 
  FiTrendingUp,
  FiExternalLink,
  FiHeart,
  FiBookmark,
  FiArrowLeft,
} from 'react-icons/fi';
import { InternshipRecommendation, UserProfile } from '@/types';
import { useToaster } from '@/components/ui/toaster';

const MotionBox = motion(Box);

interface SimpleRecommendationResultsProps {
  recommendations: InternshipRecommendation[];
  userProfile: UserProfile;
  currentLanguage: 'en' | 'hi';
  onApply: (internshipId: string) => void;
  onBack: () => void;
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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
    >
      <Box
        bg="white"
        borderRadius="xl"
        p={6}
        boxShadow="0 4px 12px rgba(0,0,0,0.1)"
        border="1px solid"
        borderColor="gray.200"
        position="relative"
        overflow="hidden"
      >
        {/* Match Score Badge */}
        <Badge
          position="absolute"
          top={4}
          right={4}
          colorScheme={internship.matchScore >= 80 ? 'green' : internship.matchScore >= 60 ? 'yellow' : 'red'}
          fontSize="sm"
          px={3}
          py={1}
          borderRadius="full"
        >
          {internship.matchScore}% Match
        </Badge>

        {/* Company Logo Placeholder */}
        <Box
          w={12}
          h={12}
          bg="brand.100"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={4}
        >
          <Icon as={FiUsers} color="brand.600" boxSize={6} />
        </Box>

        {/* Title and Company */}
        <VStack align="start" gap={2} mb={4}>
          <Heading size="md" color="gray.800" lineHeight="1.3">
            {internship.title}
          </Heading>
          <Text fontSize="lg" fontWeight="semibold" color="brand.600">
            {internship.company}
          </Text>
        </VStack>

        {/* Location and Details */}
        <VStack align="start" gap={3} mb={4}>
          <HStack>
            <Icon as={FiMapPin} color="gray.500" />
            <Text fontSize="sm" color="gray.600">
              {internship.location}
            </Text>
          </HStack>
          
          <HStack>
            <Text fontSize="sm" color="gray.500" fontWeight="bold">₹</Text>
            <Text fontSize="sm" color="gray.600">
              {formatStipend(internship.stipend)}/month
            </Text>
          </HStack>

          <HStack>
            <Icon as={FiClock} color="gray.500" />
            <Text fontSize="sm" color="gray.600">
              {internship.duration}
            </Text>
          </HStack>
        </VStack>

        {/* Description */}
        <Text fontSize="sm" color="gray.700" mb={4} lineHeight="1.5">
          {internship.description}
        </Text>

        {/* Why Recommended */}
        {internship.whyRecommended && (
          <Box p={3} bg="blue.50" borderRadius="md" mb={4}>
            <Text fontSize="sm" color="blue.800" fontWeight="medium">
              💡 {internship.whyRecommended}
            </Text>
          </Box>
        )}

        {/* Skills Required */}
        {internship.requirements && internship.requirements.length > 0 && (
          <Box mb={4}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
              {currentLanguage === 'en' ? 'Skills Required:' : 'आवश्यक कौशल:'}
            </Text>
            <Flex wrap="wrap" gap={2}>
              {internship.requirements.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} colorScheme="brand" variant="subtle" fontSize="xs">
                  {skill}
                </Badge>
              ))}
              {internship.requirements.length > 3 && (
                <Badge variant="outline" fontSize="xs">
                  +{internship.requirements.length - 3} more
                </Badge>
              )}
            </Flex>
          </Box>
        )}

        {/* Action Buttons */}
        <HStack justify="space-between" pt={4} borderTop="1px solid" borderColor="gray.100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            colorScheme={isBookmarked ? 'brand' : 'gray'}
          >
            <Icon as={FiBookmark} mr={2} />
            {currentLanguage === 'en' ? 'Save' : 'सेव करें'}
          </Button>
          
          <Button
            colorScheme="brand"
            size="md"
            onClick={() => onApply(internship.id)}
          >
            <Icon as={FiExternalLink} mr={2} />
            {currentLanguage === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}
          </Button>
        </HStack>
      </Box>
    </MotionBox>
  );
}

export function SimpleRecommendationResults({ 
  recommendations, 
  userProfile, 
  currentLanguage, 
  onApply,
  onBack 
}: SimpleRecommendationResultsProps) {
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
        <VStack align="start" gap={6} mb={8}>
          <HStack>
            <Button
              variant="ghost"
              size="lg"
              onClick={onBack}
            >
              <Icon as={FiArrowLeft} mr={2} />
              {currentLanguage === 'en' ? 'Back to Profile' : 'प्रोफाइल पर वापस'}
            </Button>
          </HStack>

          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              {currentLanguage === 'en' 
                ? `Perfect Matches for ${userProfile.name || 'You'}` 
                : `${userProfile.name || 'आपके'} लिए सही मैच`}
            </Heading>
            <Text fontSize="lg" color="gray.600">
              {currentLanguage === 'en' 
                ? `Found ${recommendations.length} personalized internship recommendations` 
                : `${recommendations.length} व्यक्तिगत इंटर्नशिप सिफारिशें मिलीं`}
            </Text>
          </Box>
        </VStack>

        {/* Recommendations Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={8}>
          {recommendations.map((internship, index) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              currentLanguage={currentLanguage}
              onApply={handleApply}
              index={index}
            />
          ))}
        </SimpleGrid>

        {/* Footer Actions */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <HStack justify="center" gap={4} pt={8}>
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
            >
              <Icon as={FiTrendingUp} mr={2} />
              {currentLanguage === 'en' ? 'Get More Recommendations' : 'और सिफारिशें प्राप्त करें'}
            </Button>
          </HStack>
        </MotionBox>
      </MotionBox>
    </Container>
  );
}
