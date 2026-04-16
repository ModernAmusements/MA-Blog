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

export function setCell(grid: Grid, x: number, y: number, v: Cell = 1): void {
  if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    grid[y][x] = v;
  }
}
