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
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Heading char-by-char reveal on scroll
  useEffect(() => {
    if (!headingRef.current) return;
    const heading = headingRef.current;
    // Wrap text nodes in spans for animation
    const text = heading.textContent || '';
    heading.innerHTML = '';
    Array.from(text).forEach((ch) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      span.setAttribute('data-heading-char', '');
      heading.appendChild(span);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(heading.querySelectorAll('[data-heading-char]'), {
              y: 80,
              opacity: 0,
              rotateX: -90,
              stagger: 0.02,
              duration: 0.7,
              ease: 'power3.out',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  // Card entrance + 3D tilt + mouse-following spotlight
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>(`.${styles.card}`));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(cards, {
              y: 60,
              opacity: 0,
              scale: 0.9,
              rotateY: 15,
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

    // 3D tilt on each card
    const cleanups: Array<() => void> = [];
    cards.forEach((card) => {
      let raf = 0;
      let pending = false;
      let mx = 0, my = 0;
      const flush = () => {
        pending = false;
        const rect = card.getBoundingClientRect();
        const x = (mx - rect.left) / rect.width;
        const y = (my - rect.top) / rect.height;
        const rotX = (0.5 - y) * 10;
        const rotY = (x - 0.5) * 10;
        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power2.out',
        });
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
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
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      };
      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
        if (raf) cancelAnimationFrame(raf);
      });
    });

    return () => {
      observer.disconnect();
      cleanups.forEach((c) => c());
    };
  }, []);

  const copy: Record<string, string> = {
    basic: '纯 CSS，无需 JS，五种缓动曲线覆盖 80% 场景。',
    text: '让文字本身成为主角，排版的呼吸感。',
    interaction: '鼠标是新的指尖，每一次悬停都是对话。',
    advanced: 'GSAP、Three.js、WebGL —— 当浏览器成为画布。',
  };

  return (
    <section className={styles.section}>
      <h2 ref={headingRef} className={styles.heading}>
        四种语言四十种节奏
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
                background: theme.bg,
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
