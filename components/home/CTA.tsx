import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './CTA.module.css';

const PARTICLES = [
  { top: '15%', left: '10%', size: 6, delay: '0s', color: 'hsl(280 80% 60%)' },
  { top: '25%', left: '75%', size: 4, delay: '-1s', color: 'hsl(340 80% 55%)' },
  { top: '65%', left: '20%', size: 5, delay: '-2s', color: 'hsl(180 80% 50%)' },
  { top: '70%', left: '80%', size: 3, delay: '-3s', color: 'hsl(30 90% 55%)' },
  { top: '40%', left: '50%', size: 7, delay: '-1.5s', color: 'hsl(210 80% 55%)' },
  { top: '85%', left: '45%', size: 4, delay: '-0.5s', color: 'hsl(260 70% 58%)' },
  { top: '10%', left: '45%', size: 5, delay: '-2.5s', color: 'hsl(320 80% 56%)' },
  { top: '55%', left: '88%', size: 4, delay: '-4s', color: 'hsl(150 75% 48%)' },
];

const STATS = ['40 动效', '4 分类', '无限可能'];

export function CTA() {
  return (
    <section className={styles.section}>
      {/* Background glow orbs */}
      <div className={styles.glowOrb} style={{ top: '10%', left: '20%', width: 400, height: 400, background: 'hsl(260 70% 40%)' }} />
      <div className={styles.glowOrb} style={{ bottom: '10%', right: '15%', width: 350, height: 350, background: 'hsl(280 65% 35%)' }} />

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
            <span key={s} className={styles.statItem}>
              {s}
              {i < STATS.length - 1 && <span className={styles.statSep}> · </span>}
            </span>
          ))}
        </div>
        <h2 className={styles.big}>
          进<span className={styles.bigAccent}>实验室</span>
        </h2>
        <Link href="/lab">
          <Button variant="primary" className={styles.ctaBtn}>
            开始探索 →
          </Button>
        </Link>
      </div>
    </section>
  );
}
