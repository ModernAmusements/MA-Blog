import type { DotCell } from './types';

export interface ImageConversionOptions {
  gridSize: 8 | 16 | 32 | 64 | 128;
  dotSize: number;
  invertColors: boolean;
  fitMode?: 'stretch' | 'fit' | 'crop';
  padColor?: string;
}

export type { DotCell };

function calculateBrightness(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export async function convertImageToDotMatrix(
  source: File | string,
  options: ImageConversionOptions
): Promise<DotCell[][]> {
  const fitMode = options.fitMode ?? 'stretch';
  const padColor = options.padColor ?? '#000000';
  const padRgb = hexToRgb(padColor) ?? { r: 0, g: 0, b: 0 };
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      canvas.width = options.gridSize;
      canvas.height = options.gridSize;

      // Fill with pad color first
      ctx.fillStyle = padColor;
      ctx.fillRect(0, 0, options.gridSize, options.gridSize);

      let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;
      
      if (fitMode === 'fit') {
        // Calculate aspect ratio preserving dimensions
        const gridAspect = options.gridSize / options.gridSize;
        const imgAspect = img.width / img.height;
        
        let drawW: number, drawH: number;
        
        if (imgAspect > gridAspect) {
          // Image is wider - fit by height
          drawH = options.gridSize;
          drawW = img.width * (options.gridSize / img.height);
        } else {
          // Image is taller - fit by width
          drawW = options.gridSize;
          drawH = img.height * (options.gridSize / img.width);
        }
        
        // Center the image
        const offsetX = (options.gridSize - drawW) / 2;
        const offsetY = (options.gridSize - drawH) / 2;
        
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      } else if (fitMode === 'crop') {
        // Crop to center
        const gridAspect = options.gridSize / options.gridSize;
        const imgAspect = img.width / img.height;
        
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        
        if (imgAspect > gridAspect) {
          // Crop width
          sw = img.height * gridAspect;
          sx = (img.width - sw) / 2;
        } else if (imgAspect < gridAspect) {
          // Crop height
          sh = img.width / gridAspect;
          sy = (img.height - sh) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, options.gridSize, options.gridSize);
      } else {
        // Stretch (default behavior)
        ctx.drawImage(img, 0, 0, options.gridSize, options.gridSize);
      }

      const imageData = ctx.getImageData(0, 0, options.gridSize, options.gridSize);
      const data = imageData.data;

      const grid: DotCell[][] = [];

      for (let y = 0; y < options.gridSize; y++) {
        grid[y] = [];
        for (let x = 0; x < options.gridSize; x++) {
          const i = (y * options.gridSize + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          let brightness = calculateBrightness(r, g, b);
          
          if (options.invertColors) {
            brightness = 1 - brightness;
          }

          grid[y][x] = { brightness };
        }
      }

      resolve(grid);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}

export function applyEdgeDetection(grid: DotCell[][], threshold: number = 0.3): DotCell[][] {
  const height = grid.length;
  const width = grid[0]?.length || 0;
  const result: DotCell[][] = [];
  
  for (let y = 0; y < height; y++) {
    result[y] = [];
    for (let x = 0; x < width; x++) {
      const current = grid[y]?.[x]?.brightness || 0;
      const right = grid[y]?.[x + 1]?.brightness || 0;
      const below = grid[y + 1]?.[x]?.brightness || 0;
      const diff = Math.abs(current - right) + Math.abs(current - below);
      result[y][x] = { brightness: diff > threshold ? 1 : diff > threshold / 2 ? 0.5 : 0 };
    }
  }
  
  return result;
}

export function applyDithering(grid: DotCell[][]): DotCell[][] {
  const height = grid.length;
  const width = grid[0]?.length || 0;
  const result: DotCell[][] = [];
  
  for (let y = 0; y < height; y++) {
    result[y] = [];
    for (let x = 0; x < width; x++) {
      const val = grid[y]?.[x]?.brightness || 0;
      const threshold = ((x + y) % 2) * 0.5;
      result[y][x] = { brightness: val > threshold ? 1 : 0 };
    }
  }
  
  return result;
}

export function adjustBrightness(grid: DotCell[][], delta: number): DotCell[][] {
  return grid.map(row =>
    row.map(cell => ({
      brightness: Math.max(0, Math.min(1, cell.brightness + delta))
    }))
  );
}

export function adjustContrast(grid: DotCell[][], factor: number): DotCell[][] {
  return grid.map(row =>
    row.map(cell => ({
      brightness: Math.max(0, Math.min(1, (cell.brightness - 0.5) * factor + 0.5))
    }))
  );
}

export function invertGrid(grid: DotCell[][]): DotCell[][] {
  return grid.map(row =>
    row.map(cell => ({ brightness: 1 - cell.brightness }))
  );
}