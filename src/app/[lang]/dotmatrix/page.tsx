'use client';

import { useState } from 'react';
import { DotMatrix, DotMatrixPulse, DotMatrixScan, DotMatrixWave, DotMatrixTrail, DotMatrixDecor } from '@/components/DotMatrix';
import styles from './dotmatrix.module.scss';

const presets: { name: string; component: React.ComponentType<any>; props: Record<string, any> }[] = [
  { name: 'Pulse', component: DotMatrixPulse, props: { cols: 20, rows: 7, message: 'PULSE' } },
  { name: 'Scan', component: DotMatrixScan, props: { cols: 24, rows: 7, message: 'SCAN' } },
  { name: 'Wave', component: DotMatrixWave, props: { cols: 18, rows: 7, message: 'WAVE' } },
  { name: 'Trail', component: DotMatrixTrail, props: { cols: 24, rows: 7, message: 'TRAIL' } },
  { name: 'Arrow →', component: DotMatrixDecor, props: { decorative: 'arrow-right' as const } },
  { name: 'Arrow ←', component: DotMatrixDecor, props: { decorative: 'arrow-left' as const } },
  { name: 'Wave Dec', component: DotMatrixDecor, props: { decorative: 'wave' as const } },
  { name: 'Grid', component: DotMatrixDecor, props: { decorative: 'grid' as const } },
  { name: 'Heart', component: DotMatrixDecor, props: { decorative: 'heart' as const } },
];

const sizes = [4, 6, 8] as const;
const colors = ['orange', 'white', 'green', 'red'] as const;
const animations = ['static', 'pulse', 'scan', 'trail', 'wave'] as const;

export default function DotMatrixPlayground() {
  const [activePreset, setActivePreset] = useState(0);
  const [customMessage, setCustomMessage] = useState('HELLO');
  const [dotSize, setDotSize] = useState(6);
  const [color, setColor] = useState<'orange' | 'white' | 'green' | 'red'>('orange');
  const [animation, setAnimation] = useState<'static' | 'pulse' | 'scan' | 'trail' | 'wave'>('static');
  const [interactive, setInteractive] = useState(true);
  const [cols, setCols] = useState(20);
  const [rows, setRows] = useState(7);

  const PresetComponent = presets[activePreset].component;

  return (
    <div className={styles.playground}>
      <h1 className={styles.title}>Dot Matrix Playground</h1>
      <p className={styles.subtitle}>Test all dot matrix configurations</p>

      {/* Preview Area */}
      <div className={styles.preview}>
        {/* Preset Previews */}
        <div className={styles.presetGrid}>
          {presets.map((preset, i) => (
            <button
              key={preset.name}
              className={`${styles.presetButton} ${activePreset === i ? styles.active : ''}`}
              onClick={() => setActivePreset(i)}
            >
              <preset.component {...preset.props} />
            </button>
          ))}
        </div>

        {/* Custom Configuration */}
        <div className={styles.customSection}>
          <h2>Custom Config</h2>
          
          <div className={styles.controls}>
            <label>
              Message:
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value.toUpperCase().slice(0, 12))}
                maxLength={12}
              />
            </label>

            <label>
              Size:
              <select value={dotSize} onChange={(e) => setDotSize(Number(e.target.value))}>
                {sizes.map(s => <option key={s} value={s}>{s}px</option>)}
              </select>
            </label>

            <label>
              Color:
              <select value={color} onChange={(e) => setColor(e.target.value as typeof color)}>
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>

            <label>
              Animation:
              <select value={animation} onChange={(e) => setAnimation(e.target.value as typeof animation)}>
                {animations.map(a => <option key={a} value={a}>{a}</option>)}
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

            <label>
              Grid:
              <input
                type="number"
                value={cols}
                min={5}
                max={40}
                onChange={(e) => setCols(Number(e.target.value))}
              />
              x
              <input
                type="number"
                value={rows}
                min={5}
                max={14}
                onChange={(e) => setRows(Number(e.target.value))}
              />
            </label>
          </div>

          {/* Custom Preview */}
          <div className={styles.customPreview}>
            <DotMatrix
              config={{
                cols,
                rows,
                dotSize: dotSize as 4 | 6 | 8,
                color,
                animation,
                interactive,
                message: customMessage,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}