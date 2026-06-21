'use client';
import styles from './Tabs.module.css';
export interface TabItem<T extends string> { value: T; label: string; }
export function Tabs<T extends string>({ items, value, onChange }: { items: TabItem<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className={styles.tabs} role="tablist">
      {items.map((it) => (
        <button key={it.value} role="tab" aria-selected={value === it.value} data-active={value === it.value} className={styles.tab} onClick={() => onChange(it.value)}>{it.label}</button>
      ))}
    </div>
  );
}
