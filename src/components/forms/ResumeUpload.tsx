'use client';

import React, { useCallback, useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, 
  FiX, 
  FiCheck, 
  FiAlertCircle
} from 'react-icons/fi';
import { AnimatedText } from '../ui/AnimatedText';

const MotionBox = motion.create(Box);

// File validation constants
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_FILE_SIZE = 1024; // 1KB

interface ResumeFile {
  file: File;
  id: string;
  uploadProgress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface ResumeUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  language: 'en' | 'hi';
  error?: string;
  isRequired?: boolean;
  disabled?: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onChange,
  language,
  error,
  isRequired = false,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<ResumeFile | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Responsive values
  const uploadBoxHeight = useBreakpointValue({ base: '120px', md: '140px' });
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '24px', md: '32px' });

  // Validation function
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return language === 'en' 
        ? 'File size must be less than 5MB'
        : 'फ़ाइल का आकार 5MB से कम होना चाहिए';
    }

    if (file.size < MIN_FILE_SIZE) {
      return language === 'en' 
        ? 'File is too small. Please upload a valid resume'
        : 'फ़ाइल बहुत छोटी है। कृपया एक वैध रिज्यूमे अपलोड करें';
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExtension || '')) {
      return language === 'en' 
        ? 'Please upload PDF, DOC, DOCX, or TXT files only'
        : 'कृपया केवल PDF, DOC, DOCX, या TXT फ़ाइलें अपलोड करें';
    }

    // Check file name length
    if (file.name.length > 100) {
      return language === 'en' 
        ? 'File name is too long. Please rename and try again'
        : 'फ़ाइल का नाम बहुत लंबा है। कृपया नाम बदलें और पुनः प्रयास करें';
    }

    return null;
  }, [language]);

  // Simulate file upload with progress
  const simulateUpload = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const fileId = Date.now().toString();
      const resumeFile: ResumeFile = {
        file,
        id: fileId,
        uploadProgress: 0,
        status: 'uploading'
      };

      setUploadedFile(resumeFile);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFile(prev => {
          if (!prev) return null;
          
          const newProgress = prev.uploadProgress + Math.random() * 30;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            const completedFile = {
              ...prev,
              uploadProgress: 100,
              status: 'success' as const
            };
            onChange(file);
            setTimeout(() => resolve(), 500);
            return completedFile;
          }
          
          return {
            ...prev,
            uploadProgress: Math.min(newProgress, 95)
          };
        });
      }, 200);

      // Simulate potential error (5% chance)
      if (Math.random() < 0.05) {
        setTimeout(() => {
          clearInterval(interval);
          setUploadedFile(prev => prev ? {
            ...prev,
            status: 'error',
            errorMessage: language === 'en' 
              ? 'Upload failed. Please try again.'
              : 'अपलोड असफल। कृपया पुनः प्रयास करें।'
          } : null);
          reject(new Error('Upload failed'));
        }, 1000);
      }
    });
  }, [onChange, language]);

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationErr = validateFile(file);
    
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setValidationError('');
    
    try {
      await simulateUpload(file);
    } catch (error) {
      console.error('Upload error:', error);
    }
  }, [validateFile, simulateUpload]);

  // Handle file input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
    // Reset input value to allow re-uploading same file
    event.target.value = '';
  }, [handleFileSelect]);

  // Handle drag and drop
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (!disabled) {
      handleFileSelect(event.dataTransfer.files);
    }
  }, [disabled, handleFileSelect]);

  // Handle file removal
  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    onChange(null);
    setValidationError('');
  }, [onChange]);

  // Handle click to upload
  const handleUploadClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Get file icon based on type
  const getFileIcon = useCallback((fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📄';
    }
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const currentError = error || validationError;

  return (
    <Box w="full">
      <AnimatedText
        fontSize="lg"
        fontWeight="semibold"
        mb={3}
        color="gray.800"
        animationKey={language}
        duration={0.25}
      >
        {language === 'en' ? 'Resume Upload' : 'रिज्यूमे अपलोड'}
        {isRequired && <Text as="span" color="red.500" ml={1}>*</Text>}
      </AnimatedText>

      <Text
        fontSize={fontSize}
        color="gray.600"
        mb={4}
        lineHeight="1.5"
      >
        {language === 'en' 
          ? 'Upload your resume to help us better match you with relevant internships. Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)'
          : 'प्रासंगिक इंटर्नशिप के साथ बेहतर मैच के लिए अपना रिज्यूमे अपलोड करें। समर्थित प्रारूप: PDF, DOC, DOCX, TXT (अधिकतम 5MB)'
        }
      </Text>

      {/* Upload Area */}
      {!uploadedFile && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            border="2px dashed"
            borderColor={
              currentError ? 'red.300' : 
              isDragOver ? 'brand.400' : 'gray.300'
            }
            borderRadius="xl"
            p={6}
            textAlign="center"
            cursor={disabled ? 'not-allowed' : 'pointer'}
            bg={
              disabled ? 'gray.50' : 
              isDragOver ? 'brand.50' : 'white'
            }
            transition="all 0.2s ease"
            _hover={!disabled ? {
              borderColor: 'brand.400',
              bg: 'brand.50'
            } : {}}
            h={uploadBoxHeight}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <VStack gap={3}>
              <Icon 
                as={FiUpload} 
                boxSize={iconSize}
                color={
                  disabled ? 'gray.400' : 
                  isDragOver ? 'brand.500' : 'gray.500'
                }
              />
              <VStack gap={1}>
                <Text 
                  fontSize={fontSize} 
                  fontWeight="medium"
                  color={disabled ? 'gray.400' : 'gray.700'}
                >
                  {language === 'en' 
                    ? 'Click to upload or drag and drop'
                    : 'अपलोड करने के लिए क्लिक करें या ड्रैग एंड ड्रॉप करें'
                  }
                </Text>
                <Text 
                  fontSize="sm" 
                  color={disabled ? 'gray.400' : 'gray.500'}
                >
                  {language === 'en' 
                    ? 'PDF, DOC, DOCX, TXT up to 5MB'
                    : 'PDF, DOC, DOCX, TXT 5MB तक'
                  }
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={handleInputChange}
            style={{ display: 'none' }}
            disabled={disabled}
          />
        </MotionBox>
      )}

      {/* File Upload Progress/Success */}
      <AnimatePresence>
        {uploadedFile && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              border="2px solid"
              borderColor={
                uploadedFile.status === 'error' ? 'red.300' :
                uploadedFile.status === 'success' ? 'green.300' : 'brand.300'
              }
              borderRadius="xl"
              p={4}
              bg={
                uploadedFile.status === 'error' ? 'red.50' :
                uploadedFile.status === 'success' ? 'green.50' : 'brand.50'
              }
            >
              <HStack justify="space-between" align="start" mb={3}>
                <HStack gap={3} flex="1" minW="0">
                  <Text fontSize="2xl">
                    {getFileIcon(uploadedFile.file.name)}
                  </Text>
                  <Box flex="1" minW="0">
                    <Text 
                      fontSize={fontSize}
                      fontWeight="medium"
                      color="gray.800"
                      truncate
                      title={uploadedFile.file.name}
                    >
                      {uploadedFile.file.name}
                    </Text>
                    <HStack gap={2} mt={1}>
                      <Text fontSize="sm" color="gray.600">
                        {formatFileSize(uploadedFile.file.size)}
                      </Text>
                      <Badge
                        colorScheme={
                          uploadedFile.status === 'error' ? 'red' :
                          uploadedFile.status === 'success' ? 'green' : 'blue'
                        }
                        size="sm"
                      >
                        {uploadedFile.status === 'uploading' && (language === 'en' ? 'Uploading' : 'अपलोड हो रहा')}
                        {uploadedFile.status === 'success' && (language === 'en' ? 'Uploaded' : 'अपलोड हो गया')}
                        {uploadedFile.status === 'error' && (language === 'en' ? 'Failed' : 'असफल')}
                      </Badge>
                    </HStack>
                  </Box>
                </HStack>

                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  onClick={handleRemoveFile}
                  aria-label={language === 'en' ? 'Remove file' : 'फ़ाइल हटाएं'}
                >
                  <Icon as={FiX} />
                </Button>
              </HStack>

              {/* Progress Bar */}
              {uploadedFile.status === 'uploading' && (
                <Box mb={2}>
                  <Box
                    w="full"
                    h="6px"
                    bg="gray.200"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      h="full"
                      bg="orange.500"
                      borderRadius="full"
                      transition="width 0.3s ease"
                      w={`${uploadedFile.uploadProgress}%`}
                    />
                  </Box>
                  <Text fontSize="xs" color="gray.600" mt={1} textAlign="center">
                    {Math.round(uploadedFile.uploadProgress)}%
                  </Text>
                </Box>
              )}

              {/* Success Icon */}
              {uploadedFile.status === 'success' && (
                <HStack justify="center" color="green.600">
                  <Icon as={FiCheck} />
                  <Text fontSize="sm" fontWeight="medium">
                    {language === 'en' ? 'Successfully uploaded' : 'सफलतापूर्वक अपलोड हो गया'}
                  </Text>
                </HStack>
              )}

              {/* Error Message */}
              {uploadedFile.status === 'error' && uploadedFile.errorMessage && (
                <HStack justify="center" color="red.600">
                  <Icon as={FiAlertCircle} />
                  <Text fontSize="sm">
                    {uploadedFile.errorMessage}
                  </Text>
                </HStack>
              )}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {currentError && (
        <Box
          mt={3}
          p={3}
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
        >
          <HStack gap={2}>
            <Icon as={FiAlertCircle} color="red.500" />
            <Text fontSize="sm" color="red.700">
              {currentError}
            </Text>
          </HStack>
        </Box>
      )}

      {/* Help Text */}
      {!currentError && !uploadedFile && (
        <Text fontSize="xs" color="gray.500" mt={2}>
          {language === 'en' 
            ? 'Tip: A well-formatted resume helps us suggest better internship matches'
            : 'सुझाव: एक अच्छी तरह से फॉर्मेट किया गया रिज्यूमे हमें बेहतर इंटर्नशिप मैच सुझाने में मदद करता है'
          }
        </Text>
      )}
    </Box>
  );
};

export default ResumeUpload;
