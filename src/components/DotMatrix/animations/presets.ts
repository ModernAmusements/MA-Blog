import { createGrid, setCell } from './engine';

export interface Animation {
  width: number;
  height: number;
  duration: number;
  frame: (t: number) => ReturnType<typeof createGrid>;
}

export function createReveal(width: number, height: number): Animation {
  const duration = height;
  return {
    width,
    height,
    duration,
    frame: (t: number) => {
      const grid = createGrid(width, height, 0);
      const revealRow = Math.min(t, height - 1);
      
      for (let y = 0; y <= revealRow; y++) {
        for (let x = 0; x < width; x++) {
          setCell(grid, x, y, 1);
        }
      }
      
      return grid;
    },
  };
}

export function createScan(width: number, height: number): Animation {
  const duration = width;
  return {
    width,
    height,
    duration,
    frame: (t: number) => {
      const grid = createGrid(width, height, 0);
      const scanCol = Math.min(t, width - 1);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x <= scanCol; x++) {
          setCell(grid, x, y, 1);
        }
      }
      
      return grid;
    },
  };
}

export const ANIMATIONS = {
  reveal: createReveal,
  scan: createScan,
} as const;

export type AnimationType = 'static' | keyof typeof ANIMATIONS;
