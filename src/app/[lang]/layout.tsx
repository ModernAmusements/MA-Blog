import type { Metadata, Viewport } from 'next';
import { Footer } from '@/components/Footer';
import { languages, defaultLang } from '@/i18n';
import '@/styles/globals.scss';
import { ClientProviders } from '@/components/ClientProviders';
import { Header } from '@/components/Header';

const BASE_URL = 'https://modern-amusements.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';

  const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
      default: lang === 'de' 
        ? 'ModernAmusement Development - Fullstack Entwickler' 
        : 'ModernAmusement Development - Fullstack Developer',
      template: `%s | ModernAmusement Development`,
    },
    description: lang === 'de'
      ? 'Fullstack Entwickler aus Bielefeld, NRW. Spezialisiert auf Swift, Python Backend, React und Next.js. Ich entwickle performante, barrierefreie Webanwendungen und mobile Apps in ganz Deutschland.'
      : 'Fullstack developer based in Bielefeld, NRW, Germany. Specializing in Swift, Python backend, React, and Next.js. I build performant, accessible web applications and mobile apps.',
    keywords: lang === 'de'
      ? ['Fullstack Entwickler', 'Swift', 'Python', 'React', 'Next.js', 'iOS Entwicklung', 'Backend Entwicklung', 'Webentwicklung', 'App Entwicklung', 'Bielefeld', 'NRW', 'Deutschland', 'Ostwestfalen', 'Entwickler Bielefeld', 'Programmierer NRW', 'Webentwickler Deutschland']
      : ['Fullstack developer', 'Swift', 'Python', 'React', 'Next.js', 'iOS development', 'Backend development', 'Web development', 'App development', 'Bielefeld', 'NRW', 'Germany', 'Developer Bielefeld', 'Programmer NRW', 'Web developer Germany'],
    authors: [{ name: 'ModernAmusement Development' }],
    creator: 'ModernAmusement Development',
    publisher: 'ModernAmusement Development',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: {
        'en': `${BASE_URL}/en`,
        'de': `${BASE_URL}/de`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${BASE_URL}/${lang}`,
      siteName: 'ModernAmusement Development',
      title: lang === 'de'
        ? 'ModernAmusement Development - Fullstack Entwickler Bielefeld'
        : 'ModernAmusement Development - Fullstack Developer Bielefeld',
      description: lang === 'de'
        ? 'Fullstack Entwickler aus Bielefeld, NRW. Spezialisiert auf Swift, Python Backend, React und Next.js.'
        : 'Fullstack developer based in Bielefeld, NRW, Germany. Specializing in Swift, Python backend, React, and Next.js.',
      images: [
        {
          url: `${BASE_URL}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: 'ModernAmusement Development - Fullstack Developer',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: lang === 'de'
        ? 'Fullstack Entwickler Bielefeld - ModernAmusement Development'
        : 'Fullstack Developer Bielefeld - ModernAmusement Development',
      description: lang === 'de'
        ? 'Fullstack Entwickler aus Bielefeld, NRW. Swift, Python, React, Next.js.'
        : 'Fullstack developer in Bielefeld, NRW, Germany. Swift, Python, React, Next.js.',
      images: [`${BASE_URL}/og-image.svg`],
      creator: '@modernamusements',
    },
    other: {
      'geo.region': 'DE-NW',
      'geo.placename': 'Bielefeld',
      'geo.position': '52.0302;8.5325',
      'ICBM': '52.0302, 8.5325',
      'google-site-verification': 'your-verification-code',
    },
  };

  return metadata;
}

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
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/x-icon" href="/images/favicon/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
        <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en`} />
        <link rel="alternate" hrefLang="de" href={`${BASE_URL}/de`} />
      </head>
      <body suppressHydrationWarning>
        <ClientProviders>
          <Header lang={lang} />
          <main className="main-content" style={{ margin: '0 auto', maxWidth: '1400px', minHeight: 'calc(100vh - 200px)', width: '100%' }}>
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}