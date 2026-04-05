'use client';

import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { useEffect } from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
      <Analytics />
      {children}
    </ThemeProvider>
  );
}
