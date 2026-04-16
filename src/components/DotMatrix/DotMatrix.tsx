'use client';

import { useMemo, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Dot } from './Dot';
import { messageToDots, getDecorativePattern, DEFAULT_MESSAGE } from './ascii';
import { DotCell } from './imageConverter';
import { ANIMATIONS, AnimationType } from './animations/presets';
import styles from './DotMatrix.module.scss';

export interface DotMatrixConfig {
  cols: number;
  rows: number;
  dotSize: number;
  gap: number;
  color: 'orange' | 'white' | 'green' | 'red' | 'black';
  interactive: boolean;
  blackBorder?: boolean;
  imageGrid?: boolean[][];
  imageData?: DotCell[][];
  message?: string;
  decorative?: 'arrow-left' | 'arrow-right' | 'wave' | 'grid' | 'heart';
}

const DotMatrixContext = createContext<{ config: DotMatrixConfig; litDots: Set<string> } | null>(null);

export function useDotMatrix() {
  const context = useContext(DotMatrixContext);
  if (!context) {
    throw new Error('useDotMatrix must be used within DotMatrixProvider');
  }
  return context;
}

interface DotMatrixProps {
  config?: Partial<DotMatrixConfig>;
  className?: string;
  animatePulse?: boolean;
  animation?: AnimationType;
}

const defaultConfig: DotMatrixConfig = {
  cols: 15,
  rows: 15,
  dotSize: 4,
  gap: 1,
  color: 'orange',
  blackBorder: false,
  interactive: true,
};

export function DotMatrix({
  config,
  className = '',
  animatePulse = false,
  animation = 'static',
}: DotMatrixProps) {
  const mergedConfig = { ...defaultConfig, ...config } as DotMatrixConfig;
  
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  
  const dotMatrix = useMemo(() => {
    let baseDots: boolean[][] = [];
    
    if (mergedConfig.imageGrid) {
      baseDots = mergedConfig.imageGrid;
    } else if (mergedConfig.decorative) {
      baseDots = getDecorativePattern(mergedConfig.decorative);
    } else if (mergedConfig.message) {
      baseDots = messageToDots(mergedConfig.message);
    } else {
      baseDots = messageToDots(DEFAULT_MESSAGE);
    }
    
    const paddedDots: boolean[][] = [];
    for (let y = 0; y < mergedConfig.rows; y++) {
      paddedDots[y] = [];
      for (let x = 0; x < mergedConfig.cols; x++) {
        paddedDots[y][x] = baseDots[y]?.[x] ?? false;
      }
    }
    
    return paddedDots;
  }, [mergedConfig.rows, mergedConfig.cols, mergedConfig.message, mergedConfig.decorative, mergedConfig.imageGrid]);

  useEffect(() => {
    if (!animatePulse) {
      setAnimationProgress(0);
      return;
    }

    const preset = (ANIMATIONS as Record<string, (w: number, h: number) => { frame: (t: number) => any; duration: number }>)[animation];
    if (!preset) {
      setAnimationProgress(0);
      return;
    }

    const anim = preset(mergedConfig.cols, mergedConfig.rows);
    
    const intervalId = setInterval(() => {
      setAnimationProgress(prev => (prev + 1) % anim.duration);
    }, 150);
    
    setAnimationProgress(0);
    
    return () => clearInterval(intervalId);
  }, [animatePulse, animation, mergedConfig.cols, mergedConfig.rows]);

  const getEffectiveGrid = useCallback((x: number, y: number): boolean => {
    const baseLit = dotMatrix[y]?.[x] ?? false;
    if (!baseLit) return false;
    
    if (animatePulse && animation !== 'static') {
      const preset = (ANIMATIONS as Record<string, (w: number, h: number) => { frame: (t: number) => any; duration: number }>)[animation];
      if (preset) {
        const anim = preset(mergedConfig.cols, mergedConfig.rows);
        const animGrid = anim.frame(animationProgress);
        return !!(animGrid[y]?.[x]) && baseLit;
      }
    }
    
    return baseLit;
  }, [dotMatrix, animatePulse, animation, animationProgress, mergedConfig.cols, mergedConfig.rows]);

  const litDots = useMemo(() => {
    const lit = new Set<string>();
    for (let y = 0; y < mergedConfig.rows; y++) {
      for (let x = 0; x < mergedConfig.cols; x++) {
        if (dotMatrix[y]?.[x]) {
          lit.add(`${x}-${y}`);
        }
      }
    }
    return lit;
  }, [dotMatrix, mergedConfig.rows, mergedConfig.cols]);

  const sizeClass = {
    2: styles.sizeTiny,
    4: styles.sizeSmall,
    6: styles.sizeMedium,
    8: styles.sizeLarge,
    10: styles.sizeLarge,
    12: styles.sizeLarge,
  }[mergedConfig.dotSize] || styles.sizeMedium;

  const colorClass = {
    orange: styles.colorOrange,
    white: styles.colorWhite,
    green: styles.colorGreen,
    red: styles.colorRed,
    black: styles.colorBlack,
  }[mergedConfig.color] || styles.colorOrange;

  const gridStyle = {
    gridTemplateColumns: `repeat(${mergedConfig.cols + 2}, ${mergedConfig.dotSize}px)`,
    gridTemplateRows: `repeat(${mergedConfig.rows + 2}, ${mergedConfig.dotSize}px)`,
    '--dot-size': `${mergedConfig.dotSize}px`,
    '--dot-gap': `${mergedConfig.gap}px`,
  } as React.CSSProperties;

  const animationClass = animatePulse ? styles.animatingContainer : '';

  return (
    <DotMatrixContext.Provider value={{ config: mergedConfig, litDots }}>
      <div
        className={`${styles.dotMatrix} ${sizeClass} ${colorClass} ${animationClass} ${className}`}
        style={gridStyle}
      >
        {!mergedConfig.blackBorder && Array.from({ length: mergedConfig.rows + 2 }).map((_, y) =>
          Array.from({ length: mergedConfig.cols + 2 }).map((_, x) => {
            const isBorder = y === 0 || y === mergedConfig.rows + 1 || x === 0 || x === mergedConfig.cols + 1;
            const isInner = y > 0 && y <= mergedConfig.rows && x > 0 && x <= mergedConfig.cols;
            const innerX = x - 1;
            const innerY = y - 1;
            const isLit = isInner && getEffectiveGrid(innerX, innerY);
            const brightness = mergedConfig.imageData?.[innerY]?.[innerX]?.brightness ?? 1;
            
            return (
              <Dot
                key={`${x}-${y}`}
                x={x}
                y={y}
                lit={isLit}
                brightness={brightness}
                animatePulse={animatePulse && isInner}
                animation={isInner ? animation : 'static'}
              />
            );
          })
        )}
      </div>
    </DotMatrixContext.Provider>
  );
}
