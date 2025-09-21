'use client';

import { Box, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const FloatingElements = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {/* Large floating circle - simplified for mobile */}
      <MotionBox
        position="absolute"
        top="10%"
        right="10%"
        w={{ base: "80px", md: "200px" }}
        h={{ base: "80px", md: "200px" }}
        bg="rgba(255,255,255,0.1)"
        borderRadius="50%"
        animate={{
          y: isMobile ? [-3, 3, -3] : [-10, 10, -10],
          x: isMobile ? 0 : [-5, 5, -5],
          scale: isMobile ? 1 : [1, 1.1, 1],
        }}
        transition={{
          duration: isMobile ? 3 : 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        zIndex={0}
        style={{ transform: "translateZ(0)" }} // Hardware acceleration
      />
      
      {/* Only show additional elements on desktop for performance */}
      {!isMobile && (
        <>
          {/* Medium floating circle */}
          <MotionBox
            position="absolute"
            bottom="20%"
            left="5%"
            w="150px"
            h="150px"
            bg="rgba(255,255,255,0.05)"
            borderRadius="50%"
            animate={{
              y: [10, -15, 10],
              x: [5, -5, 5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            zIndex={0}
            style={{ transform: "translateZ(0)" }}
          />
          
          {/* Small floating circle */}
          <MotionBox
            position="absolute"
            top="30%"
            left="15%"
            w="80px"
            h="80px"
            bg="rgba(255,255,255,0.08)"
            borderRadius="50%"
            animate={{
              y: [-8, 12, -8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            zIndex={0}
            style={{ transform: "translateZ(0)" }}
          />
        </>
      )}
    </>
  );
};
