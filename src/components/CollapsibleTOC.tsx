'use client';

import { useState, useMemo } from 'react';
import styles from './CollapsibleTOC.module.scss';
import type { HeadingItem } from '@/lib/mdx';

interface SubHeadingMap {
  [thema: number]: HeadingItem[];
}

interface TOCProps {
  headings: HeadingItem[];
}

export function CollapsibleTOC({ headings }: TOCProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const themas = useMemo(() => headings.filter(h => h.level === 2), [headings]);

  const subHeadingsMap = useMemo<SubHeadingMap>(() => {
    const map: SubHeadingMap = {};
    themas.forEach(thema => {
      map[thema.thema] = headings.filter(h => h.thema === thema.thema && h.level > 2);
    });
    return map;
  }, [headings, themas]);

  const toggle = (thema: number) => {
    setExpanded(prev => ({ ...prev, [thema]: !prev[thema] }));
  };

  return (
    <nav className={styles.toc}>
      <h4>Contents</h4>
      <ul>
        {themas.map((thema) => {
          const subHeadings = subHeadingsMap[thema.thema] || [];
          const hasSubHeadings = subHeadings.length > 0;
          const isExpanded = expanded[thema.thema] ?? false;

          return (
            <li key={thema.thema} className={styles.tocLevel2}>
              <div className={styles.tocItem}>
                {hasSubHeadings ? (
                  <button 
                    onClick={() => toggle(thema.thema)}
                    className={styles.tocToggle}
                    aria-expanded={isExpanded}
                  >
                    <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}>›</span>
                    <span className={styles.tocNumber}>{thema.thema}.</span> {thema.text}
                  </button>
                ) : (
                  <a href={`#${thema.id}`} className={styles.tocLink}>
                    <span className={styles.tocNumber}>{thema.thema}.</span> {thema.text}
                  </a>
                )}
              </div>
              {hasSubHeadings && (
                <ul className={`${styles.tocSub} ${isExpanded ? styles.tocSubOpen : ''}`}>
                  {subHeadings.map((sub, idx) => (
                    <li key={idx} className={sub.level === 3 ? styles.tocLevel3 : styles.tocLevel4}>
                      <a href={`#${sub.id}`}>
                        <span className={styles.tocNumber}>{sub.thema}.{sub.subIndex}</span> {sub.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}