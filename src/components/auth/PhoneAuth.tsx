'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  HStack,
  PinInput,
  PinInputField,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
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
  const toast = useToast();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: currentLanguage === 'en' ? 'Invalid Phone Number' : 'अमान्य फोन नंबर',
        description: currentLanguage === 'en' 
          ? 'Please enter a valid 10-digit phone number' 
          : 'कृपया एक मान्य 10-अंकीय फोन नंबर दर्ज करें',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      await signInWithPhone(phoneNumber);
      setStep('otp');
      toast({
        title: currentLanguage === 'en' ? 'OTP Sent' : 'OTP भेजा गया',
        description: currentLanguage === 'en' 
          ? 'Please check your phone for the verification code' 
          : 'कृपया सत्यापन कोड के लिए अपना फोन चेक करें',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: currentLanguage === 'en' ? 'Error' : 'त्रुटि',
        description: currentLanguage === 'en' 
          ? 'Failed to send OTP. Please try again.' 
          : 'OTP भेजने में विफल। कृपया पुनः प्रयास करें।',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: currentLanguage === 'en' ? 'Invalid OTP' : 'अमान्य OTP',
        description: currentLanguage === 'en' 
          ? 'Please enter the complete 6-digit OTP' 
          : 'कृपया पूरा 6-अंकीय OTP दर्ज करें',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!verificationId) {
      toast({
        title: currentLanguage === 'en' ? 'Error' : 'त्रुटि',
        description: currentLanguage === 'en' 
          ? 'Verification ID not found. Please try again.' 
          : 'सत्यापन ID नहीं मिली। कृपया पुनः प्रयास करें।',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      await verifyOTP(verificationId, otp);
      toast({
        title: currentLanguage === 'en' ? 'Success' : 'सफलता',
        description: currentLanguage === 'en' 
          ? 'Phone number verified successfully!' 
          : 'फोन नंबर सफलतापूर्वक सत्यापित!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: currentLanguage === 'en' ? 'Error' : 'त्रुटि',
        description: currentLanguage === 'en' 
          ? 'Invalid OTP. Please try again.' 
          : 'अमान्य OTP। कृपया पुनः प्रयास करें।',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setStep('phone');
    setOtp('');
    await handleSendOTP();
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
              <AnimatedText
                fontSize="sm"
                color="gray.600"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' 
                  ? 'We\'ll send you a verification code' 
                  : 'हम आपको एक सत्यापन कोड भेजेंगे'}
              </AnimatedText>
            </VStack>

            <FormControl isInvalid={!!error}>
              <FormLabel>
                <AnimatedText animationKey={currentLanguage} duration={0.25}>
                  {currentLanguage === 'en' ? 'Phone Number' : 'फोन नंबर'}
                </AnimatedText>
              </FormLabel>
              <InputGroup>
                <InputLeftAddon>+91</InputLeftAddon>
                <Input
                  type="tel"
                  placeholder={currentLanguage === 'en' ? '9876543210' : '9876543210'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                />
              </InputGroup>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>

            <Button
              colorScheme="brand"
              size="lg"
              w="full"
              onClick={handleSendOTP}
              isLoading={isLoading}
              leftIcon={<FiPhone />}
            >
              <AnimatedButtonText animationKey={currentLanguage}>
                {currentLanguage === 'en' ? 'Send OTP' : 'OTP भेजें'}
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
              <AnimatedText
                fontSize="sm"
                color="gray.600"
                animationKey={currentLanguage}
                duration={0.25}
              >
                {currentLanguage === 'en' 
                  ? `Code sent to +91${phoneNumber}` 
                  : `+91${phoneNumber} पर कोड भेजा गया`}
              </AnimatedText>
            </VStack>

            <FormControl isInvalid={!!error}>
              <FormLabel textAlign="center">
                <AnimatedText animationKey={currentLanguage} duration={0.25}>
                  {currentLanguage === 'en' ? '6-Digit OTP' : '6-अंकीय OTP'}
                </AnimatedText>
              </FormLabel>
              <HStack justify="center">
                <PinInput
                  value={otp}
                  onChange={setOtp}
                  size="lg"
                  type="number"
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              {error && <FormErrorMessage textAlign="center">{error}</FormErrorMessage>}
            </FormControl>

            <VStack gap={3} w="full">
              <Button
                colorScheme="brand"
                size="lg"
                w="full"
                onClick={handleVerifyOTP}
                isLoading={isLoading}
                leftIcon={<FiCheck />}
              >
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentLanguage === 'en' ? 'Verify OTP' : 'OTP सत्यापित करें'}
                </AnimatedButtonText>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                isDisabled={isLoading}
              >
                <AnimatedButtonText animationKey={currentLanguage}>
                  {currentLanguage === 'en' ? 'Resend OTP' : 'OTP पुनः भेजें'}
                </AnimatedButtonText>
              </Button>
            </VStack>
          </>
        )}
      </VStack>
    </MotionBox>
  );
};
