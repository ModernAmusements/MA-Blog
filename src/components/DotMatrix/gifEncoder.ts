export function createGIF(
  width: number, 
  height: number, 
  getFrame: (t: number) => number[][], 
  frameCount: number,
  dotColor: string = '#f97316',
  bgColor: string = '#000000'
): Uint8Array {
  const delay = Math.floor(100 / 10); // delay in 1/100ths of a second
  
  // Parse hex to RGB
  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  });
  
  const bgRgb = hexToRgb(bgColor);
  const dotRgb = hexToRgb(dotColor);
  
  // Build color table (RGB, 2 colors = 6 bytes)
  const colorTable = [
    bgRgb.r, bgRgb.g, bgRgb.b,
    dotRgb.r, dotRgb.g, dotRgb.b
  ];
  
  // Pad to 768 bytes (256 colors)
  while (colorTable.length < 768) {
    colorTable.push(0);
  }
  
  // GIF Header
  const header = new Uint8Array(13 + 768);
  header[0] = 0x47; // G
  header[1] = 0x49; // I
  header[2] = 0x46; // F
  header[3] = 0x38; // 8
  header[4] = 0x39; // 9
  header[5] = 0x61; // a
  header[6] = width & 0xff;
  header[7] = (width >> 8) & 0xff;
  header[8] = height & 0xff;
  header[9] = (height >> 8) & 0xff;
  header[10] = 0xf7; // Global color table, 8 bits
  header[11] = 0x00; // Background
  header[12] = 0x00; // Aspect ratio
  
  // Copy color table
  for (let i = 0; i < 768; i++) {
    header[13 + i] = colorTable[i];
  }
  
  // Netscape extension for looping
  const netscape = new Uint8Array([
    0x21, 0xff, 0x0b, 0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30, 0x00, 0x00
  ]);
  
  const chunks: number[] = [];
  
  // Add netscape extension
  chunks.push(...netscape);
  
  // Generate each frame
  for (let f = 0; f < frameCount; f++) {
    const grid = getFrame(f);
    
    // Graphics Control Extension
    const gce = [0x21, 0xf9, 0x04, 0x00, delay, 0x00, 0x00];
    chunks.push(...gce);
    
    // Image Descriptor
    const imgDesc = [
      0x2c, 0x00, 0x00, 0x00, 0x00,
      width & 0xff, (width >> 8) & 0xff,
      height & 0xff, (height >> 8) & 0xff,
      0x00
    ];
    chunks.push(...imgDesc);
    
    // LZW minimum code size
    chunks.push(2);
    
    // Get pixels and LZW encode
    const pixels: number[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        pixels.push(grid[y]?.[x] ? 1 : 0);
      }
    }
    
    // Simple LZW encoding
    const minCodeSize = 2;
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    
    const lzwData: number[] = [];
    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;
    const dictionary = new Map<string, number>();
    
    // Initialize dictionary
    for (let i = 0; i < clearCode; i++) {
      dictionary.set(String(i), i);
    }
    
    let output = 0;
    let bits = 0;
    
    const writeCode = (code: number) => {
      output |= code << bits;
      bits += codeSize;
      while (bits >= 8) {
        lzwData.push(output & 0xff);
        output >>= 8;
        bits -= 8;
      }
    };
    
    writeCode(clearCode);
    
    let buffer = pixels[0] ?? 0;
    for (let i = 1; i < pixels.length; i++) {
      const pixel = pixels[i];
      const key = `${buffer},${pixel}`;
      
      if (dictionary.has(key)) {
        buffer = dictionary.get(key)!;
      } else {
        writeCode(buffer);
        if (nextCode < 4096) {
          dictionary.set(key, nextCode++);
          if (nextCode > (1 << codeSize) && codeSize < 12) {
            codeSize++;
          }
        } else {
          writeCode(clearCode);
          dictionary.clear();
          for (let j = 0; j < clearCode; j++) {
            dictionary.set(String(j), j);
          }
          nextCode = eoiCode + 1;
          codeSize = minCodeSize + 1;
        }
        buffer = pixel;
      }
    }
    writeCode(buffer);
    writeCode(eoiCode);
    
    if (bits > 0) {
      lzwData.push(output & 0xff);
    }
    
    // Write sub-blocks
    for (let i = 0; i < lzwData.length; i += 255) {
      const chunk = lzwData.slice(i, i + 255);
      chunks.push(chunk.length, ...chunk);
    }
    chunks.push(0x00); // Block terminator
  }
  
  // Trailer
  chunks.push(0x3b);
  
  return new Uint8Array([...header, ...chunks]);
}
