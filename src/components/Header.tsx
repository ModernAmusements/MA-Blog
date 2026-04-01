import Link from 'next/link';
import styles from './Header.module.scss';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  lang?: string;
}

export function Header({ lang = 'en' }: HeaderProps) {
  const labels: Record<string, { blog: string; projects: string; about: string; contact: string }> = {
    en: { blog: 'Blog', projects: 'Projects', about: 'About', contact: 'Contact' },
    de: { blog: 'Blog', projects: 'Projekte', about: 'Über mich', contact: 'Kontakt' },
  };

  const t = labels[lang] || labels.en;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href={`/${lang}`} className={styles.logo}>
          ModernAmusement Development
        </Link>
        <div className={styles.links}>
          <Link href={`/${lang}/blog`}>{t.blog}</Link>
          <Link href={`/${lang}/projects`}>{t.projects}</Link>
          <Link href={`/${lang}/about`}>{t.about}</Link>
          <Link href={`/${lang}/contact`}>{t.contact}</Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}