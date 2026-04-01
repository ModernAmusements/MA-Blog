import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { languages, defaultLang } from '@/i18n';
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

export function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || defaultLang;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <Header lang={lang} />
          <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 3rem', minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <Footer lang={lang} />
        </ThemeProvider>
      </body>
    </html>
  );
}