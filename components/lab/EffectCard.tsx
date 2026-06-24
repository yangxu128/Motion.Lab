'use client';
import dynamic from 'next/dynamic';
import { ComponentType, useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/Button';
import type { Effect } from '@/data/effects';
import { getAllLikes, like } from '@/lib/likes';
import styles from './EffectCard.module.css';

type PreviewProps = Record<string, string | number>;

// 模块级缓存：避免每次渲染都重建 dynamic 组件（160 张卡片性能关键）
const previewCache = new Map<string, ComponentType<{ params: PreviewProps }>>();
const loadingFallback = () => <div style={{ opacity: 0.3 }}>…</div>;

function getPreview(effect: Effect): ComponentType<{ params: PreviewProps }> {
  let Comp = previewCache.get(effect.id);
  if (!Comp) {
    Comp = dynamic(effect.preview, { ssr: false, loading: loadingFallback });
    previewCache.set(effect.id, Comp);
  }
  return Comp;
}

export function EffectCard({ effect }: { effect: Effect }) {
  const [params] = useState<PreviewProps>(() => {
    const p: PreviewProps = {};
    effect.params.forEach((param) => (p[param.key] = param.default));
    return p;
  });
  const [key, setKey] = useState(0);
  const [lastReplay, setLastReplay] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Preview = getPreview(effect);

  useEffect(() => {
    const m = getAllLikes();
    setLikes(m[effect.id] ?? 0);
    setLiked(!!m[effect.id]);
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string; count: number };
      if (detail.id === effect.id) {
        setLikes(detail.count);
        setBouncing(true);
        setTimeout(() => setBouncing(false), 500);
      }
    };
    window.addEventListener('likes-updated', onUpdate);
    return () => window.removeEventListener('likes-updated', onUpdate);
  }, [effect.id]);

  const replay = useCallback(() => {
    if (Date.now() - lastReplay < 2000) return;
    setKey((k) => k + 1);
    setLastReplay(Date.now());
  }, [lastReplay]);

  const openPanel = useCallback((panel: 'code' | 'params') => {
    const url = new URL(window.location.href);
    url.searchParams.set('open', effect.id);
    url.searchParams.set('panel', panel);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [effect.id]);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return;
    setLiked(true);
    like(effect.id);
    // 触发飞心动画
    if (cardRef.current) {
      const btn = cardRef.current.querySelector(`.${styles.likeBtn}`) as HTMLElement | null;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const cRect = cardRef.current.getBoundingClientRect();
        const heart = document.createElement('span');
        heart.className = styles.flyHeart;
        heart.textContent = '❤';
        heart.style.left = `${rect.left - cRect.left + rect.width / 2}px`;
        heart.style.top = `${rect.top - cRect.top + rect.height / 2}px`;
        cardRef.current.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
      }
    }
  }, [effect.id, liked]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    let raf = 0;
    let pending = false;
    let mx = 0, my = 0;
    const flush = () => {
      pending = false;
      const rect = el.getBoundingClientRect();
      const x = (mx - rect.left) / rect.width - 0.5;
      const y = (my - rect.top) / rect.height - 0.5;
      el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
      gsap.to(el, { rotateX: -y * 4, rotateY: x * 4, transformPerspective: 1000, duration: 0.3, ease: 'power2.out' });
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(flush);
      }
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, original: () => void) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
    original();
  };

  return (
    <div className={styles.card} ref={cardRef} data-category={effect.category}>
      <div className={styles.preview} onMouseEnter={replay}><Preview key={key} params={params} /></div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{effect.name}</div>
          <button
            className={`${styles.likeBtn} ${liked ? styles.liked : ''} ${bouncing ? styles.bouncing : ''}`}
            onClick={handleLike}
            aria-label={liked ? `已点赞（${likes}）` : '点赞'}
            title={liked ? `已点赞 · ${likes}` : '点赞'}
          >
            <span className={styles.heartIcon}>{liked ? '❤' : '♡'}</span>
            <span className={styles.likeCount}>{likes}</span>
          </button>
        </div>
        <div className={styles.desc}>{effect.description}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {effect.tags.slice(0, 2).map((t) => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
        <div className={styles.actions}>
          <Button onClick={(e) => handleButtonClick(e, replay)}>▶ 重播</Button>
          <Button onClick={(e) => handleButtonClick(e, () => openPanel('params'))}>⚙ 调参</Button>
          <Button onClick={(e) => handleButtonClick(e, () => openPanel('code'))}>{'< / >'} 代码</Button>
        </div>
      </div>
    </div>
  );
}
