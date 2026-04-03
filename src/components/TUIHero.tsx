'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './TUIHero.module.scss';

interface TUINavItem {
  label: string;
  path: string;
  type: 'dir' | 'file';
  size?: string;
  subItems?: { label: string; path: string; type: 'dir' | 'file'; size?: string }[];
}

const navItems: TUINavItem[] = [
  { label: 'blog', path: '/en/blog', type: 'dir', subItems: [
    { label: 'hello-world.md', path: '/en/blog/hello-world', type: 'file', size: '1.2K' },
    { label: 'cli-tool.md', path: '/en/blog/cli-tool', type: 'file', size: '2.4K' },
  ]},
  { label: 'projects', path: '/en/projects', type: 'dir', subItems: [
    { label: '2026-conflict.md', path: '/en/projects/2026-conflict', type: 'file', size: '8.5K' },
    { label: 'portfolio.md', path: '/en/projects/portfolio', type: 'file', size: '3.2K' },
  ]},
  { label: 'about', path: '/en/about', type: 'file', size: '512B' },
  { label: 'contact', path: '/en/contact', type: 'file', size: '256B' },
];

export function TUIHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedDirs, setExpandedDirs] = useState<Set<number>>(new Set());

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDirs(newExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(Math.min(activeIndex + 1, navItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter') {
      const item = navItems[index];
      if (item.type === 'dir') {
        toggleExpand(index);
      } else {
        window.location.href = item.path;
      }
    } else if (e.key === ' ') {
      e.preventDefault();
      const item = navItems[index];
      if (item.type === 'dir') {
        toggleExpand(index);
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>Files</span>
        <span>Sort: Name</span>
      </header>
      
      <main className={styles.content}>
        <div className={styles.fileList}>
          <ul>
            {navItems.map((item, index) => (
              <li key={item.path}>
                <div 
                  className={`${styles.itemRow} ${index === activeIndex ? styles.active : ''}`}
                  onClick={() => { setActiveIndex(index); item.type === 'dir' && toggleExpand(index); }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  tabIndex={0}
                >
                  <span className={styles.icon}>{item.type === 'dir' ? (expandedDirs.has(index) ? '📂' : '📁') : '📄'}</span>
                  <span className={styles.name}>{item.label}</span>
                  <span className={styles.meta}>{item.type === 'dir' ? '[DIR]' : item.size}</span>
                </div>
                {item.subItems && expandedDirs.has(index) && (
                  <ul className={styles.subList}>
                    {item.subItems.map((sub) => (
                      <li key={sub.path} className={styles.subItem}>
                        <Link href={sub.path} className={styles.subLink}>
                          <span className={styles.icon}>📄</span>
                          <span className={styles.name}>{sub.label}</span>
                          <span className={styles.meta}>{sub.size}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.statusLeft}>{navItems.length} items</div>
        <div className={styles.controlsRight}>
          <span>[↑↓] Navigate</span>
          <span>[Enter] Open</span>
          <span>[Space] Expand</span>
        </div>
      </footer>
    </div>
  );
}