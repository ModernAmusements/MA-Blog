'use client';

import { useState, useEffect, useCallback } from 'react';
import { DotMatrix, DotMatrixEditor, convertImageToDotMatrix, createGIF } from '@/components/DotMatrix';
import type { DotCell } from '@/components/DotMatrix';
import { ANIMATIONS, AnimationType } from '@/components/DotMatrix/animations/presets';
import styles from './dotmatrix.module.scss';

const ANIMATION_TYPES = Object.keys(ANIMATIONS) as AnimationType[];

const GRID_SIZES = [8, 16, 32, 64, 128] as const;
const COLORS = ['orange', 'white', 'green', 'red', 'black'] as const;

export default function DotMatrixPlayground() {
  const [color, setColor] = useState<'orange' | 'white' | 'green' | 'red' | 'black'>('orange');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<DotCell[][] | null>(null);
  const [imageGrid, setImageGrid] = useState<boolean[][] | null>(null);
  const [useShades, setUseShades] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [gridSize, setGridSize] = useState<8 | 16 | 32 | 64 | 128>(16);
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>('reveal');
  const [isAnimating, setIsAnimating] = useState(false);
  const [invertColors, setInvertColors] = useState(false);

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
       setIsAnimating(false);
       setImageData(null);
       setImageGrid(null);
       const url = URL.createObjectURL(file);
       setImageDataUrl(url);
       e.target.value = '';
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
         
         // Store the full result with brightness data
         setImageData(result);
         
         // Also create boolean grid for backward compatibility
         const thresholdValue = threshold / 100;
         let boolGrid = result.map(row =>
           row.map(cell => cell.brightness > thresholdValue)
         );
         
         if (invertColors) {
           boolGrid = boolGrid.map(row => row.map(v => !v));
         }
         
         setImageGrid(boolGrid);
         
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
  }, [imageDataUrl, gridSize, imageDotSize, threshold, fitMode, padColor, invertColors]);

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
     setImageData(null);
     setImageGrid(null);
     setIsAnimating(false);
   }, [imageDataUrl]);

    const handleDownload = useCallback(async () => {
      if (!imageData) return;

      // If animation is active, create GIF
      if (isAnimating && selectedAnimation !== 'static') {
         try {
           // Import animation presets
           const { ANIMATIONS } = await import('@/components/DotMatrix/animations/presets');
           
           const animationCreator = ANIMATIONS[selectedAnimation];
           if (!animationCreator) {
             throw new Error(`Unknown animation: ${selectedAnimation}`);
           }
          
          const animation = animationCreator(gridSize, gridSize);
          const thresholdValue = threshold / 100;
          
          // Create GIF using animation frames - combine image with animation
          const gifBytes = createGIF(gridSize, gridSize, (t) => {
            const animFrame = animation.frame(t % animation.duration);
            // Apply animation mask to image - only show dot if BOTH image has it AND animation reveals it
            return animFrame.map((row, y) => 
              row.map((cell, x) => {
                const brightness = imageData[y]?.[x]?.brightness ?? 0;
                return (brightness > thresholdValue && cell) ? 1 : 0;
              })
            );
          }, 30);
         
          // Create blob and download
          const blob = new Blob([new Uint8Array(gifBytes)], { type: 'image/gif' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.download = `dotmatrix-${selectedAnimation}-${gridSize}x${gridSize}.gif`;
         link.href = url;
         link.click();
         
         // Clean up
         setTimeout(() => {
           URL.revokeObjectURL(url);
         }, 100);
       } catch (error) {
         console.error('Failed to create GIF:', error);
         alert('Failed to create GIF. Please try again.');
       }
     } else {
       // Static PNG download - use brightness data for shades when enabled
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
           if (imageData[y]?.[x]) {
             // Calculate fill style based on brightness and color
             const brightness = imageData[y][x].brightness;
             let fillStyle = '';
             
             if (useShades) {
               // Create shade based on brightness and selected color
               switch (color) {
                 case 'orange':
                   // Orange: rgb(249, 115, 22)
                   const r = Math.floor(249 * brightness);
                   const g = Math.floor(115 * brightness);
                   const b = Math.floor(22 * brightness);
                   fillStyle = `rgb(${r},${g},${b})`;
                   break;
                 case 'white':
                   // White: rgb(255, 255, 255)
                   const val = Math.floor(255 * brightness);
                   fillStyle = `rgb(${val},${val},${val})`;
                   break;
                 case 'green':
                   // Green: rgb(34, 197, 94)
                   const r2 = Math.floor(34 * brightness);
                   const g2 = Math.floor(197 * brightness);
                   const b2 = Math.floor(94 * brightness);
                   fillStyle = `rgb(${r2},${g2},${b2})`;
                   break;
                 case 'red':
                   // Red: rgb(239, 68, 68)
                   const r3 = Math.floor(239 * brightness);
                   const g3 = Math.floor(68 * brightness);
                   const b3 = Math.floor(68 * brightness);
                   fillStyle = `rgb(${r3},${g3},${b3})`;
                   break;
                 case 'black':
                   // Black: rgb(0, 0, 0) - always black regardless of brightness
                   fillStyle = 'rgb(0,0,0)';
                   break;
                 default:
                   // Default to orange
                   const r4 = Math.floor(249 * brightness);
                   const g4 = Math.floor(115 * brightness);
                   const b4 = Math.floor(22 * brightness);
                   fillStyle = `rgb(${r4},${g4},${b4})`;
                   break;
               }
             } else {
               // Binary mode - use full color if brightness > 0.5
               fillStyle = brightness > 0.5 ? 
                 (() => {
                   switch (color) {
                     case 'orange': return '#f97316';
                     case 'white': return '#ffffff';
                     case 'green': return '#22c55e';
                     case 'red': return '#ef4444';
                     case 'black': return '#000000';
                     default: return '#f97316';
                   }
                 })() : '#000000';
             }
             
             ctx.fillStyle = fillStyle;
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
     }
   }, [imageData, gridSize, isAnimating, selectedAnimation, color, useShades]);

  const displayDotSize = (() => {
    if (imageDotSize >= 1) {
      return imageDotSize;
    }
    const base = containerWidth / gridSize;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const max = isMobile ? 16 : 12;
    const min = isMobile ? 4 : 2;
    return Math.max(min, Math.min(max, Math.round(base)));
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
                  min="1"
                  max="16"
                  step="1"
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
                 Animation:
                 <select value={selectedAnimation} onChange={(e) => setSelectedAnimation(e.target.value as AnimationType)}>
                   {ANIMATION_TYPES.map(anim => (
                     <option key={anim} value={anim}>{anim}</option>
                   ))}
                 </select>
               </label>

               <label>
                 Use Shades: 
                 <input
                   type="checkbox"
                   checked={useShades}
                   onChange={(e) => setUseShades(e.target.checked)}
                 />
                </label>

                <label>
                  Invert Colors: 
                  <input
                    type="checkbox"
                    checked={invertColors}
                    onChange={(e) => setInvertColors(e.target.checked)}
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
                {imageGrid && selectedAnimation !== 'static' && (
                  <button 
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={isAnimating ? styles.stopButton : styles.startButton}
                  >
                    {isAnimating ? 'Stop' : 'Start'}
                  </button>
                )}
                <button onClick={handleClear} disabled={!imageFile}>Clear</button>
                {imageGrid && isAnimating && selectedAnimation !== 'static' && (
                  <button className={styles.primaryButton} onClick={handleDownload}>Download GIF</button>
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
                  interactive: false,
                  imageData: useShades && imageData ? imageData : undefined,
                  imageGrid: imageGrid ?? blankGrid,
                }}
                animatePulse={isAnimating}
                animation={isAnimating ? selectedAnimation : 'static'}
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