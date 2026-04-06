'use client';

import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <Analytics />
        {children}
      </ThemeProvider>
    </Suspense>
  );
}
