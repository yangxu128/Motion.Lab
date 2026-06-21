'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './click-burst.module.css';
export default function ClickBurst({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    for (let i = 0; i < params.count; i++) {
      const p = document.createElement('span');
      const ang = (i / params.count) * Math.PI * 2;
      const dist = 40 + Math.random() * 30;
      p.className = styles.p;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.background = `hsl(${Math.random() * 360} 90% 60%)`;
      p.style.transition = 'all 0.6s cubic-bezier(0.2,0.8,0.2,1)';
      el.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 700);
    }
  };
  return (
    <PreviewFrame>
      <div ref={ref} className={styles.zone} onClick={onClick}>CLICK ANYWHERE</div>
    </PreviewFrame>
  );
}
