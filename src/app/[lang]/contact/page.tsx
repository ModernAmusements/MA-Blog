'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { translations } from '@/i18n';
import { Input, Textarea } from '@/components/Input';
import { Button } from '@/components/Button';
import { PaperplaneIcon, ClipboardIcon, CheckIcon, ClockIcon, BriefcaseIcon, ChevronIcon } from '@/components/icons';

const EMAIL = 'shadynathantawfik@gmail.com';

export default function ContactPage() {
  const params = useParams();
  const lang = (params.lang === 'de') ? 'de' : 'en';
  const t = translations[lang].contact;

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormState('success');
        form.reset();
      } else {
        const result = await res.json();
        setErrorMessage(result.error || 'Something went wrong');
        setFormState('error');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setFormState('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const renderInfoColumn = () => (
    <>
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
              <span className={styles.socialLabel}>Twitter</span>
              <a href="https://twitter.com/modernamusements" target="_blank" rel="noopener noreferrer">
                @modernamusements
              </a>
            </div>
            <div className={styles.socialLink}>
              <span className={styles.socialLabel}>LinkedIn</span>
              <a href="https://linkedin.com/in/shadynathan" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/shadynathan
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (formState === 'success') {
    return (
      <div className={styles.contact}>
        <header className={styles.header}>
          <h1>{t.title}</h1>
          <p className={styles.subtitle}>{t.description}</p>
        </header>
        <div className={styles.twoColumn}>
          <div className={styles.leftColumn}>
            <div className={styles.terminalFrame}>
              <div className={styles.terminalHeader}>
                <span>~/contact</span>
                <span className={styles.success}>Success</span>
              </div>
              <div className={styles.terminalContent}>
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>
                    <CheckIcon />
                  </div>
                  <h2>{t.success}</h2>
                  <p>{t.successSubtitle}</p>
                </div>
              </div>
            </div>

            <div className={styles.terminalFrame}>
              <div className={styles.terminalHeader}>
                <span>~/faq</span>
                <span className={styles.status}>{t.faqItems.length}</span>
              </div>
              <div className={styles.terminalContent}>
                <h2 className={styles.faqTitle}>{t.faqTitle}</h2>
                <div className={styles.faqList}>
                  {t.faqItems.map((item, index) => (
                    <div key={index} className={styles.faqItem}>
                      <button
                        className={styles.faqQuestion}
                        onClick={() => toggleFaq(index)}
                      >
                        <span>{item.question}</span>
                        <ChevronIcon isExpanded={expandedFaq === index} />
                      </button>
                      {expandedFaq === index && (
                        <div className={styles.faqAnswer}>
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            {renderInfoColumn()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contact}>
      <header className={styles.header}>
        <h1>{t.title}</h1>
        <p className={styles.subtitle}>{t.description}</p>
      </header>

      <div className={styles.twoColumn}>
        <div className={styles.leftColumn}>
          <div className={styles.terminalFrame}>
            <div className={styles.terminalHeader}>
              <span>~/contact</span>
              <span className={styles.status}>Online</span>
            </div>
            <div className={styles.terminalContent}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  label={t.nameLabel}
                  name="name"
                  type="text"
                  placeholder={t.namePlaceholder}
                  required
                />
                <Input
                  label={t.email}
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                />
                <Textarea
                  label={t.message}
                  name="message"
                  placeholder={t.messagePlaceholder}
                  rows={6}
                  required
                />
                {formState === 'error' && (
                  <div className={styles.errorMessage}>{errorMessage}</div>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  loading={formState === 'submitting'}
                >
                  {formState === 'submitting' ? t.sending : t.send}
                  <PaperplaneIcon />
                </Button>
              </form>
            </div>
          </div>

          <div className={styles.terminalFrame}>
            <div className={styles.terminalHeader}>
              <span>~/faq</span>
              <span className={styles.status}>{t.faqItems.length}</span>
            </div>
            <div className={styles.terminalContent}>
              <h2 className={styles.faqTitle}>{t.faqTitle}</h2>
              <div className={styles.faqList}>
                {t.faqItems.map((item, index) => (
                  <div key={index} className={styles.faqItem}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{item.question}</span>
                      <ChevronIcon isExpanded={expandedFaq === index} />
                    </button>
                    {expandedFaq === index && (
                      <div className={styles.faqAnswer}>
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.column}>
          {renderInfoColumn()}
        </div>
      </div>
    </div>
  );
}