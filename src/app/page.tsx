'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiTarget, FiUsers, FiTrendingUp, FiMapPin, FiArrowRight, FiStar } from 'react-icons/fi';
import { AuthButton } from '@/components/auth/AuthButton';
import { FloatingElements } from '@/components/ui/FloatingElements';
import { GlowingStats } from '@/components/ui/GlowingStats';
import { AnimatedText, AnimatedButtonText } from '@/components/ui/AnimatedText';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHStack = motion(HStack);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);
const MotionButton = motion(Button);

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const features = [
    {
      icon: FiTarget,
      title: currentLanguage === 'en' ? 'AI-Powered Matching' : 'AI-संचालित मैचिंग',
      description: currentLanguage === 'en' 
        ? 'Get personalized internship recommendations based on your skills and interests'
        : 'अपने कौशल और रुचियों के आधार पर व्यक्तिगत इंटर्नशिप सिफारिशें प्राप्त करें'
    },
    {
      icon: FiUsers,
      title: currentLanguage === 'en' ? 'Inclusive Design' : 'समावेशी डिज़ाइन',
      description: currentLanguage === 'en'
        ? 'Built for first-generation learners and rural students'
        : 'पहली पीढ़ी के शिक्षार्थियों और ग्रामीण छात्रों के लिए बनाया गया'
    },
    {
      icon: FiTrendingUp,
      title: currentLanguage === 'en' ? 'Quality Opportunities' : 'गुणवत्तापूर्ण अवसर',
      description: currentLanguage === 'en'
        ? 'Access verified internships from trusted partner companies'
        : 'विश्वसनीय साझीदार कंपनियों से सत्यापित इंटर्नशिप तक पहुंच'
    },
    {
      icon: FiMapPin,
      title: currentLanguage === 'en' ? 'Location-Based' : 'स्थान-आधारित',
      description: currentLanguage === 'en'
        ? 'Find opportunities near you or explore remote options'
        : 'अपने पास के अवसर खोजें या रिमोट विकल्प देखें'
    }
  ];

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <Box bg="linear-gradient(135deg, #1A365D 0%, #2C5282 100%)" minH="100vh" position="relative" overflow="hidden">
      {/* Animated Background Elements */}
      <FloatingElements />

      {/* Header */}
      <MotionBox 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        bg="rgba(255,255,255,0.98)"
        backdropFilter="blur(15px)"
        px={{ base: 3, md: 4 }}
        py={{ base: 3, md: 4 }}
        borderBottom="2px" 
        borderColor="rgba(26, 54, 93, 0.3)"
        position="sticky"
        top={0}
        zIndex={10}
        boxShadow="0 4px 20px rgba(26, 54, 93, 0.15)"
      >
        <Container maxW={{ base: "100%", sm: "container.sm", md: "container.md", lg: "7xl" }} px={{ base: 2, md: 4 }}>
          <Flex justify="space-between" align="center" flexWrap={{ base: "wrap", md: "nowrap" }} gap={{ base: 2, md: 0 }}>
            <Heading 
              size={{ base: "md", md: "lg" }} 
              color="#1A365D" 
              fontWeight="bold"
              fontSize={{ base: "1.2rem", sm: "1.5rem", md: "1.875rem" }}
              lineHeight="1.2"
            >
              PM Internship Scheme
            </Heading>
            <HStack gap={{ base: 2, md: 4 }} flexShrink={0}>
              <MotionButton 
                variant="outline" 
                size={{ base: "xs", md: "sm" }}
                borderWidth="2px"
                color="#1A365D"
                borderColor="#DD6B20"
                bg="white"
                minH="44px"
                px={{ base: 3, md: 4 }}
                fontSize={{ base: "0.875rem", md: "1rem" }}
                _hover={{ 
                  bg: "#FFF5F0", 
                  borderColor: "#C05621",
                  color: "#1A365D",
                  transform: { base: "none", md: "translateY(-1px)" },
                  boxShadow: "0 4px 12px rgba(221, 107, 32, 0.2)"
                }}
                onClick={handleLanguageToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                fontWeight="medium"
              >
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentLanguage === 'en' ? 'हिंदी' : 'English'}
                </AnimatedButtonText>
              </MotionButton>
              <AuthButton currentLanguage={currentLanguage} />
            </HStack>
          </Flex>
        </Container>
      </MotionBox>

      {/* Hero Section */}
      <Container 
        maxW={{ base: "100%", sm: "container.sm", md: "container.md", lg: "7xl" }} 
        py={{ base: 10, md: 20 }} 
        px={{ base: 4, md: 6 }}
        position="relative" 
        zIndex={1}
      >
        <MotionVStack 
          ref={heroRef}
          gap={{ base: 8, md: 12 }}
          textAlign="center"
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          <MotionVStack gap={{ base: 4, md: 6 }} maxW="4xl" variants={itemVariants}>
            <AnimatedText
              as="h1"
              size={{ base: "xl", sm: "2xl", md: "3xl" }}
              color="white"
              textShadow="2px 2px 4px rgba(0,0,0,0.3)"
              textAlign="center"
              animationKey={currentLanguage}
              duration={0.4}
              fontSize={{ base: "1.75rem", sm: "2.25rem", md: "3rem" }}
              lineHeight={{ base: "1.3", md: "1.2" }}
              px={{ base: 2, md: 0 }}
            >
              {currentLanguage === 'en' 
                ? 'Find Your Perfect Internship with AI'
                : 'AI के साथ अपना सही इंटर्नशिप खोजें'
              }
            </AnimatedText>
            
            <AnimatedText
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              color="rgba(255,255,255,0.9)"
              maxW={{ base: "100%", md: "3xl" }}
              textAlign="center"
              lineHeight="1.6"
              animationKey={currentLanguage}
              duration={0.3}
              px={{ base: 4, md: 0 }}
            >
              {currentLanguage === 'en'
                ? 'Get 3-5 personalized internship recommendations in seconds. Our AI matches your skills, education, and interests with verified opportunities from the PM Internship Scheme.'
                : '3-5 व्यक्तिगत इंटर्नशिप सिफारिशें सेकंडों में प्राप्त करें। हमारा AI आपके कौशल, शिक्षा और रुचियों को PM इंटर्नशिप योजना के सत्यापित अवसरों से मिलाता है।'
              }
            </AnimatedText>

            {/* Trust Indicators */}
            <MotionBox
              variants={itemVariants}
              display="flex"
              alignItems="center"
              gap={{ base: 3, md: 6 }}
              flexWrap="wrap"
              justifyContent="center"
              p={{ base: 4, md: 6 }}
              bg="rgba(255,255,255,0.15)"
              borderRadius="xl"
              backdropFilter="blur(15px)"
              border="2px solid"
              borderColor="rgba(255,255,255,0.2)"
              boxShadow="0 8px 25px rgba(0,0,0,0.1)"
              mx={{ base: 4, md: 0 }}
            >
              <HStack gap={{ base: 2, md: 3 }} flexShrink={0}>
                <Icon as={FiStar} color="#F6E05E" boxSize={{ base: 4, md: 5 }} />
                <AnimatedText
                  color="white"
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="bold"
                  animationKey={currentLanguage}
                  duration={0.25}
                  textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                >
                  {currentLanguage === 'en' ? 'Government Verified' : 'सरकार द्वारा सत्यापित'}
                </AnimatedText>
              </HStack>
              <HStack gap={{ base: 2, md: 3 }} flexShrink={0}>
                <Icon as={FiTarget} color="#68D391" boxSize={{ base: 4, md: 5 }} />
                <AnimatedText
                  color="white"
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="bold"
                  animationKey={currentLanguage}
                  duration={0.25}
                  textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                >
                  {currentLanguage === 'en' ? '75% Match Accuracy' : '75% मैच सटीकता'}
                </AnimatedText>
              </HStack>
              <HStack gap={{ base: 2, md: 3 }} flexShrink={0}>
                <Icon as={FiUsers} color="#FBD38D" boxSize={{ base: 4, md: 5 }} />
                <AnimatedText
                  color="white"
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="bold"
                  animationKey={currentLanguage}
                  duration={0.25}
                  textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                >
                  {currentLanguage === 'en' ? 'Inclusive Design' : 'समावेशी डिज़ाइन'}
                </AnimatedText>
              </HStack>
            </MotionBox>
            
            <VStack gap={{ base: 3, md: 4 }} pt={{ base: 3, md: 4 }} w="full" maxW={{ base: "90%", md: "md" }} px={{ base: 4, md: 0 }}>
              <Button 
                onClick={() => window.location.href = '/profile'}
                size={{ base: "lg", md: "xl" }}
                bg="#DD6B20"
                color="white"
                px={{ base: 8, md: 12 }}
                py={{ base: 4, md: 6 }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                w="full"
                h={{ base: "50px", md: "60px" }}
                minH="44px"
                borderRadius="xl"
                boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                border="3px solid"
                borderColor="#DD6B20"
                _hover={{
                  bg: "#C05621",
                  transform: { base: "none", md: "translateY(-2px)" },
                  boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
                  borderColor: "#9C4221"
                }}
                transition="all 0.3s"
              >
                <Icon as={FiTarget} boxSize={{ base: 5, md: 6 }} mr={{ base: 2, md: 3 }} />
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentLanguage === 'en' ? 'Find My Internships' : 'मेरी इंटर्नशिप खोजें'}
                </AnimatedButtonText>
              </Button>
              <Button 
                size={{ base: "md", md: "lg" }}
                variant="outline" 
                color="white"
                borderColor="white"
                borderWidth="2px"
                px={{ base: 6, md: 8 }}
                py={{ base: 3, md: 4 }}
                minH="44px"
                fontWeight="medium"
                borderRadius="lg"
                _hover={{
                  bg: "rgba(255,255,255,0.15)",
                  transform: { base: "none", md: "translateY(-1px)" },
                  borderColor: "#DD6B20",
                  boxShadow: "0 6px 20px rgba(221, 107, 32, 0.2)"
                }}
                transition="all 0.3s"
              >
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentLanguage === 'en' ? 'How It Works' : 'यह कैसे काम करता है'}
                </AnimatedButtonText>
              </Button>
            </VStack>
          </MotionVStack>

          {/* Features Section */}
          <MotionBox 
            ref={featuresRef}
            w="full"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} w="full">
              {features.map((feature, index) => (
                <AnimatedCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </SimpleGrid>
          </MotionBox>

          {/* Stats Section */}
          <Box 
            ref={statsRef}
            w="full" 
            pt={8}
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="full">
              <GlowingStats
                value="1 Cr+"
                label={currentLanguage === 'en' ? 'Target Internships' : 'लक्षित इंटर्नशिप'}
                color="white"
                glowColor="rgba(49,130,206,"
                delay={0.2}
              />
              
              <GlowingStats
                value="50M+"
                label={currentLanguage === 'en' ? 'Eligible Youth' : 'पात्र युवा'}
                color="white"
                glowColor="rgba(56,161,105,"
                delay={0.4}
              />
              
              <GlowingStats
                value="75%"
                label={currentLanguage === 'en' ? 'Match Accuracy' : 'मैच सटीकता'}
                color="white"
                glowColor="rgba(49,130,206,"
                delay={0.6}
              />
            </SimpleGrid>
          </Box>
        </MotionVStack>
      </Container>
    </Box>
  );
}
