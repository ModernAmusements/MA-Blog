// 15x21 dot matrix patterns (3x scaled from 5x7)
// Each pattern is 21 rows, 15 columns where true = dot lit

function scalePattern(pattern: boolean[][], scaleX: number, scaleY: number): boolean[][] {
  const result: boolean[][] = [];
  for (let y = 0; y < pattern.length * scaleY; y++) {
    result[y] = [];
    for (let x = 0; x < pattern[0].length * scaleX; x++) {
      const srcY = Math.floor(y / scaleY);
      const srcX = Math.floor(x / scaleX);
      result[y][x] = pattern[srcY]?.[srcX] ?? false;
    }
  }
  return result;
}

const basePatterns: Record<string, boolean[][]> = {
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
  ' ': [
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
};

export const ASCII_PATTERNS: Record<string, boolean[][]> = {};

for (const [char, pattern] of Object.entries(basePatterns)) {
  ASCII_PATTERNS[char] = scalePattern(pattern, 3, 3);
}

export const DEFAULT_MESSAGE = 'HELLO';

export function messageToDots(message: string): boolean[][] {
  const upperMessage = message.toUpperCase();
  const allDots: boolean[][] = [];

  for (let row = 0; row < 21; row++) {
    allDots[row] = [];
  }

  for (const char of upperMessage) {
    const pattern = ASCII_PATTERNS[char] || ASCII_PATTERNS[' '] || [];
    for (let row = 0; row < pattern.length; row++) {
      allDots[row].push(...(pattern[row] || Array(15).fill(false)));
      allDots[row].push(false, false, false);
    }
  }

  return allDots;
}

// 15x15 dot matrix patterns
// Using character-based patterns for easy editing and visualization
// Rule: icons start and end 1 dot before the last border (positions 1-13)
// Rule: icons must be centered inside the matrix

function createArrowPattern(direction: 'left' | 'right', size: number = 15): boolean[][] {
  // Right arrow - 1 for lit, 0 for unlit
  const rightArrow = [
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  // Left arrow - mirrored from right arrow
  const leftArrow = [
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  const pattern = direction === 'right' ? rightArrow : leftArrow;
  
  return pattern.map(row => row.map(bit => bit === 1));
}

const ARROW_RIGHT = createArrowPattern('right', 15);
const ARROW_LEFT = createArrowPattern('left', 15);

// Wave - zigzag pattern
const WAVE: boolean[][] = Array(15).fill(null).map((_, y) => 
  Array(15).fill(false).map((_, x) => {
    if (y === 7) return true;
    return (x + y) % 3 === 0;
  })
);

// Grid - border frame
const GRID: boolean[][] = Array(15).fill(null).map((_, y) => 
  Array(15).fill(false).map((_, x) => {
    if (y === 0 || y === 14) return true;
    if (x === 0 || x === 14) return true;
    return false;
  })
);

// Heart
const HEART: boolean[][] = [
  [false,false,false,true,true,true,true,false,false,false,false,false,false,false,false],
  [false,false,true,true,true,true,true,true,false,false,false,false,false,false,false],
  [false,true,true,true,true,true,true,true,true,false,false,false,false,false,false],
  [true,true,true,true,true,true,true,true,true,true,false,false,false,false,false],
  [false,true,true,true,true,true,true,true,true,false,false,false,false,false,false],
  [false,false,true,true,true,true,true,true,false,false,false,false,false,false,false],
  [false,false,false,true,true,true,true,false,false,false,false,false,false,false,false],
  [false,false,false,false,true,true,false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
];

export function getDecorativePattern(type: 'arrow-left' | 'arrow-right' | 'wave' | 'grid' | 'heart'): boolean[][] {
  const patterns: Record<string, boolean[][]> = {
    'arrow-right': ARROW_RIGHT,
    'arrow-left': ARROW_LEFT,
    'wave': WAVE,
    'grid': GRID,
    'heart': HEART,
  };

  return patterns[type] || Array(15).fill(null).map(() => Array(15).fill(false));
}