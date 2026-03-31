'use client';

import { useForm, ValidationError } from '@formspree/react';
import styles from './page.module.scss';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xzdkgrar");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Newsletter signup coming soon!');
  };

  if (state.succeeded) {
    return (
      <div className={styles.contact}>
        <h1>Get in Touch</h1>
        <p className={styles.description}>
          Thanks for reaching out! I'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.contact}>
      <h1>Get in Touch</h1>
      <p className={styles.description}>
        Have a question or want to work together? Fill out the form below or reach out directly.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email" 
            name="email"
            required
            placeholder="your@email.com"
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} className={styles.validationError} />
        </div>
        <div className={styles.field}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Your message..."
          />
          <ValidationError prefix="Message" field="message" errors={state.errors} className={styles.validationError} />
        </div>
        <button type="submit" className={styles.submitButton} disabled={state.submitting}>
          {state.submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div className={styles.newsletter}>
        <h2>Subscribe to Newsletter</h2>
        <p>Get updates on new posts and projects delivered to your inbox.</p>
        <form onSubmit={handleNewsletter}>
          <input type="email" placeholder="your@email.com" required />
          <button type="submit" className={styles.subscribeButton}>Subscribe</button>
        </form>
      </div>
    </div>
  );
}