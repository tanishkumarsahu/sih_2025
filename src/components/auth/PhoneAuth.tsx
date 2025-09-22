'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiPhone, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedText, AnimatedButtonText } from '@/components/ui/AnimatedText';

const MotionBox = motion.create(Box);

interface PhoneAuthProps {
  currentLanguage: 'en' | 'hi';
  onSuccess?: () => void;
}

export const PhoneAuth: React.FC<PhoneAuthProps> = ({ currentLanguage, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithPhone, verifyOTP, error, verificationId } = useAuth();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      console.log('Invalid phone number');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithPhone(phoneNumber);
      setStep('otp');
    } catch {
      console.log('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      console.log('Invalid OTP');
      return;
    }

    if (!verificationId) {
      console.log('No verification ID');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOTP(verificationId, otp);
      onSuccess?.();
    } catch {
      console.log('OTP verification failed');
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
      <VStack gap={6} w="full">
        {step === 'phone' ? (
          <>
            <VStack gap={2} textAlign="center">
              <AnimatedText
                fontSize="xl"
                fontWeight="bold"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'Sign in with Phone' : 'फोन से साइन इन करें'}
              </AnimatedText>
            </VStack>

            <Box w="full">
              <Text mb={2}>
                {currentLanguage === 'en' ? 'Phone Number' : 'फोन नंबर'}
              </Text>
              <HStack>
                <Text>+91</Text>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                />
              </HStack>
              {error && <Text color="red.500" fontSize="sm" mt={1}>{error}</Text>}
            </Box>

            <Button
              colorScheme="brand"
              size="lg"
              w="full"
              onClick={handleSendOTP}
              loading={isLoading}
              disabled={true}
              opacity={0.6}
              cursor="not-allowed"
            >
              <FiPhone style={{ marginRight: '8px' }} />
              <AnimatedButtonText animationKey={currentLanguage}>
                {currentLanguage === 'en' ? 'Send OTP (Disabled)' : 'OTP भेजें (अक्षम)'}
              </AnimatedButtonText>
            </Button>
          </>
        ) : (
          <>
            <VStack gap={2} textAlign="center">
              <AnimatedText
                fontSize="xl"
                fontWeight="bold"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' ? 'Enter Verification Code' : 'सत्यापन कोड दर्ज करें'}
              </AnimatedText>
            </VStack>

            <Box w="full">
              <Text mb={2} textAlign="center">
                {currentLanguage === 'en' ? '6-Digit OTP' : '6-अंकीय OTP'}
              </Text>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                textAlign="center"
                fontSize="lg"
              />
              {error && <Text color="red.500" fontSize="sm" mt={1} textAlign="center">{error}</Text>}
            </Box>

            <VStack gap={3} w="full">
              <Button
                colorScheme="brand"
                size="lg"
                w="full"
                onClick={handleVerifyOTP}
                loading={isLoading}
                disabled={true}
                opacity={0.6}
                cursor="not-allowed"
              >
                <FiCheck style={{ marginRight: '8px' }} />
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentLanguage === 'en' ? 'Verify OTP (Disabled)' : 'OTP सत्यापित करें (अक्षम)'}
                </AnimatedButtonText>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('phone')}
                disabled={isLoading}
              >
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentLanguage === 'en' ? 'Back' : 'वापस'}
                </AnimatedButtonText>
              </Button>
            </VStack>
          </>
        )}
      </VStack>
    </MotionBox>
  );
};
