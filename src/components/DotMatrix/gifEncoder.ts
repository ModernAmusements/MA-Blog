import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export function createSpriteSheet(
  width: number,
  height: number,
  getFrame: (t: number) => number[][],
  frameCount: number,
  dotColor: string = '#f97316',
  bgColor: string = '#000000',
  dotSize: number = 10,
  gap: number = 2
): string {
  const frameWidth = width * (dotSize + gap);
  const frameHeight = height * (dotSize + gap);
  const sheetWidth = frameWidth * Math.min(frameCount, 4);
  const sheetHeight = frameHeight * Math.ceil(frameCount / 4);
  
  let rects = '';
  for (let f = 0; f < frameCount; f++) {
    const grid = getFrame(f);
    const col = f % 4;
    const row = Math.floor(f / 4);
    const offsetX = col * frameWidth;
    const offsetY = row * frameHeight;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y]?.[x]) {
          rects += `<rect x="${offsetX + x * (dotSize + gap)}" y="${offsetY + y * (dotSize + gap)}" width="${dotSize}" height="${dotSize}" fill="${dotColor}"/>`;
        }
      }
    }
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}" height="${sheetHeight}" viewBox="0 0 ${sheetWidth} ${sheetHeight}">
    <rect width="${sheetWidth}" height="${sheetHeight}" fill="${bgColor}"/>
    ${rects}
  </svg>`;
}

export function createSVG(
  width: number,
  height: number,
  grid: number[][],
  dotColor: string = '#f97316',
  bgColor: string = '#000000',
  dotSize: number = 10,
  gap: number = 2
): string {
  const totalSize = dotSize + gap;
  const svgWidth = width * totalSize;
  const svgHeight = height * totalSize;
  
  let dots = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y]?.[x]) {
        dots += `<rect x="${x * totalSize}" y="${y * totalSize}" width="${dotSize}" height="${dotSize}" fill="${dotColor}"/>`;
      }
    }
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
    <rect width="${svgWidth}" height="${svgHeight}" fill="${bgColor}"/>
    ${dots}
  </svg>`;
}

export function createGIF(
  width: number, 
  height: number, 
  getFrame: (t: number) => number[][], 
  frameCount: number,
  dotColor: string = '#f97316',
  bgColor: string = '#000000',
  delayMs: number = 80
): Uint8Array {
  const delay = Math.round(delayMs / 10);
  
  // Parse hex to RGB
  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  });
  
  const bg = hexToRgb(bgColor);
  const dot = hexToRgb(dotColor);
  
  // Create palette: [bg, dot]
  const palette = [
    bg.r, bg.g, bg.b,
    dot.r, dot.g, dot.b
  ];
  
  const gif = GIFEncoder();
  
  // Generate each frame
  for (let f = 0; f < frameCount; f++) {
    const grid = getFrame(f);
    
    // Convert grid to RGBA pixels
    const rgba = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const isLit = grid[y]?.[x] ? 1 : 0;
        
        if (isLit) {
          rgba[idx] = dot.r;
          rgba[idx + 1] = dot.g;
          rgba[idx + 2] = dot.b;
          rgba[idx + 3] = 255;
        } else {
          rgba[idx] = bg.r;
          rgba[idx + 1] = bg.g;
          rgba[idx + 2] = bg.b;
          rgba[idx + 3] = 255;
        }
      }
    }
    
    // Quantize to palette
    const indexed = quantize(rgba, 2);
    const paletteIndices = applyPalette(indexed, palette as number[]);
    
    // Add frame
    gif.writeFrame(paletteIndices as unknown as Uint8Array, width, height, {
      palette: palette as number[],
      delay,
    });
  }
  
  // Finish GIF
  gif.finish();
  
  return gif.bytes();
}
