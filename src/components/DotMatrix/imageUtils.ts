export interface ImageProcessingOptions {
  width: number;
  height: number;
  threshold: number;
}

export async function imageToDotMatrix(
  file: File,
  options: ImageProcessingOptions
): Promise<boolean[][]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      canvas.width = options.width;
      canvas.height = options.height;

      ctx.drawImage(img, 0, 0, options.width, options.height);

      const imageData = ctx.getImageData(0, 0, options.width, options.height);
      const data = imageData.data;

      const grid: boolean[][] = [];

      for (let y = 0; y < options.height; y++) {
        grid[y] = [];
        for (let x = 0; x < options.width; x++) {
          const i = (y * options.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          grid[y][x] = brightness > options.threshold;
        }
      }

      resolve(grid);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}