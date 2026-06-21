'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './scroll-progress.module.css';
export default function ScrollProgress({ params }: { params: { height: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bar = el.querySelector('[data-bar]') as HTMLElement;
    bar.style.height = params.height + 'px';
    const scroller = el.parentElement!;
    const onScroll = () => {
      const p = scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight || 1);
      bar.style.width = (p * 100) + '%';
    };
    scroller.addEventListener('scroll', onScroll);
    const cleanup = () => { scroller.removeEventListener('scroll', onScroll); };
    return () => {
      cleanup();
    };
  }, [params.height]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['scroll-progress']}><div data-bar className={styles.bar}></div><div className={styles.spacer}>Scroll Me ↓</div><div className={styles.spacer}>Keep Going ↓</div><div className={styles.spacer}>End</div></div>
        <span className={styles.hint}>Scroll</span>
      </div>
    </PreviewFrame>
  );
}
