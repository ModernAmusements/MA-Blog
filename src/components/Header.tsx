'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';
import { ThemeToggle } from './ThemeToggle';
import { SystemMonitor } from './SystemMonitor';
import { useState, useCallback, useEffect } from 'react';

interface HeaderProps {
  lang?: string;
}

const navItems: { path: string; key: string; disabled?: boolean }[] = [
  { path: '/blog', key: 'blog' },
  { path: '/projects', key: 'projects' },
  { path: '/brand', key: 'brand' },
  { path: '/about', key: 'about' },
  { path: '/contact', key: 'contact' },
];

export function Header({ lang = 'en' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const labels: Record<string, { blog: string; projects: string; brand: string; about: string; contact: string; menu: string }> = {
    en: { blog: 'Blog', projects: 'Projects', brand: 'Brand', about: 'About', contact: 'Contact', menu: 'Menu' },
    de: { blog: 'Blog', projects: 'Projekte', brand: 'Brand', about: 'Über mich', contact: 'Kontakt', menu: 'Menü' },
  };

  const t = labels[lang] || labels.en;

  const isHomepage = pathname === `/${lang}` || pathname === `/${lang}/`;

  const isActive = useCallback((path: string) => {
    return pathname === `/${lang}${path}` || pathname === `/${lang}${path}/`;
  }, [pathname, lang]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const NavLink = ({ to, label, disabled }: { to: string; label: string; disabled?: boolean }) => (
    disabled ? 
      <span className={styles.disabled}>{label}</span> :
      <Link href={to} className={isActive(to.replace(`/${lang}`, '')) ? styles.active : ''}>
        {label}
      </Link>
  );

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href={`/${lang}`} className={styles.logo}>
          <svg className={styles.logoSvg} width="132" height="107" viewBox="0 0 132 107" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M72.7846 56.5205L81.4453 57.4528L96.0084 50.1107L107.749 57.7582L132 48.3757L94.5972 36.3579L79.0335 53.7066L74.6923 41.997L81.1253 39.4422L82.2797 42.5266L89.4187 32.3724L88.7523 30.922L91.5294 25.3584L87.3638 28.0333L87.125 27.4121L91.2906 21.3134L85.6014 23.6545L76.5056 27.1029C76.5056 27.1029 73.6738 31.7871 71.9265 34.5377L59.1201 0L40.2582 28.9136L19.0865 19.6596L21.5889 42.2164L42.7606 48.2896L56.2335 21.0146L60.0829 32.1965L39.8419 53.0665L53.732 74.6115L19.6331 60.714V66.5621L13.0679 63.4617L0 92.7819L19.6321 82.034V85.9863L66.6263 85.6006L55.8484 64.9717L77.5968 73.4542L53.346 107H92.6093L73.94 94.083H80.1313L104.896 63.4126L56.6186 56.5205L70.8608 52.745L72.7855 56.5205H72.7846Z" fill="currentColor"/>
          </svg>
          <span className={styles.logoText}>
            <span className={styles.logoMain}>ModernAmusement</span>
            <span className={styles.logoSub}> Development</span>
          </span>
        </Link>
        
        <div className={styles.rightSection}>
          {!isHomepage && (
            <div className={styles.navContent}>
              <div className={styles.navLinks}>
                {navItems.map((item, index) => (
                  <NavLink 
                    key={item.disabled ? `disabled-${index}` : item.path} 
                    to={`/${lang}${item.path}`} 
                    label={t[item.key as keyof typeof t]}
                    disabled={item.disabled}
                  />
                ))}
              </div>
            </div>
          )}
          
          {isHomepage && (
            <div className={`${styles.navContent} ${styles.systemMonitor}`}>
              <SystemMonitor />
            </div>
          )}
          
          <ThemeToggle />
          
          <button 
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
          </button>
        </div>
      </nav>
      
      <div className={`${styles.menuOverlay} ${menuOpen ? styles.menuOverlayOpen : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`${styles.menuPanel} ${menuOpen ? styles.menuPanelOpen : ''}`}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>{t.menu}</span>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>×</button>
        </div>
        <nav className={styles.menuItems}>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={`/${lang}${item.path}`} 
              label={t[item.key as keyof typeof t]}
              disabled={item.disabled}
            />
          ))}
        </nav>
        <div className={styles.menuFooter}>
          <p>ModernAmusements Development</p>
          <p>Shady Nathan Tawfik</p>
          <p>C++ • Swift • Python • TS</p>
          <p>Algorithms | Performance</p>
          <div className={styles.menuSocial}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </header>
  );
}