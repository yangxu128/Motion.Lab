'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-magnetic-text.module.css';
export default function HoverMagneticText({ params }: { params: { strength: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll('span');
    const onMove = (e: MouseEvent) => {
      spans.forEach(s => {
        const r = s.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        if (d < 100) (s as HTMLElement).style.transform = 'translate(' + (dx * params.strength) + 'px, ' + (dy * params.strength) + 'px)';
        else (s as HTMLElement).style.transform = '';
      });
    };
    el.addEventListener('mousemove', onMove);
    const cleanup = () => { el.removeEventListener('mousemove', onMove); };
    return () => {
      cleanup();
    };
  }, [params.strength]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['mag-text']}><span>M</span><span>A</span><span>G</span><span>N</span><span>E</span><span>T</span><span>I</span><span>C</span></div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
