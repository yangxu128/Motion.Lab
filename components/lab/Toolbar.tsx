'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { CATEGORIES } from '@/data/effects';
import styles from './Toolbar.module.css';

type SortMode = 'default' | 'likes';

export function Toolbar({
  count,
  sort,
  onSortChange,
}: {
  count: number;
  sort: SortMode;
  onSortChange: (v: SortMode) => void;
}) {
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
        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>排序</span>
          <button
            className={`${styles.sortBtn} ${sort === 'default' ? styles.sortActive : ''}`}
            onClick={() => onSortChange('default')}
            aria-label="默认排序"
          >
            默认
          </button>
          <button
            className={`${styles.sortBtn} ${sort === 'likes' ? styles.sortActive : ''}`}
            onClick={() => onSortChange('likes')}
            aria-label="按点赞数排序"
          >
            <svg className={styles.sortIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            点赞
          </button>
        </div>
      </div>
    </div>
  );
}
