'use client';

import { useState, useCallback, useMemo, createContext, useContext } from 'react';
import { Dot } from './Dot';
import styles from './DotMatrix.module.scss';
import { messageToDots, getDecorativePattern, DEFAULT_MESSAGE } from './ascii';

export interface DotMatrixConfig {
  cols: number;
  rows: number;
  dotSize: 2 | 4 | 6 | 8 | 10 | 12;
  gap: number;
  color: 'orange' | 'white' | 'green' | 'red' | 'black';
  animation: 'pulse' | 'scan' | 'trail' | 'wave' | 'static';
  interactive: boolean;
  message?: string;
  decorative?: 'arrow-left' | 'arrow-right' | 'wave' | 'grid' | 'heart';
  speed?: number;
  blackBorder?: boolean;
}

interface DotContextValue {
  config: DotMatrixConfig;
  litDots: Set<string>;
  hoverDot: (x: number, y: number, isHovering: boolean) => void;
}

const DotMatrixContext = createContext<DotContextValue | null>(null);

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
  children?: React.ReactNode;
}

const defaultConfig: DotMatrixConfig = {
  cols: 12,
  rows: 7,
  dotSize: 4,
  gap: 2,
  color: 'orange',
  blackBorder: false,
  animation: 'static',
  interactive: true,
};

export function DotMatrix({
  config,
  className = '',
  children,
}: DotMatrixProps) {
  const mergedConfig = { ...defaultConfig, ...config };
  const [hoveredDot, setHoveredDot] = useState<{ x: number; y: number } | null>(null);

  const dotMatrix = useMemo(() => {
    let dots: boolean[][] = [];
    
    if (mergedConfig.decorative) {
      dots = getDecorativePattern(mergedConfig.decorative);
    } else if (mergedConfig.message) {
      dots = messageToDots(mergedConfig.message);
    } else {
      dots = messageToDots(DEFAULT_MESSAGE);
    }
    
    const paddedDots: boolean[][] = [];
    for (let y = 0; y < mergedConfig.rows; y++) {
      paddedDots[y] = [];
      for (let x = 0; x < mergedConfig.cols; x++) {
        paddedDots[y][x] = dots[y]?.[x] ?? false;
      }
    }
    
    return paddedDots;
  }, [mergedConfig.rows, mergedConfig.cols, mergedConfig.message, mergedConfig.decorative]);

  const handleHover = useCallback((x: number, y: number, isHovering: boolean) => {
    setHoveredDot(isHovering ? { x, y } : null);
  }, []);

  const litDots = useMemo(() => {
    const lit = new Set<string>();
    
    // Add base lit dots from message
    dotMatrix.forEach((row, y) => {
      row.forEach((isLit, x) => {
        if (isLit) {
          lit.add(`${x}-${y}`);
        }
      });
    });
    
    // Add hovered dot for trail effect
    if (mergedConfig.interactive && hoveredDot && mergedConfig.animation === 'trail') {
      // Light up 3x3 area around cursor
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = hoveredDot.x + dx;
          const ny = hoveredDot.y + dy;
          if (nx >= 0 && nx < mergedConfig.cols && ny >= 0 && ny < mergedConfig.rows) {
            lit.add(`${nx}-${ny}`);
          }
        }
      }
    }
    
    return lit;
  }, [dotMatrix, hoveredDot, mergedConfig.interactive, mergedConfig.animation, mergedConfig.cols, mergedConfig.rows]);

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

  return (
    <DotMatrixContext.Provider value={{ config: mergedConfig, litDots, hoverDot: handleHover }}>
      <div
        className={`${styles.dotMatrix} ${sizeClass} ${colorClass} ${mergedConfig.interactive ? styles.interactive : ''} ${className}`}
        style={gridStyle}
        onMouseLeave={() => setHoveredDot(null)}
      >
        {/* Black border dots */}
        {mergedConfig.blackBorder && Array.from({ length: mergedConfig.rows + 4 }).map((_, y) =>
          Array.from({ length: mergedConfig.cols + 4 }).map((_, x) => {
            const isOuterBorder = 
              y === 0 || y === mergedConfig.rows + 3 || 
              x === 0 || x === mergedConfig.cols + 3;
            const isInnerBorder = 
              y === 1 || y === mergedConfig.rows + 2 || 
              x === 1 || x === mergedConfig.cols + 2;
            const isInner = y > 1 && y <= mergedConfig.rows + 1 && x > 1 && x <= mergedConfig.cols + 1;
            const innerX = x - 2;
            const innerY = y - 2;
            const isLit = isOuterBorder || (isInnerBorder && (x % 2 === 0 || y % 2 === 0)) || (isInner && (litDots.has(`${innerX}-${innerY}`) || dotMatrix[innerY]?.[innerX]));
            
            return (
              <Dot
                key={`${x}-${y}`}
                x={x}
                y={y}
                lit={isLit}
                delay={(x + y) * 0.02}
                interactive={mergedConfig.interactive}
                animation={isInner ? mergedConfig.animation : 'static'}
                onHover={handleHover}
              />
            );
          })
        )}
        {/* Inner dots (if no black border) */}
        {!mergedConfig.blackBorder && Array.from({ length: mergedConfig.rows + 2 }).map((_, y) =>
          Array.from({ length: mergedConfig.cols + 2 }).map((_, x) => {
            const isBorder = 
              y === 0 || y === mergedConfig.rows + 1 || 
              x === 0 || x === mergedConfig.cols + 1;
            const isInner = y > 0 && y <= mergedConfig.rows && x > 0 && x <= mergedConfig.cols;
            const innerX = x - 1;
            const innerY = y - 1;
            const isLit = isBorder ? true : (litDots.has(`${innerX}-${innerY}`) || dotMatrix[innerY]?.[innerX]);
            
            return (
              <Dot
                key={`${x}-${y}`}
                x={x}
                y={y}
                lit={isInner ? isLit : isBorder && (x % 2 === 0 || y % 2 === 0)}
                delay={(x + y) * 0.02}
                interactive={mergedConfig.interactive}
                animation={isInner ? mergedConfig.animation : 'static'}
                onHover={handleHover}
              />
            );
          })
        )}
      </div>
    </DotMatrixContext.Provider>
  );
}

