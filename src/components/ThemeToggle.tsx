'use client';

import { useTheme } from 'next-themes';
import { useMounted } from '@/hooks';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) return null;

  return (
    <button
      className={styles.toggle}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <span className={styles.indicator} />
    </button>
  );
}