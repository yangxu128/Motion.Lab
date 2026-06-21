'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/Button';
import type { Effect } from '@/data/effects';
import styles from './EffectCard.module.css';

export function EffectCard({ effect }: { effect: Effect }) {
  const [params] = useState<Record<string, any>>(() => {
    const p: Record<string, any> = {}; effect.params.forEach((p2) => (p[p2.key] = p2.default)); return p;
  });
  const [key, setKey] = useState(0);
  const [lastReplay, setLastReplay] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const Preview = dynamic(effect.preview, { ssr: false, loading: () => <div style={{ opacity: 0.3 }}>…</div> });
  const replay = () => {
    if (Date.now() - lastReplay < 2000) return;
    setKey((k) => k + 1); setLastReplay(Date.now());
  };
  const openPanel = (panel: 'code' | 'params') => {
    const url = new URL(window.location.href);
    url.searchParams.set('open', effect.id); url.searchParams.set('panel', panel);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
      gsap.to(el, { rotateX: -y * 4, rotateY: x * 4, transformPerspective: 1000, duration: 0.3, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, original: () => void) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
    original();
  };

  return (
    <div className={styles.card} ref={cardRef} data-category={effect.category}>
      <div className={styles.preview} onMouseEnter={replay}><Preview key={key} params={params} /></div>
      <div className={styles.body}>
        <div>
          <div className={styles.title}>{effect.name}</div>
          <div className={styles.desc}>{effect.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {effect.tags.slice(0, 2).map((t) => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
        <div className={styles.actions}>
          <Button onClick={(e: any) => handleButtonClick(e, replay)}>▶ 重播</Button>
          <Button onClick={(e: any) => handleButtonClick(e, () => openPanel('params'))}>⚙ 调参</Button>
          <Button onClick={(e: any) => handleButtonClick(e, () => openPanel('code'))}>{'</>'} 代码</Button>
        </div>
      </div>
    </div>
  );
}
