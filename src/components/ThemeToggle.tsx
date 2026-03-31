'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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