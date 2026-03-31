'use client';

import { useState } from 'react';
import styles from './page.module.scss';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Newsletter signup coming soon! Integrate with ConvertKit or Beehiiv.');
  };

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
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            placeholder="Your message..."
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' && <p className={styles.success}>Message sent successfully!</p>}
        {status === 'error' && <p className={styles.error}>Something went wrong. Please try again.</p>}
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