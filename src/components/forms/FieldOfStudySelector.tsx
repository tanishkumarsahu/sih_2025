'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Icon,
  Badge,
  Flex,
  useBreakpointValue,
  Collapse,
  IconButton,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSearch, FiCheck } from 'react-icons/fi';
import { FIELD_CATEGORIES, CUSTOM_FIELD_OPTION, type FieldCategory } from '@/constants';

// Motion components
const MotionBox = motion.create(Box);
const MotionButton = motion.create(Button);

interface FieldOfStudySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  language: 'en' | 'hi';
  error?: string;
  isRequired?: boolean;
}

type ViewState = 'categories' | 'fields' | 'custom';

export const FieldOfStudySelector: React.FC<FieldOfStudySelectorProps> = ({
  value,
  onChange,
  language,
  error,
  isRequired = false,
}) => {
  const [currentView, setCurrentView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<FieldCategory | null>(null);
  const [customField, setCustomField] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Responsive values
  const buttonHeight = useBreakpointValue({ base: '60px', md: '56px' });
  const iconSize = useBreakpointValue({ base: '2xl', md: 'xl' });
  const fontSize = useBreakpointValue({ base: 'lg', md: 'md' });
  const spacing = useBreakpointValue({ base: 4, md: 3 });

  // Handle category selection
  const handleCategorySelect = useCallback((category: FieldCategory) => {
    setSelectedCategory(category);
    if (category.id === 'others') {
      setCurrentView('custom');
    } else {
      setCurrentView('fields');
    }
  }, []);

  // Handle field selection
  const handleFieldSelect = useCallback((field: string) => {
    onChange(field);
    setCurrentView('categories');
    setSelectedCategory(null);
  }, [onChange]);

  // Handle custom field submission
  const handleCustomFieldSubmit = useCallback(() => {
    if (customField.trim()) {
      onChange(customField.trim());
      setCurrentView('categories');
      setSelectedCategory(null);
      setCustomField('');
    }
  }, [customField, onChange]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (currentView === 'fields' || currentView === 'custom') {
      setCurrentView('categories');
      setSelectedCategory(null);
      setCustomField('');
      setSearchQuery('');
    }
  }, [currentView]);

  // Filter fields based on search query
  const getFilteredFields = useCallback((category: FieldCategory) => {
    if (!searchQuery) return category.fields[language];
    
    return category.fields[language].filter(field =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, language]);

  // Get selected field display info
  const getSelectedFieldInfo = useCallback(() => {
    if (!value) return null;
    
    for (const category of FIELD_CATEGORIES) {
      if (category.fields[language].includes(value)) {
        return {
          category: category.name[language],
          field: value,
          icon: category.icon,
          color: category.color
        };
      }
    }
    
    // Custom field
    return {
      category: FIELD_CATEGORIES.find(c => c.id === 'others')?.name[language] || 'Others',
      field: value,
      icon: '📚',
      color: '#6B7280'
    };
  }, [value, language]);

  const selectedInfo = getSelectedFieldInfo();

  return (
    <Box w="full">
      {/* Selected Field Display */}
      {selectedInfo && currentView === 'categories' && (
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          mb={4}
          p={4}
          bg="gray.50"
          borderRadius="xl"
          border="2px solid"
          borderColor="brand.200"
        >
          <HStack spacing={3}>
            <Text fontSize={iconSize}>{selectedInfo.icon}</Text>
            <Box flex="1">
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {selectedInfo.category}
              </Text>
              <Text fontSize={fontSize} fontWeight="bold" color="gray.800">
                {selectedInfo.field}
              </Text>
            </Box>
            <Badge colorScheme="green" variant="subtle">
              <Icon as={FiCheck} mr={1} />
              {language === 'en' ? 'Selected' : 'चयनित'}
            </Badge>
          </HStack>
        </MotionBox>
      )}

      {/* Main Content Area */}
      <Box
        border="2px solid"
        borderColor={error ? 'red.300' : 'gray.200'}
        borderRadius="xl"
        overflow="hidden"
        bg="white"
        minH="300px"
      >
        <AnimatePresence mode="wait">
          {/* Categories View */}
          {currentView === 'categories' && (
            <MotionBox
              key="categories"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              p={4}
            >
              <Text
                fontSize={fontSize}
                fontWeight="bold"
                color="gray.800"
                mb={4}
                textAlign="center"
              >
                {language === 'en' ? 'Choose Your Field Category' : 'अपनी क्षेत्र श्रेणी चुनें'}
              </Text>

              <VStack spacing={spacing} align="stretch">
                {FIELD_CATEGORIES.map((category) => (
                  <MotionButton
                    key={category.id}
                    h={buttonHeight}
                    w="full"
                    justifyContent="flex-start"
                    variant="outline"
                    borderWidth="2px"
                    borderColor="gray.200"
                    bg="white"
                    _hover={{
                      borderColor: category.color,
                      bg: `${category.color}10`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${category.color}20`
                    }}
                    _active={{
                      transform: 'translateY(0)',
                    }}
                    transition="all 0.2s ease"
                    onClick={() => handleCategorySelect(category)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <HStack spacing={4} w="full">
                      <Text fontSize={iconSize}>{category.icon}</Text>
                      <Box flex="1" textAlign="left">
                        <Text
                          fontSize={fontSize}
                          fontWeight="bold"
                          color="gray.800"
                          lineHeight="1.2"
                        >
                          {category.name[language]}
                        </Text>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          lineHeight="1.2"
                          mt={1}
                        >
                          {category.description[language]}
                        </Text>
                      </Box>
                      <Badge
                        colorScheme="gray"
                        variant="subtle"
                        fontSize="xs"
                      >
                        {category.fields[language].length}
                      </Badge>
                    </HStack>
                  </MotionButton>
                ))}
              </VStack>
            </MotionBox>
          )}

          {/* Fields View */}
          {currentView === 'fields' && selectedCategory && (
            <MotionBox
              key="fields"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              p={4}
            >
              {/* Header with Back Button */}
              <HStack mb={4} spacing={3}>
                <IconButton
                  aria-label="Go back"
                  icon={<FiArrowLeft />}
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                />
                <Box flex="1">
                  <HStack spacing={2}>
                    <Text fontSize="lg">{selectedCategory.icon}</Text>
                    <Text fontSize={fontSize} fontWeight="bold" color="gray.800">
                      {selectedCategory.name[language]}
                    </Text>
                  </HStack>
                </Box>
              </HStack>

              {/* Search Box for Large Categories */}
              {selectedCategory.fields[language].length > 6 && (
                <Box mb={4}>
                  <Input
                    placeholder={language === 'en' ? 'Search fields...' : 'क्षेत्र खोजें...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftElement={<Icon as={FiSearch} color="gray.400" />}
                    bg="gray.50"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: selectedCategory.color,
                      bg: "white"
                    }}
                  />
                </Box>
              )}

              {/* Fields List */}
              <VStack spacing={spacing} align="stretch">
                {getFilteredFields(selectedCategory).map((field) => (
                  <MotionButton
                    key={field}
                    h="50px"
                    w="full"
                    justifyContent="flex-start"
                    variant="outline"
                    borderWidth="2px"
                    borderColor={value === field ? selectedCategory.color : "gray.200"}
                    bg={value === field ? `${selectedCategory.color}10` : "white"}
                    color={value === field ? selectedCategory.color : "gray.800"}
                    _hover={{
                      borderColor: selectedCategory.color,
                      bg: `${selectedCategory.color}10`,
                      transform: 'translateY(-1px)'
                    }}
                    onClick={() => handleFieldSelect(field)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <HStack spacing={3} w="full">
                      <Text fontSize={fontSize} fontWeight="medium">
                        {field}
                      </Text>
                      {value === field && (
                        <Icon as={FiCheck} color={selectedCategory.color} ml="auto" />
                      )}
                    </HStack>
                  </MotionButton>
                ))}
              </VStack>

              {/* No Results Message */}
              {searchQuery && getFilteredFields(selectedCategory).length === 0 && (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500" fontSize={fontSize}>
                    {language === 'en' 
                      ? 'No fields found. Try a different search term.' 
                      : 'कोई क्षेत्र नहीं मिला। अलग खोज शब्द आज़माएं।'
                    }
                  </Text>
                </Box>
              )}
            </MotionBox>
          )}

          {/* Custom Field View */}
          {currentView === 'custom' && (
            <MotionBox
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              p={4}
            >
              {/* Header with Back Button */}
              <HStack mb={4} spacing={3}>
                <IconButton
                  aria-label="Go back"
                  icon={<FiArrowLeft />}
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                />
                <Box flex="1">
                  <Text fontSize={fontSize} fontWeight="bold" color="gray.800">
                    {language === 'en' ? 'Enter Your Field of Study' : 'अपना अध्ययन क्षेत्र दर्ज करें'}
                  </Text>
                </Box>
              </HStack>

              <VStack spacing={4} align="stretch">
                <Input
                  placeholder={CUSTOM_FIELD_OPTION[language]}
                  value={customField}
                  onChange={(e) => setCustomField(e.target.value)}
                  size="lg"
                  bg="gray.50"
                  border="2px solid"
                  borderColor="gray.200"
                  _focus={{
                    borderColor: "brand.500",
                    bg: "white"
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomFieldSubmit();
                    }
                  }}
                />

                <Button
                  colorScheme="brand"
                  size="lg"
                  onClick={handleCustomFieldSubmit}
                  isDisabled={!customField.trim()}
                  _disabled={{
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }}
                >
                  {language === 'en' ? 'Confirm Field' : 'क्षेत्र की पुष्टि करें'}
                </Button>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>

      {/* Error Message */}
      {error && (
        <Text color="red.500" fontSize="sm" mt={2}>
          {error}
        </Text>
      )}

      {/* Required Field Indicator */}
      {isRequired && !value && (
        <Text color="gray.500" fontSize="sm" mt={2}>
          {language === 'en' ? '* This field is required' : '* यह फील्ड आवश्यक है'}
        </Text>
      )}
    </Box>
  );
};

export default FieldOfStudySelector;
