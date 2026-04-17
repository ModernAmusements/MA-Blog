export { 
  DotMatrix, 
  useDotMatrix,
  type DotMatrixConfig,
  type DotCell,
  type Animation,
  type AnimationType,
  type DotColor,
  type DecorativePattern,
} from './DotMatrix';

export { DotMatrixEditor } from './DotMatrixEditor';

export { ASCII_PATTERNS, messageToDots, getDecorativePattern, DEFAULT_MESSAGE } from './ascii';

export { convertImageToDotMatrix, applyEdgeDetection, applyDithering, adjustBrightness, adjustContrast, invertGrid } from './imageConverter';
export type { ImageConversionOptions } from './imageConverter';

export { createGIF, createSVG, createSpriteSheet } from './gifEncoder';

export * from './constants';