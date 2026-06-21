import Link from 'next/link';
import styles from './Featured.module.css';
import { EFFECTS } from '@/data/effects';
const PICKS = ['fade-in', 'gradient-text', 'magnetic-cursor', 'three-particles', 'glitch-text', 'marquee'];
export function Featured() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>精选</h2>
      <div className={styles.track}>
        {PICKS.map((id) => {
          const e = EFFECTS.find((x) => x.id === id)!;
          return <Link key={id} href={`/lab?open=${id}&panel=params`} className={styles.item}>{e.name}</Link>;
        })}
      </div>
    </section>
  );
}
