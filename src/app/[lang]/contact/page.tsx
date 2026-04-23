'use client';

import { useForm, ValidationError } from '@formspree/react';
import styles from './page.module.scss';
import ctaStyles from '@/styles/cta.module.scss';
import { useParams } from 'next/navigation';
import { translations } from '@/i18n';

export default function ContactPage() {
  const params = useParams();
  const lang = (params.lang === 'de') ? 'de' : 'en';
  const t = translations[lang].contact;

  const [state, handleSubmit] = useForm("xzdkgrar");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Newsletter signup coming soon!');
  };

  if (state.succeeded) {
    return (
      <div className={styles.contact}>
        <div className={styles.layout}>
          <div className={styles.heroPane}>
            <div className={styles.subHeader}>{t.subHeader}</div>
            <h1>{t.title}</h1>
            <p>{t.success}</p>
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
            <label htmlFor="email">{t.email}</label>
            <input
              id="email"
              type="email" 
              name="email"
              required
              placeholder={t.emailPlaceholder}
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} className={styles.validationError} />
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
            <ValidationError prefix="Message" field="message" errors={state.errors} className={styles.validationError} />
          </div>
          <button type="submit" className={ctaStyles.primary} disabled={state.submitting}>
            {state.submitting ? t.sending : t.send}
          </button>
        </form>
      </div>

      <div className={styles.newsletter}>
        <h2>{t.newsletter.title}</h2>
        <p>{t.newsletter.description}</p>
        <form onSubmit={handleNewsletter}>
          <input type="email" placeholder={t.newsletter.placeholder} required />
          <button type="submit" className={ctaStyles.secondary}>{t.newsletter.subscribe}</button>
        </form>
      </div>
    </div>
  );
}