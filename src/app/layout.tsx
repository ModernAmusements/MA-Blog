import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: {
    default: 'Developer Portfolio',
    template: '%s | Developer Portfolio',
  },
  description: 'My personal portfolio showcasing projects and thoughts.',
  metadataBase: new URL('https://yourdomain.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Developer Portfolio',
  },
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <Header />
          <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}