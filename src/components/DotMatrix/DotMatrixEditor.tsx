'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './DotMatrixEditor.module.scss';

interface DotMatrixEditorProps {
  initialSize?: 8 | 16 | 32;
  dotSize?: number;
  onChange?: (grid: boolean[][]) => void;
}

export function DotMatrixEditor({ initialSize = 16, dotSize: customDotSize, onChange }: DotMatrixEditorProps) {
  const [gridSize, setGridSize] = useState(initialSize);
  const [grid, setGrid] = useState<boolean[][]>(() => 
    Array(initialSize).fill(null).map(() => Array(initialSize).fill(false))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const dotSize = customDotSize || (gridSize <= 8 ? 24 : gridSize <= 16 ? 14 : 8);
  const gap = 2;
  
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: light)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e: MediaQueryListEvent) => setIsLightMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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

  const handleMouseEnter = useCallback((x: number, y: number) => {
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
    setIsDrawing(true);
    const isRightClick = e.button === 2 || (e.button === 0 && e.ctrlKey);
    setDrawMode(!isRightClick);
    handleDotClick(x, y, !isRightClick);
  }, [handleDotClick]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
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
        <label>
          Size:
          <select 
            value={gridSize} 
            onChange={(e) => handleSizeChange(Number(e.target.value) as 8 | 16 | 32)}
          >
            <option value={8}>8×8</option>
            <option value={16}>16×16</option>
            <option value={32}>32×32</option>
          </select>
        </label>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleExport}>Export C Array</button>
      </div>

      <div 
        ref={containerRef}
        className={`${styles.grid} ${isLightMode ? styles.lightMode : ''}`}
        style={{
          '--cols': gridSize,
          '--rows': gridSize,
          '--dot-size': `${dotSize}px`,
          '--dot-gap': `${gap}px`,
        } as React.CSSProperties}
        onMouseLeave={() => setIsDrawing(false)}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        {grid.map((row, y) => 
          row.map((isLit, x) => (
            <div
              key={`${x}-${y}`}
              className={`${styles.dot} ${isLit ? styles.lit : ''}`}
              onMouseDown={(e) => handleMouseDown(e, x, y)}
              onMouseEnter={() => handleMouseEnter(x, y)}
            />
          ))
        )}
      </div>
    </div>
  );
}