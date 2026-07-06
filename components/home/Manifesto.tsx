'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Manifesto.module.css';

const PRINCIPLES = [
  {
    n: '01',
    title: '可调参',
    desc: '每个动效都用 CSS 变量组织参数：--duration、--ease、--hue、--intensity。复制到项目后，改 1 个数字就能改 10 个元素的动效，无需逐个修改。',
    color: 'hsl(280 70% 50%)',
    meta: 'PARAMETERIZE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    n: '02',
    title: '可复制',
    desc: '复制即用。一段 HTML、一段 CSS、一段 JS，无外部依赖。',
    color: 'hsl(340 70% 50%)',
    meta: 'NO-DEPENDENCY',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
  {
    n: '03',
    title: '可访问',
    desc: '统一 prefers-reduced-motion 降级。',
    color: 'hsl(30 80% 48%)',
    meta: 'A11Y-FIRST',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M5 9c2 1 5 1 7 1s5 0 7-1" />
        <path d="M5 9v4c0 3 3 5 7 5s7-2 7-5V9" />
        <path d="M9 22l3-4 3 4" />
      </svg>
    ),
  },
  {
    n: '04',
    title: '可进化',
    desc: 'SKILL.md 协议让任何 AI Agent 直接调用。',
    color: 'hsl(180 70% 42%)',
    meta: 'AI-NATIVE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  // 鼠标视差 tilt + 卡片 mouse-following spotlight（直接操作 DOM，rAF 节流）
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll<HTMLElement>(`.${styles.card}`);
    const cleanups: Array<() => void> = [];
    cards.forEach((card) => {
      let raf = 0;
      let pending = false;
      let mx = 0;
      let my = 0;
      const flush = () => {
        pending = false;
        const rect = card.getBoundingClientRect();
        const x = (mx - rect.left) / rect.width;
        const y = (my - rect.top) / rect.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        const rotX = (0.5 - y) * 4;
        const rotY = (x - 0.5) * 4;
        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 1200,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
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
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
      };
      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
        if (raf) cancelAnimationFrame(raf);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <h2 className={styles.heading}>
        我们的<span className={styles.headingAccent}>原则</span>
      </h2>
      <div className={styles.grid}>
        {PRINCIPLES.map((p) => (
          <article
            key={p.n}
            className={styles.card}
            style={{ '--cat-color': p.color } as React.CSSProperties}
          >
            <div className={styles.cardIcon} aria-hidden>
              {p.icon}
            </div>
            <div className={styles.num}>{p.n} · {p.meta}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
