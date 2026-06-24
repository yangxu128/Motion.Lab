'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from './Featured.module.css';
import { EFFECTS } from '@/data/effects';

const PICKS = ['fade-in', 'gradient-text', 'magnetic-cursor', 'three-particles', 'glitch-text', 'marquee'];

const CARD_HUES = [210, 280, 340, 30, 180, 260];

const CATEGORY_LABELS: Record<string, string> = {
  basic: '基础',
  text: '文字',
  interaction: '交互',
  advanced: '高级',
};

export function Featured() {
  const sectionRef = useRef<HTMLElement>(null);
  const items = PICKS.map((id) => EFFECTS.find((x) => x.id === id)!);
  // Duplicate for seamless infinite marquee
  const allItems = [...items, ...items];

  // Pause marquee on hover, resume on leave
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const inner = track.querySelector(`.${styles.marqueeInner}`);
    if (!inner) return;
    const handleEnter = () => gsap.to(inner, { animationPlayState: 'paused', duration: 0 });
    const handleLeave = () => gsap.to(inner, { animationPlayState: 'running', duration: 0 });
    track.addEventListener('mouseenter', handleEnter);
    track.addEventListener('mouseleave', handleLeave);
    return () => {
      track.removeEventListener('mouseenter', handleEnter);
      track.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // Mouse-following spotlight + tilt on each card
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(`.${styles.item}`);
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
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        const rotX = (0.5 - y) * 6;
        const rotY = (x - 0.5) * 6;
        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power2.out',
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
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.headingWrap}>
        <h2 className={styles.heading}>精选</h2>
        <span className={styles.headingLine} />
      </div>
      <div className={styles.track} ref={trackRef}>
        <div className={styles.marqueeInner}>
          {allItems.map((e, idx) => {
            const originalIdx = idx % items.length;
            const hue = CARD_HUES[originalIdx];
            const catLabel = CATEGORY_LABELS[e.category] || e.category;

            return (
              <Link
                key={`${e.id}-${idx}`}
                href={`/lab?open=${e.id}&panel=params`}
                className={styles.item}
                style={
                  {
                    '--card-hue': hue,
                    '--card-bg-start': `hsl(${hue} 70% 96%)`,
                    '--card-bg-end': `hsl(${hue} 50% 98%)`,
                    '--card-accent': `hsl(${hue} 85% 55%)`,
                  } as React.CSSProperties
                }
              >
                {/* Mouse-following spotlight */}
                <div className={styles.spotlight} />

                {/* Animated element inside card */}
                <div className={styles.cardAnim}>
                  <div className={styles.animRing} />
                  <div className={styles.animDot} style={{ background: `hsl(${hue} 80% 55%)` }} />
                </div>

                <span className={styles.catTag}>{catLabel}</span>
                <span className={styles.itemName}>{e.name}</span>
                <span className={styles.itemEnglish}>{e.englishName}</span>

                <span className={styles.arrow}>→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
