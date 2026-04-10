// 5x7 dot matrix patterns for A-Z, 0-9, and common symbols
// Each pattern is a 7x5 array where true = dot lit

export const ASCII_PATTERNS: Record<string, boolean[][]> = {
  // Letters A-Z (5x7 grid)
  A: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
  ],
  B: [
    [true, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, false],
  ],
  C: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  D: [
    [true, true, true, false, false],
    [true, false, false, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, true, false],
    [true, true, true, false, false],
  ],
  E: [
    [true, true, true, true, true],
    [true, false, false, false, true],
    [true, false, false, false, false],
    [true, true, true, true, false],
    [true, false, false, false, false],
    [true, false, false, false, true],
    [true, true, true, true, true],
  ],
  F: [
    [true, true, true, true, true],
    [true, false, false, false, true],
    [true, false, false, false, false],
    [true, true, true, true, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
  ],
  G: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, false],
    [true, false, true, true, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  H: [
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
  ],
  I: [
    [true, true, true, true, true],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [true, true, true, true, true],
  ],
  J: [
    [false, false, false, false, true],
    [false, false, false, false, true],
    [false, false, false, false, true],
    [false, false, false, false, true],
    [false, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  K: [
    [true, false, false, false, true],
    [true, false, false, true, false],
    [true, false, true, false, false],
    [true, true, false, false, false],
    [true, false, true, false, false],
    [true, false, false, true, false],
    [true, false, false, false, true],
  ],
  L: [
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, true],
    [true, true, true, true, true],
  ],
  M: [
    [true, false, false, false, true],
    [true, true, false, true, true],
    [true, false, true, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
  ],
  N: [
    [true, false, false, false, true],
    [true, true, false, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, false, true, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
  ],
  O: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  P: [
    [true, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
  ],
  Q: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, true, false, true],
    [true, false, false, true, true],
    [false, true, true, false, true],
  ],
  R: [
    [true, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, false],
    [true, false, true, false, false],
    [true, false, false, true, false],
    [true, false, false, false, true],
  ],
  S: [
    [false, true, true, true, true],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [false, true, true, true, false],
    [false, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, false],
  ],
  T: [
    [true, true, true, true, true],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
  ],
  U: [
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  V: [
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, false, true, false],
    [false, false, true, false, false],
  ],
  W: [
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, true, false, true, true],
    [true, false, false, false, true],
  ],
  X: [
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, false, true, false],
    [false, false, true, false, false],
    [false, true, false, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
  ],
  Y: [
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, false, true, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
  ],
  Z: [
    [true, true, true, true, true],
    [false, false, false, false, true],
    [false, false, false, true, false],
    [false, false, true, false, false],
    [false, true, false, false, false],
    [true, false, false, false, false],
    [true, true, true, true, true],
  ],
  // Numbers 0-9
  0: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, true, true],
    [true, true, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  1: [
    [false, false, true, false, false],
    [false, true, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, true, true, true, false],
  ],
  2: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [false, false, false, false, true],
    [false, false, false, true, false],
    [false, false, true, false, false],
    [false, true, false, false, false],
    [true, true, true, true, true],
  ],
  3: [
    [true, true, true, true, true],
    [false, false, false, false, true],
    [false, false, false, false, true],
    [false, true, true, true, false],
    [false, false, false, false, true],
    [false, false, false, false, true],
    [true, true, true, true, false],
  ],
  4: [
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, true],
    [false, false, false, false, true],
    [false, false, false, false, true],
    [false, false, false, false, true],
  ],
  5: [
    [true, true, true, true, true],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, true, true, true, false],
    [false, false, false, false, true],
    [false, false, false, false, true],
    [true, true, true, true, false],
  ],
  6: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, false],
    [true, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  7: [
    [true, true, true, true, true],
    [false, false, false, false, true],
    [false, false, false, true, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
  ],
  8: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  9: [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, true],
    [false, false, false, false, true],
    [false, false, false, false, true],
    [false, true, true, true, false],
  ],
  // Symbols
  ' ': [ // space
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ],
  '!': [
    [false, true, false, false, false],
    [false, true, false, false, false],
    [false, true, false, false, false],
    [false, true, false, false, false],
    [false, true, false, false, false],
    [false, false, false, false, false],
    [false, true, false, false, false],
  ],
  '?': [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [false, false, false, false, true],
    [false, false, false, true, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
    [false, false, true, false, false],
  ],
  '-': [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [true, true, true, true, true],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ],
  '.': [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, true, false, false, false],
  ],
  '@': [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, true, true, true],
    [true, true, false, false, true],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  '#': [
    [false, true, false, true, false],
    [false, true, false, true, false],
    [true, true, true, true, true],
    [false, true, false, true, false],
    [true, true, true, true, true],
    [false, true, false, true, false],
    [false, true, false, true, false],
  ],
};

export const DEFAULT_MESSAGE = 'HELLO';

// Convert message string to 2D dot matrix
export function messageToDots(message: string): boolean[][] {
  const upperMessage = message.toUpperCase();
  const allDots: boolean[][] = [];
  
  for (const char of upperMessage) {
    const pattern = ASCII_PATTERNS[char] || ASCII_PATTERNS[' '] || [];
    for (let row = 0; row < pattern.length; row++) {
      if (!allDots[row]) {
        allDots[row] = [];
      }
      allDots[row].push(...(pattern[row] || [false, false, false, false, false]));
      // Add 1 column space between letters
      allDots[row].push(false);
    }
  }
  
  return allDots;
}

// Get decorative pattern (arrows, shapes)
export function getDecorativePattern(type: 'arrow-left' | 'arrow-right' | 'wave' | 'grid' | 'heart'): boolean[][] {
  switch (type) {
    case 'arrow-left':
      return [
        [true, false, false, false, false, false, false],
        [true, true, false, false, false, false, false],
        [true, true, true, false, false, false, false],
        [true, true, true, true, true, true, true],
        [true, true, true, false, false, false, false],
        [true, true, false, false, false, false, false],
        [true, false, false, false, false, false, false],
      ];
    case 'arrow-right':
      return [
        [false, false, false, false, false, false, true],
        [false, false, false, false, false, true, true],
        [false, false, false, false, true, true, true],
        [true, true, true, true, true, true, true],
        [false, false, false, false, true, true, true],
        [false, false, false, false, false, true, true],
        [false, false, false, false, false, false, true],
      ];
    case 'wave':
      return [
        [false, false, true, false, false, false, true],
        [false, true, false, true, false, true, false],
        [true, false, false, false, true, false, false],
        [false, false, false, false, false, false, false],
        [true, false, false, false, true, false, false],
        [false, true, false, true, false, true, false],
        [false, false, true, false, false, false, true],
      ];
    case 'grid':
      return [
        [true, false, true, false, true, false, true],
        [false, false, false, false, false, false, false],
        [true, false, true, false, true, false, true],
        [false, false, false, false, false, false, false],
        [true, false, true, false, true, false, true],
        [false, false, false, false, false, false, false],
        [true, false, true, false, true, false, true],
      ];
    case 'heart':
      return [
        [false, true, false, false, false, true, false],
        [true, true, true, false, true, true, true],
        [true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true],
        [false, true, true, true, true, true, false],
        [false, false, true, true, true, false, false],
        [false, false, false, true, false, false, false],
      ];
    default:
      return Array(7).fill(null).map(() => Array(7).fill(false));
  }
}