import { Animation, createGrid, setCell } from './engine';

export function createReveal(width: number, height: number): Animation {
  return {
    width,
    height,
    duration: height,
    frame: (t) => {
      const grid = createGrid(width, height);
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

export const ANIMATIONS = {
  reveal: createReveal,
} as const;

export type AnimationType = keyof typeof ANIMATIONS;
