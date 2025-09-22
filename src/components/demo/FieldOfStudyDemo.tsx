'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import FieldOfStudySelector from '../forms/FieldOfStudySelector';

const MotionBox = motion.create(Box);

export const FieldOfStudyDemo: React.FC = () => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [error, setError] = useState<string>('');

  const handleFieldChange = (value: string) => {
    setSelectedField(value);
    setError(''); // Clear error when field is selected
  };

  const handleValidate = () => {
    if (!selectedField.trim()) {
      setError(language === 'en' ? 'Please select a field of study' : 'कृपया अध्ययन का क्षेत्र चुनें');
    } else {
      setError('');
      alert(`Selected: ${selectedField}`);
    }
  };

  const containerMaxW = useBreakpointValue({ base: 'full', md: '2xl' });

  return (
    <Container maxW={containerMaxW} py={8} px={4}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <VStack gap={6} mb={8}>
          <Heading
            size={{ base: 'lg', md: 'xl' }}
            textAlign="center"
            color="gray.800"
          >
            {language === 'en' 
              ? 'Mobile-Friendly Field of Study Selector' 
              : 'मोबाइल-फ्रेंडली अध्ययन क्षेत्र चयनकर्ता'
            }
          </Heading>
          
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            textAlign="center"
            color="gray.600"
            maxW="2xl"
          >
            {language === 'en'
              ? 'Designed for first-generation learners with limited digital exposure. Choose from categorized options instead of overwhelming 35+ choices.'
              : 'सीमित डिजिटल एक्सपोज़र वाले पहली पीढ़ी के शिक्षार्थियों के लिए डिज़ाइन किया गया। 35+ विकल्पों के बजाय वर्गीकृत विकल्पों में से चुनें।'
            }
          </Text>

          {/* Language Toggle */}
          <HStack gap={4}>
            <Button
              variant={language === 'en' ? 'solid' : 'outline'}
              colorScheme="brand"
              onClick={() => setLanguage('en')}
              size="sm"
            >
              English
            </Button>
            <Button
              variant={language === 'hi' ? 'solid' : 'outline'}
              colorScheme="brand"
              onClick={() => setLanguage('hi')}
              size="sm"
            >
              हिंदी
            </Button>
          </HStack>
        </VStack>

        {/* Field Selector */}
        <Box mb={8}>
          <FieldOfStudySelector
            value={selectedField}
            onChange={handleFieldChange}
            language={language}
            error={error}
            isRequired={true}
          />
        </Box>

        {/* Selected Field Display */}
        {selectedField && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            mb={6}
          >
            <Box
              p={6}
              bg="green.50"
              borderRadius="xl"
              border="2px solid"
              borderColor="green.200"
            >
              <HStack gap={3} justify="space-between" align="center">
                <Box>
                  <Text fontSize="sm" color="green.700" fontWeight="medium">
                    {language === 'en' ? 'Selected Field:' : 'चयनित क्षेत्र:'}
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.800">
                    {selectedField}
                  </Text>
                </Box>
                <Badge colorScheme="green" size="lg">
                  ✓ {language === 'en' ? 'Selected' : 'चयनित'}
                </Badge>
              </HStack>
            </Box>
          </MotionBox>
        )}

        {/* Action Buttons */}
        <HStack gap={4} justify="center">
          <Button
            colorScheme="brand"
            size="lg"
            onClick={handleValidate}
            px={8}
          >
            {language === 'en' ? 'Validate Selection' : 'चयन सत्यापित करें'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setSelectedField('');
              setError('');
            }}
            px={8}
          >
            {language === 'en' ? 'Clear Selection' : 'चयन साफ़ करें'}
          </Button>
        </HStack>

        {/* Features List */}
        <Box mt={12} p={6} bg="gray.50" borderRadius="xl">
          <Heading size="md" mb={4} color="gray.800">
            {language === 'en' ? 'Key Features:' : 'मुख्य विशेषताएं:'}
          </Heading>
          
          <VStack align="start" gap={3}>
            {[
              {
                en: '📱 Mobile-first design with large touch targets',
                hi: '📱 बड़े टच टारगेट के साथ मोबाइल-फर्स्ट डिज़ाइन'
              },
              {
                en: '🎯 6 main categories instead of 35+ overwhelming options',
                hi: '🎯 35+ भारी विकल्पों के बजाय 6 मुख्य श्रेणियां'
              },
              {
                en: '🔍 Search functionality for large categories',
                hi: '🔍 बड़ी श्रेणियों के लिए खोज कार्यक्षमता'
              },
              {
                en: '✨ Smooth animations and visual feedback',
                hi: '✨ स्मूथ एनीमेशन और विज़ुअल फीडबैक'
              },
              {
                en: '🌐 Full bilingual support (English/Hindi)',
                hi: '🌐 पूर्ण द्विभाषी समर्थन (अंग्रेजी/हिंदी)'
              },
              {
                en: '♿ Accessibility compliant for government standards',
                hi: '♿ सरकारी मानकों के लिए पहुंच अनुपालन'
              }
            ].map((feature, index) => (
              <Text key={index} color="gray.700" fontSize="md">
                {feature[language]}
              </Text>
            ))}
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default FieldOfStudyDemo;
