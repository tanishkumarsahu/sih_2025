'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from '@chakra-ui/react';
import { PhoneAuth } from './PhoneAuth';
import { GoogleAuth } from './GoogleAuth';
import { AnimatedText } from '@/components/ui/AnimatedText';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: 'en' | 'hi';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSuccess,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent mx={4}>
        <ModalHeader textAlign="center" pb={2}>
          <AnimatedText
            fontSize="xl"
            fontWeight="bold"
            animationKey={currentLanguage}
            duration={0.25}
          >
            {currentLanguage === 'en' ? 'Sign In to Continue' : 'जारी रखने के लिए साइन इन करें'}
          </AnimatedText>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded" colorScheme="brand">
            <TabList mb={6} justifyContent="center">
              <Tab>
                <AnimatedText animationKey={currentLanguage} duration={0.25}>
                  {currentLanguage === 'en' ? 'Phone' : 'फोन'}
                </AnimatedText>
              </Tab>
              <Tab>
                <AnimatedText animationKey={currentLanguage} duration={0.25}>
                  {currentLanguage === 'en' ? 'Google' : 'Google'}
                </AnimatedText>
              </Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel p={0}>
                <PhoneAuth currentLanguage={currentLanguage} onSuccess={handleSuccess} />
              </TabPanel>
              <TabPanel p={0}>
                <VStack gap={6}>
                  <GoogleAuth currentLanguage={currentLanguage} onSuccess={handleSuccess} />
                  <Box textAlign="center">
                    <AnimatedText
                      fontSize="sm"
                      color="gray.500"
                      animationKey={currentLanguage}
                      duration={0.25}
                    >
                      {currentLanguage === 'en' 
                        ? 'Secure authentication powered by Google' 
                        : 'Google द्वारा संचालित सुरक्षित प्रमाणीकरण'}
                    </AnimatedText>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
