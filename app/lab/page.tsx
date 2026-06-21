'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useEffect, useState, Suspense } from 'react';
import { EFFECTS } from '@/data/effects';
import { Toolbar } from '@/components/lab/Toolbar';
import { EffectGrid } from '@/components/lab/EffectGrid';
import { EmptyState } from '@/components/lab/EmptyState';
import { Drawer } from '@/components/lab/Drawer';
import { ParamPanel } from '@/components/lab/ParamPanel';
import { CodePanel } from '@/components/lab/CodePanel';

export default function LabPage() {
  return (
    <Suspense fallback={null}>
      <LabContent />
    </Suspense>
  );
}

function LabContent() {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get('q') || '').toLowerCase();
  const cat = params.get('cat') || 'all';
  const openId = params.get('open');
  const panel = params.get('panel') as 'code' | 'params' | null;

  const [, setTick] = useState(0);
  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener('popstate', h);
    return () => window.removeEventListener('popstate', h);
  }, []);

  const filtered = useMemo(() => EFFECTS.filter((e) => {
    if (cat !== 'all' && e.category !== cat) return false;
    if (q && !`${e.name} ${e.englishName} ${e.tags.join(' ')}`.toLowerCase().includes(q)) return false;
    return true;
  }), [q, cat]);

  const open = openId ? EFFECTS.find((e) => e.id === openId) : null;
  const close = () => {
    const p = new URLSearchParams(params.toString());
    p.delete('open'); p.delete('panel');
    router.replace(`/lab?${p.toString()}`);
  };

  return (
    <main>
      <Toolbar count={filtered.length} />
      {filtered.length === 0 ? <EmptyState /> : <EffectGrid effects={filtered} />}
      <Drawer open={!!open} onClose={close} title={open ? `${open.name} · ${open.englishName}` : ''}>
        {open && panel === 'code' && <CodePanel effect={open} />}
        {open && (panel === 'params' || !panel) && <ParamPanel effect={open} />}
      </Drawer>
    </main>
  );
}
