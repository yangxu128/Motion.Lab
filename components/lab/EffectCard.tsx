'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Effect } from '@/data/effects';
import styles from './EffectCard.module.css';
export function EffectCard({ effect }: { effect: Effect }) {
  const [params] = useState<Record<string, any>>(() => {
    const p: Record<string, any> = {}; effect.params.forEach((p2) => (p[p2.key] = p2.default)); return p;
  });
  const [key, setKey] = useState(0);
  const [lastReplay, setLastReplay] = useState(0);
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
  return (
    <div className={styles.card}>
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
          <Button onClick={replay}>▶ 重播</Button>
          <Button onClick={() => openPanel('params')}>⚙ 调参</Button>
          <Button onClick={() => openPanel('code')}>{'</>'} 代码</Button>
        </div>
      </div>
    </div>
  );
}
