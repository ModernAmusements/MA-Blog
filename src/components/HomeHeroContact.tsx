'use client';

import { useState } from 'react';
import styles from './HomeHeroContact.module.scss';
import { translations, type Lang } from '@/i18n';
import { ClipboardIcon, CheckIcon, ClockIcon, BriefcaseIcon } from '@/components/icons';

const EMAIL = 'shadynathantawfik@gmail.com';

interface Props {
  lang: Lang;
}

export function HomeHeroContact({ lang }: Props) {
  const t = translations[lang].contact;
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  return (
    <div className={styles.panels}>
      <div className={styles.terminalFrame}>
        <div className={styles.terminalHeader}>
          <span>~/status</span>
          <span className={styles.status}>Live</span>
        </div>
        <div className={styles.terminalContent}>
          <div className={styles.statusBadge}>
            <BriefcaseIcon />
            <span>{t.status}</span>
          </div>
          <p className={styles.statusNote}>{t.statusNote}</p>
          <div className={styles.responseTime}>
            <ClockIcon />
            <span>{t.responseTime}</span>
          </div>
        </div>
      </div>
      <div className={styles.terminalFrame}>
        <div className={styles.terminalHeader}>
          <span>~/profile</span>
          <span className={styles.status}>Info</span>
        </div>
        <div className={styles.terminalContent}>
          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h3>{t.name}</h3>
              <p>Shady Nathan Tawfik</p>
            </div>
            <div className={styles.infoCard}>
              <h3>{t.tagsLabel}</h3>
              <div className={styles.tagExamples}>
                <span className={styles.tag}>C++</span>
                <span className={styles.tag}>Swift</span>
                <span className={styles.tag}>Python</span>
                <span className={styles.tag}>TypeScript</span>
              </div>
            </div>
            <div className={styles.emailCard}>
              <h3>{t.email}</h3>
              <div className={styles.emailRow}>
                <span className={styles.emailAddress}>{EMAIL}</span>
                <button onClick={copyEmail} className={styles.copyBtn} title={t.copyEmail}>
                  {emailCopied ? <CheckIcon /> : <ClipboardIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.terminalFrame}>
        <div className={styles.terminalHeader}>
          <span>~/socials</span>
          <span className={styles.status}>Connect</span>
        </div>
        <div className={styles.terminalContent}>
          <div className={styles.socialsSection}>
            <div className={styles.socialLink}>
              <span className={styles.socialLabel}>GitHub</span>
              <a href="https://github.com/ModernAmusements" target="_blank" rel="noopener noreferrer">
                github.com/ModernAmusements
              </a>
            </div>
            <div className={styles.socialLink}>
              <span className={styles.socialLabel}>Reddit</span>
              <a href="https://www.reddit.com/user/princessinsomnia/" target="_blank" rel="noopener noreferrer">
                u/princessinsomnia
              </a>
            </div>
            <div className={styles.socialLink}>
              <span className={styles.socialLabel}>Instagram</span>
              <a href="https://www.instagram.com/modernamusements" target="_blank" rel="noopener noreferrer">
                @modernamusements
              </a>
            </div>
            <div className={styles.socialLink}>
              <span className={styles.socialLabel}>Behance</span>
              <a href="https://www.behance.net/stawfik" target="_blank" rel="noopener noreferrer">
                stawfik
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
