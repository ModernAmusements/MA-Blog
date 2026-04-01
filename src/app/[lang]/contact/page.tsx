'use client';

import { useForm, ValidationError } from '@formspree/react';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';

export default function ContactPage() {
  const params = useParams();
  const lang = (params.lang === 'de') ? 'de' : 'en';

  const translations = {
    en: {
      title: 'Get in Touch',
      description: 'Have a question or want to work together? Fill out the form below or reach out directly.',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      message: 'Message',
      messagePlaceholder: 'Your message...',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Thanks for reaching out! I\'ll get back to you soon.',
      newsletterTitle: 'Subscribe to Newsletter',
      newsletterDescription: 'Get updates on new posts and projects delivered to your inbox.',
      newsletterPlaceholder: 'your@email.com',
      subscribe: 'Subscribe',
    },
    de: {
      title: 'Kontakt',
      description: 'Hast du eine Frage oder möchtest du zusammenarbeiten? Fülle das Formular aus oder erreiche mich direkt.',
      email: 'E-Mail',
      emailPlaceholder: 'deine@email.de',
      message: 'Nachricht',
      messagePlaceholder: 'Deine Nachricht...',
      send: 'Nachricht senden',
      sending: 'Wird gesendet...',
      success: 'Danke für die Nachricht! Ich melde mich bald zurück.',
      newsletterTitle: 'Newsletter abonnieren',
      newsletterDescription: 'Erhalte Updates zu neuen Beiträgen und Projekten per E-Mail.',
      newsletterPlaceholder: 'deine@email.de',
      subscribe: 'Abonnieren',
    },
  };

  const t = translations[lang as 'en' | 'de'] || translations.en;
  const [state, handleSubmit] = useForm("xzdkgrar");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Newsletter signup coming soon!');
  };

  if (state.succeeded) {
    return (
      <div className={styles.contact}>
        <h1>{t.title}</h1>
        <p className={styles.description}>{t.success}</p>
      </div>
    );
  }

  return (
    <div className={styles.contact}>
      <h1>{t.title}</h1>
      <p className={styles.description}>{t.description}</p>

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
        <button type="submit" className={styles.submitButton} disabled={state.submitting}>
          {state.submitting ? t.sending : t.send}
        </button>
      </form>

      <div className={styles.newsletter}>
        <h2>{t.newsletterTitle}</h2>
        <p>{t.newsletterDescription}</p>
        <form onSubmit={handleNewsletter}>
          <input type="email" placeholder={t.newsletterPlaceholder} required />
          <button type="submit" className={styles.subscribeButton}>{t.subscribe}</button>
        </form>
      </div>
    </div>
  );
}