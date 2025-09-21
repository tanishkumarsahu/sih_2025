'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Divider,
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
  const { signInWithGoogle, error } = useAuth();
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: currentLanguage === 'en' ? 'Success' : 'सफलता',
        description: currentLanguage === 'en' 
          ? 'Successfully signed in with Google!' 
          : 'Google के साथ सफलतापूर्वक साइन इन!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: currentLanguage === 'en' ? 'Error' : 'त्रुटि',
        description: currentLanguage === 'en' 
          ? 'Failed to sign in with Google. Please try again.' 
          : 'Google के साथ साइन इन करने में विफल। कृपया पुनः प्रयास करें।',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
        <HStack w="full" align="center">
          <Divider />
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
          <Divider />
        </HStack>

        <Button
          size="lg"
          w="full"
          variant="outline"
          onClick={handleGoogleSignIn}
          isLoading={isLoading}
          leftIcon={<FcGoogle size="20" />}
          _hover={{
            bg: 'gray.50',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          }}
          transition="all 0.2s"
        >
          <AnimatedButtonText animationKey={currentLanguage}>
            {currentLanguage === 'en' ? 'Continue with Google' : 'Google के साथ जारी रखें'}
          </AnimatedButtonText>
        </Button>

        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
      </VStack>
    </MotionBox>
  );
};
