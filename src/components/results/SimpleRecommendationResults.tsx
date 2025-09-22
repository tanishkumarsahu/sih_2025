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

  // Determine match score colors based on PM Internship Scheme theme
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'success.500', color: 'white' };
    if (score >= 60) return { bg: 'warning.500', color: 'gray.800' };
    return { bg: 'error.500', color: 'white' };
  };

  const matchColors = getMatchScoreColor(internship.matchScore);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -6, 
        boxShadow: "0 12px 30px rgba(255, 153, 51, 0.15)",
        borderColor: "brand.300"
      }}
      w="full"
      h="full"
    >
      <Box
        bg="white"
        borderRadius={{ base: "xl", md: "2xl" }}
        p={{ base: 4, md: 5 }}
        boxShadow="0 2px 12px rgba(0, 0, 0, 0.06)"
        border="1px solid"
        borderColor="gray.200"
        position="relative"
        overflow="hidden"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        h="full"
        display="flex"
        flexDirection="column"
        minH={{ base: "320px", md: "380px" }}
        maxW={{ base: "100%", md: "400px" }}
        _hover={{
          borderColor: "brand.300",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}
        _focusWithin={{
          borderColor: "brand.500",
          boxShadow: "0 0 0 2px rgba(255, 153, 51, 0.2)",
        }}
        role="article"
        aria-label={`${internship.title} at ${internship.company}, ${internship.matchScore}% match`}
      >
        {/* Match Score Badge - Prominent Display */}
        <Box
          position="absolute"
          top={0}
          right={0}
          bg={matchColors.bg}
          color={matchColors.color}
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 2 }}
          borderBottomLeftRadius="xl"
          fontSize={{ base: "sm", md: "md" }}
          fontWeight="bold"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
        >
          {internship.matchScore}% {currentLanguage === 'en' ? 'Match' : 'मैच'}
        </Box>

        {/* Header Section - Consistent Layout */}
        <Box mb={4} pr={{ base: 12, md: 16 }}>
          {/* Company Logo with Guaranteed Visibility */}
          <Box
            w={{ base: 12, md: 14 }}
            h={{ base: 12, md: 14 }}
            bg="#FF9933"
            border="2px solid #FF6600"
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={4}
            flexShrink={0}
            boxShadow="0 4px 12px rgba(255, 153, 51, 0.4)"
            position="relative"
            css={{
              '& svg': {
                color: '#FFFFFF !important',
                stroke: '#FFFFFF !important',
                strokeWidth: '2.5px !important',
                fill: 'none !important',
                opacity: '1 !important',
                visibility: 'visible !important',
                display: 'block !important'
              }
            }}
          >
            <Icon 
              as={FiUsers} 
              w={{ base: "24px", md: "28px" }}
              h={{ base: "24px", md: "28px" }}
              color="#FFFFFF"
              style={{
                color: '#FFFFFF',
                stroke: '#FFFFFF',
                strokeWidth: '2.5px',
                fill: 'none',
                opacity: 1,
                visibility: 'visible'
              }}
            />
          </Box>

          {/* Job Title - Consistent Height */}
          <Box minH={{ base: "48px", md: "56px" }} mb={2}>
            <Heading 
              size={{ base: "sm", md: "md" }} 
              color="gray.800" 
              lineHeight="1.3"
              fontWeight="bold"
              lineClamp={2}
              fontSize={{ base: "16px", md: "18px" }}
            >
              {internship.title}
            </Heading>
          </Box>

          {/* Company Name - High Visibility */}
          <Box minH={{ base: "28px", md: "32px" }}>
            <Text 
              fontSize={{ base: "15px", md: "17px" }} 
              fontWeight="bold" 
              color="gray.700"
              lineClamp={1}
            >
              {internship.company}
            </Text>
          </Box>
        </Box>

        {/* Key Information Grid - Consistent Layout */}
        <Box mb={4} minH={{ base: "90px", md: "100px" }}>
          <VStack align="stretch" gap={{ base: 2, md: 3 }}>
            {/* Location */}
            <HStack align="center" gap={3} minH="32px">
              <Box
                w={{ base: 8, md: 9 }}
                h={{ base: 8, md: 9 }}
                bg="#FEE2E2"
                border="1px solid #FCA5A5"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon 
                  as={FiMapPin} 
                  w={{ base: "16px", md: "20px" }}
                  h={{ base: "16px", md: "20px" }}
                  color="#DC2626"
                  style={{
                    color: '#DC2626',
                    stroke: '#DC2626',
                    strokeWidth: '2px',
                    fill: 'none',
                    opacity: 1,
                    visibility: 'visible'
                  }}
                />
              </Box>
              <Text 
                fontSize={{ base: "14px", md: "15px" }} 
                color="#1F2937"
                fontWeight="medium"
                flex="1"
                lineClamp={1}
              >
                {internship.location}
              </Text>
            </HStack>

            {/* Stipend with Indian Rupee Symbol */}
            <HStack align="center" gap={3} minH="32px">
              <Box
                w={{ base: 8, md: 9 }}
                h={{ base: 8, md: 9 }}
                bg="#DCFCE7"
                border="1px solid #86EFAC"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text 
                  fontSize={{ base: "14px", md: "15px" }} 
                  color="#15803D" 
                  fontWeight="bold"
                >
                  ₹
                </Text>
              </Box>
              <Text 
                fontSize={{ base: "14px", md: "15px" }} 
                color="#1F2937"
                fontWeight="semibold"
                flex="1"
                lineClamp={1}
              >
                ₹{formatStipend(internship.stipend)}/
                <Text as="span" fontSize={{ base: "13px", md: "14px" }} color="#4B5563">
                  {currentLanguage === 'en' ? 'month' : 'महीना'}
                </Text>
              </Text>
            </HStack>

            {/* Duration */}
            <HStack align="center" gap={3} minH="32px">
              <Box
                w={{ base: 8, md: 9 }}
                h={{ base: 8, md: 9 }}
                bg="#DBEAFE"
                border="1px solid #93C5FD"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon 
                  as={FiClock} 
                  w={{ base: "16px", md: "20px" }}
                  h={{ base: "16px", md: "20px" }}
                  color="#1D4ED8"
                  style={{
                    color: '#1D4ED8',
                    stroke: '#1D4ED8',
                    strokeWidth: '2px',
                    fill: 'none',
                    opacity: 1,
                    visibility: 'visible'
                  }}
                />
              </Box>
              <Text 
                fontSize={{ base: "14px", md: "15px" }} 
                color="#1F2937"
                fontWeight="medium"
                flex="1"
                lineClamp={1}
              >
                {internship.duration}
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Description - Consistent Length */}
        <Box mb={4} minH={{ base: "60px", md: "72px" }}>
          <Text 
            fontSize={{ base: "13px", md: "14px" }} 
            color="gray.600" 
            lineHeight="1.4"
            lineClamp={3}
          >
            {internship.description}
          </Text>
        </Box>

        {/* Why Recommended - Government Theme */}
        {internship.whyRecommended && (
          <Box 
            p={3} 
            bg="linear-gradient(135deg, rgba(255, 153, 51, 0.1) 0%, rgba(19, 136, 8, 0.1) 100%)"
            borderRadius="lg" 
            mb={4}
            border="1px solid"
            borderColor="brand.200"
          >
            <Text 
              fontSize={{ base: "xs", md: "sm" }} 
              color="gray.800" 
              fontWeight="medium"
              lineHeight="1.4"
            >
              💡 {internship.whyRecommended}
            </Text>
          </Box>
        )}

        {/* Skills Required - Tag Format */}
        {internship.requirements && internship.requirements.length > 0 && (
          <Box mb={5}>
            <Text 
              fontSize="sm" 
              fontWeight="semibold" 
              color="gray.700" 
              mb={2}
            >
              {currentLanguage === 'en' ? 'Skills Required:' : 'आवश्यक कौशल:'}
            </Text>
            <Flex wrap="wrap" gap={2}>
              {internship.requirements.slice(0, 3).map((skill, idx) => (
                <Badge 
                  key={idx} 
                  bg="brand.100" 
                  color="brand.800"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontWeight="medium"
                >
                  {skill}
                </Badge>
              ))}
              {internship.requirements.length > 3 && (
                <Badge 
                  bg="gray.100" 
                  color="gray.600"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  +{internship.requirements.length - 3} {currentLanguage === 'en' ? 'more' : 'और'}
                </Badge>
              )}
            </Flex>
          </Box>
        )}

        {/* Action Buttons - Touch Friendly */}
        <Box 
          pt={4} 
          borderTop="2px solid" 
          borderColor="gray.100"
          mt="auto"
        >
          <HStack justify="space-between" gap={3}>
            {/* Save Button */}
            <Button
              variant="outline"
              size={{ base: "sm", md: "md" }}
              onClick={handleBookmark}
              borderColor={isBookmarked ? "brand.500" : "gray.300"}
              color={isBookmarked ? "brand.600" : "gray.600"}
              bg={isBookmarked ? "brand.50" : "white"}
              _hover={{
                borderColor: "brand.500",
                color: "brand.600",
                bg: "brand.50"
              }}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 3px rgba(255, 153, 51, 0.2)"
              }}
              minW={{ base: "44px", md: "auto" }}
              h={{ base: "44px", md: "40px" }}
              px={{ base: 2, md: 4 }}
              aria-label={
                isBookmarked 
                  ? (currentLanguage === 'en' 
                      ? `Remove ${internship.title} from bookmarks` 
                      : `${internship.title} को बुकमार्क से हटाएं`)
                  : (currentLanguage === 'en' 
                      ? `Save ${internship.title} to bookmarks` 
                      : `${internship.title} को बुकमार्क में सेव करें`)
              }
            >
              <Icon as={FiBookmark} boxSize={4} aria-hidden="true" />
              <Text ml={2} display={{ base: "none", sm: "block" }}>
                {currentLanguage === 'en' ? 'Save' : 'सेव'}
              </Text>
            </Button>
            
            {/* Apply Button - Primary CTA */}
            <Button
              bg="linear-gradient(135deg, #FF9933 0%, #FF6600 100%)"
              color="white"
              size={{ base: "sm", md: "md" }}
              onClick={() => onApply(internship.id)}
              _hover={{
                bg: "linear-gradient(135deg, #FF6600 0%, #FF4400 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(255, 102, 0, 0.3)"
              }}
              _focus={{
                boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.4), 0 0 0 6px rgba(255, 153, 51, 0.3)"
              }}
              fontWeight="bold"
              flex="1"
              h={{ base: "44px", md: "40px" }}
              transition="all 0.2s ease"
              aria-label={
                currentLanguage === 'en' 
                  ? `Apply for ${internship.title} position at ${internship.company}` 
                  : `${internship.company} में ${internship.title} पद के लिए आवेदन करें`
              }
            >
              <Icon as={FiExternalLink} mr={2} boxSize={4} aria-hidden="true" />
              {currentLanguage === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}
            </Button>
          </HStack>
        </Box>
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
    <Container 
      maxW="7xl" 
      py={{ base: 4, md: 8 }} 
      px={{ base: 4, md: 6 }}
      w="full"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w="full"
      >
        {/* Header */}
        <VStack align="start" gap={6} mb={8} as="header">
          <HStack>
            <Button
              variant="outline"
              size="lg"
              onClick={onBack}
              borderColor="#FF9933"
              color="#1F2937"
              bg="white"
              borderWidth="2px"
              _hover={{
                bg: "#FFF7ED",
                borderColor: "#FF6600",
                color: "#111827"
              }}
              _focus={{
                boxShadow: "0 0 0 3px rgba(255, 153, 51, 0.3)",
                borderColor: "#FF6600"
              }}
              fontWeight="bold"
              px={8}
              py={3}
              aria-label={currentLanguage === 'en' ? 'Go back to profile form' : 'प्रोफाइल फॉर्म पर वापस जाएं'}
            >
              <Icon 
                as={FiArrowLeft} 
                mr={2} 
                aria-hidden="true" 
                boxSize={5}
                color="#1F2937"
                style={{
                  color: '#1F2937',
                  stroke: '#1F2937',
                  strokeWidth: '2px'
                }}
              />
              <Text color="#1F2937" fontWeight="bold">
                {currentLanguage === 'en' ? 'Back to Profile' : 'प्रोफाइल पर वापस'}
              </Text>
            </Button>
          </HStack>

          <Box>
            <Heading 
              size="xl" 
              color="gray.800" 
              mb={2}
              as="h1"
              id="recommendations-title"
            >
              {currentLanguage === 'en' 
                ? `Perfect Matches for ${userProfile.name || 'You'}` 
                : `${userProfile.name || 'आपके'} लिए सही मैच`}
            </Heading>
            <Text 
              fontSize="lg" 
              color="gray.600"
              aria-describedby="recommendations-title"
            >
              {currentLanguage === 'en' 
                ? `Found ${recommendations.length} personalized internship recommendations` 
                : `${recommendations.length} व्यक्तिगत इंटर्नशिप सिफारिशें मिलीं`}
            </Text>
          </Box>
        </VStack>

        {/* Recommendations Grid - Mobile-First Responsive */}
        <Box as="main" role="main" aria-labelledby="recommendations-title">
          <SimpleGrid 
            columns={{ 
              base: 1,           // 320px+: Single column for mobile
              sm: 1,             // 480px+: Single column for small mobile
              md: 2,             // 768px+: Two columns for tablet
              lg: 3,             // 1024px+: Three columns for desktop
              xl: 3              // 1280px+: Three columns for large desktop
            }} 
            gap={{ base: 3, sm: 4, md: 5, lg: 6 }} 
            mb={8}
            w="full"
            alignItems="stretch"
            justifyItems="center"
            role="list"
            aria-label={
              currentLanguage === 'en' 
                ? `${recommendations.length} internship recommendations`
                : `${recommendations.length} इंटर्नशिप सिफारिशें`
            }
          >
            {recommendations.map((internship, index) => (
              <Box key={internship.id} role="listitem">
                <InternshipCard
                  internship={internship}
                  currentLanguage={currentLanguage}
                  onApply={handleApply}
                  index={index}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Footer Actions */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <VStack gap={4} pt={8} align="center">
            <HStack justify="center" gap={4} flexWrap="wrap">
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                borderColor="gray.400"
                color="gray.700"
                bg="white"
                _hover={{
                  bg: "gray.50",
                  borderColor: "gray.500",
                  color: "gray.800"
                }}
                _focus={{
                  boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.1)"
                }}
                fontWeight="semibold"
                px={8}
                minW={{ base: "200px", md: "auto" }}
              >
                {currentLanguage === 'en' ? 'Modify Profile' : 'प्रोफाइल संशोधित करें'}
              </Button>
              
              <Button
                bg="linear-gradient(135deg, #FF9933 0%, #FF6600 100%)"
                color="white"
                size="lg"
                _hover={{
                  bg: "linear-gradient(135deg, #FF6600 0%, #FF4400 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(255, 102, 0, 0.3)"
                }}
                _focus={{
                  boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.4), 0 0 0 6px rgba(255, 153, 51, 0.3)"
                }}
                fontWeight="bold"
                px={8}
                minW={{ base: "200px", md: "auto" }}
                transition="all 0.2s ease"
              >
                <Icon as={FiTrendingUp} mr={2} boxSize={5} />
                {currentLanguage === 'en' ? 'Get More Recommendations' : 'और सिफारिशें प्राप्त करें'}
              </Button>
            </HStack>
            
            {/* Additional Profile Actions */}
            <Text 
              fontSize="sm" 
              color="gray.600" 
              textAlign="center"
              mt={2}
            >
              {currentLanguage === 'en' 
                ? 'Not satisfied with recommendations? Update your profile for better matches.' 
                : 'सिफारिशों से संतुष्ट नहीं हैं? बेहतर मैच के लिए अपनी प्रोफाइल अपडेट करें।'}
            </Text>
          </VStack>
        </MotionBox>
      </MotionBox>
    </Container>
  );
}
