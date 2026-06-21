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
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Title character animation + interactive hover
  useEffect(() => {
    if (!titleRef.current) return;
    const chars = titleRef.current.querySelectorAll('[data-char]');
    // Entrance
    gsap.from(chars, {
      y: 100,
      opacity: 0,
      stagger: 0.04,
      duration: 1.2,
      ease: 'power4.out',
    });

    // Hover bounce on each char
    chars.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          y: -20,
          scale: 1.15,
          duration: 0.3,
          ease: 'back.out(2)',
          yoyo: true,
          repeat: 1,
        });
      });
    });
  }, []);

  // Subtitle word-by-word fade-in
  useEffect(() => {
    if (!subtitleRef.current) return;
    const words = subtitleRef.current.querySelectorAll('[data-word]');
    gsap.from(words, {
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      delay: 0.6,
      ease: 'power2.out',
    });
  }, []);

  // Badge stagger entrance
  useEffect(() => {
    gsap.from(badgeRefs.current.filter(Boolean), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      delay: 1.0,
      ease: 'back.out(1.4)',
    });
  }, []);

  // Mouse parallax on blobs + title
  useEffect(() => {
    if (!heroRef.current) return;
    const handleMove = (e: MouseEvent) => {
      const rect = heroRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      // Move blobs opposite direction
      const blobs = heroRef.current!.querySelectorAll(`.${styles.blob}`);
      blobs.forEach((blob, i) => {
        const factor = (i + 1) * 12;
        gsap.to(blob, {
          x: -x * factor,
          y: -y * factor,
          duration: 1.2,
          ease: 'power2.out',
        });
      });
    };
    heroRef.current.addEventListener('mousemove', handleMove);
    return () => heroRef.current?.removeEventListener('mousemove', handleMove);
  }, []);

  const text = '动效实验室';
  const subLines = [
    ['40', '个精选动效，', '可调参数，', '可复制代码。'],
    ['为', '中文开发者打造', '的动效参考站。'],
  ];

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Floating blobs */}
      <div className={styles.blob} style={{ top: '10%', left: '5%', width: 300, height: 300, background: 'hsl(280 90% 60%)', animationDelay: '0s' }} />
      <div className={styles.blob} style={{ top: '60%', right: '8%', width: 400, height: 400, background: 'hsl(340 90% 55%)', animationDelay: '-2s' }} />
      <div className={styles.blob} style={{ bottom: '15%', left: '25%', width: 250, height: 250, background: 'hsl(180 90% 50%)', animationDelay: '-4s' }} />
      <div className={styles.blob} style={{ top: '25%', right: '20%', width: 200, height: 200, background: 'hsl(30 95% 55%)', animationDelay: '-6s' }} />
      <div className={styles.blob} style={{ bottom: '30%', left: '60%', width: 180, height: 180, background: 'hsl(210 90% 55%)', animationDelay: '-3s' }} />

      <div className={styles.content}>
        <div className={styles.kicker}>Motion.Lab · 2026</div>
        <h1 ref={titleRef} className={styles.title}>
          {text.split('').map((c, i) => (
            <span key={i} data-char>
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))}
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          {subLines.map((line, li) => (
            <span key={li}>
              {line.map((word, wi) => (
                <span key={wi} data-word style={{ display: 'inline-block', marginRight: 4 }}>
                  {word}
                </span>
              ))}
              {li < subLines.length - 1 && <br />}
            </span>
          ))}
        </p>
        <div className={styles.badges}>
          {BADGES.map((b, i) => (
            <span
              key={b.label}
              ref={(el) => {
                badgeRefs.current[i] = el;
              }}
              className={styles.badge}
              style={{ background: b.color }}
            >
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
