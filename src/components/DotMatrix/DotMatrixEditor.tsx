'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import styles from './DotMatrixEditor.module.scss';

interface DotMatrixEditorProps {
  initialSize?: 8 | 16 | 32 | 64 | 128;
  dotSize?: number;
  onChange?: (grid: boolean[][]) => void;
  maxWidth?: number;
}

export function DotMatrixEditor({ initialSize = 16, dotSize: customDotSize, onChange, maxWidth = 0 }: DotMatrixEditorProps) {
  const [gridSize, setGridSize] = useState(initialSize);
  const [grid, setGrid] = useState<boolean[][]>(() => 
    Array(initialSize).fill(null).map(() => Array(initialSize).fill(false))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGridSize(initialSize);
    setGrid(Array(initialSize).fill(null).map(() => Array(initialSize).fill(false)));
  }, [initialSize]);

  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const computedDotSize = useMemo(() => {
    if (customDotSize) return customDotSize;
    const isMobile = viewportWidth < 640;
    if (gridSize <= 8) return isMobile ? 28 : 24;
    if (gridSize <= 16) return isMobile ? 18 : 14;
    if (gridSize <= 32) return isMobile ? 12 : 10;
    return isMobile ? 8 : 6;
  }, [gridSize, customDotSize, viewportWidth]);

  const dotSize = computedDotSize;
  const gap = 2;
  
  const totalDotSize = dotSize + gap;
  const contentWidth = gridSize * totalDotSize;
  
  let scale = 1;
  if (maxWidth && contentWidth > maxWidth) {
    scale = maxWidth / contentWidth;
  }
  
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLightMode = mounted && theme === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const handleDotClick = useCallback((x: number, y: number, isPrimary: boolean) => {
    const newGrid = grid.map((row, rowIdx) => 
      row.map((cell, colIdx) => 
        rowIdx === y && colIdx === x ? (isPrimary ? true : false) : cell
      )
    );
    setGrid(newGrid);
    onChange?.(newGrid);
  }, [grid, onChange]);

  const handleMouseEnter = useCallback((e: React.MouseEvent, x: number, y: number) => {
    if (isDrawing) {
      const newGrid = grid.map((row, rowIdx) => 
        row.map((cell, colIdx) => 
          rowIdx === y && colIdx === x ? drawMode : cell
        )
      );
      setGrid(newGrid);
      onChange?.(newGrid);
    }
  }, [isDrawing, drawMode, grid, onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    e.stopPropagation();
    const isRightClick = e.button === 2 || (e.button === 0 && e.ctrlKey);
    const shouldDraw = !isRightClick;
    setIsDrawing(true);
    setDrawMode(shouldDraw);
    handleDotClick(x, y, shouldDraw);
  }, [handleDotClick]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleSizeChange = useCallback((newSize: 8 | 16 | 32) => {
    setGridSize(newSize);
    setGrid(Array(newSize).fill(null).map(() => Array(newSize).fill(false)));
  }, []);

  const handleClear = useCallback(() => {
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)));
    onChange?.(grid.map(() => Array(gridSize).fill(false)));
  }, [gridSize, onChange, grid]);

  const handleExport = useCallback(() => {
    const bytes: number[] = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x += 8) {
        let byte = 0;
        for (let bit = 0; bit < 8 && x + bit < gridSize; bit++) {
          if (grid[y][x + bit]) {
            byte |= (1 << (7 - bit));
          }
        }
        bytes.push(byte);
      }
    }
    
    const hexBytes = bytes.map(b => `0x${b.toString(16).padStart(2, '0')}`).join(', ');
    navigator.clipboard.writeText(`static const uint8_t data[] = { ${hexBytes} };`);
    alert('Copied to clipboard!');
  }, [grid, gridSize]);

  return (
    <div 
      className={styles.editor} 
      ref={containerRef}
      data-light-mode={isLightMode}
    >
      <div className={styles.toolbar}>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleExport}>Export C Array</button>
      </div>

      <div 
        className={`${styles.grid} ${isLightMode ? styles.lightMode : ''}`}
        style={{
          '--cols': gridSize,
          '--rows': gridSize,
          '--dot-size': `${dotSize}px`,
          '--dot-gap': `${gap}px`,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
          width: scale !== 1 ? `${contentWidth}px` : undefined,
        } as React.CSSProperties}
        onMouseDown={(e) => e.preventDefault()}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
        onContextMenu={(e) => e.preventDefault()}
      >
        {grid.map((row, y) => 
          row.map((isLit, x) => (
            <div
              key={`${x}-${y}`}
              className={`${styles.dot} ${isLit ? styles.lit : ''}`}
              onMouseDown={(e) => handleMouseDown(e, x, y)}
              onMouseEnter={(e) => handleMouseEnter(e, x, y)}
            />
          ))
        )}
      </div>
    </div>
  );
}