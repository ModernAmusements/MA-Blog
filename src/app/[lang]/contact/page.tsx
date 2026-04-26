'use client';

import styles from './page.module.scss';
import ctaStyles from '@/styles/cta.module.scss';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { translations } from '@/i18n';

export default function ContactPage() {
  const params = useParams();
  const lang = (params.lang === 'de') ? 'de' : 'en';
  const t = translations[lang].contact;

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  if (formState === 'success') {
    return (
      <div className={styles.contact}>
        <div className={styles.layout}>
          <div className={styles.heroPane}>
            <div className={styles.subHeader}>{t.subHeader}</div>
            <h1>{t.title}</h1>
            <div className={styles.successMessage}>
              <p>{t.success}</p>
            </div>
            <ul className={styles.info}>
              <li>{t.name}</li>
              <li>Shady Nathan Tawfik</li>
              <li>{t.tags}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contact}>
      <div className={styles.layout}>
        <div className={styles.heroPane}>
          <div className={styles.subHeader}>{t.subHeader}</div>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
          <ul className={styles.info}>
            <li>{t.name}</li>
            <li>Shady Nathan Tawfik</li>
            <li>{t.tags}</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">{t.nameLabel}</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              placeholder={t.namePlaceholder}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">{t.email}</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder={t.emailPlaceholder}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="message">{t.message}</label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder={t.messagePlaceholder}
            />
          </div>
          {formState === 'error' && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
          <button type="submit" className={ctaStyles.primary} disabled={formState === 'submitting'}>
            {formState === 'submitting' ? t.sending : t.send}
          </button>
        </form>
      </div>
    </div>
  );
}