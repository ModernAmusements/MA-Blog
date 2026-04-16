'use client';

import { useCallback } from 'react';
import styles from './DotMatrix.module.scss';

interface DotProps {
  x: number;
  y: number;
  lit: boolean;
  brightness?: number;
  delay?: number;
  interactive?: boolean;
  animation?: 'static' | 'reveal' | 'scan';
  onHover?: (x: number, y: number, isHovering: boolean) => void;
  forceColor?: 'orange' | 'black';
  animatePulse?: boolean;
}

export function Dot({
  x,
  y,
  lit,
  brightness = 1,
  delay = 0,
  interactive = false,
  animation = 'static',
  onHover,
  forceColor,
  animatePulse = false,
}: DotProps) {
  const handleMouseEnter = useCallback(() => {
    if (interactive) {
      onHover?.(x, y, true);
    }
  }, [interactive, x, y, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      onHover?.(x, y, false);
    }
  }, [interactive, x, y, onHover]);

  const animationStyle = animatePulse && animation !== 'static' ? styles.animating : '';
  
  const dotClass = [
    styles.dot,
    lit ? styles.lit : '',
    interactive ? styles.interactive : '',
    forceColor === 'black' ? styles.forceBlack : '',
    forceColor === 'orange' ? styles.forceOrange : '',
    animationStyle,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={dotClass}
      style={{
        '--dot-delay': `${delay}s`,
        '--dot-brightness': lit ? brightness : 0.15,
        gridColumn: x + 1,
        gridRow: y + 1,
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}