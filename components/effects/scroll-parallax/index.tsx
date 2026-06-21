'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './scroll-parallax.module.css';
export default function ScrollParallax({ params }: { params: { speed: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const layers = el.querySelectorAll('[data-d]');
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const y = r.top;
      layers.forEach(l => {
        const d = parseFloat(l.getAttribute('data-d') || '0.5');
        (l as HTMLElement).style.transform = 'translateY(' + (y * d * params.speed) + 'px)';
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    const cleanup = () => { window.removeEventListener('scroll', onScroll); };
    return () => {
      cleanup();
    };
  }, [params.speed]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['scroll-parallax']}><div data-d="0.3" className={styles.layer}>BACK</div><div data-d="0.6" className={styles.layer}>MID</div><div data-d="1" className={styles.layer}>FRONT</div></div>
        <span className={styles.hint}>Scroll</span>
      </div>
    </PreviewFrame>
  );
}
