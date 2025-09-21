'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/',
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        router.push('/profile');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect
  }

  if (!requireAuth && user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};
