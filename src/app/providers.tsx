'use client';

import { Provider } from '@/components/ui/provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToasterProvider } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <ToasterProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ToasterProvider>
    </Provider>
  );
}
