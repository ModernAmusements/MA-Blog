import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function Card({ children, className, href, onClick }: CardProps) {
  const content = <div className={`${styles.card} ${className || ''}`}>{children}</div>;
  
  if (href) {
    return <a href={href} className={styles.cardLink}>{content}</a>;
  }
  
  if (onClick) {
    return (
      <button onClick={onClick} className={styles.cardButton}>
        {content}
      </button>
    );
  }
  
  return content;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.content} ${className || ''}`}>{children}</div>;
}

export function CardTags({ children }: { children: React.ReactNode }) {
  return <div className={styles.tags}>{children}</div>;
}

export function CardDate({ children }: { children: React.ReactNode }) {
  return <span className={styles.date}>{children}</span>;
}