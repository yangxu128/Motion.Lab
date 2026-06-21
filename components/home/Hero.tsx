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

  // Title character entrance — use fromTo with explicit autoAlpha to avoid stuck state
  useEffect(() => {
    if (!titleRef.current) return;
    const chars = titleRef.current.querySelectorAll<HTMLElement>('[data-char]');
    gsap.fromTo(
      chars,
      { y: 100, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.04,
        duration: 1.0,
        delay: 0.1,
        ease: 'power4.out',
        overwrite: 'auto',
        clearProps: 'transform',
      }
    );
  }, []);

  // Subtitle word-by-word fade-in
  useEffect(() => {
    if (!subtitleRef.current) return;
    const words = subtitleRef.current.querySelectorAll<HTMLElement>('[data-word]');
    gsap.fromTo(
      words,
      { y: 20, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.6,
        delay: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
        clearProps: 'transform',
      }
    );
  }, []);

  // Badge stagger entrance
  useEffect(() => {
    const targets = badgeRefs.current.filter((el): el is HTMLSpanElement => el !== null);
    if (targets.length === 0) return;
    gsap.fromTo(
      targets,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 0.6,
        delay: 1.1,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
        clearProps: 'transform',
      }
    );
  }, []);

  // Char hover bounce
  useEffect(() => {
    if (!titleRef.current) return;
    const chars = titleRef.current.querySelectorAll<HTMLElement>('[data-char]');
    const handlers: Array<{ el: HTMLElement; fn: () => void }> = [];
    chars.forEach((char) => {
      const fn = () => {
        gsap.fromTo(
          char,
          { y: 0 },
          { y: -20, scale: 1.15, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: 'auto' }
        );
      };
      char.addEventListener('mouseenter', fn);
      handlers.push({ el: char, fn });
    });
    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener('mouseenter', fn));
    };
  }, []);

  // Mouse parallax on blobs
  useEffect(() => {
    if (!heroRef.current) return;
    const handleMove = (e: MouseEvent) => {
      const rect = heroRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const blobs = heroRef.current!.querySelectorAll(`.${styles.blob}`);
      blobs.forEach((blob, i) => {
        const factor = (i + 1) * 12;
        gsap.to(blob, {
          x: -x * factor,
          y: -y * factor,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
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
            <span key={i} data-char className={styles.char}>
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))}
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          {subLines.map((line, li) => (
            <span key={li}>
              {line.map((word, wi) => (
                <span key={wi} data-word className={styles.word} style={{ marginRight: 4 }}>
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
