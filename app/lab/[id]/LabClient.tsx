'use client';
import { useEffect, useState } from 'react';
import { EFFECTS } from '@/data/effects';
import { Toolbar } from '@/components/lab/Toolbar';
import { EffectGrid } from '@/components/lab/EffectGrid';
import { Drawer } from '@/components/lab/Drawer';
import { ParamPanel } from '@/components/lab/ParamPanel';
import { CodePanel } from '@/components/lab/CodePanel';
export function LabClient({ id }: { id: string }) {
  const effect = EFFECTS.find((e) => e.id === id)!;
  const [panel, setPanel] = useState<'params' | 'code'>('params');
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setPanel((p.get('panel') as any) || 'params');
  }, []);
  return (
    <main>
      <Toolbar count={EFFECTS.length} />
      <EffectGrid effects={EFFECTS} />
      <Drawer open onClose={() => history.back()} title={`${effect.name} · ${effect.englishName}`}>
        {panel === 'code' ? <CodePanel effect={effect} /> : <ParamPanel effect={effect} />}
      </Drawer>
    </main>
  );
}
