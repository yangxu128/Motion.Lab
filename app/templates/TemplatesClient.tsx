'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  TEMPLATES,
  SCENE_CATEGORIES,
  STYLE_CATEGORIES,
  CATEGORY_LABEL,
} from '@/data/templates';
import styles from './templates.module.css';

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

export function TemplatesClient() {
  // 两层筛选：scene（主分类，固定 6 个）+ style（风格 chip 横向滚动）
  const [scene, setScene] = useState<string>('all');
  const [style, setStyle] = useState<string>('all');

  // 风格 chip 行的滚动控制
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scrollBy = (dx: number) => {
    trackRef.current?.scrollBy({ left: dx, behavior: 'smooth' });
  };

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchScene = scene === 'all' || t.category === scene;
      const matchStyle = style === 'all' || t.category === style;
      // 任一筛选命中即显示（union），全部=all 时只看 scene
      if (scene === 'all' && style === 'all') return true;
      if (scene === 'all') return matchStyle;
      if (style === 'all') return matchScene;
      return matchScene || matchStyle;
    });
  }, [scene, style]);

  const reset = () => {
    setScene('all');
    setStyle('all');
  };

  const hasFilter = scene !== 'all' || style !== 'all';

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <span className={styles.kicker}>Templates · 整页模板</span>
        <h1 className={styles.title}>
          <span className={styles.titleLine}>动效组合</span>
          <span className={styles.titleAccent}>完整页面参考</span>
        </h1>
        <p className={styles.lede}>
          {TEMPLATES.length} 套由 {TEMPLATES.reduce((s, t) => s + t.effects.length, 0)} 个动效组合而成的整页模板，覆盖营销、产品、认证、电商、创意五大场景。<br />
          点击进入全屏预览，也可作为新项目的起点。
        </p>

        {/* 主分类 tab：固定 6 个，永远不增长 */}
        <div className={styles.tabs} role="tablist" aria-label="主分类">
          {SCENE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              data-active={scene === c.id}
              onClick={() => setScene(c.id)}
              className={styles.tab}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 风格 chip：横向滚动，物理上限固定（1 行） */}
        <div className={styles.styleRow} aria-label="风格筛选">
          <span className={styles.styleLabel}>风格</span>
          <div className={styles.styleViewport}>
            {canScrollLeft && (
              <button
                type="button"
                aria-label="向左滚动"
                className={`${styles.scrollBtn} ${styles.scrollBtnLeft}`}
                onClick={() => scrollBy(-240)}
              >
                ‹
              </button>
            )}
            <div className={styles.styleTrack} ref={trackRef}>
              <button
                type="button"
                data-active={style === 'all'}
                onClick={() => setStyle('all')}
                className={styles.chip}
              >
                全部风格
              </button>
              {STYLE_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-active={style === c.id}
                  onClick={() => setStyle(c.id)}
                  className={styles.chip}
                >
                  {c.name}
                </button>
              ))}
            </div>
            {canScrollRight && (
              <button
                type="button"
                aria-label="向右滚动"
                className={`${styles.scrollBtn} ${styles.scrollBtnRight}`}
                onClick={() => scrollBy(240)}
              >
                ›
              </button>
            )}
          </div>
        </div>

        {hasFilter && (
          <div className={styles.filterStatus}>
            <span className={styles.filterCount}>
              {filtered.length} / {TEMPLATES.length} 个模板
            </span>
            <button type="button" onClick={reset} className={styles.resetBtn}>
              重置筛选 ×
            </button>
          </div>
        )}
      </header>

      <section className={styles.grid}>
        {filtered.length > 0 ? (
          filtered.map((t) => <TemplateCard key={t.id} tpl={t} />)
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>∅</div>
            <div className={styles.emptyText}>该筛选下暂无模板</div>
            <button type="button" onClick={reset} className={styles.emptyReset}>
              重置筛选
            </button>
          </div>
        )}
      </section>

      <section className={styles.bottomHint}>
        <span className={styles.bottomHintText}>
          点击任意卡片 → 进入全屏预览；右上角有"在新窗口打开"按钮
        </span>
      </section>
    </main>
  );
}
