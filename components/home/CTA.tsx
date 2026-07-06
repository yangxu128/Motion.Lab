'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './CTA.module.css';

const PARTICLES = [
  { top: '15%', left: '10%', size: 6, delay: '0s', color: 'hsl(280 65% 50%)' },
  { top: '25%', left: '75%', size: 4, delay: '-1s', color: 'hsl(340 65% 50%)' },
  { top: '65%', left: '20%', size: 5, delay: '-2s', color: 'hsl(180 65% 42%)' },
  { top: '70%', left: '80%', size: 3, delay: '-3s', color: 'hsl(30 80% 48%)' },
  { top: '40%', left: '50%', size: 7, delay: '-1.5s', color: 'hsl(210 65% 50%)' },
  { top: '85%', left: '45%', size: 4, delay: '-0.5s', color: 'hsl(260 60% 50%)' },
  { top: '10%', left: '45%', size: 5, delay: '-2.5s', color: 'hsl(320 65% 50%)' },
  { top: '55%', left: '88%', size: 4, delay: '-4s', color: 'hsl(150 60% 42%)' },
];

// Animated stats with count-up
const STATS: Array<{ value: number; suffix: string; label: string }> = [
  { value: 160, suffix: '', label: '动效' },
  { value: 4, suffix: '', label: '分类' },
  { value: 100, suffix: '%', label: '开源' },
];

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const dur = 1600;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

function StatItem({ stat, inView }: { stat: (typeof STATS)[number]; inView: boolean }) {
  return (
    <span className={styles.statItem}>
      <span className={styles.statValue}>
        <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
      </span>
      <span className={styles.statLabel}>{stat.label}</span>
    </span>
  );
}

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Trigger count-up when section enters viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Click ripple on CTA button
  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background glow orbs */}
      <div className={styles.glowOrb} style={{ top: '10%', left: '15%', width: 360, height: 360, background: 'hsl(280 65% 60%)' }} />
      <div className={styles.glowOrb} style={{ bottom: '5%', right: '10%', width: 320, height: 320, background: 'hsl(330 65% 58%)' }} />
      <div className={styles.glowOrb} style={{ top: '45%', left: '50%', width: 280, height: 280, background: 'hsl(30 80% 55%)', transform: 'translate(-50%, -50%)' }} />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={styles.particle}
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            background: p.color,
          }}
        />
      ))}

      <div className={styles.content}>
        <div className={styles.stats}>
          {STATS.map((s, i) => (
            <span key={i} className={styles.statGroup}>
              <StatItem stat={s} inView={inView} />
              {i < STATS.length - 1 && <span className={styles.statSep}>·</span>}
            </span>
          ))}
        </div>
        <h2 className={styles.big}>
          进<span className={styles.bigAccent}>实验室</span>
        </h2>
        <p className={styles.lead}>亲手调参,实时反馈,一键复制进项目。</p>
        <Link href="/lab" className={styles.btnLink}>
          <Button variant="primary" className={styles.ctaBtn} onClick={handleBtnClick}>
            开始探索 →
            {ripples.map((r) => (
              <span
                key={r.id}
                className={styles.ripple}
                style={{ left: r.x, top: r.y }}
              />
            ))}
          </Button>
        </Link>
      </div>
    </section>
  );
}
