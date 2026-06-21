'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Effect } from '@/data/effects';
import { EffectCard } from './EffectCard';
import styles from './EffectGrid.module.css';

export function EffectGrid({ effects }: { effects: Effect[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('[data-category]');
    if (!cards || cards.length === 0) return;
    // 仅首次挂载播入场动画；后续 sort/filter 切换直接展示
    if (!isFirstRender.current) return;
    isFirstRender.current = false;
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.02, duration: 0.4, ease: 'power3.out' }
    );
  }, [effects]);

  return <div className={styles.grid} ref={gridRef}>{effects.map((e) => <EffectCard key={e.id} effect={e} />)}</div>;
}
