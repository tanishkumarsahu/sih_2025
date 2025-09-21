'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';

const MotionBox = motion.create(Box);

interface Toast {
  id: string;
  title: string;
  description?: string;
  status: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isClosable?: boolean;
}

interface ToasterContextType {
  create: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};

interface ToasterProviderProps {
  children: React.ReactNode;
}

export const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const create = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      isClosable: true,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, newToast.duration);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const getStatusColor = (status: Toast['status']) => {
    switch (status) {
      case 'success': return 'green.500';
      case 'error': return 'red.500';
      case 'warning': return 'orange.500';
      case 'info': return 'blue.500';
      default: return 'gray.500';
    }
  };

  const getStatusIcon = (status: Toast['status']) => {
    switch (status) {
      case 'success': return FiCheck;
      case 'error': return FiAlertCircle;
      case 'warning': return FiAlertCircle;
      case 'info': return FiInfo;
      default: return FiInfo;
    }
  };

  return (
    <ToasterContext.Provider value={{ create, dismiss }}>
      {children}
      <Box
        position="fixed"
        top={4}
        right={4}
        zIndex={9999}
        pointerEvents="none"
      >
        <VStack gap={2} align="stretch">
          <AnimatePresence>
            {toasts.map((toast) => {
              const StatusIcon = getStatusIcon(toast.status);
              return (
                <MotionBox
                  key={toast.id}
                  initial={{ opacity: 0, x: 300, scale: 0.3 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
                  bg="white"
                  p={4}
                  borderRadius="md"
                  boxShadow="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  minW="300px"
                  maxW="400px"
                  pointerEvents="auto"
                >
                  <HStack gap={3} align="start">
                    <Box color={getStatusColor(toast.status)} mt={0.5}>
                      <StatusIcon size={20} />
                    </Box>
                    <VStack gap={1} align="start" flex={1}>
                      <Text fontWeight="semibold" fontSize="sm">
                        {toast.title}
                      </Text>
                      {toast.description && (
                        <Text fontSize="xs" color="gray.600">
                          {toast.description}
                        </Text>
                      )}
                    </VStack>
                    {toast.isClosable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismiss(toast.id)}
                        color="gray.400"
                        _hover={{ color: 'gray.600' }}
                        minW="auto"
                        h="auto"
                        p={1}
                      >
                        <FiX size={16} />
                      </Button>
                    )}
                  </HStack>
                </MotionBox>
              );
            })}
          </AnimatePresence>
        </VStack>
      </Box>
    </ToasterContext.Provider>
  );
};

// Legacy compatibility for existing components
export const toaster = {
  create: (toast: Omit<Toast, 'id'>) => {
    // This will be replaced by the context when used properly
    console.warn('Toaster not initialized. Wrap your app with ToasterProvider.');
  }
};
