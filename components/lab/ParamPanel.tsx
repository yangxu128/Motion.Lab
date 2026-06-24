'use client';
import dynamic from 'next/dynamic';
import { ComponentType, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import type { Effect } from '@/data/effects';
import styles from './ParamPanel.module.css';

type PreviewProps = Record<string, string | number>;

// 模块级缓存：避免每次 params 变化都重建 dynamic 组件（导致预览树卸载/重挂）
const previewCache = new Map<string, ComponentType<{ params: PreviewProps }>>();
function getPreview(effect: Effect): ComponentType<{ params: PreviewProps }> {
  let Comp = previewCache.get(effect.id);
  if (!Comp) {
    Comp = dynamic(effect.preview, { ssr: false });
    previewCache.set(effect.id, Comp);
  }
  return Comp;
}

export function ParamPanel({ effect }: { effect: Effect }) {
  const [params, setParams] = useState<Record<string, any>>(() => {
    const p: Record<string, any> = {}; effect.params.forEach((p2) => (p[p2.key] = p2.default)); return p;
  });
  const Preview = getPreview(effect);
  const update = (k: string, v: any) => setParams((p) => ({ ...p, [k]: v }));
  return (
    <div className={styles.panel}>
      <div className={styles.preview}><Preview key={JSON.stringify(params)} params={params} /></div>
      <div className={styles.params}>
        {effect.params.map((param) => (
          param.kind === 'range' ? (
            <Slider key={param.key} label={param.label} min={param.min} max={param.max} step={param.step} value={params[param.key]} onChange={(v) => update(param.key, v)} unit={param.unit} />
          ) : (
            <div key={param.key}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{param.label}</div>
              <select value={params[param.key]} onChange={(e) => update(param.key, e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8 }}>
                {param.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
