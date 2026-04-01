import Link from 'next/link';
import styles from './Footer.module.scss';

interface FooterProps {
  lang?: string;
}

export function Footer({ lang = 'en' }: FooterProps) {
  const labels: Record<string, { builtWith: string; github: string; twitter: string; linkedin: string }> = {
    en: { builtWith: 'Built with Next.js', github: 'GitHub', twitter: 'Twitter', linkedin: 'LinkedIn' },
    de: { builtWith: 'Erstellt mit Next.js', github: 'GitHub', twitter: 'Twitter', linkedin: 'LinkedIn' },
  };

  const t = labels[lang] || labels.en;

  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} — {t.builtWith}</p>
      <div className={styles.social}>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">{t.github}</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">{t.twitter}</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">{t.linkedin}</a>
      </div>
    </footer>
  );
}