'use client';

import { Box, Text, Heading } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

const MotionBox = motion.create(Box);

interface AnimatedTextProps {
  children: ReactNode;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  animationKey: string | number;
  duration?: number;
  [key: string]: any; // For passing through other props like fontSize, color, etc.
}

export function AnimatedText({ 
  children, 
  as = 'p', 
  animationKey, 
  duration = 0.3,
  ...props 
}: AnimatedTextProps) {
  const Component = as === 'p' ? Text : Heading;
  
  return (
    <AnimatePresence mode="wait">
      <MotionBox
        key={animationKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration,
          ease: "easeInOut"
        }}
      >
        <Component {...props}>
          {children}
        </Component>
      </MotionBox>
    </AnimatePresence>
  );
}

interface AnimatedButtonTextProps {
  children: ReactNode;
  animationKey: string | number;
  duration?: number;
}

export function AnimatedButtonText({ 
  children, 
  animationKey, 
  duration = 0.2 
}: AnimatedButtonTextProps) {
  return (
    <AnimatePresence mode="wait">
      <MotionBox
        key={animationKey}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ 
          duration,
          ease: "easeInOut"
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </MotionBox>
    </AnimatePresence>
  );
}
