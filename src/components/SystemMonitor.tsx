'use client';

import { useState, useEffect } from 'react';
import { useMounted } from '@/hooks';
import styles from './SystemMonitor.module.scss';

interface StatItem {
  label: string;
  getValue: () => { value: number; text: string };
}

const generateRandomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const stats: StatItem[] = [
  {
    label: 'LOAD',
    getValue: () => {
      const val = generateRandomValue(20, 100);
      return { value: val, text: `${val}%` };
    },
  },
  {
    label: 'MEM',
    getValue: () => {
      const used = generateRandomValue(6, 16);
      return { value: Math.round((used / 16) * 100), text: `${used}G/16G` };
    },
  },
  {
    label: 'DISK',
    getValue: () => {
      const used = generateRandomValue(50, 256);
      return { value: Math.round((used / 256) * 100), text: `${used}G/256G` };
    },
  },
  {
    label: 'NET',
    getValue: () => {
      const up = generateRandomValue(1, 10);
      const down = generateRandomValue(1, 15);
      const total = up + down;
      return { value: Math.min(100, Math.round((total / 25) * 100)), text: `↑${up}MB ↓${down}MB` };
    },
  },
  {
    label: 'UPTIME',
    getValue: () => {
      const days = generateRandomValue(1, 30);
      const hours = generateRandomValue(0, 23);
      return { value: Math.min(100, Math.round((days * 24 + hours) / (30 * 24) * 100)), text: `${days}d ${hours}h` };
    },
  },
  {
    label: 'PROCS',
    getValue: () => {
      const procs = generateRandomValue(50, 200);
      return { value: Math.round((procs / 200) * 100), text: `${procs} proc` };
    },
  },
];

const STATIC_VALUE = { value: 50, text: '50%' };

export function SystemMonitor() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const mounted = useMounted();

  const currentStat = stats[currentIndex];
  const { value, text } = mounted ? currentStat.getValue() : STATIC_VALUE;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
      setAnimKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isFull = value >= 100;

  return (
    <div className={styles.content}>
      <div className={styles.stat}>
        <span className={styles.value}>{text}</span>
        <div className={styles.barContainer}>
          <div key={animKey} className={`${styles.bar} ${isFull ? styles.full : ''}`} />
        </div>
        <span className={styles.label}>{currentStat.label}</span>
      </div>
    </div>
  );
}
