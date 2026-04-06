import type { Metadata } from 'next';
import styles from './page.module.scss';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';
  const t = translations[lang].about;
  const baseUrl = 'https://modern-amusements.vercel.app';
  
  return {
    title: t.title,
    description: t.content[0],
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${lang}/about`,
      siteName: 'ModernAmusement Development',
      title: t.title,
      description: t.content[0],
      images: [
        {
          url: `${baseUrl}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: 'About ModernAmusement Development',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.content[0],
      creator: '@modernamusements',
      images: [`${baseUrl}/og-image.svg`],
    },
  };
}

export default async function AboutPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].about;
  
  return (
    <div className={styles.about}>
      <h1>{t.title}</h1>
      <div className={styles.content}>
        {t.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <h2>{t.skills}</h2>
        <ul className={styles.skills}>
          {t.skillsList.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <h2>{t.notCoding}</h2>
        <p>{t.notCodingContent}</p>
      </div>
    </div>
  );
}