'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedText, AnimatedButtonText } from '@/components/ui/AnimatedText';

const MotionBox = motion.create(Box);

interface GoogleAuthProps {
  currentLanguage: 'en' | 'hi';
  onSuccess?: () => void;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ currentLanguage, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      console.log('Successfully signed in with Google!');
      onSuccess?.();
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      w="full"
    >
      <VStack gap={4} w="full">
        <HStack align="center" w="full">
          <Box h="1px" bg="gray.300" flex="1" />
          <Text fontSize="sm" color="gray.500" px={3}>
            {currentLanguage === 'en' ? 'OR' : 'या'}
          </Text>
          <Box h="1px" bg="gray.300" flex="1" />
          <AnimatedText
            fontSize="sm"
            color="gray.500"
            whiteSpace="nowrap"
            px={3}
            animationKey={currentLanguage}
            duration={0.25}
          >
            {currentLanguage === 'en' ? 'Or continue with' : 'या जारी रखें'}
          </AnimatedText>
          <Box h="1px" bg="gray.300" flex="1" />
        </HStack>

        <Button
          size="lg"
          w="full"
          variant="outline"
          onClick={handleGoogleSignIn}
          loading={isLoading || loading}
          _hover={{
            bg: 'gray.50',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          }}
          transition="all 0.2s"
        >
          <HStack gap={2}>
            <FcGoogle size="20" />
            <AnimatedButtonText animationKey={currentLanguage}>
              {currentLanguage === 'en' ? 'Continue with Google' : 'Google के साथ जारी रखें'}
            </AnimatedButtonText>
          </HStack>
        </Button>

      </VStack>
    </MotionBox>
  );
};
