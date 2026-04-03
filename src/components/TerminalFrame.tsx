import styles from './TerminalFrame.module.scss';

interface TerminalFrameProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'full' | 'corners';
}

export function TerminalFrame({ children, title, variant = 'full' }: TerminalFrameProps) {
  return (
    <div className={`${styles.frame} ${styles[variant]}`}>
      {title && (
        <div className={styles.header}>
          {title}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}