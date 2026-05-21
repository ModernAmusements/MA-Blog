import Link from 'next/link';
import styles from './Footer.module.scss';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface FooterProps {
  lang: Lang;
}

export function Footer({ lang }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const t = translations[lang].footer;

  return (
    <footer className={styles.footer}>
      <div className={styles.info}>
        <p>ModernAmusements Development</p>
        <p>Shady Nathan Tawfik</p>
        <p>C++ • Swift • Python • TS</p>
        <p>Algorithms | Performance</p>
        <p>© {currentYear}</p>
      </div>
      <div className={styles.social}>
        <a href="https://github.com/ModernAmusements" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.reddit.com/user/princessinsomnia/" target="_blank" rel="noopener noreferrer">Reddit</a>
        <a href="https://www.instagram.com/modernamusements" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.behance.net/stawfik" target="_blank" rel="noopener noreferrer">Behance</a>
        <Link href={`/${lang}/impressum`}>{t.impressum}</Link>
      </div>
    </footer>
  );
}