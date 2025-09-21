'use client';

import { VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionVStack = motion(VStack);
const MotionText = motion(Text);

interface GlowingStatsProps {
  value: string;
  label: string;
  color: string;
  glowColor: string;
  delay?: number;
}

export const GlowingStats = ({ value, label, color, glowColor, delay = 0 }: GlowingStatsProps) => {
  return (
    <MotionVStack
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.3 }
      }}
      p={6}
      bg="rgba(255,255,255,0.1)"
      borderRadius="xl"
      backdropFilter="blur(10px)"
      border="1px solid rgba(255,255,255,0.2)"
      cursor="pointer"
    >
      <MotionText 
        fontSize="4xl" 
        fontWeight="bold" 
        color={color}
        animate={{ 
          textShadow: [
            `0 0 10px ${glowColor}50`,
            `0 0 20px ${glowColor}80`,
            `0 0 30px ${glowColor}60`,
            `0 0 20px ${glowColor}80`,
            `0 0 10px ${glowColor}50`
          ]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {value}
      </MotionText>
      <Text color="rgba(255,255,255,0.8)" fontWeight="medium">
        {label}
      </Text>
    </MotionVStack>
  );
};
