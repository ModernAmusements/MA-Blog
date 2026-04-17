export interface DotCell {
  brightness: number;
}

export interface ImageConversionOptions {
  threshold: number;
  invert: boolean;
  resize: boolean;
}

export interface Animation {
  width: number;
  height: number;
  duration: number;
  frame: (t: number) => number[][];
}

export type AnimationType = 'static' | 'reveal' | 'scan';

export type DotColor = 'orange' | 'white' | 'green' | 'red' | 'black' | 'neon-green' | 'purple' | 'pink';

export type DecorativePattern = 'arrow-left' | 'arrow-right' | 'wave' | 'grid' | 'heart';

export interface DotMatrixConfig {
  cols: number;
  rows: number;
  dotSize: number;
  gap: number;
  color: DotColor;
  interactive: boolean;
  blackBorder?: boolean;
  bgColor?: string;
  imageGrid?: boolean[][];
  imageData?: DotCell[][];
  message?: string;
  decorative?: DecorativePattern;
}