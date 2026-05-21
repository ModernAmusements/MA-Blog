'use client';

import { useState } from 'react';
import styles from './HomeContactForm.module.scss';
import { translations, type Lang } from '@/i18n';
import { Input, Textarea } from '@/components/Input';
import { Button } from '@/components/Button';
import { PaperplaneIcon, CheckIcon } from '@/components/icons';

interface Props {
  lang: Lang;
}

export function HomeContactForm({ lang }: Props) {
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
    );
  }

  return (
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
  );
}
