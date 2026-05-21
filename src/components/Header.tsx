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
  // { path: '/projects', key: 'projects' },
  { path: '/brand', key: 'brand' },
  // { path: '/about', key: 'about' },
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
          <svg className={styles.logoSvg} width="200" height="197" viewBox="0 0 200 197" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 40.7412C200 50.9686 191.709 59.2598 181.481 59.2598L118.519 59.2598C108.291 59.2598 100 67.5508 100 77.7783C100 88.0057 108.291 96.2969 118.519 96.2969L181.481 96.2969C191.709 96.2969 200 104.588 200 114.815V196.297H118.519C108.291 196.297 100 188.006 100 177.778L100 114.815C100 104.748 91.9658 96.556 81.959 96.3027L81.4814 96.2969C71.2539 96.2969 62.9629 104.588 62.9629 114.815L62.9629 196.297H0L0 77.7783C-4.47059e-07 67.5508 8.29102 59.2598 18.5186 59.2598L44.4443 59.2598C54.6717 59.2597 62.9627 50.9686 62.9629 40.7412L62.9629 18.5186C62.9629 8.29104 71.2539 0 81.4814 0L200 0V40.7412Z" fill="currentColor"/>
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
            <a href="https://github.com/ModernAmusements" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.reddit.com/user/princessinsomnia/" target="_blank" rel="noopener noreferrer">Reddit</a>
            <a href="https://www.instagram.com/modernamusements" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.behance.net/stawfik" target="_blank" rel="noopener noreferrer">Behance</a>
          </div>
        </div>
      </div>
    </header>
  );
}