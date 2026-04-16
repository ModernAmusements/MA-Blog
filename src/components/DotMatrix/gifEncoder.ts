export function createGIF(
  width: number, 
  height: number, 
  getFrame: (t: number) => number[][], 
  frameCount: number = 30,
  dotColor: string = '#f97316',
  bgColor: string = '#000000'
): Uint8Array {
  const delay = 8;
  
  // Parse colors to RGB
  const parseColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  
  const bg = parseColor(bgColor);
  const dot = parseColor(dotColor);
  const colorPalette = [bg, dot];
  
  const header = [
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61,
    width & 0xff, (width >> 8) & 0xff,
    height & 0xff, (height >> 8) & 0xff,
    0xf7, 0x00, 0x00,
  ];
  
  const netscapeExt = [0x21, 0xff, 0x0b, 0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30, 0x00, 0x00];
  
  const allFrames: number[] = [];
  
  for (let t = 0; t < frameCount; t++) {
    const grid = getFrame(t);
    const pixels = new Uint8Array(width * height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        pixels[y * width + x] = grid[y]?.[x] ? 1 : 0;
      }
    }
    
    // Graphics Control Extension
    const gce = [0x21, 0xf9, 0x04, 0x00, delay & 0xff, (delay >> 8) & 0xff, 0x00, 0x00];
    
    // Image Descriptor
    const imgDesc = [0x2c, 0x00, 0x00, 0x00, 0x00, width & 0xff, (width >> 8) & 0xff, height & 0xff, (height >> 8) & 0xff, 0x00, 0x08];
    
    // LZW minimum code size
    const codeSize = 2;
    imgDesc.push(codeSize);
    
    // Prepare pixel data
    const pixels8 = [...pixels];
    let output: number[] = [];
    let codeSizeNow = codeSize + 1;
    const clearCode = 1 << codeSize;
    const eoiCode = clearCode + 1;
    let nextCode = eoiCode + 1;
    const table = new Map<string, number>();
    
    for (let i = 0; i < clearCode; i++) {
      table.set(String(i), i);
    }
    
    let buffer = 0;
    let bits = 0;
    
    const emit = (code: number) => {
      buffer |= code << bits;
      bits += codeSizeNow;
      while (bits >= 8) {
        output.push(buffer & 0xff);
        buffer >>= 8;
        bits -= 8;
      }
    };
    
    emit(clearCode);
    
    let prefix = pixels8[0] ?? 0;
    for (let i = 1; i < pixels8.length; i++) {
      const k = pixels8[i];
      const combined = `${prefix},${k}`;
      if (table.has(combined)) {
        prefix = table.get(combined)!;
      } else {
        emit(prefix);
        if (nextCode < 4096) {
          table.set(combined, nextCode++);
          if (nextCode > (1 << codeSizeNow) && codeSizeNow < 12) codeSizeNow++;
        } else {
          emit(clearCode);
          table.clear();
          for (let j = 0; j < clearCode; j++) table.set(String(j), j);
          nextCode = eoiCode + 1;
          codeSizeNow = codeSize + 1;
        }
        prefix = k;
      }
    }
    emit(prefix);
    emit(eoiCode);
    
    if (bits > 0) output.push(buffer & 0xff);
    
    // Sub-block the image data
    const imgData: number[] = [];
    for (let i = 0; i < output.length; i += 255) {
      const chunk = output.slice(i, i + 255);
      imgData.push(chunk.length, ...chunk);
    }
    imgData.push(0x00);
    
    allFrames.push(...gce, ...imgDesc, ...imgData);
  }
  
  const trailer = [0x3b];
  
  return new Uint8Array([...header, ...netscapeExt, ...allFrames, ...trailer]);
}
