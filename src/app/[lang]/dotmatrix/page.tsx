'use client';

import { useState, useEffect, useCallback } from 'react';
import { DotMatrix, DotMatrixEditor, convertImageToDotMatrix } from '@/components/DotMatrix';
import type { DotCell } from '@/components/DotMatrix';
import styles from './dotmatrix.module.scss';

const GRID_SIZES = [8, 16, 32, 64, 128] as const;
const COLORS = ['orange', 'white', 'green', 'red', 'black'] as const;

export default function DotMatrixPlayground() {
  const [color, setColor] = useState<'orange' | 'white' | 'green' | 'red' | 'black'>('orange');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageGrid, setImageGrid] = useState<boolean[][] | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [gridSize, setGridSize] = useState<8 | 16 | 32 | 64 | 128>(16);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      if (mobile) {
        setGridSize(32);
        setImageDotSize(8);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [imageDotSize, setImageDotSize] = useState(16);
  const [threshold, setThreshold] = useState(30);
  const [fitMode, setFitMode] = useState<'stretch' | 'fit' | 'crop'>('fit');
  const [padColor, setPadColor] = useState('#000000');
  const [containerWidth, setContainerWidth] = useState(600);

  const [editorGrid, setEditorGrid] = useState<boolean[][] | null>(null);
  const [editorGridSize, setEditorGridSize] = useState<8 | 16 | 32 | 64 | 128>(16);
  const [editorDotSizeInput, setEditorDotSizeInput] = useState(16);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('[class*="editorColumn"]');
      if (container) {
        setContainerWidth(Math.min(container.clientWidth - 64, 600));
      } else {
        setContainerWidth(600);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageDataUrl) {
        URL.revokeObjectURL(imageDataUrl);
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageDataUrl(url);
    }
  }, [imageDataUrl]);

  useEffect(() => {
    if (!imageDataUrl) return;

    let cancelled = false;

    const convert = async () => {
      setIsConverting(true);
      setConversionProgress(0);
      try {
        setConversionProgress(10);
        await new Promise(r => setTimeout(r, 50));
        
        const result = await convertImageToDotMatrix(imageDataUrl, {
          gridSize,
          dotSize: imageDotSize,
          invertColors: false,
          fitMode,
          padColor,
        });
        
        if (cancelled) return;
        
        await new Promise(r => setTimeout(r, 50));
        setConversionProgress(60);

        const thresholdValue = threshold / 100;
        const booleanGrid = result.map(row =>
          row.map(cell => cell.brightness > thresholdValue)
        );
        setImageGrid(booleanGrid);
        
        await new Promise(r => setTimeout(r, 50));
        setConversionProgress(90);
      } catch (error) {
        console.error('Conversion failed:', error);
      } finally {
        if (!cancelled) {
          setIsConverting(false);
          setConversionProgress(0);
        }
      }
    };

    convert();

    return () => {
      cancelled = true;
    };
  }, [imageDataUrl, gridSize, imageDotSize, threshold, fitMode, padColor]);

  useEffect(() => {
    return () => {
      if (imageDataUrl) {
        URL.revokeObjectURL(imageDataUrl);
      }
    };
  }, []);

  const handleGridSizeChange = (value: number) => {
    setGridSize(value as 8 | 16 | 32 | 64 | 128);
  };

  const handleClear = useCallback(() => {
    if (imageDataUrl) {
      URL.revokeObjectURL(imageDataUrl);
    }
    setImageFile(null);
    setImageDataUrl(null);
    setImageGrid(null);
  }, [imageDataUrl]);

  const handleDownload = useCallback(() => {
    if (!imageGrid) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dotSize = 10;
    const gap = 2;
    const padding = 16;
    const size = gridSize * (dotSize + gap) + padding * 2;

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (imageGrid[y]?.[x]) {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(
            padding + x * (dotSize + gap) + dotSize / 2,
            padding + y * (dotSize + gap) + dotSize / 2,
            dotSize / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }

    const link = document.createElement('a');
    link.download = `dotmatrix-${gridSize}x${gridSize}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [imageGrid, gridSize]);

  const displayDotSize = (() => {
    if (imageDotSize > 0) {
      return imageDotSize;
    }
    const base = containerWidth / gridSize;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const max = isMobile ? 16 : 12;
    const min = isMobile ? 4 : 2;
    return Math.max(min, Math.min(max, base));
  })();

  const blankGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

  return (
    <div className={styles.playground}>
      <h1 className={styles.title}>Dot Matrix Playground</h1>
      <p className={styles.subtitle}>Test all dot matrix configurations</p>

      <div className={styles.customSection}>
        <h2>Image to Dot Matrix</h2>

        <div className={styles.editorLayout}>
          <div className={styles.controlsColumn}>
            <div className={styles.controls}>
              <label className={styles.uploadLabel}>
                Upload Image:
                <label className={styles.fileUploadBtn}>
                  {imageFile ? imageFile.name : 'Choose file'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                </label>
              </label>

              <label className={styles.gridSizeLabel}>
                Grid Size: {gridSize}×{gridSize}
                <input
                  type="range"
                  min="8"
                  max="128"
                  step="8"
                  value={gridSize}
                  onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                />
              </label>

              <label className={styles.dotSizeLabel}>
                Dot Size: {imageDotSize}px
                <input
                  type="range"
                  min="0.1"
                  max="16"
                  step="0.1"
                  value={imageDotSize}
                  onChange={(e) => setImageDotSize(Number(e.target.value))}
                />
              </label>

              <label>
                Threshold: {threshold}%
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
              </label>

              <label>
                Fit Mode:
                <select value={fitMode} onChange={(e) => setFitMode(e.target.value as 'stretch' | 'fit' | 'crop')}>
                  <option value="fit">Fit (Letterbox)</option>
                  <option value="crop">Crop to Center</option>
                  <option value="stretch">Stretch</option>
                </select>
              </label>

              {fitMode === 'fit' && (
                <label>
                  Pad Color:
                  <input
                    type="color"
                    value={padColor}
                    onChange={(e) => setPadColor(e.target.value)}
                    className={styles.colorInput}
                  />
                </label>
              )}

              <div className={styles.buttonRow}>
                <button onClick={handleClear} disabled={!imageFile}>Clear</button>
                {imageGrid && (
                  <button className={styles.primaryButton} onClick={handleDownload}>Download</button>
                )}
              </div>

              {isConverting && (
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${conversionProgress}%` }} />
                  <span className={styles.progressLabel}>Converting... {conversionProgress}%</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.editorColumn}>
            <div className={styles.imagePreview}>
              <DotMatrix
                config={{
                  cols: gridSize,
                  rows: gridSize,
                  dotSize: displayDotSize,
                  color: 'orange',
                  animation: 'static',
                  interactive: false,
                  imageGrid: imageGrid ?? blankGrid,
                  maxWidth: Math.min(containerWidth - 32, 600),
                }}
              />
              <div className={styles.gridInfo}>
                Grid: {gridSize}×{gridSize}{imageGrid ? ` | Dots: ${imageGrid.flat().filter(Boolean).length}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.customSection}>
        <h2>Interactive Editor</h2>

        <div className={styles.editorLayout}>
          <div className={styles.controlsColumn}>
            <div className={styles.controls}>
              <label>
                Grid Size: {editorGridSize}×{editorGridSize}
                <input
                  type="range"
                  min="8"
                  max="128"
                  step="8"
                  value={editorGridSize}
                  onChange={(e) => setEditorGridSize(Number(e.target.value) as 8 | 16 | 32 | 64 | 128)}
                />
              </label>

              <label>
                Dot Size: {editorDotSizeInput}px
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="1"
                  value={editorDotSizeInput}
                  onChange={(e) => setEditorDotSizeInput(Number(e.target.value))}
                />
              </label>

              <label>
                Color:
                <select value={color} onChange={(e) => setColor(e.target.value as typeof color)}>
                  {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className={styles.editorColumn}>
            <DotMatrixEditor
              initialSize={editorGridSize}
              dotSize={editorDotSizeInput}
              onChange={setEditorGrid}
              maxWidth={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
}