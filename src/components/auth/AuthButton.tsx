'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiPhone, FiLogOut } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/contexts/AuthContext';
import { useToaster } from '@/components/ui/toaster';
import { AnimatedText, AnimatedButtonText } from '@/components/ui/AnimatedText';

const MotionBox = motion.create(Box);

interface AuthButtonProps {
  currentLanguage: 'en' | 'hi';
}

export const AuthButton: React.FC<AuthButtonProps> = ({ currentLanguage }) => {
  const { user, loading, signInWithPhone, verifyOTP, signInWithGoogle, signOut, error, verificationId } = useAuth();
  const toast = useToaster();
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithGoogle();
      toast.create({
        title: currentLanguage === 'en' ? 'Success' : 'सफलता',
        description: currentLanguage === 'en' 
          ? 'Successfully signed in with Google!' 
          : 'Google के साथ सफलतापूर्वक साइन इन!',
        status: 'success',
      });
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      const authError = error as { code?: string; message?: string };
      if (authError.code === 'auth/popup-closed-by-user') {
        toast.create({
          title: currentLanguage === 'en' ? 'Cancelled' : 'रद्द किया गया',
          description: currentLanguage === 'en' 
            ? 'Sign-in was cancelled' 
            : 'साइन-इन रद्द कर दिया गया',
          status: 'warning',
        });
      } else {
        toast.create({
          title: currentLanguage === 'en' ? 'Error' : 'त्रुटि',
          description: currentLanguage === 'en' 
            ? 'Failed to sign in with Google. Please try again.' 
            : 'Google से साइन इन करने में विफल। कृपया पुनः प्रयास करें।',
          status: 'error',
        });
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      toast.create({
        title: currentLanguage === 'en' ? 'Invalid Phone Number' : 'अमान्य फोन नंबर',
        description: currentLanguage === 'en' 
          ? 'Please enter a valid 10-digit phone number' 
          : 'कृपया एक मान्य 10-अंकीय फोन नंबर दर्ज करें',
        status: 'error',
      });
      return;
    }
    
    try {
      setIsAuthLoading(true);
      await signInWithPhone(phoneNumber);
      setStep('otp');
      toast.create({
        title: currentLanguage === 'en' ? 'OTP Sent' : 'OTP भेजा गया',
        description: currentLanguage === 'en' 
          ? 'Please check your phone for the verification code' 
          : 'कृपया सत्यापन कोड के लिए अपना फोन चेक करें',
        status: 'success',
      });
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.create({
        title: currentLanguage === 'en' ? 'Error' : 'त्रुटि',
        description: currentLanguage === 'en' 
          ? 'Failed to send OTP. Please try again.' 
          : 'OTP भेजने में विफल। कृपया पुनः प्रयास करें।',
        status: 'error',
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.create({
        title: currentLanguage === 'en' ? 'Invalid OTP' : 'अमान्य OTP',
        description: currentLanguage === 'en' 
          ? 'Please enter the complete 6-digit OTP' 
          : 'कृपया पूरा 6-अंकीय OTP दर्ज करें',
        status: 'error',
      });
      return;
    }

    if (!verificationId) {
      toast.create({
        title: currentLanguage === 'en' ? 'Error' : 'त्रुटि',
        description: currentLanguage === 'en' 
          ? 'Verification ID not found. Please try again.' 
          : 'सत्यापन ID नहीं मिली। कृपया पुनः प्रयास करें।',
        status: 'error',
      });
      return;
    }
    
    try {
      setIsAuthLoading(true);
      await verifyOTP(verificationId, otp);
      toast.create({
        title: currentLanguage === 'en' ? 'Success' : 'सफलता',
        description: currentLanguage === 'en' 
          ? 'Phone number verified successfully!' 
          : 'फोन नंबर सफलतापूर्वक सत्यापित!',
        status: 'success',
      });
      setShowPhoneAuth(false);
      setStep('phone');
      setPhoneNumber('');
      setOtp('');
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.create({
        title: currentLanguage === 'en' ? 'Error' : 'त्रुटि',
        description: currentLanguage === 'en' 
          ? 'Invalid OTP. Please try again.' 
          : 'अमान्य OTP। कृपया पुनः प्रयास करें।',
        status: 'error',
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsAuthLoading(true);
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        borderWidth="2px"
        color="#1A365D"
        borderColor="#DD6B20"
        bg="white"
        _hover={{ bg: "#FFF5F0" }}
      >
        <AnimatedButtonText animationKey={currentLanguage}>
          {currentLanguage === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
        </AnimatedButtonText>
      </Button>
    );
  }

  if (user) {
    return (
      <HStack gap={2}>
        <Text fontSize="sm" color="#1A365D" fontWeight="medium">
          {user.displayName || user.email || user.phoneNumber}
        </Text>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          colorScheme="red"
          borderWidth="2px"
          color="red.600"
          borderColor="red.300"
          bg="white"
          _hover={{ 
            bg: 'red.50', 
            borderColor: 'red.500',
            color: 'red.700',
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)"
          }}
          fontWeight="medium"
        >
          <FiLogOut style={{ marginRight: '4px' }} />
          <AnimatedButtonText animationKey={currentLanguage}>
            {currentLanguage === 'en' ? 'Sign Out' : 'साइन आउट'}
          </AnimatedButtonText>
        </Button>
      </HStack>
    );
  }

  return (
    <MotionBox>
      {!showPhoneAuth ? (
        <HStack gap={2}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPhoneAuth(true)}
            borderWidth="2px"
            color="#1A365D"
            borderColor="#DD6B20"
            bg="white"
            _hover={{ 
              bg: '#FFF5F0', 
              borderColor: '#C05621',
              color: '#1A365D',
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(221, 107, 32, 0.2)"
            }}
            fontWeight="medium"
          >
            <FiPhone style={{ marginRight: '4px' }} />
            <AnimatedButtonText animationKey={currentLanguage}>
              {currentLanguage === 'en' ? 'Phone' : 'फोन'}
            </AnimatedButtonText>
          </Button>
          <Button
            bg="#1A365D"
            color="white"
            size="sm"
            onClick={handleGoogleSignIn}
            _hover={{ 
              bg: '#2C5282',
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(26, 54, 93, 0.3)"
            }}
            disabled={isAuthLoading}
            fontWeight="medium"
            borderWidth="2px"
            borderColor="#1A365D"
          >
            <FcGoogle style={{ marginRight: '4px' }} />
            <AnimatedButtonText animationKey={currentLanguage}>
              {currentLanguage === 'en' ? 'Google' : 'Google'}
            </AnimatedButtonText>
          </Button>
        </HStack>
      ) : (
        <VStack 
          gap={3} 
          p={{ base: 4, md: 6 }}
          bg="white" 
          borderRadius="xl" 
          boxShadow="0 20px 40px rgba(0,0,0,0.15)"
          border="2px solid"
          borderColor="#E2E8F0"
          position="absolute"
          top="100%"
          right={{ base: "50%", md: 0 }}
          transform={{ base: "translateX(50%)", md: "none" }}
          mt={2}
          w={{ base: "90vw", sm: "320px", md: "320px" }}
          maxW="320px"
          zIndex={20}
        >
          {step === 'phone' ? (
            <>
              <Text fontSize="md" color="#1A365D" fontWeight="bold">
                <AnimatedText animationKey={currentLanguage} duration={0.25}>
                  {currentLanguage === 'en' ? 'Phone Authentication' : 'फोन प्रमाणीकरण'}
                </AnimatedText>
              </Text>
              <HStack w="full">
                <Text fontSize="sm" color="gray.700" fontWeight="medium">+91</Text>
                <Input
                  size="md"
                  placeholder={currentLanguage === 'en' ? '9876543210' : '9876543210'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  borderWidth="2px"
                  borderColor="gray.300"
                  color="#1A365D"
                  bg="white"
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    borderColor: "#DD6B20",
                    boxShadow: "0 0 0 1px rgba(221, 107, 32, 0.6)"
                  }}
                />
              </HStack>
              {error && (
                <Text fontSize="xs" color="red.500" textAlign="center">
                  {error}
                </Text>
              )}
              <HStack gap={2} w="full">
                <Button
                  size="md"
                  bg="#DD6B20"
                  color="white"
                  _hover={{ 
                    bg: '#C05621',
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(221, 107, 32, 0.3)"
                  }}
                  disabled={phoneNumber.length !== 10 || isAuthLoading}
                  loading={isAuthLoading}
                  onClick={handleSendOTP}
                  flex={1}
                  fontWeight="medium"
                  borderRadius="lg"
                >
                  <AnimatedButtonText animationKey={currentLanguage}>
                    {currentLanguage === 'en' ? 'Send OTP' : 'OTP भेजें'}
                  </AnimatedButtonText>
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  colorScheme="gray"
                  color="gray.700"
                  borderColor="gray.300"
                  _hover={{ 
                    bg: 'gray.50',
                    borderColor: 'gray.400'
                  }}
                  onClick={() => {
                    setShowPhoneAuth(false);
                    setStep('phone');
                    setPhoneNumber('');
                    setOtp('');
                  }}
                  fontWeight="medium"
                  borderRadius="lg"
                >
                  <AnimatedButtonText animationKey={currentLanguage}>
                    {currentLanguage === 'en' ? 'Cancel' : 'रद्द करें'}
                  </AnimatedButtonText>
                </Button>
              </HStack>
            </>
          ) : (
            <>
              <Text fontSize="md" color="#1A365D" fontWeight="bold">
                <AnimatedText animationKey={currentLanguage} duration={0.25}>
                  {currentLanguage === 'en' ? 'Enter OTP' : 'OTP दर्ज करें'}
                </AnimatedText>
              </Text>
              <Text fontSize="sm" color="gray.700" textAlign="center" fontWeight="medium">
                <AnimatedText animationKey={currentLanguage} duration={0.25}>
                  {currentLanguage === 'en' 
                    ? `Code sent to +91${phoneNumber}` 
                    : `+91${phoneNumber} पर कोड भेजा गया`}
                </AnimatedText>
              </Text>
              <Input
                size="lg"
                placeholder={currentLanguage === 'en' ? '123456' : '123456'}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                textAlign="center"
                fontSize="xl"
                letterSpacing="0.5em"
                borderWidth="2px"
                borderColor="gray.300"
                color="#1A365D"
                bg="white"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                  borderColor: "#DD6B20",
                  boxShadow: "0 0 0 1px rgba(221, 107, 32, 0.6)"
                }}
                fontWeight="bold"
              />
              {error && (
                <Text fontSize="xs" color="red.500" textAlign="center">
                  {error}
                </Text>
              )}
              <HStack gap={2} w="full">
                <Button
                  size="md"
                  bg="#38A169"
                  color="white"
                  _hover={{ 
                    bg: '#2F855A',
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(56, 161, 105, 0.3)"
                  }}
                  disabled={otp.length !== 6 || isAuthLoading}
                  loading={isAuthLoading}
                  onClick={handleVerifyOTP}
                  flex={1}
                  fontWeight="medium"
                  borderRadius="lg"
                >
                  <AnimatedButtonText animationKey={currentLanguage}>
                    {currentLanguage === 'en' ? 'Verify' : 'सत्यापित करें'}
                  </AnimatedButtonText>
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  colorScheme="gray"
                  color="gray.700"
                  borderColor="gray.300"
                  _hover={{ 
                    bg: 'gray.50',
                    borderColor: 'gray.400'
                  }}
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                  }}
                  fontWeight="medium"
                  borderRadius="lg"
                >
                  <AnimatedButtonText animationKey={currentLanguage}>
                    {currentLanguage === 'en' ? 'Back' : 'वापस'}
                  </AnimatedButtonText>
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      )}
    </MotionBox>
  );
};
