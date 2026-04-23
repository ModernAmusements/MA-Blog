'use client';

import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';
import { ToastProvider } from './Toast';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </Suspense>
  );
}