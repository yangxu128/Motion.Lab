'use client';
import { MouseEvent, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './click-emoji-burst.module.css';
export default function ClickEmojiBurst({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const emojis = ['🎉','✨','⭐','💫','🌟','🎊'];
    const x = e.clientX - r.left, y = e.clientY - r.top;
    for (let i = 0; i < params.count; i++) {
      const s = document.createElement('span');
      s.className = styles.e;
      s.textContent = emojis[i % emojis.length];
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      el.appendChild(s);
      const ang = (i / params.count) * Math.PI * 2;
      const dist = 50 + Math.random() * 30;
      requestAnimationFrame(() => {
        s.style.transform = 'translate(' + Math.cos(ang) * dist + 'px, ' + Math.sin(ang) * dist + 'px) scale(0)';
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 750);
    }
  };
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['emoji-burst']} onClick={handleClick}>CLICK</div>
        <span className={styles.hint}>Click</span>
      </div>
    </PreviewFrame>
  );
}
