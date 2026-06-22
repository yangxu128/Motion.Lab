'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/data/templates';
import styles from './templates.module.css';

const CATEGORY_LABEL: Record<string, string> = {
  marketing: '营销', product: '产品', auth: '认证', commerce: '电商', creative: '创意',
  brutalism: '新粗野', neumorphism: '拟物', cyberpunk: '赛博', y2k: 'Y2K',
  terminal: '终端', spatial: '空间', swiss: '瑞士', memphis: '孟菲斯',
};

// 动态加载预览组件（避开 SSR；每个卡片独立 lazy）
function useDynamic<T>(loader: () => Promise<{ default: T }>) {
  const [Comp, setComp] = useState<T | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 用 IntersectionObserver 懒加载
    const obs = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !Comp) {
          const m = await loader();
          setComp(() => m.default);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loader]);
  return { Comp, ref };
}

function TemplateCard({ tpl }: { tpl: typeof TEMPLATES[number] }) {
  const { Comp, ref } = useDynamic(tpl.preview);
  return (
    <Link href={`/templates/${tpl.id}`} className={styles.card}>
      <div className={styles.preview} ref={ref}>
        {Comp ? (
          <div className={styles.previewInner}>
            <Comp />
          </div>
        ) : (
          <div className={styles.previewLoading}>
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} />
          </div>
        )}
        <div className={styles.previewOverlay} aria-hidden>
          <span className={styles.overlayText}>↗ 在新窗口打开</span>
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaTop}>
          <span className={styles.catTag}>{CATEGORY_LABEL[tpl.category] || tpl.category}</span>
          <span className={styles.idTag}>{tpl.englishName}</span>
        </div>
        <h3 className={styles.name}>{tpl.name}</h3>
        <p className={styles.desc}>{tpl.description}</p>
        <div className={styles.effects}>
          {tpl.effects.slice(0, 5).map((id) => (
            <span key={id} className={styles.effectChip}>{id}</span>
          ))}
          {tpl.effects.length > 5 && (
            <span className={styles.effectChip}>+{tpl.effects.length - 5}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function TemplatesPage() {
  const [cat, setCat] = useState<string>('all');
  const filtered = useMemo(
    () => cat === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === cat),
    [cat]
  );
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <span className={styles.kicker}>Templates · 整页模板</span>
        <h1 className={styles.title}>
          <span className={styles.titleLine}>动效组合</span>
          <span className={styles.titleAccent}>完整页面参考</span>
        </h1>
        <p className={styles.lede}>
          5 套由 {TEMPLATES.reduce((s, t) => s + t.effects.length, 0)} 个动效组合而成的整页模板，覆盖营销、产品、认证、电商、创意五大场景。<br />
          点击进入全屏预览，也可作为新项目的起点。
        </p>
        <div className={styles.tabs} role="tablist">
          {TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              data-active={cat === c.id}
              onClick={() => setCat(c.id)}
              className={styles.tab}
            >
              {c.name}
            </button>
          ))}
        </div>
      </header>

      <section className={styles.grid}>
        {filtered.map((t) => (
          <TemplateCard key={t.id} tpl={t} />
        ))}
      </section>

      <section className={styles.bottomHint}>
        <span className={styles.bottomHintText}>
          点击任意卡片 → 进入全屏预览；右上角有"在新窗口打开"按钮
        </span>
      </section>
    </main>
  );
}
