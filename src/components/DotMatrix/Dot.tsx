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
  animation?: 'pulse' | 'wave' | 'sparkle' | 'scan' | 'rain' | 'orbit' | 'reveal' | 'static' | 'diagSwipe' | 'invert';
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

  const animationStyle = animatePulse 
    ? (animation === 'wave' ? styles.wave 
      : animation === 'sparkle' ? styles.sparkle
      : animation === 'scan' ? styles.scan
      : animation === 'rain' ? styles.rain
      : animation === 'orbit' ? styles.orbit
      : animation === 'reveal' ? styles.reveal
      : animation === 'diagSwipe' ? styles.diagSwipe
      : animation === 'invert' ? styles.invert
      : styles.animating)
    : '';
  
  const dotClass = [
    styles.dot,
    isLit || lit ? styles.lit : '',
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
        '--dot-brightness': lit || isLit ? localBrightness : 0.15,
        gridColumn: x + 1,
        gridRow: y + 1,
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}