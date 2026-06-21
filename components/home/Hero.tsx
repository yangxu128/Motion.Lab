'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Hero.module.css';

const BADGES = [
  { label: '40 Effects', color: 'hsl(280 85% 60%)' },
  { label: '参数可调', color: 'hsl(210 85% 55%)' },
  { label: '一键复制', color: 'hsl(340 85% 55%)' },
];

export function Hero() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll('[data-char]');
    gsap.from(chars, {
      y: 100,
      opacity: 0,
      stagger: 0.04,
      duration: 1.2,
      ease: 'power4.out',
    });
  }, []);

  const text = '动效实验室';

  return (
    <section className={styles.hero}>
      {/* Floating blobs */}
      <div className={styles.blob} style={{ top: '10%', left: '5%', width: 300, height: 300, background: 'hsl(280 90% 60%)', animationDelay: '0s' }} />
      <div className={styles.blob} style={{ top: '60%', right: '8%', width: 400, height: 400, background: 'hsl(340 90% 55%)', animationDelay: '-2s' }} />
      <div className={styles.blob} style={{ bottom: '15%', left: '25%', width: 250, height: 250, background: 'hsl(180 90% 50%)', animationDelay: '-4s' }} />
      <div className={styles.blob} style={{ top: '25%', right: '20%', width: 200, height: 200, background: 'hsl(30 95% 55%)', animationDelay: '-6s' }} />
      <div className={styles.blob} style={{ bottom: '30%', left: '60%', width: 180, height: 180, background: 'hsl(210 90% 55%)', animationDelay: '-3s' }} />

      <div className={styles.content}>
        <div className={styles.kicker}>Motion.Lab · 2026</div>
        <h1 ref={ref} className={styles.title}>
          {text.split('').map((c, i) => (
            <span key={i} data-char>
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))}
        </h1>
        <p className={styles.subtitle}>
          40 个精选动效，可调参数，可复制代码。
          <br />
          为中文开发者打造的动效参考站。
        </p>
        <div className={styles.badges}>
          {BADGES.map((b) => (
            <span key={b.label} className={styles.badge} style={{ background: b.color }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
