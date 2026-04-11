'use client';

import { useState, useEffect } from 'react';
import { DotMatrix, DotMatrixEditor, convertImageToDotMatrix } from '@/components/DotMatrix';
import type { DotCell } from '@/components/DotMatrix';
import styles from './dotmatrix.module.scss';

const sizes = [2, 4, 6, 8, 10, 12, 16, 20, 24] as const;
const colors = ['orange', 'white', 'green', 'red', 'black'] as const;
const gridSizes = [8, 16, 32, 64, 128] as const;

export default function DotMatrixPlayground() {
  const [color, setColor] = useState<'orange' | 'white' | 'green' | 'red' | 'black'>('orange');
  const [interactive, setInteractive] = useState(true);
  const [editorGrid, setEditorGrid] = useState<boolean[][] | null>(null);
  
  const [editorGridSize, setEditorGridSize] = useState<8 | 16 | 32 | 64 | 128>(16);
  const [editorDotSizeInput, setEditorDotSizeInput] = useState(16);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [convertedGrid, setConvertedGrid] = useState<DotCell[][] | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [gridSize, setGridSize] = useState<8 | 16 | 32 | 64 | 128>(128);
  const [invertColors, setInvertColors] = useState(false);
  const [imageDotSize, setImageDotSize] = useState(4);
  const [threshold, setThreshold] = useState(30);
  const [fitMode, setFitMode] = useState<'stretch' | 'fit' | 'crop'>('fit');
  const [padColor, setPadColor] = useState('#000000');

  const displayDotSize = Math.max(1, Math.min(12, imageDotSize * (16 / (gridSize / 8))));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageDataUrl(url);
    }
  };

  useEffect(() => {
    if (!imageDataUrl) return;
    
    const convert = async () => {
      setIsConverting(true);
      setHasPendingChanges(false);
      try {
        const result = await convertImageToDotMatrix(imageDataUrl, {
          gridSize,
          dotSize: imageDotSize,
          invertColors,
          fitMode,
          padColor,
        });
        
        const thresholdValue = threshold / 100;
        const booleanGrid = result.map(row => 
          row.map(cell => cell.brightness > thresholdValue)
        );
        setConvertedGrid(result);
        setEditorGrid(booleanGrid);
      } catch (error) {
        console.error('Conversion failed:', error);
      } finally {
        setIsConverting(false);
      }
    };

    const timer = setTimeout(() => {
      convert();
    }, 300);

    return () => clearTimeout(timer);
  }, [imageDataUrl, gridSize, imageDotSize, invertColors, threshold, fitMode, padColor]);

  const handleGridSizeChange = (value: number) => {
    setGridSize(value as 8 | 16 | 32 | 64 | 128);
    if (imageDataUrl) setHasPendingChanges(true);
  };

  const handleImageDotSizeChange = (value: number) => {
    setImageDotSize(value);
    if (imageDataUrl) setHasPendingChanges(true);
  };

  const handleInvertColorsChange = (checked: boolean) => {
    setInvertColors(checked);
    if (imageDataUrl) setHasPendingChanges(true);
  };

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
    if (imageDataUrl) setHasPendingChanges(true);
  };

  const handleFitModeChange = (value: 'stretch' | 'fit' | 'crop') => {
    setFitMode(value);
    if (imageDataUrl) setHasPendingChanges(true);
  };

  const handlePadColorChange = (value: string) => {
    setPadColor(value);
    if (imageDataUrl) setHasPendingChanges(true);
  };

  const handleClear = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setConvertedGrid(null);
    setEditorGrid(null);
  };

  const handleDownload = () => {
    if (!editorGrid || !gridSize) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dotSize = 8;
    const gap = 1;
    const padding = 16;
    const size = gridSize * (dotSize + gap) + padding * 2;

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (editorGrid[y]?.[x]) {
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
  };

  const blankGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  const displayGrid = convertedGrid ? editorGrid : blankGrid;

  return (
    <div className={styles.playground}>
      <h1 className={styles.title}>Dot Matrix Playground</h1>
      <p className={styles.subtitle}>Test all dot matrix configurations</p>

      {/* Image Upload Section */}
      <div className={styles.customSection}>
        <h2>Image to Dot Matrix</h2>
        
        <div className={styles.editorLayout}>
          <div className={styles.controlsColumn}>
            <div className={styles.controls}>
              <div className={styles.uploadRow}>
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
              </div>

              <label>
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

              <label>
                Invert Colors:
                <input
                  type="checkbox"
                  checked={invertColors}
                  onChange={(e) => handleInvertColorsChange(e.target.checked)}
                />
              </label>

              <label>
                Dot Size: {imageDotSize}px
                <input 
                  type="range" 
                  min="0.1" 
                  max="16" 
                  step="0.1"
                  value={imageDotSize}
                  onChange={(e) => handleImageDotSizeChange(Number(e.target.value))}
                />
              </label>

              <label>
                Threshold: {threshold}%
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={threshold}
                  onChange={(e) => handleThresholdChange(Number(e.target.value))}
                />
              </label>

              <label>
                Fit Mode:
                <select value={fitMode} onChange={(e) => handleFitModeChange(e.target.value as 'stretch' | 'fit' | 'crop')}>
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
                    onChange={(e) => handlePadColorChange(e.target.value)}
                    className={styles.colorInput}
                  />
                </label>
              )}

              <div className={styles.buttonRow}>
                <button onClick={handleClear} disabled={!imageFile}>Clear</button>
                {convertedGrid && (
                  <button className={styles.primaryButton} onClick={handleDownload}>Download</button>
                )}
              </div>
              
              {(isConverting || hasPendingChanges) && (
                <div className={styles.loaderRow}>
                  <div className={styles.loader}>
                    <div className={styles.loaderBar} />
                  </div>
                  <span className={styles.loaderLabel}>
                    {isConverting ? 'Converting...' : 'Processing...'}
                  </span>
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
                  color: color as 'orange' | 'white' | 'green' | 'red' | 'black',
                  animation: 'static',
                  interactive: false,
                  imageGrid: displayGrid ?? undefined,
                  maxWidth: 600,
                }}
              />
              <div className={styles.gridInfo}>
                Grid: {gridSize}×{gridSize}{convertedGrid ? ` | Dots: ${convertedGrid.flat().filter(c => c.brightness > threshold / 100).length}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Editor */}
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
                  min="0.1" 
                  max="16" 
                  step="0.1"
                  value={editorDotSizeInput}
                  onChange={(e) => setEditorDotSizeInput(Number(e.target.value))}
                />
              </label>

              <label>
                Color:
                <select value={color} onChange={(e) => setColor(e.target.value as typeof color)}>
                  {colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              <label>
                Interactive:
                <input
                  type="checkbox"
                  checked={interactive}
                  onChange={(e) => setInteractive(e.target.checked)}
                />
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