'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './number-marquee.module.css';
export default function NumberMarquee({ params }: { params: { speed: number } }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cur = 0;
    const render = () => {
      let track = '';
      for (let i = 0; i < 10; i++) track += `<div>${i}</div>`;
      el.innerHTML = `<div class="${styles.track}" style="transform:translateY(-${cur * 60}px)">${track}</div>`;
      cur = (cur + 1) % 10;
    };
    render();
    const id = setInterval(render, params.speed);
    return () => clearInterval(id);
  }, [params.speed]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}><span ref={ref} className={styles.num} /></div>
    </PreviewFrame>
  );
}
