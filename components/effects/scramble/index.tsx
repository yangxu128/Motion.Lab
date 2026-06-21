'use client';
import { useEffect, useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './scramble.module.css';
const TARGET = 'SCRAMBLE';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%';
const TOTAL_FRAMES = TARGET.length * 3;
export default function Scramble({ params }: { params: { duration: number } }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let frame = 0;
    setOut('');
    const totalMs = params.duration * 1000;
    const tickMs = Math.max(20, totalMs / TOTAL_FRAMES);
    const id = setInterval(() => {
      frame++;
      setOut(
        TARGET.split('').map((c, i) =>
          i < frame / 3 ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('')
      );
      if (frame > TOTAL_FRAMES) clearInterval(id);
    }, tickMs);
    return () => clearInterval(id);
  }, [params.duration]);
  return <PreviewFrame><span className={styles.scramble}>{out}</span></PreviewFrame>;
}
