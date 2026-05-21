import type { Metadata } from 'next';
import styles from './page.module.scss';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';
  const t = translations[lang].impressum;

  return {
    title: `${t.title} | ${SITE_NAME}`,
    description: t.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/impressum`,
      languages: {
        en: `${SITE_URL}/en/impressum`,
        de: `${SITE_URL}/de/impressum`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${SITE_URL}/${lang}/impressum`,
      siteName: SITE_NAME,
      title: `${t.title} | ${SITE_NAME}`,
      description: t.description,
    },
  };
}

export default async function ImpressumPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].impressum;

  return (
    <div className={styles.impressum}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
        <p className={styles.subtitle}>{t.description}</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.responsible}</h2>
          <p className={styles.text}>{t.name}</p>
          <p className={styles.text}>{t.address}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.contact}</h2>
          <p className={styles.text}>
            <a href={`mailto:${t.email}`}>{t.email}</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.disclaimerTitle}</h2>
          <p className={styles.text}>{t.disclaimerContent}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.copyrightTitle}</h2>
          <p className={styles.text}>{t.copyrightContent}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.liabilityTitle}</h2>
          <p className={styles.text}>{t.liabilityContent}</p>
        </section>
      </div>
    </div>
  );
}
