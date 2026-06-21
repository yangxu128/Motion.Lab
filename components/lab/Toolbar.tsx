'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { CATEGORIES } from '@/data/effects';
import styles from './Toolbar.module.css';
export function Toolbar({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const cat = (params.get('cat') as any) || 'all';
  const q = params.get('q') || '';
  const setParam = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.replace(`/lab?${p.toString()}`);
  }, [params, router]);
  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <input className={styles.search} placeholder="搜索动效、标签…" defaultValue={q} onChange={(e) => setParam('q', e.target.value || null)} />
        <span className={styles.count}>{count} 个</span>
      </div>
      <div className={styles.row}>
        <Tabs items={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} value={cat} onChange={(v) => setParam('cat', v === 'all' ? null : v)} />
      </div>
    </div>
  );
}
