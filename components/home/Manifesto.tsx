'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Manifesto.module.css';
import { CATEGORIES } from '@/data/effects';

const CATEGORY_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  basic: {
    color: 'hsl(210 90% 55%)',
    bg: 'hsl(210 60% 97%)',
    icon: '◆',
  },
  text: {
    color: 'hsl(280 80% 60%)',
    bg: 'hsl(280 55% 96%)',
    icon: '✦',
  },
  interaction: {
    color: 'hsl(340 85% 60%)',
    bg: 'hsl(340 50% 97%)',
    icon: '◈',
  },
  advanced: {
    color: 'hsl(30 95% 55%)',
    bg: 'hsl(30 70% 95%)',
    icon: '✧',
  },
};

export function Manifesto() {
  const items = CATEGORIES.filter((c) => c.id !== 'all');
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(`.${styles.card}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(cards, {
              y: 60,
              opacity: 0,
              stagger: 0.12,
              duration: 0.8,
              ease: 'power3.out',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const copy: Record<string, string> = {
    basic: '纯 CSS，无需 JS，五种缓动曲线覆盖 80% 场景。',
    text: '让文字本身成为主角，排版的呼吸感。',
    interaction: '鼠标是新的指尖，每一次悬停都是对话。',
    advanced: 'GSAP、Three.js、WebGL —— 当浏览器成为画布。',
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        <span className={styles.headingAccent}>四</span>种语言
        <br />
        <span className={styles.headingAccent}>四十</span>种节奏
      </h2>
      <div className={styles.grid} ref={gridRef}>
        {items.map((c, i) => {
          const theme = CATEGORY_COLORS[c.id];
          return (
            <div
              key={c.id}
              className={styles.card}
              style={{
                '--cat-color': theme.color,
                '--cat-bg': theme.bg,
                animationDelay: `${i * 0.1}s`,
              } as React.CSSProperties}
            >
              <div className={styles.cardIcon}>{theme.icon}</div>
              <div className={styles.num} style={{ color: theme.color }}>
                0{i + 1} / {c.english}
              </div>
              <h3>{c.name}</h3>
              <p>{copy[c.id]}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
