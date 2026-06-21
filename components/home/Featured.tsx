import Link from 'next/link';
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
  const items = PICKS.map((id) => EFFECTS.find((x) => x.id === id)!);
  // Duplicate for seamless infinite marquee
  const allItems = [...items, ...items];

  return (
    <section className={styles.section}>
      <div className={styles.headingWrap}>
        <h2 className={styles.heading}>精选</h2>
        <span className={styles.headingLine} />
      </div>
      <div className={styles.track}>
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
                {/* Animated element inside card */}
                <div className={styles.cardAnim}>
                  <div className={styles.animRing} />
                  <div className={styles.animDot} style={{ background: `hsl(${hue} 80% 55%)` }} />
                </div>

                <span className={styles.catTag}>{catLabel}</span>
                <span className={styles.itemName}>{e.name}</span>
                <span className={styles.itemEnglish}>{e.englishName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
