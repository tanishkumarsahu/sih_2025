'use client';

import { Box, VStack, Heading, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

const MotionBox = motion(Box);

interface AnimatedCardProps {
  icon: IconType;
  title: string;
  description: string;
  index: number;
}

export const AnimatedCard = ({ icon, title, description, index }: AnimatedCardProps) => {
  return (
    <MotionBox
      bg="rgba(255,255,255,0.95)"
      p={8}
      borderRadius="xl"
      shadow="xl"
      textAlign="center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        transition: { duration: 0.3 }
      }}
      backdropFilter="blur(10px)"
      border="1px solid rgba(255,255,255,0.2)"
      cursor="pointer"
    >
      <VStack gap={4}>
        <MotionBox
          whileHover={{ 
            rotate: 360, 
            scale: 1.2,
            transition: { duration: 0.6 }
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
        >
          <Icon as={icon} boxSize={12} color="#DD6B20" />
        </MotionBox>
        <Heading size="md" color="#1A365D">
          {title}
        </Heading>
        <Text color="#2D3748" fontSize="sm" lineHeight="1.6">
          {description}
        </Text>
      </VStack>
    </MotionBox>
  );
};
