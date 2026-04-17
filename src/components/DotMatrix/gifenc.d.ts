declare module 'gifenc' {
  export function GIFEncoder(): {
    writeFrame(data: Uint8Array, width: number, height: number, options?: {
      palette?: number[];
      delay?: number;
      dispose?: number;
    }): void;
    finish(): void;
    bytes(): Uint8Array;
  };
  
  export function quantize(rgba: Uint8Array, maxColors: number): Uint8Array;
  export function applyPalette(indexed: Uint8Array, palette: number[]): Uint8Array;
}
