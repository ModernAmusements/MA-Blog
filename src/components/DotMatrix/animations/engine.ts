export type Cell = 0 | 1;

export type Grid = Cell[][];

export interface Animation {
  width: number;
  height: number;
  duration: number;
  frame: (t: number) => Grid;
}

export function createGrid(w: number, h: number, fill: Cell = 0): Grid {
  return Array.from({ length: h }, () => Array(w).fill(fill));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}

export function setCell(grid: Grid, x: number, y: number, v: Cell = 1): void {
  if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    grid[y][x] = v;
  }
}

export function getCell(grid: Grid, x: number, y: number): Cell {
  if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    return grid[y][x];
  }
  return 0;
}

export function renderGridAsDotSize(grid: Grid, dotSize: number): Grid {
  const h = grid.length;
  const w = grid[0].length;
  const scaledGrid = createGrid(w, h);
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (getCell(grid, x, y) === 1) {
        const startX = x * dotSize;
        const startY = y * dotSize;
        
        for (let dy = 0; dy < dotSize && startY + dy < h; dy++) {
          for (let dx = 0; dx < dotSize && startX + dx < w; dx++) {
            setCell(scaledGrid, startX + dx, startY + dy, 1);
          }
        }
      }
    }
  }
  
  return scaledGrid;
}

export interface AnimationEngine {
  start: () => void;
  stop: () => void;
  getFrame: () => Grid;
  isRunning: () => boolean;
}

export function createAnimationEngine(
  animation: Animation,
  fps: number = 8
): AnimationEngine {
  let running = false;
  let frameId: number | null = null;
  let currentFrame = 0;
  let lastTime = 0;

  const tick = (time: number) => {
    if (!running) return;

    if (time - lastTime >= 1000 / fps) {
      currentFrame = (currentFrame + 1) % animation.duration;
      lastTime = time;
    }

    frameId = requestAnimationFrame(tick);
  };

  return {
    start: () => {
      if (running) return;
      running = true;
      currentFrame = 0;
      lastTime = 0;
      frameId = requestAnimationFrame(tick);
    },
    stop: () => {
      running = false;
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    },
    getFrame: () => {
      return animation.frame(currentFrame);
    },
    isRunning: () => running,
  };
}