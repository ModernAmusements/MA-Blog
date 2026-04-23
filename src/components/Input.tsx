'use client';

import { useId } from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`${styles.field} ${className || ''}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <input 
        id={inputId} 
        className={`${styles.input} ${error ? styles.hasError : ''}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`${styles.field} ${className || ''}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <textarea 
        id={inputId} 
        className={`${styles.textarea} ${error ? styles.hasError : ''}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}