// Pre-built variants for quick use
export function DotMatrixPulse({
  cols = 16,
  rows = 7,
  message = 'PULSE',
  interactive = false,
}: Partial<DotMatrixConfig>) {
  return (
    <DotMatrix
      config={{
        cols,
        rows,
        animation: 'pulse',
        interactive,
        message,
      }}
    />
  );
}

export function DotMatrixScan({
  cols = 24,
  rows = 7,
  message = 'SCAN',
  interactive = true,
}: Partial<DotMatrixConfig>) {
  return (
    <DotMatrix
      config={{
        cols,
        rows,
        animation: 'scan',
        interactive,
        message,
      }}
    />
  );
}

export function DotMatrixWave({
  cols = 16,
  rows = 7,
  message = 'WAVE',
  interactive = false,
}: Partial<DotMatrixConfig>) {
  return (
    <DotMatrix
      config={{
        cols,
        rows,
        animation: 'wave',
        interactive,
        message,
      }}
    />
  );
}

export function DotMatrixTrail({
  cols = 24,
  rows = 7,
  message = 'TRAIL',
  interactive = true,
}: Partial<DotMatrixConfig>) {
  return (
    <DotMatrix
      config={{
        cols,
        rows,
        animation: 'trail',
        interactive,
        message,
      }}
    />
  );
}

export function DotMatrixDecor({
  decorative = 'arrow-right',
  dotSize = 4,
}: Partial<DotMatrixConfig>) {
  return (
    <DotMatrix
      config={{
        cols: 7,
        rows: 7,
        dotSize,
        color: 'black',
        animation: 'static',
        decorative,
        interactive: true,
      }}
    />
  );
}