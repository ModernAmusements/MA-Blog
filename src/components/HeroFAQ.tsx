'use client';

import { useState } from 'react';
import { translations, type Lang } from '@/i18n';
import { ChevronIcon } from '@/components/icons';
import styles from './HeroFAQ.module.scss';

interface Props {
  lang: Lang;
}

export function HeroFAQ({ lang }: Props) {
  const t = translations[lang].contact;
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className={styles.terminalFrame}>
      <div className={styles.terminalHeader}>
        <span>~/faq</span>
        <span className={styles.status}>{t.faqItems.length}</span>
      </div>
      <div className={styles.terminalContent}>
        <h3 className={styles.title}>{t.faqTitle}</h3>
        <div className={styles.list}>
          {t.faqItems.map((item, index) => (
            <div key={index} className={styles.item}>
              <button
                className={styles.question}
                onClick={() => toggleFaq(index)}
              >
                <span>{item.question}</span>
                <ChevronIcon isExpanded={expandedFaq === index} />
              </button>
              {expandedFaq === index && (
                <div className={styles.answer}>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
