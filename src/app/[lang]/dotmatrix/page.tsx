'use client';

import { useState } from 'react';
import { DotMatrix, DotMatrixDecor, DotMatrixEditor } from '@/components/DotMatrix';
import styles from './dotmatrix.module.scss';

const sizes = [2, 4, 6, 8, 10, 12, 16, 20, 24] as const;
const colors = ['orange', 'white', 'green', 'red', 'black'] as const;
const animations = ['static', 'pulse', 'scan', 'trail', 'wave'] as const;

const decorativePresets = [
  { name: 'Arrow →', decorative: 'arrow-right' as const },
];

export default function DotMatrixPlayground() {
  const [dotSize, setDotSize] = useState(16);
  const [color, setColor] = useState<'orange' | 'white' | 'green' | 'red' | 'black'>('orange');
  const [animation, setAnimation] = useState<'static' | 'pulse' | 'scan' | 'trail' | 'wave'>('static');
  const [interactive, setInteractive] = useState(true);
  const [editorGrid, setEditorGrid] = useState<boolean[][] | null>(null);

  return (
    <div className={styles.playground}>
      <h1 className={styles.title}>Dot Matrix Playground</h1>
      <p className={styles.subtitle}>Test all dot matrix configurations</p>

      {/* Decorative Examples */}
      <div className={styles.presetGrid}>
        {decorativePresets.map((preset) => (
          <div key={preset.name} className={styles.presetExample}>
            <span className={styles.presetLabel}>{preset.name}</span>
            <DotMatrixDecor decorative={preset.decorative} dotSize={6} />
          </div>
        ))}
      </div>

      {/* Custom Config */}
      <div className={styles.customSection}>
        <h2>Interactive Editor</h2>
        
        <div className={styles.editorLayout}>
          <div className={styles.controlsColumn}>
            <div className={styles.controls}>
              <label>
                Dot Size:
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
            </div>
          </div>

          <div className={styles.editorColumn}>
            <DotMatrixEditor 
              initialSize={16} 
              dotSize={dotSize}
              onChange={setEditorGrid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}