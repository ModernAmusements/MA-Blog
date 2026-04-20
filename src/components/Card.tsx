'use client';

import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function Card({
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}