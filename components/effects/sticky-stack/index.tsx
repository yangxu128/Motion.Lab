'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './sticky-stack.module.css';
const COLORS = ['hsl(0 80% 60%)', 'hsl(40 90% 60%)', 'hsl(80 80% 55%)', 'hsl(160 80% 50%)', 'hsl(220 80% 60%)', 'hsl(280 80% 60%)', 'hsl(320 80% 60%)', 'hsl(180 80% 50%)'];
export default function StickyStack({ params }: { params: { count: number } }) {
  const stackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const cards = Array.from(stack.querySelectorAll<HTMLDivElement>(`.${styles.card}`));
    cards.forEach((card, i) => {
      card.style.top = `${8 + i * 4}px`;
      card.style.zIndex = String(i + 1);
    });
  }, [params.count]);
  const count = Math.max(3, Math.min(8, Math.round(params.count)));
  return (
    <PreviewFrame style={{ padding: 0, overflow: 'hidden', height: 280 }}>
      <div ref={stackRef} className={styles.stack}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={styles.card} style={{ background: COLORS[i % COLORS.length], top: 8 + i * 4 }}>
            {i + 1}
          </div>
        ))}
      </div>
      <span className={styles.hint}>Scroll</span>
    </PreviewFrame>
  );
}
