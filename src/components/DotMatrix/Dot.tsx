'use client';

import { useState, useCallback } from 'react';
import styles from './DotMatrix.module.scss';

interface DotProps {
  x: number;
  y: number;
  lit: boolean;
  brightness?: number;
  delay?: number;
  interactive?: boolean;
  animation?: 'pulse' | 'scan' | 'trail' | 'wave' | 'static';
  onHover?: (x: number, y: number, isHovering: boolean) => void;
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
}: DotProps) {
  const [isLit, setIsLit] = useState(lit);
  const [localBrightness, setLocalBrightness] = useState(brightness);

  const handleMouseEnter = useCallback(() => {
    if (interactive) {
      setIsLit(true);
      setLocalBrightness(1);
      onHover?.(x, y, true);
    }
  }, [interactive, x, y, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setIsLit(false);
      setLocalBrightness(0.3);
      onHover?.(x, y, false);
    }
  }, [interactive, x, y, onHover]);

  const dotClass = [
    styles.dot,
    styles[animation],
    isLit || lit ? styles.lit : '',
    interactive ? styles.interactive : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={dotClass}
      style={{
        '--dot-delay': `${delay}s`,
        '--dot-brightness': lit || isLit ? localBrightness : 0.15,
        gridColumn: x + 1,
        gridRow: y + 1,
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}