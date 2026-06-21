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
import { getAllLikes } from '@/lib/likes';

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
  const sort = params.get('sort') || 'default';
  const openId = params.get('open');
  const panel = params.get('panel') as 'code' | 'params' | null;

  const [likeMap, setLikeMap] = useState<Record<string, number>>({});
  const [, setTick] = useState(0);
  useEffect(() => {
    setLikeMap(getAllLikes());
    const h = () => setTick((t) => t + 1);
    const onLikes = () => setLikeMap(getAllLikes());
    window.addEventListener('popstate', h);
    window.addEventListener('likes-updated', onLikes);
    return () => {
      window.removeEventListener('popstate', h);
      window.removeEventListener('likes-updated', onLikes);
    };
  }, []);

  const filtered = useMemo(() => {
    const list = EFFECTS.filter((e) => {
      if (cat !== 'all' && e.category !== cat) return false;
      if (q && !`${e.name} ${e.englishName} ${e.tags.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === 'likes') {
      // 按点赞数降序；0 排最后（不是排最前）；相同点赞数按原顺序
      return list
        .map((e, i) => ({ e, i, likes: likeMap[e.id] ?? 0 }))
        .sort((a, b) => b.likes - a.likes || a.i - b.i)
        .map((x) => x.e);
    }
    return list;
  }, [q, cat, sort, likeMap]);

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
