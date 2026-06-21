'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { CATEGORIES } from '@/data/effects';
import styles from './Toolbar.module.css';

export function Toolbar({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const cat = (params.get('cat') as any) || 'all';
  const q = params.get('q') || '';
  const [displayCount, setDisplayCount] = useState(count);

  const setParam = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.replace(`/lab?${p.toString()}`);
  }, [params, router]);

  useEffect(() => {
    let start: number | null = null;
    const from = displayCount;
    const to = count;
    if (from === to) return;
    const dur = 600;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayCount(Math.round(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <input className={styles.search} placeholder="搜索动效、标签…" defaultValue={q} onChange={(e) => setParam('q', e.target.value || null)} />
        <span className={styles.count}><span key={displayCount} className={styles.countNumber}>{displayCount}</span> 个</span>
      </div>
      <div className={styles.row}>
        <Tabs items={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} value={cat} onChange={(v) => setParam('cat', v === 'all' ? null : v)} />
      </div>
    </div>
  );
}
