import styles from './Loading.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius = '4px', className }: SkeletonProps) {
  return (
    <div 
      className={`${styles.skeleton} ${className || ''}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton width="100%" height={120} borderRadius="8px" />
      <div className={styles.content}>
        <Skeleton width="60%" height="1.25rem" />
        <Skeleton width="100%" height="0.875rem" />
        <Skeleton width="80%" height="0.875rem" />
      </div>
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className={styles.post}>
      <Skeleton width="30%" height="0.75rem" />
      <Skeleton width="80%" height="1.5rem" />
      <Skeleton width="100%" height="3rem" />
      <div className={styles.tags}>
        <Skeleton width="60px" height="24px" borderRadius="12px" />
        <Skeleton width="80px" height="24px" borderRadius="12px" />
        <Skeleton width="50px" height="24px" borderRadius="12px" />
      </div>
    </div>
  );
}

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div className={styles.spinner} style={{ width: size, height: size }}>
      <div />
    </div>
  );
}