import Link from 'next/link';
import styles from './Header.module.scss';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Dev
        </Link>
        <div className={styles.links}>
          <Link href="/blog">Blog</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}