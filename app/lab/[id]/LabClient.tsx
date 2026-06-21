'use client';
import { useEffect, useState, useCallback } from 'react';
import { EFFECTS } from '@/data/effects';
import { Toolbar } from '@/components/lab/Toolbar';
import { EffectGrid } from '@/components/lab/EffectGrid';
import { Drawer } from '@/components/lab/Drawer';
import { ParamPanel } from '@/components/lab/ParamPanel';
import { CodePanel } from '@/components/lab/CodePanel';

const SORT_KEY = 'motionlab:sort';
type SortMode = 'default' | 'likes';
function readSort(): SortMode {
  if (typeof window === 'undefined') return 'default';
  try {
    const v = sessionStorage.getItem(SORT_KEY);
    return v === 'likes' ? 'likes' : 'default';
  } catch { return 'default'; }
}

export function LabClient({ id }: { id: string }) {
  const effect = EFFECTS.find((e) => e.id === id)!;
  const [panel, setPanel] = useState<'params' | 'code'>('params');
  const [sort, setSort] = useState<SortMode>('default');
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setPanel((p.get('panel') as any) || 'params');
    setSort(readSort());
  }, []);
  const onSortChange = useCallback((v: SortMode) => {
    setSort(v);
    try { sessionStorage.setItem(SORT_KEY, v); } catch { /* noop */ }
  }, []);
  return (
    <main>
      <Toolbar count={EFFECTS.length} sort={sort} onSortChange={onSortChange} />
      <EffectGrid effects={EFFECTS} />
      <Drawer open onClose={() => history.back()} title={`${effect.name} · ${effect.englishName}`}>
        {panel === 'code' ? <CodePanel effect={effect} /> : <ParamPanel effect={effect} />}
      </Drawer>
    </main>
  );
}
