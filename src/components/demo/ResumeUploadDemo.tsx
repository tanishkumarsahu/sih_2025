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
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import ResumeUpload from '../forms/ResumeUpload';

const MotionBox = motion.create(Box);

export const ResumeUploadDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [error, setError] = useState<string>('');

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setError(''); // Clear error when file is selected
  };

  const handleValidate = () => {
    if (!selectedFile) {
      setError(language === 'en' ? 'Please upload a resume' : 'कृपया एक रिज्यूमे अपलोड करें');
    } else {
      setError('');
      alert(`Selected file: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`);
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
              ? 'Resume Upload Component Demo' 
              : 'रिज्यूमे अपलोड कंपोनेंट डेमो'
            }
          </Heading>
          
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            textAlign="center"
            color="gray.600"
            maxW="2xl"
          >
            {language === 'en'
              ? 'Test the resume upload functionality with drag-and-drop support, file validation, and progress tracking.'
              : 'ड्रैग-एंड-ड्रॉप समर्थन, फ़ाइल सत्यापन और प्रगति ट्रैकिंग के साथ रिज्यूमे अपलोड कार्यक्षमता का परीक्षण करें।'
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

        {/* Resume Upload Component */}
        <Box mb={8}>
          <ResumeUpload
            value={selectedFile}
            onChange={handleFileChange}
            language={language}
            error={error}
            isRequired={false}
          />
        </Box>

        {/* File Information Display */}
        {selectedFile && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            mb={6}
          >
            <Box
              p={6}
              bg="blue.50"
              borderRadius="xl"
              border="2px solid"
              borderColor="blue.200"
            >
              <VStack gap={3} align="start">
                <HStack justify="space-between" w="full">
                  <Text fontSize="lg" fontWeight="bold" color="blue.800">
                    {language === 'en' ? 'File Information:' : 'फ़ाइल जानकारी:'}
                  </Text>
                  <Badge colorScheme="blue" size="lg">
                    ✓ {language === 'en' ? 'Uploaded' : 'अपलोड हो गया'}
                  </Badge>
                </HStack>
                
                <VStack align="start" gap={2} w="full">
                  <HStack>
                    <Text fontWeight="medium" color="gray.700">
                      {language === 'en' ? 'Name:' : 'नाम:'}
                    </Text>
                    <Text color="gray.800">{selectedFile.name}</Text>
                  </HStack>
                  
                  <HStack>
                    <Text fontWeight="medium" color="gray.700">
                      {language === 'en' ? 'Size:' : 'आकार:'}
                    </Text>
                    <Text color="gray.800">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </Text>
                  </HStack>
                  
                  <HStack>
                    <Text fontWeight="medium" color="gray.700">
                      {language === 'en' ? 'Type:' : 'प्रकार:'}
                    </Text>
                    <Text color="gray.800">{selectedFile.type || 'Unknown'}</Text>
                  </HStack>
                  
                  <HStack>
                    <Text fontWeight="medium" color="gray.700">
                      {language === 'en' ? 'Last Modified:' : 'अंतिम संशोधन:'}
                    </Text>
                    <Text color="gray.800">
                      {new Date(selectedFile.lastModified).toLocaleDateString()}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
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
            {language === 'en' ? 'Validate Upload' : 'अपलोड सत्यापित करें'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setSelectedFile(null);
              setError('');
            }}
            px={8}
          >
            {language === 'en' ? 'Clear Upload' : 'अपलोड साफ़ करें'}
          </Button>
        </HStack>

        {/* Error Display */}
        {error && (
          <Box
            mt={6}
            p={4}
            bg="red.50"
            border="1px solid"
            borderColor="red.200"
            borderRadius="lg"
          >
            <HStack gap={2}>
              <Icon as={FiAlertCircle} color="red.500" />
              <Text color="red.700">
                {error}
              </Text>
            </HStack>
          </Box>
        )}

        {/* Features List */}
        <Box mt={12} p={6} bg="gray.50" borderRadius="xl">
          <Heading size="md" mb={4} color="gray.800">
            {language === 'en' ? 'Resume Upload Features:' : 'रिज्यूमे अपलोड सुविधाएं:'}
          </Heading>
          
          <VStack align="start" gap={3}>
            {[
              {
                en: '📁 Drag & Drop Support - Easy file upload interface',
                hi: '📁 ड्रैग एंड ड्रॉप समर्थन - आसान फ़ाइल अपलोड इंटरफ़ेस'
              },
              {
                en: '✅ File Validation - PDF, DOC, DOCX, TXT formats supported',
                hi: '✅ फ़ाइल सत्यापन - PDF, DOC, DOCX, TXT प्रारूप समर्थित'
              },
              {
                en: '📏 Size Limits - Maximum 5MB, minimum 1KB file size',
                hi: '📏 आकार सीमा - अधिकतम 5MB, न्यूनतम 1KB फ़ाइल आकार'
              },
              {
                en: '📊 Upload Progress - Real-time progress tracking',
                hi: '📊 अपलोड प्रगति - रियल-टाइम प्रगति ट्रैकिंग'
              },
              {
                en: '🗑️ File Management - Easy file removal and replacement',
                hi: '🗑️ फ़ाइल प्रबंधन - आसान फ़ाइल हटाना और बदलना'
              },
              {
                en: '🌐 Bilingual Support - Full English/Hindi interface',
                hi: '🌐 द्विभाषी समर्थन - पूर्ण अंग्रेजी/हिंदी इंटरफ़ेस'
              },
              {
                en: '⚡ Performance Optimized - Smooth animations and interactions',
                hi: '⚡ प्रदर्शन अनुकूलित - स्मूथ एनीमेशन और इंटरैक्शन'
              },
              {
                en: '🛡️ Error Handling - Comprehensive validation and error messages',
                hi: '🛡️ त्रुटि प्रबंधन - व्यापक सत्यापन और त्रुटि संदेश'
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

export default ResumeUploadDemo;
