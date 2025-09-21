'use client';

import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Image,
  HStack,
} from '@chakra-ui/react';

interface HeaderProps {
  onLanguageToggle?: () => void;
  currentLanguage?: 'en' | 'hi';
}

export default function Header({ onLanguageToggle, currentLanguage = 'en' }: HeaderProps) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      px={4}
      borderBottom="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={4}>
          <Image
            src="/government-logo.png"
            alt="Government of India"
            height="40px"
            fallback={
              <Box
                bg="government.500"
                color="white"
                px={3}
                py={2}
                borderRadius="md"
                fontSize="sm"
                fontWeight="bold"
              >
                GOI
              </Box>
            }
          />
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="bold"
            color="brand.700"
          >
            PM Internship Scheme
          </Text>
        </HStack>

        <Stack direction="row" spacing={4} alignItems="center">
          <Button
            variant="outline"
            size="sm"
            onClick={onLanguageToggle}
            colorScheme="brand"
          >
            {currentLanguage === 'en' ? 'हिंदी' : 'English'}
          </Button>
          
          <Button
            variant="government"
            size="sm"
            display={{ base: 'none', md: 'inline-flex' }}
          >
            Help
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}
