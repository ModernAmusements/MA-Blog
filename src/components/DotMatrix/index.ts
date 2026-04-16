export { 
  DotMatrix, 
  useDotMatrix,
} from './DotMatrix';

export { DotMatrixEditor } from './DotMatrixEditor';

export type { DotMatrixConfig } from './DotMatrix';

export { ASCII_PATTERNS, messageToDots, getDecorativePattern, DEFAULT_MESSAGE } from './ascii';

export { convertImageToDotMatrix } from './imageConverter';
export type { DotCell, ImageConversionOptions } from './imageConverter';

export { createGIF } from './gifEncoder';