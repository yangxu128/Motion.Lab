import type { Effect } from '@/data/effects';
import { EffectCard } from './EffectCard';
import styles from './EffectGrid.module.css';
export function EffectGrid({ effects }: { effects: Effect[] }) {
  return <div className={styles.grid}>{effects.map((e) => <EffectCard key={e.id} effect={e} />)}</div>;
}
