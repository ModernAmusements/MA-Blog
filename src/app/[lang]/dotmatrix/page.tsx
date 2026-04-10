'use client';

import { useState } from 'react';
import { DotMatrix, DotMatrixDecor } from '@/components/DotMatrix';
import styles from './dotmatrix.module.scss';

const sizes = [2, 4, 6, 8, 10] as const;
const colors = ['orange', 'white', 'green', 'red', 'black'] as const;
const animations = ['static', 'pulse', 'scan', 'trail', 'wave'] as const;

const decorativePresets = [
  { name: 'Arrow →', decorative: 'arrow-right' as const },
  { name: 'Arrow ←', decorative: 'arrow-left' as const },
  { name: 'Wave', decorative: 'wave' as const },
  { name: 'Grid', decorative: 'grid' as const },
  { name: 'Heart', decorative: 'heart' as const },
];

export default function DotMatrixPlayground() {
  const [customMessage, setCustomMessage] = useState('HELLO');
  const [dotSize, setDotSize] = useState(4);
  const [color, setColor] = useState<'orange' | 'white' | 'green' | 'red' | 'black'>('black');
  const [animation, setAnimation] = useState<'static' | 'pulse' | 'scan' | 'trail' | 'wave'>('static');
  const [interactive, setInteractive] = useState(true);
  const [cols, setCols] = useState(20);
  const [rows, setRows] = useState(7);

  return (
    <div className={styles.playground}>
      <h1 className={styles.title}>Dot Matrix Playground</h1>
      <p className={styles.subtitle}>Test all dot matrix configurations</p>

      {/* Decorative Examples */}
      <div className={styles.presetGrid}>
        {decorativePresets.map((preset) => (
          <div key={preset.name} className={styles.presetExample}>
            <span className={styles.presetLabel}>{preset.name}</span>
            <DotMatrixDecor decorative={preset.decorative} dotSize={8} />
          </div>
        ))}
      </div>

      {/* Custom Config */}
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
  );
}