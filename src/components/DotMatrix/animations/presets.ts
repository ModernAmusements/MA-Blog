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

export function createBlink(width: number, height: number): Animation {
  const duration = 2;
  return {
    width,
    height,
    duration,
    frame: (t: number) => {
      const val: 0 | 1 = t % 2 as 0 | 1;
      const grid = createGrid(width, height, val);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          setCell(grid, x, y, val);
        }
      }
      
      return grid;
    },
  };
}

export function createWave(width: number, height: number): Animation {
  const duration = width + height;
  return {
    width,
    height,
    duration,
    frame: (t: number) => {
      const grid = createGrid(width, height, 0);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dist = Math.abs(x - y);
          if (t >= dist && (t - dist) % 4 < 2) {
            setCell(grid, x, y, 1);
          }
        }
      }
      
      return grid;
    },
  };
}

export const ANIMATIONS = {
  reveal: createReveal,
  scan: createScan,
  blink: createBlink,
  wave: createWave,
  spiral: createSpiral,
  sparkle: createRandomSparkle,
  snake: createSnake,
  bounce: createBounce,
} as const;

export function createSpiral(width: number, height: number): Animation {
  const maxDist = Math.max(width, height);
  const duration = maxDist * 2;
  return {
    width,
    height,
    duration,
    frame: (t: number) => {
      const grid = createGrid(width, height, 0);
      const centerX = width / 2;
      const centerY = height / 2;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const spiralPos = dist * 3 + angle;
          
          if (t >= spiralPos && t - spiralPos < 1.5) {
            setCell(grid, x, y, 1);
          }
        }
      }
      
      return grid;
    },
  };
}

export function createRandomSparkle(width: number, height: number): Animation {
  const duration = 30;
  return {
    width,
    height,
    duration,
    frame: (t: number) => {
      const grid = createGrid(width, height, 0);
      const seed = t * 12345;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const rand = Math.sin(seed + x * 12.9898 + y * 78.233) * 43758.5453;
          const isOn = rand - Math.floor(rand);
          
          if (isOn < 0.15 && t % 4 === 0) {
            setCell(grid, x, y, 1);
          }
        }
      }
      
      return grid;
    },
  };
}

export function createSnake(width: number, height: number): Animation {
  const duration = width + height;
  return {
    width,
    height,
    duration,
    frame: (t: number) => {
      const grid = createGrid(width, height, 0);
      
      let x = 0;
      let y = 0;
      let dx = 1;
      let dy = 0;
      let len = 0;
      
      for (let i = 0; i < t && i < width * height; i++) {
        setCell(grid, x, y, 1);
        len++;
        
        const nextX = x + dx;
        const nextY = y + dy;
        
        if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height && len < Math.min(width * height, t)) {
          x = nextX;
          y = nextY;
        } else {
          if (dx === 1 && dy === 0) { dx = 0; dy = 1; }
          else if (dx === 0 && dy === 1) { dx = -1; dy = 0; }
          else if (dx === -1 && dy === 0) { dx = 0; dy = -1; }
          else { dx = 1; dy = 0; }
        }
      }
      
      return grid;
    },
  };
}

export function createBounce(width: number, height: number): Animation {
  const duration = height * 2;
  return {
    width,
    height,
    duration,
    frame: (t: number) => {
      const grid = createGrid(width, height, 0);
      const phase = t % (height * 2);
      const row = phase < height ? phase : height * 2 - phase;
      
      for (let x = 0; x < width; x++) {
        setCell(grid, x, row, 1);
      }
      
      return grid;
    },
  };
}

export type AnimationType = 'static' | keyof typeof ANIMATIONS;
