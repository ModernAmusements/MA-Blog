export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://modern-amusements.vercel.app';

export const SITE_NAME = 'ModernAmusements Development';

export const OG_IMAGE = `${SITE_URL}/og-image.svg`;

export const TWITTER_HANDLE = '@modernamusements';

export const AUTHOR_NAME = 'Shady Nathan Tawfik';

export const GRID_PRESETS = [8, 16, 32, 64] as const;

export const DOT_COLORS = ['orange', 'white', 'green', 'red', 'black', 'neon-green', 'purple', 'pink'] as const;

export const DISPLAY_COLORS = ['primary', 'accent', 'pink'] as const;

export const DOT_COLOR_MAP: Record<string, string> = {
  primary: '#f97316',
  accent: '#4BFF00',
  pink: '#FF9CEA',
  orange: '#f97316',
  white: '#ffffff',
  green: '#22c55e',
  red: '#ef4444',
  black: '#000000',
  'neon-green': '#4BFF00',
  purple: '#992EFE',
};

export const DOTMATRIX_DEFAULTS = {
  dotSize: 10,
  gap: 2,
  padding: 16,
  threshold: 30,
  animationSpeed: 150,
  minOutputWidth: 1000,
} as const;

export const ANIMATION_TYPES = ['static', 'reveal', 'scan', 'blink', 'wave', 'spiral', 'sparkle', 'snake', 'bounce'] as const;

export type AnimationType = typeof ANIMATION_TYPES[number];