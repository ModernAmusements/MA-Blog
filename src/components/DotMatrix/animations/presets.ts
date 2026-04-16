import { Animation, createGrid, setCell, getCell } from './engine';

export function createScan(width: number, height: number): Animation {
  return {
    width,
    height,
    duration: width,
    frame: (t) => {
      const grid = createGrid(width, height);
      const x = t % width;
      for (let y = 0; y < height; y++) {
        setCell(grid, x, y, 1);
      }
      return grid;
    },
  };
}

export function createRain(width: number, height: number): Animation {
  const drops = Array.from({ length: width }, () => Math.floor(Math.random() * height));

  return {
    width,
    height,
    duration: 1000,
    frame: () => {
      const grid = createGrid(width, height);

      for (let x = 0; x < width; x++) {
        drops[x]++;

        if (drops[x] >= height) {
          drops[x] = 0;
        }

        setCell(grid, x, drops[x], 1);
      }

      return grid;
    },
  };
}

export function createWave(width: number, height: number): Animation {
  return {
    width,
    height,
    duration: 200,
    frame: (t) => {
      const grid = createGrid(width, height);

      for (let x = 0; x < width; x++) {
        const y = Math.floor(
          (Math.sin((x + t) * 0.3) * 0.5 + 0.5) * (height - 1)
        );
        setCell(grid, x, y, 1);
      }

      return grid;
    },
  };
}

export function createDiagSwipe(width: number, height: number): Animation {
  return {
    width,
    height,
    duration: width + height,
    frame: (t) => {
      const grid = createGrid(width, height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (x + y < t) {
            setCell(grid, x, y, 1);
          }
        }
      }

      return grid;
    },
  };
}

export function createOrbit(width: number, height: number): Animation {
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const r = Math.min(cx, cy) - 1;

  return {
    width,
    height,
    duration: 200,
    frame: (t) => {
      const grid = createGrid(width, height);

      const angle = (t / 200) * Math.PI * 2;
      const x = Math.round(cx + r * Math.cos(angle));
      const y = Math.round(cy + r * Math.sin(angle));

      setCell(grid, x, y, 1);

      return grid;
    },
  };
}

export function createPulse(width: number, height: number): Animation {
  return {
    width,
    height,
    duration: 60,
    frame: (t) => {
      const grid = createGrid(width, height);
      const centerX = Math.floor(width / 2);
      const centerY = Math.floor(height / 2);
      const maxRadius = Math.min(centerX, centerY);
      const radius = ((t % 60) / 60) * maxRadius;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          if (Math.abs(dist - radius) < 1) {
            setCell(grid, x, y, 1);
          }
        }
      }

      return grid;
    },
  };
}

export function createSparkle(width: number, height: number): Animation {
  const sparkles = Array.from({ length: 10 }, () => ({
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
    life: Math.floor(Math.random() * 30),
  }));

  return {
    width,
    height,
    duration: 200,
    frame: (t) => {
      const grid = createGrid(width, height);

      for (const s of sparkles) {
        s.life--;
        if (s.life <= 0) {
          s.x = Math.floor(Math.random() * width);
          s.y = Math.floor(Math.random() * height);
          s.life = Math.floor(Math.random() * 30) + 10;
        }
        if (s.life > 0) {
          setCell(grid, s.x, s.y, 1);
        }
      }

      return grid;
    },
  };
}

export function createReveal(width: number, height: number): Animation {
  const pixels: { x: number; y: number }[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pixels.push({ x, y });
    }
  }
  for (let i = pixels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pixels[i], pixels[j]] = [pixels[j], pixels[i]];
  }

  return {
    width,
    height,
    duration: width * height,
    frame: (t) => {
      const grid = createGrid(width, height);
      const revealCount = Math.min(t + 1, pixels.length);
      
      for (let i = 0; i < revealCount; i++) {
        const { x, y } = pixels[i];
        setCell(grid, x, y, 1);
      }
      
      return grid;
    },
  };
}

export function createInvert(width: number, height: number): Animation {
  return {
    width,
    height,
    duration: 60,
    frame: (t) => {
      const grid = createGrid(width, height);
      const cycle = t % 60;
      const progress = cycle / 30;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const delay = (x + y) / (width + height);
          const pixelProgress = Math.max(0, Math.min(1, (progress - delay * 0.5) * 2));
          if (pixelProgress < 0.5) {
            setCell(grid, x, y, 0);
          } else {
            setCell(grid, x, y, 1);
          }
        }
      }
      
      return grid;
    },
  };
}

export const ANIMATIONS = {
  scan: createScan,
  rain: createRain,
  wave: createWave,
  diagSwipe: createDiagSwipe,
  orbit: createOrbit,
  pulse: createPulse,
  sparkle: createSparkle,
  reveal: createReveal,
  invert: createInvert,
} as const;

export type AnimationType = keyof typeof ANIMATIONS;