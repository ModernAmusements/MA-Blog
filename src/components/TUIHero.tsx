'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './TUIHero.module.scss';

interface TUINavItem {
  label: string;
  path: string;
  type: 'dir' | 'file';
  size?: string;
  subItems?: { label: string; path: string; type: 'dir' | 'file'; size?: string }[];
}

interface TUIHeroProps {
  navItems: TUINavItem[];
  lang: string;
}

const FolderIcon = () => (
  <Image src="/images/icons/sf-symbols/folder.svg" alt="folder" width={16} height={14} className={styles.sfIcon} unoptimized />
);

const OpenFolderIcon = () => (
  <Image src="/images/icons/sf-symbols/folder.svg" alt="open folder" width={16} height={14} className={styles.sfIcon} unoptimized />
);

const FileIcon = () => (
  <Image src="/images/icons/sf-symbols/text.document.svg" alt="file" width={13} height={16} className={styles.sfIcon} unoptimized />
);

const PersonIcon = () => (
  <Image src="/images/icons/sf-symbols/person.crop.circle.svg" alt="person" width={16} height={16} className={styles.sfIcon} unoptimized />
);

const PaperplaneIcon = () => (
  <Image src="/images/icons/sf-symbols/paperplane.svg" alt="paperplane" width={16} height={16} className={styles.sfIcon} unoptimized />
);

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <span className={`${styles.chevron} ${isExpanded ? styles.chevronDown : ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </span>
);

const getIcon = (item: TUINavItem, isExpanded: boolean) => {
  if (item.type === 'dir') {
    return isExpanded ? <OpenFolderIcon /> : <FolderIcon />;
  }
  if (item.path.includes('/about')) {
    return <PersonIcon />;
  }
  if (item.path.includes('/contact')) {
    return <PaperplaneIcon />;
  }
  return <FileIcon />;
};

export function TUIHero({ navItems, lang }: TUIHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedDirs, setExpandedDirs] = useState<Set<number>>(new Set([0, 1, 2, 3]));
  const router = useRouter();

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        router.push(item.path);
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
        <div className={styles.heroPane}>
          <div className={styles.subHeader}>
            <span>C++ • Swift • Python • TS</span>
            <span className={styles.separator}>|</span>
          </div>
          <h1><span className={styles.prompt}>~ &gt;</span> Welcome to My Portfolio</h1>
          <p>Full-stack developer specializing in algorithms, performance optimization, and clean code.</p>
          <div className={styles.cta}>
            <button onClick={scrollToProjects} className={styles.primary}>
              View Projects <span className={styles.arrow}>↓</span>
            </button>
            <Link href={`/${lang}/contact`} className={styles.secondary}>
              Get in Touch <PaperplaneIcon />
            </Link>
          </div>
        </div>
        
        <div className={styles.explorePane}>
          <h2>Explore My Work</h2>
          <div className={styles.fileList}>
            <ul>
              {navItems.map((item, index) => (
                <li key={item.path}>
                  <div 
                    className={`${styles.itemRow} ${index === activeIndex ? styles.active : ''}`}
                    onClick={() => { 
                      setActiveIndex(index); 
                      if (item.type === 'dir') toggleExpand(index);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    tabIndex={0}
                  >
                    <span className={styles.chevronContainer}>
                      <ChevronIcon isExpanded={expandedDirs.has(index)} />
                    </span>
                    <span className={styles.icon}>{getIcon(item, expandedDirs.has(index))}</span>
                    <span className={styles.name}>{item.label}</span>
                    <span className={styles.meta}>{item.type === 'dir' ? '[DIR]' : item.size}</span>
                  </div>
                  {item.subItems && expandedDirs.has(index) && (
                    <ul className={styles.subList}>
                      {item.subItems.map((sub) => (
                        <li key={sub.path} className={styles.subItem}>
                          <Link href={sub.path} className={styles.subLink}>
                            <span className={styles.icon}><FileIcon /></span>
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