import styles from './page.module.scss';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string }>;
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