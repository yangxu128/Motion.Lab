'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './scroll-reveal.module.css';
export default function ScrollReveal({ params }: { params: { distance: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translateY(' + params.distance + 'px)';
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) {
        el.classList.add(styles.in);
        el.style.transform = '';
      }
    }), { threshold: 0.2 });
    io.observe(el);
    const cleanup = () => { io.disconnect(); };
    return () => {
      cleanup();
    };
  }, [params.distance]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['scroll-reveal']}>REVEAL ON SCROLL</div>
        <span className={styles.hint}>Scroll</span>
      </div>
    </PreviewFrame>
  );
}
